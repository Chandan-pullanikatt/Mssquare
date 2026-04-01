import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database'
import { createAdminClient } from './service'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
      cookieOptions: {
        path: '/',
        secure: true,
        sameSite: 'lax',
      }
    }
  )

  const pathname = request.nextUrl.pathname;
  const isAuthPath = pathname.startsWith('/auth');

  // 4a. If we are on an auth path, we don't need to refresh the session here
  // The route handler or the page will handle it.
  if (isAuthPath) {
    return supabaseResponse;
  }

  // IMPORTANT: Do not run any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // auth issues.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Portal Route Detection
  const portalRoutes = [
    { path: '/student', role: 'student' },
    { path: '/business', role: 'business_client' },
    { path: '/admin/lms', role: 'lms_admin' },
    { path: '/admin/business', role: 'business_admin' },
    { path: '/admin/cms', role: 'cms_admin' },
    { path: '/instructor', role: 'instructor' },
  ];
  const currentPortal = portalRoutes.find((p) => pathname.startsWith(p.path));
  const isProtected = currentPortal || pathname === '/dashboard' || pathname === '/portal' || pathname === '/unauthorized';

  if (!isProtected || isAuthPath) {
    return supabaseResponse;
  }

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    url.search = '' // Clear all codes/params to prevent leakage
    return NextResponse.redirect(url)
  }

  // 5. Role based redirection for landings
  let userRole = user.app_metadata?.role as string | undefined;

    // Fallback to database check if role is missing from metadata - USE ADMIN CLIENT to bypass RLS
    const adminSupabase = createAdminClient(); 
    const [profileRes, userRes] = await Promise.all([
      adminSupabase.from('profiles').select('role').eq('id', user.id).maybeSingle(),
      adminSupabase.from('users').select('role').eq('id', user.id).maybeSingle(),
    ]);
    userRole = (profileRes.data as any)?.role || (userRes.data as any)?.role;


  if (pathname === '/dashboard' || pathname === '/portal') {
    const url = request.nextUrl.clone()
    if (userRole === 'student') url.pathname = '/student/dashboard';
    else if (userRole === 'business_client') url.pathname = '/business/dashboard';
    else if (userRole === 'lms_admin') url.pathname = '/admin/lms/dashboard';
    else if (userRole === 'business_admin') url.pathname = '/admin/business/dashboard';
    else if (userRole === 'cms_admin') url.pathname = '/admin/cms/dashboard';
    else if (userRole === 'instructor') url.pathname = '/instructor/dashboard';
    else url.pathname = '/';
    return NextResponse.redirect(url)
  }

  // Strict role check for protected portal routes
  if (currentPortal && userRole !== currentPortal.role) {
    // Determine if the target portal is a basic end-user portal
    const isEndUserPortal = currentPortal.role === 'student' || currentPortal.role === 'business_client';
    
    // Determine if the user holds any standard (non-malicious) role that should be allowed into end-user areas
    const isStandardRole = userRole === 'student' || userRole === 'business_client' || userRole === 'instructor';

    // Exception: cms_admin can access everything
    // Exception: Instructors, students, and business clients can ALL freely use the basic end-user portals
    if (userRole !== 'cms_admin' && !(isEndUserPortal && isStandardRole)) {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      url.search = '' // IMPORTANT: Clear search params to prevent carrying over OAuth code
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
