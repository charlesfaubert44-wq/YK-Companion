/**
 * Sentry Error Monitoring Integration
 * 
 * Provides enhanced error tracking and reporting to Sentry.
 * Includes context enrichment, user identification, and custom error boundaries.
 * 
 * @module sentry-integration
 */

import * as Sentry from '@sentry/nextjs';
import { logError } from './logger';

/**
 * Initialize Sentry with custom configuration
 * Call this in sentry.client.config.ts and sentry.server.config.ts
 */
export function initializeSentry() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error monitoring disabled.');
    return;
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    
    // Adjust this value in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Capture 100% of errors
    sampleRate: 1.0,
    
    // Environment
    environment: process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || 'development',
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    
    // Performance monitoring
    enableTracing: true,
    
    // Session replay (useful for debugging)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Don't send errors in development
    enabled: process.env.NODE_ENV === 'production',
    
    // Beforeend hook to filter/modify events
    beforeSend(event, hint) {
      // Filter out known non-critical errors
      if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
        return null; // Don't send ResizeObserver errors
      }
      
      if (event.exception?.values?.[0]?.value?.includes('Loading chunk')) {
        return null; // Don't send chunk loading errors (network issues)
      }
      
      return event;
    },
    
    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
  });
}

/**
 * Capture error with context
 * 
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * 
 * @example
 * ```ts
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   captureError(error, {
 *     operation: 'riskyOperation',
 *     userId: user.id,
 *     customData: { foo: 'bar' },
 *   });
 * }
 * ```
 */
export function captureError(error: Error | unknown, context?: Record<string, any>): void {
  // Log locally first
  logError('Error captured by Sentry integration', error as Error, context);
  
  // Capture in Sentry if initialized
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
}

/**
 * Capture message (non-error event)
 * 
 * @param {string} message - Message to capture
 * @param {Sentry.SeverityLevel} level - Severity level
 * @param {Object} context - Additional context
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    });
  }
}

/**
 * Set user context for error tracking
 * Call this when user logs in
 * 
 * @param {Object} user - User object
 * 
 * @example
 * ```ts
 * setUserContext({
 *   id: user.id,
 *   email: user.email,
 *   username: user.full_name,
 * });
 * ```
 */
export function setUserContext(user: {
  id: string;
  email?: string;
  username?: string;
  [key: string]: any;
}): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }
}

/**
 * Clear user context (call on logout)
 */
export function clearUserContext(): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for debugging
 * Breadcrumbs appear in error reports to show user journey
 * 
 * @example
 * ```ts
 * addBreadcrumb({
 *   message: 'User clicked submit button',
 *   category: 'user-action',
 *   data: { formId: 'contact-form' },
 * });
 * ```
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, any>;
}): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'custom',
      level: breadcrumb.level || 'info',
      data: breadcrumb.data,
      timestamp: Date.now() / 1000,
    });
  }
}

/**
 * Start a new transaction for performance monitoring
 * 
 * @example
 * ```ts
 * const transaction = startTransaction('checkout-flow', 'payment');
 * try {
 *   await processCheckout();
 *   transaction.finish();
 * } catch (error) {
 *   transaction.setStatus('internal_error');
 *   transaction.finish();
 *   throw error;
 * }
 * ```
 */
export function startTransaction(name: string, op: string = 'custom') {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return Sentry.startSpan({ name, op }, (span) => span);
  }
  
  // Return mock transaction if Sentry not configured
  return {
    end: () => {},
    setStatus: () => {},
    setData: () => {},
    setAttribute: () => {},
  };
}

/**
 * Wrap async function with error boundary
 * Automatically captures and reports errors
 * 
 * @example
 * ```ts
 * const safeFunction = withErrorBoundary(
 *   async (userId) => {
 *     return await fetchUserData(userId);
 *   },
 *   { operationName: 'fetchUserData' }
 * );
 * ```
 */
export function withErrorBoundary<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    operationName?: string;
    captureTimeouts?: boolean;
  } = {}
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(error, {
        operation: options.operationName || fn.name,
        args,
      });
      throw error;
    }
  }) as T;
}

/**
 * Check if Sentry is initialized and ready
 */
export function isSentryInitialized(): boolean {
  return !!process.env.NEXT_PUBLIC_SENTRY_DSN;
}

