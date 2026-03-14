import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { UserRole, Database } from '../types/database';

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

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
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) return null;
    return (data as any)?.role as UserRole;
  },

  getRedirectPath(role: UserRole): string {
    switch (role) {
      case 'student':
        return '/student/dashboard';
      case 'admin':
        return '/lms-admin/dashboard';
      case 'business_admin':
        return '/business-dashboard';
      case 'ceo':
        return '/adminpanel/dashboard';
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
      // Create user profile in the users table
      const { error: profileError } = await (supabase as any)
        .from('users')
        .insert({
          id: authData.user.id,
          name: fullName,
          role: role,
        });

      if (profileError) throw profileError;
    }

    return authData;
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  }
};
