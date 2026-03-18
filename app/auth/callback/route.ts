import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
    console.error('Auth Callback: Code exchange failed:', error.message);
  }

  // Redirect to /auth with an error message
  const errorUrl = new URL('/auth', request.url);
  errorUrl.searchParams.set('error', 'Authentication failed. Please try again.');
  return NextResponse.redirect(errorUrl);
}
