# YK Buddy - QR Code Generation Guide

**Purpose:** Step-by-step instructions to create all QR codes for your campaign
**Tool:** QR Code Monkey (free, no account needed)
**Time:** 30-45 minutes for all codes

---

## 🎯 Overview

### What You Need

**Number of QR Codes:**
- **Minimal Budget:** 9 codes (3 sizes × 3 variants)
- **Standard Budget:** 12 codes (9 posters + 3 cards)
- **Premium Budget:** 15+ codes (posters + cards + location-specific)

**Each QR Code Needs:**
- Unique tracking URL (UTM parameters)
- High resolution (1000×1000px minimum)
- Error correction level H (30%)
- Print-ready format (PNG or SVG)

---

## 📱 STEP-BY-STEP GUIDE

### Step 1: Prepare Your URLs

Before generating QR codes, create a list of all URLs you need.

#### Base URL Structure
```
https://ykbuddy.com/?utm_source=[source]&utm_medium=[medium]&utm_campaign=[campaign]
```

#### URL Components
- **utm_source:** Where is this? (poster, card, partner)
- **utm_medium:** What type? (qr, nfc, print)
- **utm_campaign:** Which variant? (visitor-large, resident-medium, newcomer-small)

---

### Step 2: URL List - Copy & Paste Ready

#### POSTERS - Large (11×17")

**Visitor Variant:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=visitor-large
```

**Resident Variant:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=resident-large
```

**Newcomer Variant:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=newcomer-large
```

---

#### POSTERS - Medium (8.5×11")

**Visitor Variant:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=visitor-medium
```

**Resident Variant:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=resident-medium
```

**Newcomer Variant:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=newcomer-medium
```

---

#### POSTERS - Small (5×7")

**Visitor Variant:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=visitor-small
```

**Resident Variant:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=resident-small
```

**Newcomer Variant:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=newcomer-small
```

---

#### BUSINESS CARDS

**Visitor Variant:**
```
https://ykbuddy.com/?utm_source=card&utm_medium=qr&utm_campaign=visitor
```

**Resident Variant:**
```
https://ykbuddy.com/?utm_source=card&utm_medium=qr&utm_campaign=resident
```

**Newcomer Variant:**
```
https://ykbuddy.com/?utm_source=card&utm_medium=qr&utm_campaign=newcomer
```

---

#### LOCATION-SPECIFIC (Optional - Premium)

**Airport:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=airport
```

**City Hall:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=cityhall
```

**Hotels:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=hotels
```

**Coffee Shops:**
```
https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=coffee
```

---

### Step 3: Generate QR Codes (QR Code Monkey)

#### Access the Tool
1. Open browser
2. Go to: **https://www.qrcode-monkey.com/**
3. No account needed!

---

#### For Each URL:

**A. Enter Content**
1. Click **"URL"** tab (should be default)
2. Paste your URL (e.g., `https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=visitor-large`)
3. Click into the URL field to ensure it's registered

**B. Set Colors (Optional but Branded)**

**Standard (Black & White):**
- Foreground: Black `#000000`
- Background: White `#FFFFFF`
- Skip customization, use defaults

**Branded Aurora Style:**
- Foreground: Aurora Blue `#3B82F6`
- Background: White `#FFFFFF`
- Eye (corners): Aurora Green `#10B981`

**To Apply Colors:**
1. Click **"Set Colors"** button
2. Select foreground color picker → enter hex code
3. Select background → keep white
4. Optional: Click "Eye" tab → choose custom eye color

**C. Add Logo (Optional Premium)**
1. Click **"Add Logo Image"** button
2. Upload YK Buddy logo (small PNG, transparent background)
3. Set logo size: 15-20% (don't go larger, affects scanning)
4. Preview to ensure QR still scans

**D. Customize Design (Optional)**
1. Click **"Customize Design"** button
2. **Body Shape:** Try "circular" or "rounded" (modern look)
3. **Eye Frame:** Try "frame14" (rounded square)
4. **Eye Ball:** Try "ball15" (rounded)
5. Preview changes

**E. Set Quality**
1. Click **"Quality and Options"** section
2. Set quality to **1000 × 1000** pixels (print quality)
3. Check **"High Error Correction (30%)"** - important!
4. Margin: 4 (default is fine)

**F. Download**
1. Click green **"Download PNG"** button
2. File will download as `qrcode.png`
3. **RENAME immediately** to match campaign:
   - Example: `visitor-large-poster-qr.png`

---

### Step 4: Naming Convention

**Use this format for easy organization:**

**Posters:**
- `visitor-large-qr.png`
- `visitor-medium-qr.png`
- `visitor-small-qr.png`
- `resident-large-qr.png`
- `resident-medium-qr.png`
- `resident-small-qr.png`
- `newcomer-large-qr.png`
- `newcomer-medium-qr.png`
- `newcomer-small-qr.png`

**Cards:**
- `visitor-card-qr.png`
- `resident-card-qr.png`
- `newcomer-card-qr.png`

**Location-Specific:**
- `airport-qr.png`
- `cityhall-qr.png`
- `hotels-qr.png`
- `coffee-qr.png`

---

### Step 5: Test EVERY QR Code

**Critical: Test before printing!**

**Testing Process:**
1. Open QR code image on computer screen
2. Use phone camera (iPhone) or Google Lens (Android)
3. Scan from 6-12 inches away
4. Verify URL opens correctly
5. Check that URL in browser matches expected tracking parameters
6. Test with at least 3 different devices/cameras

**Testing Checklist for Each Code:**
- [ ] Scans successfully on iPhone
- [ ] Scans successfully on Android
- [ ] URL matches expected link
- [ ] UTM parameters are correct
- [ ] Page loads properly
- [ ] No broken links

**If a QR Code Doesn't Scan:**
- Regenerate at higher resolution (1500×1500px)
- Remove logo (if you added one)
- Simplify design (use standard black & white)
- Check URL for typos
- Test on different lighting conditions

---

## 📁 File Organization

### Create This Folder Structure

```
/marketing/
└── /qr-codes/
    ├── /posters/
    │   ├── /large/
    │   │   ├── visitor-large-qr.png
    │   │   ├── resident-large-qr.png
    │   │   └── newcomer-large-qr.png
    │   ├── /medium/
    │   │   ├── visitor-medium-qr.png
    │   │   ├── resident-medium-qr.png
    │   │   └── newcomer-medium-qr.png
    │   └── /small/
    │       ├── visitor-small-qr.png
    │       ├── resident-small-qr.png
    │       └── newcomer-small-qr.png
    ├── /cards/
    │   ├── visitor-card-qr.png
    │   ├── resident-card-qr.png
    │   └── newcomer-card-qr.png
    ├── /location-specific/
    │   ├── airport-qr.png
    │   ├── cityhall-qr.png
    │   └── [others...]
    └── QR_URL_TRACKING_LIST.txt
```

---

## 📊 QR Code Tracking List

### Create this document: `QR_URL_TRACKING_LIST.txt`

**Purpose:** Master reference for all QR codes and their URLs

**Template:**
```
YK BUDDY - QR CODE TRACKING LIST
Generated: [Date]
Campaign: Your Northern Companion

===========================================
POSTERS - LARGE (11×17")
===========================================

Visitor Variant
File: visitor-large-qr.png
URL: https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=visitor-large
Status: ✓ Tested, Ready

Resident Variant
File: resident-large-qr.png
URL: https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=resident-large
Status: ✓ Tested, Ready

Newcomer Variant
File: newcomer-large-qr.png
URL: https://ykbuddy.com/?utm_source=poster&utm_medium=qr&utm_campaign=newcomer-large
Status: ✓ Tested, Ready

===========================================
POSTERS - MEDIUM (8.5×11")
===========================================

[Repeat format for medium...]

===========================================
POSTERS - SMALL (5×7")
===========================================

[Repeat format for small...]

===========================================
BUSINESS CARDS
===========================================

[Repeat format for cards...]

===========================================
LOCATION-SPECIFIC (Optional)
===========================================

[Add location-specific codes...]

===========================================
TESTING NOTES
===========================================

All codes tested on:
- iPhone 12 ✓
- Samsung Galaxy ✓
- Google Pixel ✓

Lighting conditions tested:
- Indoor bright ✓
- Indoor dim ✓
- Outdoor daylight ✓

Issues encountered: None / [describe any issues]

===========================================
ANALYTICS SETUP
===========================================

Google Analytics: ✓ Configured
UTM tracking: ✓ Active
Goal conversions: ✓ Set up

Date deployed: [Date]
```

---

## 🎨 Design Specifications for Posters/Cards

### QR Code Sizing in Design Files

**Large Posters (11×17"):**
- QR Code Size: 2.5" × 2.5"
- Resolution: 750×750px (at 300 DPI)
- Position: Centered horizontally, bottom third

**Medium Posters (8.5×11"):**
- QR Code Size: 2.0" × 2.0"
- Resolution: 600×600px (at 300 DPI)
- Position: Centered horizontally, bottom third

**Small Posters (5×7"):**
- QR Code Size: 1.5" × 1.5"
- Resolution: 450×450px (at 300 DPI)
- Position: Centered, bottom section

**Business Cards (3.5×2"):**
- QR Code Size: 1.0" × 1.0"
- Resolution: 300×300px (at 300 DPI)
- Position: Right side, centered vertically

**Minimum Scannable Size:** 0.75" × 0.75" (don't go smaller!)

---

## 🔧 Advanced: Dynamic QR Codes (Optional)

### Why Dynamic QR Codes?

**Standard (Static) QR:**
- ✅ Simple, free forever
- ✅ No external dependencies
- ❌ Can't change URL after printing
- ❌ Limited tracking data

**Dynamic QR:**
- ✅ Change destination URL anytime
- ✅ Detailed scan analytics (time, location, device)
- ✅ A/B test destinations
- ❌ Requires subscription ($5-20/month)
- ❌ Dependent on service staying active

### Recommended Dynamic QR Services (If You Want)

**Bitly** ($35/month)
- Short link + QR generation
- Excellent analytics
- Trusted brand

**QR Code Generator PRO** ($9/month)
- Specifically for QR codes
- Great tracking features
- Affordable

**Rebrandly** ($29/month)
- Custom domain short links
- White-label option
- Professional analytics

### My Recommendation:
**Start with static QR codes** (free) for first campaign. If successful and you want better analytics, upgrade to dynamic for campaign v2.

---

## ✅ QR CODE GENERATION CHECKLIST

### Before You Start
- [ ] Decided on budget level (Minimal/Standard/Premium)
- [ ] Know which variants you're printing
- [ ] Have list of URLs ready
- [ ] Have 30-45 minutes uninterrupted time

### During Generation (Per QR Code)
- [ ] Correct URL pasted
- [ ] UTM parameters double-checked
- [ ] Quality set to 1000×1000px
- [ ] Error correction set to High (30%)
- [ ] Colors applied (if using branded)
- [ ] Logo added (if using premium)
- [ ] Downloaded PNG file
- [ ] Renamed with clear convention
- [ ] Saved to organized folder

### After Generation
- [ ] All QR codes generated (9-15 codes)
- [ ] All files renamed properly
- [ ] Organized into folder structure
- [ ] Testing completed (3+ devices)
- [ ] All scans successful
- [ ] Tracking list document created
- [ ] URLs verified in Google Analytics
- [ ] Ready to insert into design files

---

## 🚀 NEXT STEPS

Once all QR codes are generated and tested:

1. **Insert into Design Files**
   - Open poster design templates (Canva/Illustrator)
   - Replace placeholder QR with real code
   - Verify positioning and size
   - Export print-ready PDFs

2. **Set Up Analytics**
   - Verify Google Analytics tracking
   - Create custom dashboard for UTM campaigns
   - Set up conversion goals
   - Test tracking with sample scans

3. **Order Test Prints**
   - Print 1-2 posters of each size
   - Print 10 business cards
   - Test QR codes on physical prints
   - Verify quality, colors, scannability

4. **Proceed to Full Production**
   - Once test prints approved
   - Place full print order
   - Move to distribution phase

---

## 💡 PRO TIPS

### For Best Scanning Results

**DO:**
✅ Use high contrast (black on white is best)
✅ Ensure adequate quiet zone (white space around QR)
✅ Make QR large enough (minimum 1.5" for posters, 1" for cards)
✅ Test on physical prints, not just screen
✅ Use glossy or matte finish (not textured paper)

**DON'T:**
❌ Use low contrast (light colors on light background)
❌ Stretch or distort QR code (always square!)
❌ Make QR too small (won't scan from distance)
❌ Put text or images over QR code
❌ Use damaged or pixelated QR images

### Troubleshooting Common Issues

**Issue: QR won't scan**
- Solution: Increase size, simplify design, boost contrast

**Issue: Wrong URL opens**
- Solution: Check for typos in URL, regenerate

**Issue: Low resolution / pixelated**
- Solution: Regenerate at 1500×1500px, use SVG format

**Issue: Logo covering too much**
- Solution: Reduce logo size to 10-15%, center better

**Issue: Colors not printing correctly**
- Solution: Use CMYK color mode, test print first

---

## 📞 NEED HELP?

### QR Code Won't Generate?
- Try different browser (Chrome works best)
- Clear cache and cookies
- Disable ad blockers
- Try alternative tool: QR Code Generator (qr-code-generator.com)

### Can't Test QR Codes?
- Use online QR scanner (web.qr-scanner.com)
- Try Google Lens app (Android)
- iPhone: native camera app should work
- Check camera focus (might be blurry)

### Files Not Organizing?
- Use provided folder structure above
- Consistent naming is key
- Keep tracking list updated
- Back up all files to cloud (Google Drive/Dropbox)

---

## 🎉 YOU'RE READY!

Once you've:
- ✅ Generated all QR codes
- ✅ Tested every code
- ✅ Organized files properly
- ✅ Created tracking list

**NEXT:** Insert QR codes into design templates and proceed to test printing!

**Questions?** Refer back to:
- [PRINT_POSTER_DESIGNS.md](./PRINT_POSTER_DESIGNS.md) for design specs
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for next steps

---

**Time Investment:** 30-45 minutes
**Difficulty:** Easy (just follow steps!)
**Result:** Professional QR codes ready for print campaign

**Let's make some QR codes! 🚀**
