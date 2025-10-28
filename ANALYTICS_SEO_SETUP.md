# Analytics, SEO, and Monitoring Setup Guide

## What Was Added

### 1. Analytics ✅
- **Google Analytics** - Track page views, user behavior, and conversions
- **Vercel Analytics** - Performance monitoring (automatically enabled)

### 2. SEO Optimization ✅
- **Enhanced Meta Tags** - Open Graph, Twitter Cards, comprehensive descriptions
- **Sitemap.xml** - Automatically generated at `/sitemap.xml`
- **Robots.txt** - Search engine directives at `/robots.txt`
- **Structured Data** - JSON-LD for Organization, WebSite, and LocalBusiness

### 3. Error Monitoring ✅
- **Sentry** - Real-time error tracking and performance monitoring

---

## Required Environment Variables (Add to Vercel)

### Google Analytics (Optional but Recommended)
1. **Get your GA4 Measurement ID:**
   - Go to https://analytics.google.com/
   - Create a property (if you haven't)
   - Click "Admin" → "Data Streams" → Select your stream
   - Copy the "Measurement ID" (format: G-XXXXXXXXXX)

2. **Add to Vercel:**
   ```
   Variable: NEXT_PUBLIC_GA_MEASUREMENT_ID
   Value: G-XXXXXXXXXX
   Environment: Production, Preview, Development
   ```

### Site URL (Required for SEO)
```
Variable: NEXT_PUBLIC_SITE_URL
Value: https://web-git-master-charles-projects-5049ee53.vercel.app
(or https://ykbuddy.com when custom domain is configured)
Environment: Production
```

### Sentry (Optional - for Error Tracking)
1. **Get your Sentry DSN:**
   - Go to https://sentry.io/
   - Create a free account
   - Create a new project (Next.js)
   - Copy the DSN (format: https://xxx@xxx.ingest.sentry.io/xxx)

2. **Add to Vercel:**
   ```
   Variable: NEXT_PUBLIC_SENTRY_DSN
   Value: https://xxx@xxx.ingest.sentry.io/xxx
   Environment: Production, Preview
   ```

---

## How to Add Environment Variables to Vercel

1. Go to https://vercel.com/dashboard
2. Select your YK-Companion project
3. Click "Settings" → "Environment Variables"
4. For each variable:
   - Enter "Variable Name"
   - Enter "Value"
   - Check environments (Production, Preview, Development)
   - Click "Save"
5. After adding variables, **redeploy** your project

---

## Verification Checklist

### SEO
- ✅ Visit https://your-site.vercel.app/sitemap.xml
- ✅ Visit https://your-site.vercel.app/robots.txt
- ✅ View page source and verify Open Graph tags (`<meta property="og:...`)
- ✅ Test with https://cards-dev.twitter.com/validator (Twitter Card)
- ✅ Test with https://developers.facebook.com/tools/debug/ (Facebook)

### Google Analytics
- ✅ Visit your site
- ✅ Go to Google Analytics → Reports → Realtime
- ✅ Verify you see active users

### Vercel Analytics
- ✅ Go to Vercel Dashboard → Your Project → Analytics tab
- ✅ Wait 24 hours for data to populate

### Sentry (if configured)
- ✅ Trigger a test error
- ✅ Check Sentry dashboard for error report

---

## Test Google Analytics Locally

1. Add to `apps/web/.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. Start dev server:
   ```bash
   npm run dev:web
   ```

3. Open browser console and verify no errors
4. Visit Google Analytics → Realtime to see your visit

---

## Features That Now Work

### Automatic Sitemap
- Generated at build time
- Includes all major pages
- Updates automatically when you add pages

### SEO Metadata
Every page now has:
- Unique title and description
- Open Graph images (for social media sharing)
- Twitter Card support
- Structured data for search engines

### Analytics Tracking
- Page views
- User interactions
- Performance metrics (via Vercel Analytics)

### Error Monitoring (with Sentry)
- Real-time error tracking
- Stack traces
- User session replays
- Performance monitoring

---

## Next Steps (Optional)

### 1. Create Custom Open Graph Image
Current: `/og-image.jpg` (placeholder)

Create a 1200x630px image featuring:
- YK Buddy logo
- "Your Yellowknife Companion" tagline
- Aurora/northern imagery
- Place at: `apps/web/public/og-image.jpg`

### 2. Set Up Google Search Console
1. Go to https://search.google.com/search-console
2. Add your property (your domain or URL)
3. Verify ownership
4. Submit sitemap: https://your-site.vercel.app/sitemap.xml

### 3. Set Up Social Media
Add to Structured Data (in `StructuredData.tsx`):
- Facebook page URL
- Twitter/X handle
- Instagram profile

### 4. Monitor Performance
- Google Analytics: https://analytics.google.com/
- Vercel Analytics: Vercel Dashboard → Analytics
- Sentry: https://sentry.io/ (if configured)

---

## Files Created

```
apps/web/
├── sentry.client.config.ts          # Sentry browser config
├── sentry.server.config.ts          # Sentry server config
├── sentry.edge.config.ts            # Sentry edge config
├── src/
│   ├── app/
│   │   ├── sitemap.ts              # Auto-generated sitemap
│   │   ├── robots.ts               # Robots.txt configuration
│   │   └── layout.tsx              # Updated with analytics
│   ├── components/
│   │   ├── GoogleAnalytics.tsx     # GA4 integration
│   │   └── StructuredData.tsx      # JSON-LD structured data
│   └── lib/
│       └── seo.ts                  # SEO metadata utilities
```

---

## Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| Vercel Analytics | Built-in | FREE |
| Google Analytics | GA4 | FREE |
| Sentry | Developer (10K errors/mo) | FREE |
| **Total** | | **$0/month** |

All services have free tiers perfect for starting out!

---

## Support Resources

- **Google Analytics Help**: https://support.google.com/analytics
- **Vercel Analytics Docs**: https://vercel.com/docs/analytics
- **Sentry Docs**: https://docs.sentry.io/
- **Next.js SEO**: https://nextjs.org/learn/seo/introduction-to-seo

---

**Last Updated:** January 2025
**Status:** Production Ready ✅
