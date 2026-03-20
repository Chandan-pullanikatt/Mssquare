import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database'

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
  const isAuthPath = pathname === '/auth' || pathname === '/auth/callback';

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
    return NextResponse.redirect(url)
  }

  // Role based redirection for landings
  if (pathname === '/dashboard' || pathname === '/portal') {
    const role = user.app_metadata?.role as string | undefined;
    const url = request.nextUrl.clone()
    if (role === 'student') url.pathname = '/student/dashboard';
    else if (role === 'business_client') url.pathname = '/business/dashboard';
    else if (role === 'lms_admin') url.pathname = '/admin/lms/dashboard';
    else if (role === 'business_admin') url.pathname = '/admin/business/dashboard';
    else if (role === 'cms_admin') url.pathname = '/admin/cms/dashboard';
    else if (role === 'instructor') url.pathname = '/instructor/dashboard';
    else url.pathname = '/';
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
