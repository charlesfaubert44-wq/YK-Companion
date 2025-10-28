'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database.types';
import { logDebug, logError, logWarn } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, address?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  let supabase;
  try {
    supabase = createClient();
  } catch (error: any) {
    logError('Failed to initialize Supabase', error, { context: 'AuthProvider' });
    // Set loading to false immediately if Supabase isn't configured
    setLoading(false);
    supabase = null;
  }

  useEffect(() => {
    logDebug('AuthProvider: Initializing...');
    let timeoutId: NodeJS.Timeout;

    // Set a timeout to prevent infinite loading - reduced to 2 seconds
    const initAuth = async () => {
      timeoutId = setTimeout(() => {
        logWarn('AuthProvider: Loading timeout reached (2s), forcing loading to false');
        setLoading(false);
      }, 2000);

      try {
        // Get initial session with a race condition against timeout
        const { data } = await supabase.auth.getSession();
        const { session } = data;

        logDebug('Initial session check', {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email
        });

        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          logDebug('No initial session, setting loading to false');
          setLoading(false);
        }

        clearTimeout(timeoutId);
      } catch (error: any) {
        logError('Error getting session', error, { context: 'AuthProvider.initAuth' });
        setUser(null);
        setProfile(null);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      logDebug('Auth state change event', {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email
      });

      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        logDebug('No session in auth state change, clearing profile and stopping loading');
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    logDebug('fetchProfile called', { userId });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      logDebug('Profile fetch result', { hasData: !!data, error: error?.message });

      if (error) {
        logError('Profile fetch error', error, { userId });
        throw error;
      }

      logDebug('Setting profile data', { profileId: data?.id });
      setProfile(data);
    } catch (error) {
      logError('Error fetching profile', error as Error, { userId });
      // Even if profile fetch fails, we should still stop loading
      setProfile(null);
    } finally {
      logDebug('fetchProfile finished, setting loading to false');
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, address?: string) => {
    if (!supabase) {
      const error = new Error('Authentication is not configured. Please set up Supabase credentials in .env.local');
      logError('SignUp failed: Supabase not configured', error);
      return { data: null, error };
    }
    logDebug('signUp called', { email });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          address: address || null,
        },
      },
    });
    if (error) {
      logError('SignUp failed', error, { email });
    } else {
      logDebug('SignUp successful', { userId: data?.user?.id, email: data?.user?.email });
    }
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return {
        data: null,
        error: new Error('Authentication is not configured. Please set up Supabase credentials in .env.local')
      };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      return {
        data: null,
        error: new Error('Authentication is not configured. Please set up Supabase credentials in .env.local')
      };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const signInWithApple = async () => {
    if (!supabase) {
      return {
        data: null,
        error: new Error('Authentication is not configured. Please set up Supabase credentials in .env.local')
      };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    if (!supabase) {
      logWarn('Cannot sign out: Supabase not configured');
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    logDebug('User signed out');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    // Refetch profile
    await fetchProfile(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithApple,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
