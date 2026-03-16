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
    data: { session },
  } = await supabase.auth.getSession();

  // Unified Portal Access Control
  const portalRoutes = [
    { path: '/student', role: 'student' },
    { path: '/business', role: 'business_client' },
    { path: '/lms-admin', role: 'lms_admin' },
    { path: '/business-admin', role: 'business_admin' },
    { path: '/cms-admin', role: 'cms_admin' },
  ];

  const currentPortal = portalRoutes.find((p) => pathname.startsWith(p.path));

  // 1. If hitting a protected portal without a session, redirect to login
  if (currentPortal && !session) {
    url.pathname = '/auth';
    url.search = ''; 
    return NextResponse.redirect(url);
  }

  // 2. If session exists, enforce role-based access
  if (session) {
    // Check if user is trying to access a portal
    if (currentPortal) {
      // Fetch role from profiles, then fallback to users table
      let { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();
      
      let role = (data as { role: string } | null)?.role;

      if (!role) {
        // Fallback to 'users' table if profile not found
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
        role = (userData as { role: string } | null)?.role;
      }

      // Strict Role Enforcement
      const isAllowed = role === currentPortal.role || (role === 'lms_admin' && currentPortal.role === 'student');

      if (!role || !isAllowed) {
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    }

    // Handle generic /dashboard or /portal redirects based on role
    if (pathname === '/dashboard' || pathname === '/portal') {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();
      
      const role = (data as { role: string } | null)?.role;
      
      if (role === 'student') url.pathname = '/student/dashboard';
      else if (role === 'business_client') url.pathname = '/business/dashboard';
      else if (role === 'lms_admin') url.pathname = '/lms-admin/dashboard';
      else if (role === 'business_admin') url.pathname = '/business-admin/dashboard';
      else if (role === 'cms_admin') url.pathname = '/cms-admin';
      else url.pathname = '/';
      
      return NextResponse.redirect(url);
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
