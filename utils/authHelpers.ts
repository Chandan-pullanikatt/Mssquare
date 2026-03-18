import { supabase } from '@/lib/supabase/client';
import { UserRole, Database } from '../types/database';

export const authHelpers = {
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
        setTimeout(() => reject(new Error('Timeout fetching role')), 5000)
      );

      const fetchPromise = (async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();
        
        if (!data || error) {
          // Try falling back to 'users' table if it exists
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .maybeSingle();
          
          return (userData as any)?.role as UserRole || null;
        }
        return (data as any)?.role as UserRole;
      })();

      return await Promise.race([fetchPromise, timeoutPromise]) as UserRole | null;
    } catch (err) {
      console.warn("authHelpers: getUserRole timed out or failed:", err);
      return null;
    }
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
        return '/admin/lms/dashboard'; // Defaulting to LMS dashboard for now
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
    }

    return authData;
  },

  async signInWithGoogle(nextPath?: string) {
    const redirectUrl = new URL(`${window.location.origin}/auth/callback`);
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

