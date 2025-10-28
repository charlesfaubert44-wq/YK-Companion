'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultView = 'signin' }: AuthModalProps) {
  const [view, setView] = useState<'signin' | 'signup'>(defaultView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, signInWithGoogle, signInWithApple } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (view === 'signup') {
        console.log('AuthModal: Starting signup process');
        const { data, error } = await signUp(email, password, fullName, address);

        console.log('AuthModal: Signup completed', {
          success: !error,
          userId: data?.user?.id,
          errorMessage: error?.message
        });

        if (error) {
          console.error('AuthModal: Signup error:', error);
          throw error;
        }

        // Show success message
        alert('✅ Account created! Check your email to verify your account, then you can sign in.');

        // Switch to sign in view
        setView('signin');
        setEmail('');
        setPassword('');
        setFullName('');
        setAddress('');
      } else {
        console.log('AuthModal: Starting signin process');
        const { error } = await signIn(email, password);

        if (error) {
          console.error('AuthModal: Signin error:', error);
          throw error;
        }

        console.log('AuthModal: Signin successful, closing modal');
        onClose();
      }
    } catch (err: any) {
      console.error('AuthModal: Error in handleSubmit:', err);
      setError(err.message || 'An error occurred');
    } finally {
      console.log('AuthModal: Setting loading to false');
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setError(null);
    setLoading(true);

    try {
      const { error } = provider === 'google'
        ? await signInWithGoogle()
        : await signInWithApple();

      if (error) {
        throw error;
      }

      // OAuth redirect will happen automatically
    } catch (err: any) {
      console.error('AuthModal: Social auth error:', err);
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-northern-midnight to-dark-900 border border-aurora-green/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl my-8">
        {/* Close button - Touch-friendly */}
        <button
          onClick={onClose}
          className="float-right text-gray-400 hover:text-white text-3xl min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2 touch-manipulation"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-6">
          {view === 'signin' ? 'Welcome Back' : 'Join YK Buddy'}
        </h2>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Social Auth Buttons - Temporarily hidden until OAuth is configured in Supabase
            To enable: Configure Google/Apple OAuth in Supabase Dashboard > Authentication > Providers
        */}
        {false && (
          <>
            <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
              <button
                onClick={() => handleSocialAuth('google')}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 min-h-[48px] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 touch-manipulation text-sm sm:text-base"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleSocialAuth('apple')}
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 min-h-[48px] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-gray-700 touch-manipulation text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-northern-midnight text-gray-400">Or continue with email</span>
              </div>
            </div>
          </>
        )}

        {/* Form - Mobile optimized */}
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          {view === 'signup' && (
            <>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  inputMode="text"
                  className="w-full px-3 sm:px-4 py-3 min-h-[48px] bg-dark-800 border border-gray-700 rounded-lg text-white text-base placeholder-gray-500 focus:outline-none focus:border-aurora-green focus:ring-2 focus:ring-aurora-green/20 transition-colors touch-manipulation"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                  inputMode="text"
                  className="w-full px-3 sm:px-4 py-3 min-h-[48px] bg-dark-800 border border-gray-700 rounded-lg text-white text-base placeholder-gray-500 focus:outline-none focus:border-aurora-green focus:ring-2 focus:ring-aurora-green/20 transition-colors touch-manipulation"
                  placeholder="Your address (optional)"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              inputMode="email"
              className="w-full px-3 sm:px-4 py-3 min-h-[48px] bg-dark-800 border border-gray-700 rounded-lg text-white text-base placeholder-gray-500 focus:outline-none focus:border-aurora-green focus:ring-2 focus:ring-aurora-green/20 transition-colors touch-manipulation"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={view === 'signin' ? 'current-password' : 'new-password'}
              className="w-full px-3 sm:px-4 py-3 min-h-[48px] bg-dark-800 border border-gray-700 rounded-lg text-white text-base placeholder-gray-500 focus:outline-none focus:border-aurora-green focus:ring-2 focus:ring-aurora-green/20 transition-colors touch-manipulation"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold py-3 min-h-[48px] rounded-lg hover:shadow-aurora transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-base sm:text-lg mt-5 sm:mt-6"
          >
            {loading ? 'Loading...' : view === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle view */}
        <div className="mt-6 text-center text-sm text-gray-400">
          {view === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setView('signup')}
                className="text-aurora-green hover:text-aurora-blue transition-colors font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setView('signin')}
                className="text-aurora-green hover:text-aurora-blue transition-colors font-medium"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
