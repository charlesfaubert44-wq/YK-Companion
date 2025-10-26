# Social Authentication Setup Guide

This guide explains how to configure social authentication (Google, Apple, etc.) in your YK Buddy application.

## Overview

The application now supports:
- **Email/Password authentication**
- **Google Sign-In** (OAuth)
- **Apple Sign-In** (OAuth)
- **Address field** collection during signup

## Prerequisites

- Active Supabase project
- Supabase environment variables configured in `.env.local`

## 1. Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if you haven't already
6. Select **Web application** as the application type
7. Add authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
8. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication > Providers**
4. Find **Google** and click to configure
5. Enable Google provider
6. Paste your **Client ID** and **Client Secret**
7. Save the configuration

## 2. Apple OAuth Setup

### Step 1: Create Apple OAuth Credentials

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a new **Services ID**
4. Configure Sign in with Apple:
   - Add your domain
   - Add return URL: `https://your-project-ref.supabase.co/auth/v1/callback`
5. Create a private key for Sign in with Apple
6. Note down your **Services ID**, **Team ID**, and **Key ID**

### Step 2: Configure Apple OAuth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication > Providers**
4. Find **Apple** and click to configure
5. Enable Apple provider
6. Enter your **Services ID**, **Team ID**, **Key ID**, and upload your private key
7. Save the configuration

## 3. Database Migration

Run the migration to add the address field to the profiles table:

```bash
# If using Supabase CLI
supabase db push

# Or apply the migration manually in your Supabase SQL Editor
# File: supabase/migrations/20251026030348_add_address_to_profiles.sql
```

## 4. Environment Variables

Ensure your `.env.local` file has the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. Testing Authentication

### Test Email/Password Signup:
1. Click "Sign Up" in the app
2. Fill in name, email, password, and optionally address
3. Submit the form
4. Check email for verification link
5. Click verification link and sign in

### Test Google OAuth:
1. Click "Continue with Google"
2. Select Google account
3. Grant permissions
4. You'll be redirected back to the app, signed in

### Test Apple OAuth:
1. Click "Continue with Apple"
2. Sign in with Apple ID
3. Grant permissions
4. You'll be redirected back to the app, signed in

## 6. Additional OAuth Providers

To add more OAuth providers (GitHub, Facebook, Twitter, etc.):

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable the provider you want
3. Follow the provider-specific setup instructions
4. Update `AuthModal.tsx` to add the corresponding button and handler

Example for adding GitHub:

```typescript
// In AuthContext.tsx
const signInWithGitHub = async () => {
  if (!supabase) {
    return {
      data: null,
      error: new Error('Authentication is not configured')
    };
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
};

// In AuthModal.tsx
<button onClick={() => handleSocialAuth('github')}>
  Continue with GitHub
</button>
```

## Troubleshooting

### OAuth redirect not working
- Verify the redirect URL in your OAuth provider matches exactly
- Check that the callback route exists at `/auth/callback`
- Ensure environment variables are set correctly

### User profile not created
- Check Supabase Database triggers
- Ensure the profiles table has proper RLS policies
- Verify the address field migration was applied

### Social auth doesn't collect address
- Address is only collected during email/password signup
- For social auth users, you'll need to add a separate profile completion flow
- Consider adding a profile update modal for OAuth users

## Security Considerations

1. **Never expose client secrets** in frontend code
2. **Enable email verification** in Supabase settings
3. **Configure RLS policies** on the profiles table
4. **Use HTTPS** in production
5. **Limit OAuth redirect URLs** to your actual domains

## Support

For more information, refer to:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
