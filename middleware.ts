import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname, searchParams } = url;

  // 1. Initial response object
  let supabaseResponse = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // 2. Initialize Supabase
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure: true,
      },
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Early out for OAuth params on non-auth paths (Redirect to centralized callback)
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const isAuthPath = pathname === '/auth' || pathname === '/auth/callback';
  
  if ((code || error) && !isAuthPath) {
    const callbackUrl = new URL('/auth/callback', req.url);
    searchParams.forEach((v, k) => callbackUrl.searchParams.set(k, v));
    return NextResponse.redirect(callbackUrl);
  }

  // 4. Portal Route Detection
  const portalRoutes = [
    { path: '/student', role: 'student' },
    { path: '/business', role: 'business_client' },
    { path: '/admin/lms', role: 'lms_admin' },
    { path: '/admin/business', role: 'business_admin' },
    { path: '/admin/cms', role: 'cms_admin' },
  ];
  const currentPortal = portalRoutes.find((p) => pathname.startsWith(p.path));
  const isProtected = currentPortal || pathname === '/dashboard' || pathname === '/portal';

  // 5. If not protected, just return (Saves time)
  if (!isProtected) return supabaseResponse;

  // 6. Auth check (LEAN: No database queries in middleware)
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    url.pathname = '/auth';
    url.search = ''; 
    return NextResponse.redirect(url);
  }

  // 7. Role-based enforcement (Using ONLY JWT app_metadata for speed)
  const role = user.app_metadata?.role as string | undefined;

  if (currentPortal) {
    // LMS Admin can access student portal
    const isAllowed = role === currentPortal.role || (role === 'lms_admin' && currentPortal.role === 'student');
    
    // If role is missing from JWT, we DON'T block yet (to avoid DB query)
    // We let the client-side AuthProvider handle the missing role.
    if (role && !isAllowed) {
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
  }

  // 8. Handle unified entry points
  if (pathname === '/dashboard' || pathname === '/portal') {
    if (role === 'student') url.pathname = '/student/dashboard';
    else if (role === 'business_client') url.pathname = '/business/dashboard';
    else if (role === 'lms_admin') url.pathname = '/admin/lms/dashboard';
    else if (role === 'business_admin') url.pathname = '/admin/business/dashboard';
    else if (role === 'cms_admin') url.pathname = '/admin/cms/dashboard';
    else if (role) url.pathname = '/'; // Unknown role
    else return supabaseResponse; // Role missing, let client handle it
    
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|fonts|images|favicon).*)',
  ],
};
