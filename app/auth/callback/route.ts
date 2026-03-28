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
      // 1. check if this is an instructor by email
      try {
        const { data: instructor } = await supabase
          .from('instructors')
          .select('id')
          .eq('email', data.user.email!)
          .maybeSingle();

        if (instructor) {
          console.log(`Auth Callback: Auto-promoting ${data.user.email} to instructor...`);
          // 2. Assign role in profiles (trigger will sync to auth.users)
          await (supabase as any).from('profiles').upsert({
            id: data.user.id,
            user_id: data.user.id,
            email: data.user.email,
            role: 'instructor',
          }, { onConflict: 'id' });

          // 3. Mark in instructors table as active
          await (supabase as any).from('instructors').update({ status: 'active' }).eq('id', data.user.id);
          
          // 4. If the next path is /portal or /, redirect to instructor dashboard
          if (next === '/portal' || next === '/') {
            return NextResponse.redirect(new URL('/instructor/dashboard', request.url));
          }
        }
      } catch (err) {
        console.warn("Auth Callback: Failed to check/assign instructor role:", err);
      }

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
