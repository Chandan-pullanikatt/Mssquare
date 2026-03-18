import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname, searchParams } = url;

  // 1. Handle OAuth Callback parameters on ANY route BEFORE anything else
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if ((code || error) && pathname !== '/auth/callback') {
    const callbackUrl = new URL('/auth/callback', req.url);
    if (code) callbackUrl.searchParams.set('code', code);
    if (error) callbackUrl.searchParams.set('error', error);
    if (errorDescription) callbackUrl.searchParams.set('error_description', errorDescription);
    return NextResponse.redirect(callbackUrl);
  }

  // 2. Initialize Supabase SSR Client and handle session/cookies
  let supabaseResponse = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            req.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: We must call getUser() or getSession() to trigger cookie updates if needed
  const { data: { user } } = await supabase.auth.getUser();

  // Unified Portal Access Control
  const portalRoutes = [
    { path: '/student', role: 'student' },
    { path: '/business', role: 'business_client' },
    { path: '/admin/lms', role: 'lms_admin' },
    { path: '/admin/business', role: 'business_admin' },
    { path: '/admin/cms', role: 'cms_admin' },
  ];

  const currentPortal = portalRoutes.find((p) => pathname.startsWith(p.path));

  // 3. Unauthorized access check
  if (currentPortal && !user) {
    url.pathname = '/auth';
    url.search = ''; 
    return NextResponse.redirect(url);
  }

  // 4. Role-based enforcement
  if (user) {
    const needsRoleCheck = currentPortal || pathname === '/dashboard' || pathname === '/portal';

    if (needsRoleCheck) {
      let role = user.app_metadata?.role as string | undefined;

      // Fallback to database check ONLY if not in metadata (SLOWER)
      if (!role) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        
        role = (profileData as { role: string } | null)?.role;

        if (!role) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          role = (userData as { role: string } | null)?.role;
        }
      }

      // Check portal permission
      if (currentPortal) {
        const isAllowed = role === currentPortal.role || (role === 'lms_admin' && currentPortal.role === 'student');
        if (!role || !isAllowed) {
          url.pathname = '/unauthorized';
          return NextResponse.redirect(url);
        }
      }

      // Handle unified entry points
      if (pathname === '/dashboard' || pathname === '/portal') {
        if (role === 'student') url.pathname = '/student/dashboard';
        else if (role === 'business_client') url.pathname = '/business/dashboard';
        else if (role === 'lms_admin') url.pathname = '/admin/lms/dashboard';
        else if (role === 'business_admin') url.pathname = '/admin/business/dashboard';
        else if (role === 'cms_admin') url.pathname = '/admin/cms/dashboard';
        else url.pathname = '/';
        
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|fonts|images|favicon).*)',
  ],
};
