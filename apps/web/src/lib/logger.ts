/**
 * Centralized logging utility
 * 
 * Replaces console.log with structured logging that can be easily integrated
 * with monitoring services like Sentry or LogRocket. Automatically suppresses
 * debug logs in production and includes context information.
 * 
 * @module logger
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isTest = process.env.NODE_ENV === 'test'

  /**
   * Debug level - only in development
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment && !this.isTest) {
      console.debug(`[DEBUG] ${message}`, context || '')
    }
  }

  /**
   * Info level - general information
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || '')
    }
    this.sendToMonitoring('info', message, context)
  }

  /**
   * Warning level - something unexpected but not breaking
   */
  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context || '')
    this.sendToMonitoring('warn', message, context)
  }

  /**
   * Error level - something broke
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorInfo = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : { error }

    console.error(`[ERROR] ${message}`, { ...errorInfo, ...context })
    
    // Send to error monitoring service
    this.sendToErrorMonitoring(message, error, context)
  }

  /**
   * Send logs to monitoring service (Sentry, LogRocket, etc.)
   */
  private sendToMonitoring(level: LogLevel, message: string, context?: LogContext) {
    // Skip in development and test
    if (this.isDevelopment || this.isTest) return

    // TODO: Integrate with your monitoring service
    // Example: Sentry.captureMessage(message, { level, extra: context })
    // Example: LogRocket.log(message, context)
  }

  /**
   * Send errors to error monitoring service
   */
  private sendToErrorMonitoring(message: string, error?: Error | unknown, context?: LogContext) {
    // Skip in development and test
    if (this.isDevelopment || this.isTest) return

    // TODO: Integrate with error monitoring service
    // Example: Sentry.captureException(error, { extra: { message, ...context } })
  }

  /**
   * Track user events for analytics
   */
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (this.isTest) return

    if (this.isDevelopment) {
      console.log(`[EVENT] ${eventName}`, properties || '')
    }

    // TODO: Send to analytics service
    // Example: analytics.track(eventName, properties)
  }

  /**
   * Track page views
   */
  trackPageView(pageName: string, properties?: Record<string, any>) {
    if (this.isTest) return

    if (this.isDevelopment) {
      console.log(`[PAGE VIEW] ${pageName}`, properties || '')
    }

    // TODO: Send to analytics service
    // Example: analytics.page(pageName, properties)
  }
}

// Export singleton instance
export const logger = new Logger()

// Convenience exports
export const logDebug = logger.debug.bind(logger)
export const logInfo = logger.info.bind(logger)
export const logWarn = logger.warn.bind(logger)
export const logError = logger.error.bind(logger)
export const trackEvent = logger.trackEvent.bind(logger)
export const trackPageView = logger.trackPageView.bind(logger)


