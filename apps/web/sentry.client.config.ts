import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Adjust this value in production
    tracesSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,

    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Environment
    environment: process.env.NEXT_PUBLIC_ENV || 'development',

    // Filter out local development errors
    beforeSend(event) {
      // Don't send errors if we're in development
      if (process.env.NODE_ENV === 'development') {
        return null;
      }
      return event;
    },
  });
}
