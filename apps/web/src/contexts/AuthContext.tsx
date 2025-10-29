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

/**
 * Authentication Provider Component
 * 
 * Manages user authentication state and provides auth methods throughout the app.
 * Automatically handles session persistence, token refresh, and profile management.
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components that will have access to auth context
 * @returns {JSX.Element} Provider component wrapping children
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState<ReturnType<typeof createClient> | null>(null);

  // Initialize Supabase client
  useEffect(() => {
    try {
      const client = createClient();
      setSupabaseClient(client);
    } catch (error: any) {
      logError('Failed to initialize Supabase', error, { context: 'AuthProvider' });
      setLoading(false);
      setSupabaseClient(null);
    }
  }, []);

  useEffect(() => {
    if (!supabaseClient) return;

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
        const { data } = await supabaseClient.auth.getSession();
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
    } = supabaseClient.auth.onAuthStateChange(async (event: any, session: any) => {
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
  }, [supabaseClient]);

  /**
   * Fetches user profile from the database
   * 
   * @param {string} userId - The user's unique ID
   * @returns {Promise<void>} Resolves when profile is fetched and set
   * @private
   */
  const fetchProfile = async (userId: string) => {
    if (!supabaseClient) {
      logWarn('Cannot fetch profile: Supabase client not initialized');
      setLoading(false);
      return;
    }

    logDebug('fetchProfile called', { userId });
    try {
      const { data, error } = await supabaseClient
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

  /**
   * Creates a new user account
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password (min 6 characters)
   * @param {string} fullName - User's full name
   * @param {string} [address] - Optional user address
   * @returns {Promise<{data: any, error: Error | null}>} Result object with user data or error
   * 
   * @example
   * ```ts
   * const { data, error } = await signUp('user@example.com', 'password123', 'John Doe');
   * if (error) {
   *   console.error('Signup failed:', error);
   * }
   * ```
   */
  const signUp = async (email: string, password: string, fullName: string, address?: string) => {
    if (!supabaseClient) {
      const error = new Error('Authentication is not configured. Please set up Supabase credentials in .env.local');
      logError('SignUp failed: Supabase not configured', error);
      return { data: null, error };
    }
    logDebug('signUp called', { email });
    const { data, error } = await supabaseClient.auth.signUp({
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

  /**
   * Signs in an existing user
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<{data: any, error: Error | null}>} Result object with session data or error
   * 
   * @example
   * ```ts
   * const { error } = await signIn('user@example.com', 'password123');
   * if (!error) {
   *   // User is now signed in
   * }
   * ```
   */
  const signIn = async (email: string, password: string) => {
    if (!supabaseClient) {
      return {
        data: null,
        error: new Error('Authentication is not configured. Please set up Supabase credentials in .env.local')
      };
    }
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  /**
   * Signs in using Google OAuth
   * 
   * Redirects user to Google sign-in page and returns to callback URL
   * 
   * @returns {Promise<{data: any, error: Error | null}>} Result object with OAuth data or error
   * 
   * @example
   * ```ts
   * const { error } = await signInWithGoogle();
   * // User will be redirected to Google for authentication
   * ```
   */
  const signInWithGoogle = async () => {
    if (!supabaseClient) {
      return {
        data: null,
        error: new Error('Authentication is not configured. Please set up Supabase credentials in .env.local')
      };
    }
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  /**
   * Signs in using Apple OAuth
   * 
   * Redirects user to Apple sign-in page and returns to callback URL
   * 
   * @returns {Promise<{data: any, error: Error | null}>} Result object with OAuth data or error
   * 
   * @example
   * ```ts
   * const { error } = await signInWithApple();
   * // User will be redirected to Apple for authentication
   * ```
   */
  const signInWithApple = async () => {
    if (!supabaseClient) {
      return {
        data: null,
        error: new Error('Authentication is not configured. Please set up Supabase credentials in .env.local')
      };
    }
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  /**
   * Signs out the current user
   * 
   * Clears session, user state, and profile data
   * 
   * @returns {Promise<void>} Resolves when sign out is complete
   * 
   * @example
   * ```ts
   * await signOut();
   * // User is now signed out
   * ```
   */
  const signOut = async () => {
    if (!supabaseClient) {
      logWarn('Cannot sign out: Supabase not configured');
      return;
    }
    await supabaseClient.auth.signOut();
    setUser(null);
    setProfile(null);
    logDebug('User signed out');
  };

  /**
   * Updates the current user's profile
   * 
   * @param {Partial<Profile>} updates - Profile fields to update
   * @returns {Promise<void>} Resolves when profile is updated
   * @throws {Error} If update fails or user is not authenticated
   * 
   * @example
   * ```ts
   * await updateProfile({ 
   *   full_name: 'Jane Doe',
   *   user_type: 'visiting' 
   * });
   * ```
   */
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !supabaseClient) return;

    const { error } = await supabaseClient
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

/**
 * Hook to access authentication context
 * 
 * Must be used within an AuthProvider component tree.
 * Provides access to current user, profile, loading state, and auth methods.
 * 
 * @returns {AuthContextType} Authentication context with user data and methods
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, profile, signIn, signOut } = useAuth();
 *   
 *   if (!user) {
 *     return <LoginForm onSubmit={signIn} />;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {profile?.full_name}!</p>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
