# Environment Variables Setup Guide

This guide explains all environment variables needed for the YK Buddy application.

## Quick Start

1. **Web App**: Create `apps/web/.env.local`
2. **Mobile App**: Create `apps/mobile/.env`
3. **API**: Create `apps/api/.env`

## Web App (`apps/web/.env.local`)

```bash
# =======================
# Supabase Configuration (REQUIRED)
# =======================
# Get these from: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# =======================
# Email Service (OPTIONAL)
# =======================
# Get from: https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here

# =======================
# Weather API (OPTIONAL)
# =======================
# Get from: https://openweathermap.org/api
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here

# =======================
# Maps Integration (OPTIONAL)
# =======================
# Get from: https://account.mapbox.com/access-tokens/
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here

# =======================
# Stripe Payments (OPTIONAL)
# =======================
# Get from: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# =======================
# Analytics (OPTIONAL)
# =======================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# =======================
# Error Monitoring (OPTIONAL)
# =======================
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=your_token

# =======================
# Application Settings
# =======================
NODE_ENV=development
NEXT_PUBLIC_ENV=dev
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Mobile App (`apps/mobile/.env`)

```bash
# =======================
# Supabase Configuration (REQUIRED)
# =======================
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# =======================
# Application Settings
# =======================
NODE_ENV=development
EXPO_PUBLIC_ENV=dev
EXPO_PUBLIC_API_URL=http://localhost:3001

# =======================
# Maps (OPTIONAL)
# =======================
EXPO_PUBLIC_MAPBOX_TOKEN=pk.your_token_here

# =======================
# Analytics (OPTIONAL)
# =======================
EXPO_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## API (`apps/api/.env`)

```bash
# =======================
# Application Settings
# =======================
NODE_ENV=development
PORT=3001

# =======================
# Database (REQUIRED)
# =======================
DATABASE_URL=postgresql://user:password@localhost:5432/ykbuddy

# =======================
# Authentication
# =======================
JWT_SECRET=your-super-secret-jwt-key-change-in-prod
JWT_EXPIRES_IN=7d

# =======================
# CORS
# =======================
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002

# =======================
# External APIs (OPTIONAL)
# =======================
OPENWEATHER_API_KEY=your_key
RESEND_API_KEY=re_your_key

# =======================
# Logging
# =======================
LOG_LEVEL=debug
SENTRY_DSN=https://xxx@sentry.io/xxx
```

## Environment Variable Details

### Required Variables

These are essential for the app to function:

- **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anonymous key

### Optional Variables

These enable specific features but the app will work without them:

- **RESEND_API_KEY**: Enables email notifications
- **NEXT_PUBLIC_OPENWEATHER_API_KEY**: Enables live weather data (falls back to seasonal estimates)
- **NEXT_PUBLIC_MAPBOX_TOKEN**: Enables interactive maps (shows placeholder otherwise)
- **Stripe Keys**: Enables payment/sponsorship features
- **Google Analytics**: Enables usage analytics
- **Sentry**: Enables error monitoring

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon/public key
5. Add to your `.env` files

### 2. Weather API Setup

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add to `NEXT_PUBLIC_OPENWEATHER_API_KEY`

### 3. Mapbox Setup

1. Go to [Mapbox](https://account.mapbox.com/)
2. Sign up for an account
3. Create an access token
4. Add to `NEXT_PUBLIC_MAPBOX_TOKEN`

### 4. Email Setup (Resend)

1. Go to [Resend](https://resend.com)
2. Sign up and verify your domain
3. Generate an API key
4. Add to `RESEND_API_KEY`

### 5. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your test/live API keys
3. Set up webhook endpoint
4. Add all three keys to your `.env`

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit `.env` files** to version control
2. **Never share your secret keys** publicly
3. **Use different keys** for development and production
4. **Rotate keys** if they're ever exposed
5. **Use test keys** during development (Stripe, etc.)
6. **Validate all environment variables** on app startup

## Troubleshooting

### App won't start

- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Ensure the values don't contain placeholder text like "your-project"

### Features not working

- Check console for warnings about missing API keys
- Most features gracefully degrade if API keys are missing

### "Supabase not configured" error

- Verify your Supabase credentials are correct
- Check that the `.env.local` file is in the correct directory
- Restart your dev server after adding env vars

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use production API keys (not test keys)
3. Set proper `ALLOWED_ORIGINS` for CORS
4. Enable error monitoring (Sentry)
5. Set up proper domain for email (Resend)
6. Use environment variables in your hosting platform (Vercel, etc.)

---

**Last Updated**: October 2025

