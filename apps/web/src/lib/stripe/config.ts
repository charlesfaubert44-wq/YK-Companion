/**
 * Stripe Configuration
 * Handles Stripe API keys and configuration
 */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment variables');
}

export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  apiVersion: '2023-10-16' as const,
};

export const STRIPE_PRICES = {
  AURORA_SPONSOR: {
    monthly: 200,
    quarterly: 550,
    annually: 2000,
  },
  EXPLORER_SPONSOR: {
    monthly: 350,
    quarterly: 950,
    annually: 3500,
  },
  NORTHERN_SPONSOR: {
    monthly: 500,
    quarterly: 1350,
    annually: 5000,
  },
};

export const STRIPE_CURRENCY = 'cad';
