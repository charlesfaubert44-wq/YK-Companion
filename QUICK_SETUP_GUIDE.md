# Quick Setup Guide - Google Analytics & SEO

## ✅ Task 1: Google Analytics Setup (5 minutes)

### Get Your GA4 Measurement ID:

1. **Go to Google Analytics**: https://analytics.google.com/

2. **Create Property** (if new):
   - Click "Admin" → "Create Property"
   - Property name: **YK Buddy**
   - Time zone: **(GMT-07:00) Mountain Time**
   - Currency: **Canadian Dollar**
   - Click "Next"

3. **Set Up Data Stream**:
   - Select platform: **Web**
   - Website URL: `https://web-git-master-charles-projects-5049ee53.vercel.app`
   - Stream name: **YK Buddy Production**
   - Click "Create stream"

4. **Copy Measurement ID**:
   - Look for "Measurement ID" (format: `G-XXXXXXXXXX`)
   - Copy it!

### Add to Vercel:

1. Go to https://vercel.com/dashboard
2. Select your YK-Companion project
3. Click **Settings** → **Environment Variables**
4. Add new variable:
   ```
   Name: NEXT_PUBLIC_GA_MEASUREMENT_ID
   Value: G-XXXXXXXXXX (paste your ID)
   Environments: ✓ Production ✓ Preview ✓ Development
   ```
5. Click **Save**
6. Go to **Deployments** → Click ⋮ on latest → **Redeploy**

### Verify It Works:
1. Visit your site: https://web-git-master-charles-projects-5049ee53.vercel.app
2. Go to Google Analytics → **Reports** → **Realtime**
3. You should see yourself as an active user! 🎉

---

## ✅ Task 2: Create Open Graph Image (10 minutes)

### Method 1: Use the Template (Easiest)

1. **Open the template**:
   ```
   File: apps/web/public/og-image-template.html
   ```
   Double-click to open in your browser

2. **Capture Screenshot** (1200x630px):

   **Option A - Browser DevTools (Chrome/Firefox)**:
   - Press `F12` to open DevTools
   - Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
   - Type "screenshot"
   - Select "Capture node screenshot"
   - Click on the card
   - Save as `og-image.jpg`

   **Option B - Windows Snipping Tool**:
   - Open template in browser
   - Press `Windows + Shift + S`
   - Select the card area
   - Save from clipboard as `og-image.jpg`

   **Option C - Screenshot Tool**:
   - Use Snagit, Lightshot, or similar
   - Capture at exactly 1200x630 pixels
   - Save as `og-image.jpg`

3. **Save the file**:
   ```
   Location: apps/web/public/og-image.jpg
   ```

4. **Commit and push**:
   ```bash
   git add apps/web/public/og-image.jpg
   git commit -m "Add Open Graph image"
   git push origin master
   ```

### Method 2: Use Canva (Alternative)

1. Go to https://www.canva.com/
2. Create design → Custom size → 1200 x 630 px
3. Use this content:
   - **Title**: YK Buddy
   - **Tagline**: Your Yellowknife Companion
   - **Subtitle**: "Because Nobody Should Face -40° Alone"
   - **Background**: Dark gradient (navy/purple)
   - **Accent color**: Aurora green (#10B981)
4. Download as JPG
5. Save to `apps/web/public/og-image.jpg`

---

## ✅ Task 3: Google Search Console (10 minutes)

### Step 1: Add Property

1. **Go to Search Console**: https://search.google.com/search-console

2. **Add a property**:
   - Click **Add property**
   - Select **URL prefix**
   - Enter: `https://web-git-master-charles-projects-5049ee53.vercel.app`
   - Click **Continue**

### Step 2: Verify Ownership

**Choose verification method**: HTML Tag (easiest)

1. Google will show you a meta tag like:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXX" />
   ```

2. **Copy the content value** (XXXXXXXXXXX)

3. **Add to Vercel Environment Variables**:
   ```
   Name: NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
   Value: XXXXXXXXXXX (paste the code)
   Environments: ✓ Production
   ```

4. **Update your layout.tsx**:
   I'll help you add this in the next step!

5. Go back to Google Search Console and click **Verify**

### Step 3: Submit Sitemap

1. In Google Search Console
2. Click **Sitemaps** (left sidebar)
3. Enter: `sitemap.xml`
4. Click **Submit**

### Step 4: Monitor

- Check back in 2-3 days
- View **Performance** report to see search impressions
- Monitor **Coverage** for indexing issues

---

## Verification Checklist

### After Setup, Test These:

- [ ] Visit your site and check Google Analytics Realtime
- [ ] View page source - verify GA script is present
- [ ] Check `/sitemap.xml` - should show all pages
- [ ] Check `/robots.txt` - should show sitemap reference
- [ ] Share a link on Twitter/Facebook - preview should show your OG image
- [ ] Google Search Console shows "Verified" status
- [ ] Sitemap submitted successfully

### Testing Tools:

- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **Google Rich Results Test**: https://search.google.com/test/rich-results

---

## Expected Results

### Google Analytics:
- Real-time visitor tracking
- Page view stats
- User demographics
- Traffic sources

### Open Graph Image:
- Beautiful social media previews
- Professional appearance when shared
- Consistent branding

### Google Search Console:
- Search performance data
- Indexing status
- Mobile usability reports
- Core Web Vitals

---

## Need Help?

If you get stuck:
1. Check the verification URL works in a browser
2. Make sure environment variables are saved
3. Redeploy after adding variables
4. Wait 5-10 minutes for changes to propagate

---

**Time Required:**
- Google Analytics: 5 minutes
- Open Graph Image: 10 minutes
- Search Console: 10 minutes
- **Total: ~25 minutes**

**Next Steps After Setup:**
- Monitor analytics daily for the first week
- Check Search Console weekly for issues
- Update OG image seasonally for fresh content
