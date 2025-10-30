'use client';

import { useEffect } from 'react';

/**
 * Global Error Component
 * Catches errors in the root layout
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #0A1128, #1a1a2e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              maxWidth: '28rem',
              width: '100%',
              background: 'rgba(31, 41, 55, 0.5)',
              border: '1px solid rgba(55, 65, 81, 1)',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❄️</div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '1rem',
              }}
            >
              Application Error
            </h1>
            <p style={{ color: '#D1D5DB', marginBottom: '1.5rem' }}>
              A critical error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(to right, #10B981, #3B82F6)',
                color: 'white',
                fontWeight: '600',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
