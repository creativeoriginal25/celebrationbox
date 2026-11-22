import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { AdminUser } from '../types';

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const LOCAL_ADMIN_KEY = 'cb_admin_session_v1';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    const initAuth = async () => {
      const supabase = getSupabaseClient();
      if (supabase && isConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Verify if user is in admin_users
            const { data: adminRecord } = await supabase
              .from('admin_users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (adminRecord) {
              setUser({
                id: adminRecord.id,
                email: adminRecord.email,
                role: adminRecord.role || 'admin',
                created_at: adminRecord.created_at,
              });
            } else {
              // Sign out if not authorized in admin_users table
              await supabase.auth.signOut();
              setUser(null);
            }
          }
        } catch (err) {
          console.error('Supabase session check error:', err);
        }
      } else {
        // Local mode session check
        const savedSession = localStorage.getItem(LOCAL_ADMIN_KEY);
        if (savedSession) {
          try {
            setUser(JSON.parse(savedSession));
          } catch {
            localStorage.removeItem(LOCAL_ADMIN_KEY);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();

    // Setup listener if Supabase is active
    const supabase = getSupabaseClient();
    if (supabase && isConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
        } else if (session?.user) {
          const { data: adminRecord } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (adminRecord) {
            setUser({
              id: adminRecord.id,
              email: adminRecord.email,
              role: adminRecord.role || 'admin',
              created_at: adminRecord.created_at,
            });
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [isConfigured]);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const supabase = getSupabaseClient();

    if (supabase && isConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (!data.user) {
          setIsLoading(false);
          return { success: false, error: 'Authentication failed' };
        }

        // Verify user exists in admin_users table
        const { data: adminRecord, error: adminErr } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (adminErr || !adminRecord) {
          await supabase.auth.signOut();
          setIsLoading(false);
          return {
            success: false,
            error: 'Access denied: You are not authorized as an administrator. Contact the business owner.',
          };
        }

        setUser({
          id: adminRecord.id,
          email: adminRecord.email,
          role: adminRecord.role || 'admin',
          created_at: adminRecord.created_at,
        });
        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'An unexpected error occurred' };
      }
    }

    // Local / Demo Mode authentication:
    // If Supabase is not yet configured, allow safe local sign-in with any password for initial dashboard exploration
    if (!email || !email.includes('@')) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid administrator email address.' };
    }

    if (!password || password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const localAdmin: AdminUser = {
      id: 'local-admin-1',
      email: email.trim().toLowerCase(),
      role: 'admin',
      created_at: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(localAdmin));
    setUser(localAdmin);
    setIsLoading(false);
    return { success: true };
  };

  const signOut = async (): Promise<void> => {
    const supabase = getSupabaseClient();
    if (supabase && isConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isLoading,
        isConfigured,
        signIn,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
