# 🎨 YK Buddy - Print Ads & Facebook Branding Guide

**Created:** Complete print-ready assets with your aurora design style
**Status:** Ready to use!

---

## 📁 What You Have

### ✅ Print Ads (8.5" × 11")
1. **[visitor-print-ad.html](./print-ads/visitor-print-ad.html)** - "JUST LANDED?" variant

### ✅ Facebook Branding
1. **[facebook-cover.html](./facebook-cover.html)** - Cover photo (820×312px)
2. **[facebook-profile.html](./facebook-profile.html)** - Profile picture (180×180px)

---

## 🎨 Design Features

### Matching Your Uploaded Images
All designs include:
- ✅ **Aurora background** - Flowing northern lights gradients
- ✅ **Houseboat scenery** - Water, houseboats with lit windows
- ✅ **Deep blue palette** - Authentic Yellowknife night sky
- ✅ **Ice chunks** - Floating on water
- ✅ **Twinkling stars** - Animated starfield
- ✅ **Chimney smoke** - Small atmospheric details
- ✅ **Your tagline** - "Because Nobody Should Face -40° Alone"

### Color Palette (Exact Match)
```
Northern Midnight:  #0d1b2a (Deep blue-black)
Deep Water:         #1e3a5f (Medium blue)
Aurora Teal:        #2c5f7f (Lighter blue)
Aurora Green:       #10b981 (Northern lights)
Aurora Blue:        #3b82f6 (Northern lights)
Aurora Purple:      #8b5cf6 (Northern lights)
Window Light:       #ffa726 (Warm orange glow)
```

---

## 🖨️ HOW TO PRINT THE ADS

### Method 1: Print from Browser (Easy)

**Step 1:** Open the HTML file
- Double-click `visitor-print-ad.html`

**Step 2:** Print setup
- Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
- **Paper size:** Letter (8.5" × 11")
- **Margins:** None
- **Background graphics:** ENABLED ✓ (Very important!)
- **Color:** Color (not black & white)

**Step 3:** Print or Save as PDF
- Click "Print" to print directly
- Or "Save as PDF" to create a PDF file

### Method 2: Screenshot to Image (Best Quality)

**Step 1:** Open HTML file in browser

**Step 2:** Full-screen the browser (F11)

**Step 3:** Take screenshot
- Use Snipping Tool (Windows) or Screenshot (Mac)
- Capture exactly 8.5" × 11" area
- Save as PNG (high quality)

**Step 4:** Print from image
- Open PNG in any image viewer
- Print at actual size (100%)
- Ensure "Fit to page" is OFF

### Method 3: Professional Printing

**For best results:**
1. Save each HTML as PDF (Method 1)
2. Bring PDF to local print shop
3. Request:
   - **Paper:** 100lb Gloss Cover Stock
   - **Size:** 8.5" × 11"
   - **Finish:** Gloss or Matte
   - **Colors:** Full color (CMYK)

**Cost estimate:** $2-5 per poster at local shop

---

## 📱 HOW TO USE FACEBOOK ASSETS

### Facebook Cover Photo

**Step 1:** Open `facebook-cover.html`
- Double-click the file
- Displays at exact 820×312px

**Step 2:** Capture the image
- **Option A:** Right-click → "Save Image As..."
- **Option B:** Screenshot at 820×312px
- **Option C:** Use browser screenshot extension

**Step 3:** Upload to Facebook
1. Go to your Facebook page
2. Click "Add Cover Photo"
3. Upload your image
4. Position and save

**Perfect fit:** No cropping needed!

---

### Facebook Profile Picture

**Step 1:** Open `facebook-profile.html`
- Double-click the file
- Shows 180×180px version + previews

**Step 2:** Capture the image
- Right-click main image → "Save Image As..."
- Save as PNG
- Size: 180×180px

**Step 3:** Upload to Facebook
1. Click on profile picture
2. "Upload Photo"
3. Select your saved image
4. Position (already centered!)
5. Save

**Note:** Facebook will create smaller versions automatically

---

## 🎯 QR CODE INTEGRATION

### Replace Placeholder QR Code

The print ad has a **placeholder QR code design**. To add your real QR code:

**Method 1: Quick Edit (HTML)**
1. Open `visitor-print-ad.html` in text editor
2. Find the `<svg class="qr-code">` section
3. Replace entire `<svg>` with your QR code image:
   ```html
   <img class="qr-code" src="visitor-large-p1.png" alt="QR Code">
   ```
4. Save and re-print

**Method 2: Design Software**
1. Save HTML as PDF
2. Open in Photoshop/Illustrator
3. Place your QR code PNG over placeholder
4. Export as PDF

**Method 3: Physical Print**
1. Print poster with placeholder
2. Print real QR code separately (2" × 2")
3. Cut out and glue over placeholder
4. Re-scan to create master copy

---

## 🎨 CUSTOMIZATION OPTIONS

### Change Headlines

Edit the HTML file, find this section:
```html
<h2 class="headline">
    <span class="headline-line1">JUST LANDED?</span>
    <span class="headline-line2">YOUR YK GUIDE IS READY.</span>
</h2>
```

**Resident variant:**
```html
<span class="headline-line1">YOUR NEIGHBOR JUST</span>
<span class="headline-line2">LISTED A GARAGE SALE</span>
```

**Newcomer variant:**
```html
<span class="headline-line1">MOVING TO -40°?</span>
<span class="headline-line2">WE'VE GOT YOU COVERED.</span>
```

### Change Features List

Find the `<ul class="features">` section:
```html
<li class="feature">
    <span class="feature-icon">✓</span>
    <span>Your custom feature text</span>
</li>
```

Add or remove `<li>` items as needed.

### Change Colors

Edit the color variables at the top of the `<style>` section.

---

## 📏 SPECIFICATIONS

### Print Ad Specs
```
Dimensions:    8.5" × 11" (Letter size)
Resolution:    Screen optimized (prints well)
Color Mode:    RGB (browser), prints as CMYK
Bleed:         None needed for letter size
Safe Area:     0.5" margin on all sides
Format:        HTML (save as PDF for print)
```

### Facebook Cover Specs
```
Dimensions:    820px × 312px
File Type:     PNG or JPG
Max File Size: 100KB recommended
Display:       Desktop and mobile optimized
Safe Zone:     Central area (avoid text at edges)
```

### Facebook Profile Specs
```
Dimensions:    180px × 180px minimum
File Type:     PNG or JPG
Display Sizes: 180px, 96px, 40px (auto-scaled)
Shape:         Circular crop (keep logo centered)
Background:    Aurora gradient visible in circle
```

---

## 💡 PRO TIPS

### For Print Ads

**Best Practices:**
1. ✅ Always enable background graphics when printing
2. ✅ Print test copy on regular paper first
3. ✅ Use gloss paper for vibrant aurora colors
4. ✅ Print in color (not black & white!)
5. ✅ Check QR code scans after printing

**Distribution:**
- Laminate for outdoor use
- Use poster putty (won't damage walls)
- Ask permission before posting
- Place at eye level (5-6 feet)

### For Facebook

**Best Practices:**
1. ✅ Upload highest quality possible
2. ✅ Check preview before publishing
3. ✅ Test on mobile (how most see it)
4. ✅ Coordinate profile pic with cover
5. ✅ Update seasonally for freshness

**Branding Consistency:**
- Use same aurora color scheme everywhere
- Keep "YK BUDDY" logo treatment consistent
- Always include tagline in bio/about section

---

## 🔧 TROUBLESHOOTING

### Print Ad Issues

**Problem:** Background doesn't print
- **Solution:** Enable "Background graphics" in print settings

**Problem:** Colors look washed out
- **Solution:** Use gloss paper, increase printer color density

**Problem:** QR code doesn't scan
- **Solution:** Print larger, ensure high contrast, use real QR code

**Problem:** Page doesn't fit
- **Solution:** Set margins to "None", paper to "Letter"

### Facebook Issues

**Problem:** Cover photo looks blurry
- **Solution:** Ensure image is exactly 820×312px, use PNG format

**Problem:** Profile pic cut off
- **Solution:** Keep logo centered, remember circular crop

**Problem:** Colors look different on Facebook
- **Solution:** Facebook compresses images, slightly boost saturation before upload

---

## 📊 COMPLETE ASSET CHECKLIST

### Print Materials
- [x] Visitor print ad (HTML ready)
- [ ] Resident print ad (create variation)
- [ ] Newcomer print ad (create variation)
- [ ] Real QR codes generated
- [ ] Test prints reviewed
- [ ] Full print run ordered

### Facebook Branding
- [x] Cover photo (820×312px)
- [x] Profile picture (180×180px)
- [ ] Uploaded to Facebook page
- [ ] Mobile preview checked
- [ ] Bio/tagline updated

### Optional Extras
- [ ] Instagram profile pic (same as Facebook)
- [ ] Twitter header (1500×500px - similar design)
- [ ] LinkedIn banner (1584×396px - similar design)
- [ ] Business cards (use same design style)

---

## 🎯 QUICK START WORKFLOW

### To Create Full Print Campaign (30 minutes)

**10 minutes:** Generate real QR codes
1. Use qr-code-generator.html (already created)
2. Generate visitor, resident, newcomer codes
3. Save as PNG files

**10 minutes:** Customize print ads
1. Open visitor-print-ad.html
2. Replace placeholder QR code
3. Save 3 variants (visitor, resident, newcomer)

**10 minutes:** Print and distribute
1. Print test copy
2. Verify QR code scans
3. Print full run (50-100 copies)
4. Distribute to locations

### To Set Up Facebook Page (10 minutes)

**5 minutes:** Prepare assets
1. Open facebook-cover.html
2. Screenshot/save at 820×312px
3. Open facebook-profile.html
4. Screenshot/save at 180×180px

**5 minutes:** Upload to Facebook
1. Add cover photo
2. Add profile picture
3. Update page bio with tagline
4. Check mobile preview

**Done!** Your branding is complete! 🎉

---

## 🌟 WHAT MAKES THESE SPECIAL

### Authentic Yellowknife Design
- Real houseboat imagery (iconic to YK)
- Accurate aurora colors and movement
- Northern night sky aesthetic
- Winterized water/ice details
- Warm window lights (contrast to cold)

### Professional Quality
- Print-ready specifications
- Perfect Facebook dimensions
- Consistent branding across platforms
- Animated elements (HTML versions)
- High attention to detail

### Easy to Use
- No design software needed
- Print directly from browser
- Simple customization
- Clear instructions
- Multiple methods provided

---

## 📞 NEED VARIATIONS?

### To Create Resident Variant
1. Copy `visitor-print-ad.html`
2. Rename to `resident-print-ad.html`
3. Change headline to "YOUR NEIGHBOR JUST / LISTED A GARAGE SALE"
4. Update features list (see customization section)
5. Replace QR code with resident variant

### To Create Newcomer Variant
1. Copy `visitor-print-ad.html`
2. Rename to `newcomer-print-ad.html`
3. Change headline to "MOVING TO -40°? / WE'VE GOT YOU COVERED."
4. Update features list
5. Replace QR code with newcomer variant

**All three variants use same beautiful aurora background!**

---

## ✅ YOU'RE READY!

**You now have:**
- ✅ Print-ready poster design (matches your images perfectly!)
- ✅ Facebook cover photo (complete branding)
- ✅ Facebook profile picture (professional look)
- ✅ Complete instructions (print, upload, customize)
- ✅ Aurora aesthetic throughout (consistent brand)

**Next steps:**
1. Open the HTML files and see your designs
2. Print a test poster
3. Upload to Facebook
4. Start promoting YK Buddy!

---

**Status:** Complete and ready to use! 🚀
**Design Style:** Matches your uploaded aurora/houseboat images ✓
**Print Quality:** Professional, ready for local print shop ✓
**Facebook:** Optimized for platform requirements ✓

**Let's make YK Buddy famous in Yellowknife! 🌌**
