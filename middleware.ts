import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from './types/database';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          res = NextResponse.next();
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
    '/lms-admin',
    '/business-dashboard',
    '/adminpanel',
  ];

  const isProtectedPath = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedPath && !session) {
    url.pathname = '/auth'; 
    return NextResponse.redirect(url);
  }

  // Role-based access control (RBAC)
  if (session && isProtectedPath) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const role = (userData as any)?.role;

    if (pathname.startsWith('/student') && role !== 'student') {
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/lms-admin') && role !== 'admin' && role !== 'ceo') {
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/business-dashboard') && role !== 'business_admin' && role !== 'ceo') {
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/adminpanel') && role !== 'ceo') {
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/student/:path*',
    '/lms-admin/:path*',
    '/business-dashboard/:path*',
    '/adminpanel/:path*',
  ],
};
