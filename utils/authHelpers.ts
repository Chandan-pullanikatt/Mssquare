import { supabase } from '@/lib/supabase/client';
import { UserRole, Database } from '../types/database';

export const authHelpers = {
  supabase,

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      // Use Promise.race to prevent indefinite hangs
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout fetching role')), 3000)
      );

      const fetchPromise = (async () => {
        // Fetch from both tables in parallel for maximum speed
        const [profileRes, userRes] = await Promise.all([
          supabase.from('profiles').select('role').eq('id', userId).maybeSingle(),
          supabase.from('users').select('role').eq('id', userId).maybeSingle()
        ]);
        
        const profileRole = profileRes.data ? (profileRes.data as any).role : null;
        const userRole = userRes.data ? (userRes.data as any).role : null;
        
        const role = profileRole || userRole;
        return (role as UserRole) || null;
      })();

      return await Promise.race([fetchPromise, timeoutPromise]) as UserRole | null;
    } catch (err) {
      console.warn("authHelpers: getUserRole timed out or failed:", err);
      return null;
    }
  },

  async isInstructor(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('instructors')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    return !!data;
  },

  async getRedirectPath(role: UserRole): Promise<string> {
    switch (role) {
      case 'student':
        return '/student/dashboard';
      case 'business_client':
        return '/business/dashboard';
      case 'lms_admin':
        return '/admin/lms/dashboard';
      case 'business_admin':
        return '/admin/business/dashboard';
      case 'cms_admin':
        return '/admin/cms/dashboard';
      case 'instructor':
        return '/instructor/dashboard';
      default:
        return '/';
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async signUp(email: string, password: string, fullName: string, role: UserRole) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile in the profiles table
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .upsert({
          id: authData.user.id,
          user_id: authData.user.id,
          email: email,
          role: role,
        }, { onConflict: 'id' });

      if (profileError) {
        console.error("Error creating profile, trying 'users' table fallback:", profileError.message);
        // Fallback to 'users' table if it's the one currently configured in the DB
        await (supabase as any)
          .from('users')
          .insert({
            id: authData.user.id,
            name: fullName,
            role: role,
          });
      }

      // Record as Lead for Admin visibility
      try {
        await supabase.from('leads').insert({
          name: fullName,
          email: email,
          source: role === 'business_admin' ? 'Business Signup' : 'Student Signup',
        } as any);

        // Notify Admins
        await supabase.from('notifications').insert({
          title: `New ${role === 'business_admin' ? 'Business' : 'Student'} Registered`,
          message: `${fullName} (${email}) has joined the platform.`,
          target_role: 'cms_admin',
          type: 'info'
        } as any);
      } catch (leadError) {
        console.warn("Failed to record lead/notification during signup:", leadError);
      }
    }

    return authData;
  },

  async signInWithGoogle(nextPath?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const redirectUrl = new URL(`${baseUrl}/auth/callback`);
    if (nextPath) {
      redirectUrl.searchParams.set('next', nextPath);
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl.toString(),
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline'
        }
      },
    });

    if (error) throw error;
    return data;
  },

  async ensureUserProfile(user: any, portalRole: string): Promise<UserRole> {
    const existingRole = await this.getUserRole(user.id);
    if (existingRole) return existingRole;

    // Create a new profile if it doesn't exist
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'User';
    const role = portalRole as UserRole;

    const { error: profileError } = await (supabase as any)
      .from('profiles')
      .upsert({
        id: user.id,
        user_id: user.id,
        email: user.email,
        role: role,
      }, { onConflict: 'id' });

    if (profileError) {
      console.error("Error creating profile:", profileError.message);
      // Fallback to 'users' table
      await (supabase as any)
        .from('users')
        .insert({
          id: user.id,
          name: fullName,
          role: role,
        });
    }

    return role;
  }
};

