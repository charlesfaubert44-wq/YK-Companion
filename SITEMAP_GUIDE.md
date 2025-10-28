# Sitemap Management Guide

## 📍 Your Sitemap Location

**Live URL:** https://web-git-master-charles-projects-5049ee53.vercel.app/sitemap.xml
**File:** `apps/web/src/app/sitemap.ts`

---

## 📋 Current Pages in Sitemap (17 pages)

### Priority 1.0 - Homepage
- `/` - Updated daily

### Priority 0.9 - Main Landing Pages
- `/visiting` - For visitors to Yellowknife
- `/living` - For current residents
- `/moving` - For people relocating

### Priority 0.9 - Key Features (Updated Daily)
- `/living/garage-sales` - Garage sale planner with map
- `/aurora-live` - Real-time aurora tracking

### Priority 0.8 - Aurora & Discovery
- `/aurora` - Aurora information
- `/knowledge` - Knowledge base
- `/discover` - Discovery page

### Priority 0.8 - Information Pages
- `/about` - About YK Buddy
- `/contact` - Contact information

### Priority 0.7 - Tools
- `/calculator` - Cost of living calculator
- `/quiz` - Yellowknife quiz
- `/seasonal` - Seasonal information

### Priority 0.6-0.5 - Additional Pages
- `/sponsor-info` - Sponsor information
- `/sitemap-page` - Visual sitemap page

---

## 🚫 Pages Excluded from Sitemap

These pages are intentionally NOT in the sitemap:

### Admin Pages (No Index)
- `/admin/*` - All admin routes
- Reason: Private, authentication required

### User-Specific Pages
- `/profile` - User profiles
- `/saved` - Saved items
- Reason: Personal data, requires login

### Technical Pages
- `/offline` - PWA offline page
- Reason: Service worker page, not user-facing

### Demo Pages
- `/pixel-demo` - Component demo
- `/carousel-demo` - Component demo
- Reason: Development/testing only

---

## 🔄 How It Updates

### Automatic Updates
- **Last Modified**: Updates automatically on every build
- **Build Trigger**: Every git push to master/production
- **Vercel**: Regenerates sitemap on each deployment

### No Manual Updates Needed!
The sitemap is generated dynamically from the `sitemap.ts` file. When Vercel builds your site, it:
1. Reads `sitemap.ts`
2. Generates `sitemap.xml`
3. Serves it at `/sitemap.xml`

---

## ➕ Adding New Pages to Sitemap

When you create a new public page, add it to `apps/web/src/app/sitemap.ts`:

### Step 1: Open the file
```typescript
// apps/web/src/app/sitemap.ts
```

### Step 2: Add your route
Choose the appropriate priority level:

```typescript
const routes = [
  // Add your new page in the right section

  // High priority (0.9) - Main features
  { path: '/your-new-page', priority: 0.9, changeFreq: 'weekly' as const },

  // Medium priority (0.7-0.8) - Information/tools
  { path: '/your-tool', priority: 0.7, changeFreq: 'monthly' as const },

  // Lower priority (0.5-0.6) - Additional content
  { path: '/extra-page', priority: 0.6, changeFreq: 'monthly' as const },
];
```

### Step 3: Commit and push
```bash
git add apps/web/src/app/sitemap.ts
git commit -m "Add [page name] to sitemap"
git push origin master
```

Vercel will automatically regenerate the sitemap!

---

## 📊 Priority Guidelines

### 1.0 - Homepage Only
- Main entry point
- Changes daily

### 0.9 - Critical Pages
- Primary user journeys (Visiting, Living, Moving)
- Key features (Garage Sales, Aurora Live)
- Updated daily or weekly

### 0.8 - Important Information
- About, Contact
- Knowledge base, Discovery
- Updated weekly or monthly

### 0.7 - Tools & Utilities
- Calculators, quizzes
- Seasonal guides
- Updated monthly

### 0.6 and below - Supplementary
- Sponsor info
- Visual sitemap
- Updated monthly or less

---

## 🔍 Change Frequency Options

```typescript
'always'   // Changes on every access (rare)
'hourly'   // Changes hourly
'daily'    // Changes daily (homepage, live features)
'weekly'   // Changes weekly (most pages)
'monthly'  // Changes monthly (stable content)
'yearly'   // Changes yearly (static pages)
'never'    // Never changes (archived content)
```

---

## ✅ Verifying Your Sitemap

### 1. Check Locally (After Build)
```bash
npm run build:web
# Visit: http://localhost:3002/sitemap.xml
```

### 2. Check Production
Visit: https://web-git-master-charles-projects-5049ee53.vercel.app/sitemap.xml

### 3. Validate Sitemap
Use these tools:
- **Google Search Console**: Submit and check for errors
- **XML Sitemap Validator**: https://www.xml-sitemaps.com/validate-xml-sitemap.html
- **Screaming Frog**: Desktop tool for SEO audits

---

## 🔧 Troubleshooting

### Sitemap Not Updating?
1. Check the build succeeded in Vercel
2. Clear browser cache
3. Verify `NEXT_PUBLIC_SITE_URL` is set in Vercel
4. Check `sitemap.ts` has no syntax errors

### Wrong URLs in Sitemap?
- Make sure `NEXT_PUBLIC_SITE_URL` is set correctly in Vercel environment variables
- For production: `https://ykbuddy.com`
- For preview: `https://web-git-master-charles-projects-5049ee53.vercel.app`

### Page Missing from Sitemap?
1. Check if the route exists in `sitemap.ts`
2. Verify the page is not in the excluded list
3. Rebuild and redeploy

---

## 📈 SEO Best Practices

### Do:
✅ Include all public-facing pages
✅ Use realistic change frequencies
✅ Set appropriate priorities (don't make everything 1.0!)
✅ Update `lastModified` automatically
✅ Keep URLs clean and readable

### Don't:
❌ Include admin/login pages
❌ Include user-specific pages
❌ Include demo/test pages
❌ Set all pages to priority 1.0
❌ Claim pages update more than they actually do

---

## 🎯 Quick Reference

| Page Type | Priority | Change Freq | Example |
|-----------|----------|-------------|---------|
| Homepage | 1.0 | daily | `/` |
| Main Sections | 0.9 | weekly | `/visiting`, `/living` |
| Key Features | 0.9 | daily | `/aurora-live` |
| Information | 0.8 | monthly | `/about`, `/contact` |
| Tools | 0.7 | monthly | `/calculator` |
| Supplementary | 0.5-0.6 | monthly | `/sponsor-info` |

---

## 📝 Example: Adding a New Page

Let's say you create `/events` page:

### 1. Edit sitemap.ts
```typescript
// Add to the appropriate section based on importance
{ path: '/events', priority: 0.8, changeFreq: 'daily' as const },
```

### 2. Commit
```bash
git add apps/web/src/app/sitemap.ts
git commit -m "Add events page to sitemap"
git push origin master
```

### 3. Verify
- Wait for Vercel deployment (~2 minutes)
- Visit: `/sitemap.xml`
- Check that `/events` appears in the XML

Done! 🎉

---

## 🤖 Automated Maintenance

The sitemap is **fully automated**:
- ✅ Updates on every deployment
- ✅ No manual XML editing needed
- ✅ TypeScript ensures correctness
- ✅ Version controlled in git

Just add/remove routes in `sitemap.ts` and push!

---

**Last Updated:** January 2025
**Maintained By:** YK Buddy Team
