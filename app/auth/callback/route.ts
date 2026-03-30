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
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        let userRole = profile?.role;

        if (!userRole) {
          // If no role found, check if they are an instructor by email first
          const { data: instructor } = await (supabase as any)
            .from('instructors')
            .select('id')
            .eq('email', data.user.email!)
            .maybeSingle();

          if (instructor) {
            userRole = 'instructor';
            // Mark in instructors table as active
            await (supabase as any).from('instructors').update({ status: 'active', id: data.user.id }).eq('email', data.user.email!);
          } else {
            // Default based on 'next' path
            if (next.includes('/student')) userRole = 'student';
            else if (next.includes('/business')) userRole = 'business_client';
            else if (next.includes('/instructor')) userRole = 'instructor';
            else userRole = 'student'; // Fallback for general newcomers
          }

          console.log(`Auth Callback: Assigning ${userRole} role to new user ${data.user.email}...`);
          
          // Create/Update profile (trigger will sync metadata)
          await (supabase as any).from('profiles').upsert({
            id: data.user.id,
            user_id: data.user.id,
            email: data.user.email,
            role: userRole,
          }, { onConflict: 'id' });
        }

        // Special case: if intended 'next' is generic /portal or /, redirect to their dashboard
        if (next === '/portal' || next === '/') {
          const dashboardPath = userRole === 'student' ? '/student/dashboard' :
                              userRole === 'business_client' ? '/business/dashboard' :
                              userRole === 'instructor' ? '/instructor/dashboard' :
                              '/';
          return NextResponse.redirect(new URL(dashboardPath, request.url));
        }
      } catch (err) {
        console.warn("Auth Callback: Failed to check/assign roles:", err);
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

