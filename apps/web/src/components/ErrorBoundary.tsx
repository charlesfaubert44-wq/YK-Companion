'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 *
 * Catches React errors and displays a fallback UI instead of crashing the entire app.
 *
 * Architecture Reference: Arc42 Section 4.2 - Reliability Strategy
 * - Implements graceful degradation
 * - Prevents full app crashes
 * - Provides user-friendly error messages
 *
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // TODO: Log to error tracking service (e.g., Sentry) in production
    // This aligns with monitoring architecture from docs
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI - matches YK Buddy aurora theme
      return (
        <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-dark-800/50 backdrop-blur-sm rounded-2xl border border-aurora-blue/30 p-8 text-center">
            {/* Error Icon */}
            <div className="text-6xl mb-4">❄️</div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-white mb-3">
              Something Went Wrong
            </h1>

            {/* Error Message */}
            <p className="text-gray-300 mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-red-400 cursor-pointer text-sm mb-2">
                  Error Details (dev only)
                </summary>
                <pre className="text-xs text-red-300 bg-dark-900 p-3 rounded overflow-x-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
              >
                Go to Homepage
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-dark-700 text-white font-semibold rounded-lg hover:bg-dark-600 transition-all"
              >
                Try Again
              </button>
            </div>

            {/* Help Text */}
            <p className="text-sm text-gray-500 mt-6">
              If this problem persists, please{' '}
              <a
                href="/contact"
                className="text-aurora-blue hover:text-aurora-green transition-colors"
              >
                contact us
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
