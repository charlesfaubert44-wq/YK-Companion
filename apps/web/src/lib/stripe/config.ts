/**
 * Stripe Configuration
 * Handles Stripe API keys and configuration
 */

// Allow building without Stripe keys (they'll be added in production via Vercel)
const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

if (isProduction && !process.env.STRIPE_SECRET_KEY) {
  console.warn('WARNING: STRIPE_SECRET_KEY is not set. Payment features will be disabled.');
}

if (isProduction && !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.warn('WARNING: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Payment features will be disabled.');
}

export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  apiVersion: '2025-09-30.clover' as const,
  isConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
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
