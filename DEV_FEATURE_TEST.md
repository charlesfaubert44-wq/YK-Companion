# Dev Branch Test Feature

This file exists only on the dev branch to demonstrate branch separation.

## Purpose
- Test that dev branch works independently from master
- Verify deployment pipeline for dev environment
- Validate feature isolation before merging to production

## Changes in this Dev Branch
1. **Reverted to pre-mobile-improvements state** - Branch reset to commit 375a7d2
2. **DEV Badge in Header** - Yellow "DEV" badge appears next to logo on all pages
3. **Environment-aware indicator** - Only shows in development/staging environments

## Branch Reset Details
- Reset to commit: `375a7d2` (Remove Frozen Shield branding from footer)
- This is BEFORE the mobile-first UX improvements (commit 3cd9c8b)
- Mobile improvements (PWA, swipeable cards, gestures, FAB) are NOT in this branch

## Test Features Active on Dev
1. **Development Mode Indicator** - Shows "DEV" badge in header
2. **Enhanced Logging** - More verbose console output available
3. **Pre-mobile UI** - Testing without mobile-first improvements

## Status
- Created: 2025-10-24
- Environment: Development
- Branch: dev
- Reset Point: Before mobile improvements

---
*This file should NOT exist on master branch*
