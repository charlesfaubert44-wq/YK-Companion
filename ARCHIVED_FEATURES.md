# Archived Features - YK Buddy

This document lists features that were documented but **never implemented** or have been **removed** from the project.

---

## ❌ Never Implemented (From Old Documentation)

These features were in planning documents but never built:

### Trip Planner System
- **Activities Directory** - Database of Yellowknife attractions
- **Accommodations Listings** - Hotel/lodging database
- **Itinerary Builder** - User-created trip plans
- **Booking System** - Integrated booking functionality
- **Reviews & Ratings** - User review system
- **Weather Cache** - Cached weather API data

**Why removed:** Project pivoted from trip planner to community platform

### Aurora Live Events (Extensive Version)
- **Real-time Photo Uploads** - Community aurora photography
- **Photo Mosaics** - Time-synchronized photo collages
- **Photography Challenges** - Monthly competitions with leaderboards
- **Achievement Badges** - User gamification (First Light, Aurora Master, etc.)
- **3-Day Aurora Forecasts** - KP predictions with hourly breakdown
- **Push Notifications** - Browser alerts for aurora events
- **Email Digests** - Customizable summaries (daily/weekly/monthly)
- **AR Camera Overlay** - Real-time camera settings based on KP
- **AI Photo Scoring** - Multi-dimensional quality analysis
- **Print Downloads** - High-resolution mosaic exports (4K/8K/12K)
- **WebSocket Real-time** - Live updates for events and photos

**Why removed:** Overly complex feature set, maintenance burden, shifted focus to simpler community tools

---

## 🗑️ Removed Features

### Daily Dad Joke Component
**Removed:** January 2025
**Replaced with:** Premium Spotlight system

**What it was:**
- Displayed a daily rotating joke about Yellowknife
- 30 pre-written jokes about northern life
- Appeared below navigation on homepage

**Why removed:**
- Replaced with monetizable Premium Spotlight
- Limited value to users
- Space better used for revenue generation

**Code location:** Previously at `apps/web/src/components/DailyDadJoke.tsx` (deleted)

---

## 📊 Feature Comparison

### Old Vision vs. Current Reality

| Feature Category | Old Plan | Current Reality |
|-----------------|----------|-----------------|
| **Core Focus** | Trip planning + Aurora tracking | Community platform + Premium ads |
| **Database Tables** | 20+ | 4 |
| **Main Features** | Activities, bookings, complex aurora system | Garage sales, premium spotlight, multilingual |
| **Monetization** | Booking commissions | Premium sponsor placements |
| **Complexity** | High (WebSocket, AI, AR) | Medium (Maps, scheduling, i18n) |
| **Target Users** | Tourists | Tourists + Residents + Newcomers |

---

## 🎯 Why The Pivot?

### Problems with Old Approach:
1. **Too Complex** - Aurora Live Events had 10+ interconnected features
2. **High Maintenance** - Real-time systems, AI scoring, image processing
3. **Unclear Business Model** - No clear revenue path
4. **Scope Creep** - Feature bloat made development unsustainable
5. **Resource Intensive** - Needed significant infrastructure

### New Approach Benefits:
1. **Simpler** - 4 tables, clear features
2. **Revenue Model** - Premium Spotlight generates income
3. **Community Focused** - Garage sales serve real local need
4. **Maintainable** - Small codebase, easier to update
5. **International** - 9 languages attract global tourists

---

## 📁 Archived Code

### Where to Find Old Code

**Old Database Schemas:**
- `docs/database-schema.md.old` - Original trip planner schema

**Old Component (Deleted):**
- `apps/web/src/components/DailyDadJoke.tsx` - ❌ Deleted

**Still Exists But Unused:**
- `apps/web/src/app/aurora-live/` - May be simplified/outdated
- `apps/web/src/app/pixel-demo/` - Demo page, not core feature

---

## 💡 Lessons Learned

### What We Learned:
1. **Start Simple** - MVP approach works better than complex v1
2. **Revenue First** - Build monetization early (Premium Spotlight)
3. **Local Needs** - Garage sales were more valuable than complex aurora features
4. **Maintainability** - Simpler codebases are easier to sustain
5. **Focus** - Better to do 3 things well than 10 things poorly

### What We Kept:
- ✅ Aurora information (simplified)
- ✅ Garage sale mapping
- ✅ Community focus
- ✅ Northern branding
- ✅ Mobile-first design

### What We Improved:
- ✅ Added multilingual support (9 languages)
- ✅ Created monetization system (Premium Spotlight)
- ✅ Better user segmentation (Visiting/Living/Moving)
- ✅ Simpler, faster database
- ✅ Easier deployment

---

## 🔮 Future Considerations

### Features That Might Return:
- **Simplified Aurora Alerts** - Email/SMS when KP is high
- **Basic Photo Sharing** - Simple gallery, no mosaics/AI
- **Community Events** - Calendar of local happenings
- **Business Directory** - Local services for newcomers

### Features Permanently Archived:
- ❌ Complex photo mosaics
- ❌ AI photo scoring
- ❌ AR camera overlays
- ❌ WebSocket real-time everything
- ❌ Photography competitions
- ❌ Achievement badges

---

## 📝 Documentation Cleanup

### Files Updated/Created:
- ✅ `CURRENT_FEATURES.md` - What actually exists now
- ✅ `ARCHIVED_FEATURES.md` - This file
- ✅ `docs/database-schema.md` - Updated to reflect current tables
- ✅ `docs/database-schema.md.old` - Backup of old documentation

### Files That Need Review:
- ⚠️ `README.md` - Still references some old features
- ⚠️ `PRD.md` - Product requirements may be outdated
- ⚠️ `UI-PROTOTYPE-SUMMARY.md` - May reference old designs
- ⚠️ `RESEARCH_SUMMARY.md` - User research from old version

---

**Last Updated:** January 2025
**Status:** Documentation cleanup complete
**Next Step:** Focus on current features, build value before adding complexity
