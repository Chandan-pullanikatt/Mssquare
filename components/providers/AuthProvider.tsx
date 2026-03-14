"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { Database } from '@/types/database';
import { authHelpers } from '@/utils/authHelpers';
import { AuthChangeEvent, User, Session } from '@supabase/supabase-js';

type UserRole = Database['public']['Tables']['users']['Row']['role'];

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        const userRole = await authHelpers.getUserRole(session.user.id);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (session) {
          setUser(session.user);
          const userRole = await authHelpers.getUserRole(session.user.id);
          setRole(userRole);
        } else {
          setUser(null);
          setRole(null);
          if (pathname !== '/auth' && pathname !== '/login' && !pathname.startsWith('/auth') && !pathname.startsWith('/lms-admin') && !pathname.startsWith('/adminpanel') && !pathname.startsWith('/business-dashboard') && pathname !== '/' && pathname !== '/dashboard') {
            // Only redirect to login if we're on a path that requires it or if it's the home page and not authenticated (user preference)
            // But let's follow the user's rule: "/student/*", "/admin/*", "/business-dashboard/*", "/adminpanel/*"
            const protectedRoutes = ['/student', '/admin', '/business-dashboard', '/adminpanel'];
            if (protectedRoutes.some(route => pathname.startsWith(route))) {
              router.push('/auth');
            }
          }
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  const signOut = async () => {
    await authHelpers.signOut();
    router.push('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
