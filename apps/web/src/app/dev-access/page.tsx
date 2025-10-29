'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DevAccessPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already has access (only on client)
    if (typeof window !== 'undefined') {
      const hasAccess = localStorage.getItem('yk_dev_access');
      if (hasAccess === 'granted') {
        router.push('/');
      }
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === 'maeve2023') {
      localStorage.setItem('yk_dev_access', 'granted');
      setError('');
      // Show success animation then redirect
      setTimeout(() => {
        router.push('/');
      }, 500);
    } else {
      setError('Invalid access code');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-northern-midnight via-dark-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Aurora Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-aurora-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-aurora-blue/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-aurora-purple/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Northern Lights particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-aurora-blue rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-dark-800/40 border border-aurora-blue/20 rounded-2xl p-8 shadow-2xl">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-aurora-green/20 to-aurora-blue/20 rounded-2xl mb-4 animate-bounce-gentle">
              <svg
                className="w-16 h-16 text-aurora-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent mb-2">
              YKBuddy Development
            </h1>
            <p className="text-gray-400 text-sm">
              Enter access code to continue
            </p>
          </div>

          {/* Access Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Access Code
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-dark-900/50 border ${
                  error ? 'border-red-500' : 'border-gray-700'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aurora-blue focus:border-transparent transition-all ${
                  isShaking ? 'animate-shake' : ''
                }`}
                placeholder="Enter code"
              />
              {error && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-aurora-blue/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-aurora-blue focus:ring-offset-2 focus:ring-offset-dark-900"
            >
              Access Site
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-700/30 text-center">
            <p className="text-xs text-gray-500">
              🔒 Development Environment
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Yellowknife's Digital Companion Platform
            </p>
          </div>
        </div>

        {/* Decorative Northern Lights Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple rounded-2xl opacity-20 blur-xl -z-10"></div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(5px);
          }
        }

        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
