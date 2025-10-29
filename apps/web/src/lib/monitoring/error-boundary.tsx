/**
 * Error Boundary Component
 * 
 * Catches React errors and reports them to Sentry
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-northern-midnight">
          <div className="max-w-md w-full mx-4">
            <div className="bg-dark-800 rounded-lg p-8 shadow-xl border border-aurora-green/20">
              <div className="text-center">
                {/* Error Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                  <svg
                    className="h-8 w-8 text-red-600 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                {/* Error Message */}
                <h2 className="text-2xl font-bold text-white mb-2">
                  Oops! Something went wrong
                </h2>
                <p className="text-gray-300 mb-6">
                  We're sorry, but something unexpected happened. The error has been
                  reported and we'll look into it.
                </p>

                {/* Error Details (development only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mb-6 text-left">
                    <details className="bg-dark-900 rounded p-4 text-xs text-gray-400">
                      <summary className="cursor-pointer font-semibold text-gray-300 mb-2">
                        Error Details (Development Only)
                      </summary>
                      <pre className="whitespace-pre-wrap break-words">
                        {this.state.error.toString()}
                      </pre>
                    </details>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-aurora-green hover:bg-aurora-green/90 text-white rounded-lg font-semibold transition-colors"
                  >
                    Reload Page
                  </button>
                  <button
                    onClick={() => (window.location.href = '/')}
                    className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Go Home
                  </button>
                </div>

                {/* Help Text */}
                <p className="text-sm text-gray-400 mt-6">
                  If this problem persists, please{' '}
                  <a
                    href="/contact"
                    className="text-aurora-blue hover:text-aurora-blue/80 underline"
                  >
                    contact support
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

