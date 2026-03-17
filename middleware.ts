import { updateSession } from './lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  const { supabase, response } = updateSession(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unified Portal Access Control
  const portalRoutes = [
    { path: '/student', role: 'student' },
    { path: '/business', role: 'business_client' },
    { path: '/admin/lms', role: 'lms_admin' },
    { path: '/admin/business', role: 'business_admin' },
    { path: '/admin/cms', role: 'cms_admin' },
  ];

  const currentPortal = portalRoutes.find((p) => pathname.startsWith(p.path));

  // 1. If hitting a protected portal without a user, redirect to login
  if (currentPortal && !user) {
    url.pathname = '/auth';
    url.search = ''; 
    return NextResponse.redirect(url);
  }

  // 2. If user exists, enforce role-based access
  if (user) {
    // Determine if we need to fetch the role
    const needsRole = currentPortal || pathname === '/dashboard' || pathname === '/portal';

    if (needsRole) {
      // Prioritize role from app_metadata
      let role = user.app_metadata?.role as string | undefined;

      // Fallback to database check if not in metadata
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

      // Enforcement
      if (currentPortal) {
        const isAllowed = role === currentPortal.role || (role === 'lms_admin' && currentPortal.role === 'student');
        if (!role || !isAllowed) {
          url.pathname = '/unauthorized';
          return NextResponse.redirect(url);
        }
      }

      // Redirects
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

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
