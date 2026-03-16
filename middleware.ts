import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from './types/database';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();
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
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Protected routes
  const protectedRoutes = [
    '/student',
    '/admin',
    '/lms-admin',
    '/dashboard',
    '/portal',
  ];

  const isProtectedPath = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedPath && !session) {
    url.pathname = '/auth';
    const redirectRes = NextResponse.redirect(url);
    // Propagate cookies from res (updated by setAll) to the redirect response
    res.cookies.getAll().forEach(cookie => {
      redirectRes.cookies.set(cookie.name, cookie.value, {
        domain: cookie.domain,
        expires: cookie.expires,
        httpOnly: cookie.httpOnly,
        maxAge: cookie.maxAge,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
      });
    });
    return redirectRes;
  }

  // Role-based access control (RBAC)
  if (session && isProtectedPath) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      console.error('Middleware: Error fetching user role:', userError);
      url.pathname = '/unauthorized';
      const redirectRes = NextResponse.redirect(url);
      res.cookies.getAll().forEach(cookie => {
        redirectRes.cookies.set(cookie.name, cookie.value, {
          domain: cookie.domain,
          expires: cookie.expires,
          httpOnly: cookie.httpOnly,
          maxAge: cookie.maxAge,
          path: cookie.path,
          sameSite: cookie.sameSite,
          secure: cookie.secure,
        });
      });
      return redirectRes;
    }

    const role = (userData as any)?.role;

    if (pathname.startsWith('/student') && role !== 'student' && role !== 'ceo' && role !== 'admin') {
      url.pathname = '/unauthorized';
      const redirectRes = NextResponse.redirect(url);
      res.cookies.getAll().forEach(cookie => {
        redirectRes.cookies.set(cookie.name, cookie.value, {
          domain: cookie.domain,
          expires: cookie.expires,
          httpOnly: cookie.httpOnly,
          maxAge: cookie.maxAge,
          path: cookie.path,
          sameSite: cookie.sameSite,
          secure: cookie.secure,
        });
      });
      return redirectRes;
    }

    const adminRoles = ['admin', 'ceo', 'content_admin', 'support_admin'];
    if (pathname.startsWith('/admin') && (!role || !adminRoles.includes(role))) {
      url.pathname = '/unauthorized';
      const redirectRes = NextResponse.redirect(url);
      res.cookies.getAll().forEach(cookie => {
        redirectRes.cookies.set(cookie.name, cookie.value, {
          domain: cookie.domain,
          expires: cookie.expires,
          httpOnly: cookie.httpOnly,
          maxAge: cookie.maxAge,
          path: cookie.path,
          sameSite: cookie.sameSite,
          secure: cookie.secure,
        });
      });
      return redirectRes;
    }

    if (pathname.startsWith('/dashboard') && role !== 'business_admin' && role !== 'ceo') {
      url.pathname = '/unauthorized';
      const redirectRes = NextResponse.redirect(url);
      res.cookies.getAll().forEach(cookie => {
        redirectRes.cookies.set(cookie.name, cookie.value, {
          domain: cookie.domain,
          expires: cookie.expires,
          httpOnly: cookie.httpOnly,
          maxAge: cookie.maxAge,
          path: cookie.path,
          sameSite: cookie.sameSite,
          secure: cookie.secure,
        });
      });
      return redirectRes;
    }

    if (pathname.startsWith('/lms-admin') && role !== 'admin' && role !== 'ceo') {
      url.pathname = '/unauthorized';
      const redirectRes = NextResponse.redirect(url);
      res.cookies.getAll().forEach(cookie => {
        redirectRes.cookies.set(cookie.name, cookie.value, {
          domain: cookie.domain,
          expires: cookie.expires,
          httpOnly: cookie.httpOnly,
          maxAge: cookie.maxAge,
          path: cookie.path,
          sameSite: cookie.sameSite,
          secure: cookie.secure,
        });
      });
      return redirectRes;
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/student/:path*',
    '/admin/:path*',
    '/lms-admin/:path*',
    '/dashboard/:path*',
    '/portal/:path*',
  ],
};
