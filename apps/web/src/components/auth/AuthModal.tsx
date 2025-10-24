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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (view === 'signup') {
        console.log('AuthModal: Starting signup process');
        const { data, error } = await signUp(email, password, fullName);

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-northern-midnight to-dark-900 border border-aurora-green/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="float-right text-gray-400 hover:text-white text-2xl"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'signup' && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold py-3 rounded-lg hover:shadow-aurora transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
