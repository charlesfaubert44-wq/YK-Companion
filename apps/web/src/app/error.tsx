'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/logger';

/**
 * Next.js Error Component
 * This is the root error boundary for the app
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to logging service
    logError('Next.js Error Component', error, {
      digest: error.digest,
      page: window.location.pathname,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">❄️</div>
        <h1 className="text-2xl font-bold text-white mb-4">Something went wrong!</h1>
        <p className="text-gray-300 mb-6">
          We're experiencing some technical difficulties. Our team has been notified.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
          >
            Go Home
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 text-left">
            <details className="text-sm text-red-400">
              <summary className="cursor-pointer font-semibold mb-2">
                Error Details (Dev Only)
              </summary>
              <pre className="bg-gray-900 p-4 rounded overflow-auto text-xs">
                {error.message}
                {'\n\n'}
                {error.stack}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
