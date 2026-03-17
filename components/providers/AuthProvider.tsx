"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      console.log("AuthProvider: Initializing Auth...");
      
      // Safety timeout for initializeAuth
      const timeoutId = setTimeout(() => {
        if (loading && mounted) {
          console.warn("AuthProvider: initializeAuth safety timeout reached.");
          setLoading(false);
        }
      }, 8000);

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (mounted) {
          if (session) {
            console.log("AuthProvider: Session found for user:", session.user.id);
            setUser(session.user);
            const userRole = await authHelpers.getUserRole(session.user.id);
            if (mounted) {
              setRole(userRole);
              console.log("AuthProvider: Role fetched:", userRole);
            }
          } else {
            console.log("AuthProvider: No active session.");
            setUser(null);
            setRole(null);
          }
        }
      } catch (err) {
        console.error("AuthProvider: Auth initialization error:", err);
      } finally {
        clearTimeout(timeoutId);
        if (mounted) {
          setLoading(false);
          console.log("AuthProvider: Initialization complete.");
        }
      }
    }

    initializeAuth();

    // 2. Set up the listener exactly once.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        if (session) {
          setUser(session.user);
          const userRole = await authHelpers.getUserRole(session.user.id);
          if (mounted) setRole(userRole);
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

