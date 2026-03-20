"use client";

import { createContext, useContext, useEffect, useState, useRef } from 'react';

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
  const lastTokenRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      console.log("AuthProvider: Initializing Auth...");
      
      const timeoutId = setTimeout(() => {
        if (loading && mounted) {
          console.warn("AuthProvider: initializeAuth safety timeout reached. Unlocking UI.");
          setLoading(false);
        }
      }, 8000);

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (mounted) {
          const newToken = session?.access_token || null;
          
          // Only update if token actually changed
          if (newToken !== lastTokenRef.current) {
            lastTokenRef.current = newToken;

            if (session) {
              setUser(session.user);
              let userRole = session.user.app_metadata?.role as UserRole | null | undefined;
              if (!userRole) {
                userRole = await authHelpers.getUserRole(session.user.id);
                
                // If still no role and we are on a portal route, try to ensure a profile
                if (!userRole && mounted) {
                  const portalMatch = pathname.match(/^\/(student|business|instructor|admin\/lms|admin\/business|admin\/cms)/);
                  if (portalMatch) {
                    const detectedRole = portalMatch[1].replace('/', '_');
                    console.log(`AuthProvider: No role found on portal route ${pathname}, ensuring ${detectedRole} profile...`);
                    userRole = await authHelpers.ensureUserProfile(session.user, detectedRole);
                  }
                }
              }
              if (mounted) setRole((userRole || null) as UserRole | null);
            } else {
              setUser(null);
              setRole(null);
            }
          }
        }
      } catch (err) {
        console.error("AuthProvider: Auth initialization error:", err);
      } finally {
        clearTimeout(timeoutId);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    // Listener for tab focus recovery - now guarded by token comparison
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && !loading) {
        const { data: { session } } = await supabase.auth.getSession();
        const newToken = session?.access_token || null;

        if (mounted && newToken !== lastTokenRef.current) {
          console.log("AuthProvider: Session change detected on tab focus, updating state...");
          lastTokenRef.current = newToken;
          
          if (session) {
            setUser(session.user);
            let userRole = session.user.app_metadata?.role as UserRole | null | undefined;
            if (!userRole) {
              userRole = await authHelpers.getUserRole(session.user.id);
            }
            if (mounted) setRole((userRole || null) as UserRole | null);
          } else {
            setUser(null);
            setRole(null);
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        const newToken = session?.access_token || null;
        
        // Skip update if token is the same (Cause 1 Fix)
        if (newToken === lastTokenRef.current && event !== 'SIGNED_OUT') {
           setLoading(false);
           return;
        }

        lastTokenRef.current = newToken;
        console.log(`AuthProvider: onAuthStateChange event: ${event}`);

        if (session) {
          setUser(session.user);
          let userRole = session.user.app_metadata?.role as UserRole | null | undefined;
          if (!userRole) {
            userRole = await authHelpers.getUserRole(session.user.id);
          }
          if (mounted) setRole((userRole || null) as UserRole | null);
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      }
    );


    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      subscription.unsubscribe();
    };

  }, []);

  const signOut = async () => {
    setLoading(true);
    try {
      console.log("AuthProvider: Signing out...");
      // Wrap standard signOut in a fast timeout
      const signOutPromise = authHelpers.signOut();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('SignOut timeout')), 3000));
      
      await Promise.race([signOutPromise, timeoutPromise]).catch(err => {
        console.warn("AuthProvider: SignOut server call timed out or failed, proceeding with local cleanup.", err);
      });
    } catch (err) {
      console.error("AuthProvider: SignOut error:", err);
    } finally {
      // ALWAYS clear local state and redirect
      setUser(null);
      setRole(null);
      lastTokenRef.current = null;
      setLoading(false);
      
      // Use window.location for a hard reset to clear all caches
      window.location.href = '/auth';
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

