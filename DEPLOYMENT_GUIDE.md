# YK Buddy Deployment Guide

## Overview
This guide walks you through deploying YK Buddy to production with a custom domain.

## Architecture
- **Frontend/Backend:** Next.js app deployed on Vercel
- **Database:** Supabase (PostgreSQL)
- **Domain:** YKBuddy.com
- **Cost:** ~$10-35/month (domain + Supabase Pro if needed)

---

## Step 1: Purchase Domain

### Buy YKBuddy.com
1. Go to [Namecheap.com](https://namecheap.com)
2. Search for "ykbuddy.com"
3. Purchase domain (~$10-15/year)
4. Enable WhoisGuard (privacy protection)

**Don't configure DNS yet - we'll do that after Vercel setup**

---

## Step 2: Set Up Production Supabase

### Create Production Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project called "YK-Buddy-Production"
3. Choose region closest to Yellowknife (Canada - Central)
4. Set strong database password (save it!)

### Run Migrations
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link to your production project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Push migrations:
   ```bash
   supabase db push
   ```

   Or manually run each migration file in Supabase SQL Editor:
   - `supabase/migrations/20250123000001_profiles.sql`
   - `supabase/migrations/20250123000002_garage_sales.sql`
   - `supabase/migrations/20250124000003_premium_sponsors.sql`

### Get Production Credentials
1. Go to Project Settings > API
2. Copy these values:
   - **Project URL** (e.g., https://xxx.supabase.co)
   - **anon/public key**
   - **service_role key** (keep secret!)

---

## Step 3: Prepare Code for Deployment

### Update Environment Variables

Create `.env.production` (DON'T commit this):

```env
# Production Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Production URL
NEXT_PUBLIC_APP_URL=https://ykbuddy.com
```

### Update Next.js Config

Ensure `apps/web/next.config.js` has:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  // Ensure standalone output for optimal deployment
  output: 'standalone',
}

module.exports = nextConfig
```

### Create `vercel.json` in project root:

```json
{
  "buildCommand": "cd apps/web && npm install && npm run build",
  "outputDirectory": "apps/web/.next",
  "devCommand": "cd apps/web && npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

---

## Step 4: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Connect Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "Add New Project"
   - Import your YK-Companion repository
   - Select "apps/web" as root directory

3. **Configure Build Settings:**
   - Framework Preset: Next.js
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   Go to Project Settings > Environment Variables and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxx...
   NEXT_PUBLIC_APP_URL = https://ykbuddy.com
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-5 minutes
   - Vercel will give you a URL like: `yk-companion.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
cd apps/web
vercel login
vercel --prod
```

---

## Step 5: Connect Custom Domain

### Add Domain to Vercel

1. Go to your Vercel project
2. Settings > Domains
3. Add "ykbuddy.com" and "www.ykbuddy.com"
4. Vercel will show you DNS records to add

### Configure DNS at Namecheap

1. Log into Namecheap
2. Go to Domain List > Manage > Advanced DNS
3. Add these records:

**For ykbuddy.com:**
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

**Vercel will provide exact values - use those instead**

4. Save changes
5. Wait 5-60 minutes for DNS propagation

### Verify Domain

1. Back in Vercel, click "Verify" on your domain
2. Once verified, your site is live at YKBuddy.com!
3. Vercel automatically provisions SSL certificate (HTTPS)

---

## Step 6: Post-Deployment Configuration

### Test Everything

1. **Homepage:** https://ykbuddy.com
2. **Auth:** Sign up/sign in functionality
3. **Database:** Check garage sales, sponsors load
4. **Admin:** https://ykbuddy.com/admin
5. **Language Selector:** Switch languages
6. **Premium Spotlight:** Verify northern lights animation

### Set Up Monitoring

1. **Vercel Analytics:**
   - Go to Vercel > Analytics tab
   - Enable Web Analytics (free)

2. **Supabase Monitoring:**
   - Dashboard shows database usage
   - Set up alerts for quota limits

### Configure Admin Access

1. In Supabase, find your user in Authentication
2. In SQL Editor, make yourself admin:
   ```sql
   UPDATE profiles
   SET is_admin = true
   WHERE id = 'your-user-id-here';
   ```

---

## Step 7: Ongoing Maintenance

### Update Production

Every time you push to GitHub main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel auto-deploys in ~2 minutes!

### Database Migrations

When you add new migrations:
```bash
supabase db push --project-ref YOUR_PRODUCTION_REF
```

### Monitor Costs

**Monthly Budget Estimate:**

| Service | Tier | Cost |
|---------|------|------|
| Domain (Namecheap) | - | $1/month ($12/year) |
| Vercel | Hobby (Free) | $0 |
| Vercel | Pro (if needed) | $20/month |
| Supabase | Free | $0 |
| Supabase | Pro (if needed) | $25/month |
| **Total (Free tier)** | | **$1/month** |
| **Total (Paid)** | | **$46/month** |

**Start with free tiers, upgrade when:**
- Vercel: >100GB bandwidth/month
- Supabase: >500MB database or need better support

---

## Troubleshooting

### Build Fails on Vercel

**Error: "Module not found"**
```bash
# Make sure all dependencies are in package.json
cd apps/web
npm install
npm run build  # Test locally first
```

### Database Connection Issues

**Check environment variables in Vercel:**
1. Settings > Environment Variables
2. Ensure NEXT_PUBLIC_SUPABASE_URL is correct
3. Redeploy after changes

### Domain Not Working

**DNS not propagated:**
- Wait up to 48 hours (usually 5-60 minutes)
- Check with: https://dnschecker.org
- Verify DNS records match Vercel's instructions

### Images Not Loading

Add Supabase domain to `next.config.js`:
```javascript
images: {
  domains: ['your-project.supabase.co'],
}
```

---

## Security Checklist

✅ Environment variables not committed to git
✅ .env files in .gitignore
✅ Supabase Row Level Security (RLS) enabled
✅ Service role key kept secret
✅ HTTPS enabled (automatic with Vercel)
✅ Admin-only routes protected
✅ Database backups enabled (Supabase auto-backups)

---

## Going Live Checklist

- [ ] Domain purchased and DNS configured
- [ ] Production Supabase project created
- [ ] All migrations run on production database
- [ ] Environment variables set in Vercel
- [ ] App deployed to Vercel
- [ ] Custom domain connected and SSL working
- [ ] Test all features in production
- [ ] Admin access configured
- [ ] Monitoring/analytics enabled
- [ ] Backup strategy in place
- [ ] Error tracking configured (optional: Sentry)

---

## Next Steps

1. **Marketing:**
   - Add Google Analytics
   - Set up social media (@YKBuddy)
   - Contact local businesses about Premium Spotlight

2. **Features:**
   - Email notifications (SendGrid, Resend)
   - Payment processing for Premium Sponsors (Stripe)
   - SEO optimization
   - Open Graph images

3. **Scale:**
   - Monitor usage
   - Upgrade when hitting limits
   - Consider CDN for images (Cloudinary, Cloudflare)

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Namecheap Support:** https://www.namecheap.com/support/

---

## Cost Summary

### Minimal Setup (Recommended to Start)
- **Domain:** $10/year
- **Vercel:** FREE
- **Supabase:** FREE
- **Total:** $10/year (less than $1/month!)

### Production Setup (When You Grow)
- **Domain:** $12/year
- **Vercel Pro:** $20/month
- **Supabase Pro:** $25/month
- **Total:** ~$46/month

**Start free, scale when needed!**
