import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/portal';

  let exchangeError = null;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
    
    exchangeError = error;
    console.error('Auth Callback: Code exchange failed:', error.message);
    
    // Check if error is because user is already logged in or session exists
    if (data?.user) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Redirect to /auth with an error message
  const errorUrl = new URL('/auth', request.url);
  const errorMessage = exchangeError?.message || 'Authentication failed. Please check your Supabase Redirect URLs or try again.';
  errorUrl.searchParams.set('error', errorMessage);
  return NextResponse.redirect(errorUrl);
}
