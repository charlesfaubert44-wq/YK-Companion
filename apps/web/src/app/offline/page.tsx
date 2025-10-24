'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-white mb-4">Back Online!</h1>
          <p className="text-gray-400 mb-8">
            Your connection has been restored.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all transform hover:scale-105"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">📡</div>
        <h1 className="text-3xl font-bold text-white mb-4">You're Offline</h1>
        <p className="text-gray-400 mb-8">
          Don't worry! YK Buddy works offline too. Some features may be limited, but you can still access:
        </p>

        <div className="space-y-4 mb-8">
          <div className="bg-dark-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-start gap-3">
              <span className="text-2xl">🌌</span>
              <div className="text-left">
                <p className="text-white font-semibold">Cached Aurora Info</p>
                <p className="text-gray-500 text-sm">Last synced forecast</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-start gap-3">
              <span className="text-2xl">🏠</span>
              <div className="text-left">
                <p className="text-white font-semibold">Saved Locations</p>
                <p className="text-gray-500 text-sm">Your saved garage sales</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-start gap-3">
              <span className="text-2xl">📋</span>
              <div className="text-left">
                <p className="text-white font-semibold">Trip Plans</p>
                <p className="text-gray-500 text-sm">View your itineraries</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
        >
          Try Again
        </button>

        <p className="text-xs text-gray-600 mt-6">
          We'll automatically reconnect when you're back online
        </p>
      </div>
    </div>
  );
}
