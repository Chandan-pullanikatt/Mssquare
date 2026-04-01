import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/portal';

  console.log(`Auth Callback: Processing login for ${requestUrl.host}, code: ${code ? 'present' : 'missing'}, next: ${next}`);

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // 1. check if this is an instructor by email
      try {
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        let userRole = profile?.role;

        // Detect if this is a newly created Google login (within last 30 seconds)
        // This bypasses triggers that auto-assign 'student' to new Google accounts
        const isNewUser = data?.user?.created_at && (new Date().getTime() - new Date(data.user.created_at).getTime() < 30000);

        if (!userRole || (isNewUser && userRole === 'student')) {
          // If no role found, or if they are a brand new user (meaning a DB trigger might have assigned a default role)
          
          // Check if they are an instructor by email first
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

          const adminSupabase = createAdminClient();
          console.log(`Auth Callback: Assigning ${userRole} role to new user ${data.user.email}...`);
          
          // Create/Update profile (bypass RLS with ADMIN CLIENT)
          await (adminSupabase as any).from('profiles').upsert({
            id: data.user.id,
            user_id: data.user.id,
            email: data.user.email,
            role: userRole,
          }, { onConflict: 'id' });

          // Also update the users table for consistency
          const fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
          await (adminSupabase as any).from('users').upsert({
            id: data.user.id,
            name: fullName,
            role: userRole,
          }, { onConflict: 'id' }).select().maybeSingle();

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
    
    if (data?.user) {
      return NextResponse.redirect(new URL(next, request.url));
    }

    console.error('Auth Callback: Code exchange failed:', error?.message);
    const errorUrl = new URL('/auth', request.url);
    errorUrl.searchParams.set('error', error?.message || 'Authentication failed.');
    return NextResponse.redirect(errorUrl);
  }

  // Redirect to /auth if no code was provided
  return NextResponse.redirect(new URL('/auth', request.url));
}

