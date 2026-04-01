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

        let currentUserRole = profile?.role;
        let intendedRole = currentUserRole;

        // Determine intended role from 'next' path (what the user selected in the dropdown)
        if (next.includes('/student')) intendedRole = 'student';
        else if (next.includes('/business')) intendedRole = 'business_client';
        else if (next.includes('/instructor')) intendedRole = 'instructor';
        else if (!currentUserRole) intendedRole = 'student'; // Fallback for brand newcomers without a specific path

        // Check if they are an instructor by email first
        const { data: instructor } = await (supabase as any)
          .from('instructors')
          .select('id')
          .eq('email', data.user.email!)
          .maybeSingle();

        if (instructor) {
          intendedRole = 'instructor';
          // Mark in instructors table as active if just logging in
          if (data.user?.id) {
             await (supabase as any).from('instructors').update({ status: 'active', id: data.user.id }).eq('email', data.user.email!);
          }
        }

        // Safe-guards: Do NOT downgrade an admin's role!
        const isAdmin = currentUserRole && ['cms_admin', 'lms_admin', 'business_admin'].includes(currentUserRole);

        // If they are not an admin, and their current role doesn't match the intended role (the portal they chose), 
        // we forcefully UPDATE their role context so they don't get 'Access Restricted'.
        if (!isAdmin && currentUserRole !== intendedRole) {
          const adminSupabase = createAdminClient();
          console.log(`Auth Callback: Dynamically switching ${data.user.email} from ${currentUserRole || 'none'} to ${intendedRole} based on portal selection.`);
          
          // Create/Update profile (bypass RLS with ADMIN CLIENT)
          await (adminSupabase as any).from('profiles').upsert({
            id: data.user.id,
            user_id: data.user.id,
            email: data.user.email,
            role: intendedRole,
          }, { onConflict: 'id' });

          // Also update the users table for consistency
          const fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
          await (adminSupabase as any).from('users').upsert({
            id: data.user.id,
            name: fullName,
            role: intendedRole,
          }, { onConflict: 'id' }).select().maybeSingle();

          // Reflect the change in our local variable for the final redirect
          currentUserRole = intendedRole;
        }

        let userRole = currentUserRole;

        // Special case: if intended 'next' is generic /portal or /, redirect to their dashboard
      if (next === '/portal' || next === '/') {
        const userRole = currentUserRole;
        const dashboardPath = userRole === 'student' ? '/student/dashboard' :
                            userRole === 'business_client' ? '/business/dashboard' :
                            userRole === 'instructor' ? '/instructor/dashboard' :
                            userRole === 'cms_admin' ? '/admin/cms/dashboard' :
                            userRole === 'lms_admin' ? '/admin/lms/dashboard' :
                            userRole === 'business_admin' ? '/admin/business/dashboard' :
                            '/';
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
        return NextResponse.redirect(new URL(dashboardPath, baseUrl));
      }
      } catch (err) {
        console.warn("Auth Callback: Failed to check/assign roles:", err);
      }

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
      return NextResponse.redirect(new URL(next, baseUrl));
    }
    
    if (data?.user) {
      return NextResponse.redirect(new URL(next, request.url));
    }

    console.error('Auth Callback: Code exchange failed:', error?.message);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
    const errorUrl = new URL('/auth', baseUrl);
    errorUrl.searchParams.set('error', error?.message || 'Authentication failed.');
    return NextResponse.redirect(errorUrl);
  }

  // Redirect to /auth if no code was provided
  return NextResponse.redirect(new URL('/auth', request.url));
}

