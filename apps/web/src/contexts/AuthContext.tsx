'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database.types';

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
    console.error('Failed to initialize Supabase:', error.message);
    // Set loading to false immediately if Supabase isn't configured
    setLoading(false);
    supabase = null;
  }

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    let timeoutId: NodeJS.Timeout;

    // Set a timeout to prevent infinite loading - reduced to 2 seconds
    const initAuth = async () => {
      timeoutId = setTimeout(() => {
        console.warn('AuthProvider: Loading timeout reached (2s), forcing loading to false');
        setLoading(false);
      }, 2000);

      try {
        // Get initial session with a race condition against timeout
        const { data } = await supabase.auth.getSession();
        const { session } = data;

        console.log('Initial session check:', {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email
        });

        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          console.log('No initial session, setting loading to false');
          setLoading(false);
        }

        clearTimeout(timeoutId);
      } catch (error: any) {
        console.error('Error getting session:', error);
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
      console.log('Auth state change event:', event, {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email
      });

      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        console.log('No session in auth state change, clearing profile and stopping loading');
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
    console.log('fetchProfile called for userId:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Profile fetch result:', { data, error });

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }

      console.log('Setting profile data:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Even if profile fetch fails, we should still stop loading
      setProfile(null);
    } finally {
      console.log('fetchProfile finished, setting loading to false');
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, address?: string) => {
    if (!supabase) {
      return {
        data: null,
        error: new Error('Authentication is not configured. Please set up Supabase credentials in .env.local')
      };
    }
    console.log('signUp called with email:', email);
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
    console.log('signUp result:', {
      userId: data?.user?.id,
      email: data?.user?.email,
      error: error?.message
    });
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
      console.warn('Cannot sign out: Supabase not configured');
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
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
