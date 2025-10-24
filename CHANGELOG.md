# Changelog

All notable changes to the YKBuddy project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- User authentication system
- Saved favorites and itineraries
- Mobile app deployment
- Booking integration
- Multi-language support

---

## [1.0.0] - 2025-10-23

### 🎉 Major Release - Aurora Live Events & Garage Sale Planner

This release includes 12 major features across two main systems.

### Added - Aurora Live Events System

#### Core Features
- **Aurora Live Events** (`/aurora-live`)
  - Automatic event creation when KP index ≥ 4.0
  - Real-time KP tracking and display
  - Event statistics (photo count, participants, duration, visibility)
  - 10-second auto-refresh polling

- **Live Photo Uploads** (`PhotoUploadModal.tsx`)
  - Photo upload with metadata (camera settings, location, caption)
  - Quality scoring (0-10 scale)
  - Thumbnail generation support
  - Photo approval/moderation system

- **Photo Mosaics** (`MosaicGenerator.tsx`)
  - Time-window based photo selection (5min to 2hr)
  - Grid sizes: 2x2, 3x3, 4x4, 5x5
  - Auto-select highest quality photos
  - Manual photo selection
  - Real-time mosaic preview

#### Enhancement Features (9 Total)

- **Push Notifications** (`PushNotificationManager.tsx`)
  - Browser push notification support
  - Customizable KP threshold alerts (3.0-9.0)
  - Event type filters (new events, featured photos, challenges, mosaics)
  - Test notification functionality

- **Photography Challenges** (`ChallengeLeaderboard.tsx`)
  - Monthly themed photography competitions
  - Challenge statuses: upcoming, active, judging, completed
  - Winner selection with badges
  - Challenge rules and requirements
  - Entry tracking and participant counts

- **Leaderboard System**
  - Multiple ranking metrics (likes, quality score, photo count, featured count)
  - Timeframe filters (today, this week, this month, all time)
  - Top 50 photographer ranking
  - User highlight in leaderboard

- **Badge & Achievement System** (`BadgeDisplay.tsx`)
  - 8 badge types (First Light, Aurora Chaser, Master, Champion, etc.)
  - Automatic badge awarding via database triggers
  - Progress tracking to next badge
  - User statistics dashboard
  - Badge sharing functionality

- **Aurora Forecasts** (`ForecastDisplay.tsx`)
  - 3-day KP predictions (72 hours)
  - Hourly breakdown with visual timeline
  - Best viewing time recommendations
  - Confidence levels (low/medium/high)
  - Model accuracy tracking across data sources (NOAA, Space Weather, Aurora Watch)
  - 24-hour forecast chart

- **Email Digest System** (`EmailDigestSettings.tsx`)
  - Customizable frequency (daily/weekly/monthly/never)
  - Day/date selection for delivery
  - Content preferences (top photos, mosaics, forecast, challenges, stats)
  - Next scheduled digest preview

- **AR Camera Overlay** (`ARCameraOverlay.tsx`)
  - Real-time camera settings based on current KP index
  - Skill levels: beginner, intermediate, advanced
  - Brightness categories: dim, moderate, bright
  - ISO, shutter speed, aperture, white balance recommendations
  - Skill-appropriate photography tips
  - Phone model overrides (iPhone 14/15 Pro, Samsung S23)

- **AI Photo Scoring** (`AIPhotoScoring.tsx`)
  - Multi-dimensional quality analysis
  - Composition scoring (rule of thirds, balance, positioning)
  - Color scoring (saturation, temperature, contrast)
  - Technical scoring (sharpness, noise, exposure)
  - Detailed feedback for each dimension
  - Improvement suggestions
  - Camera settings display

- **Print-Quality Downloads** (`PrintDownload.tsx`)
  - Multiple resolutions: 4K (3840×2160), 8K (7680×4320), 12K (11520×6480)
  - DPI options: 150 (web), 300 (standard print), 600 (professional)
  - File formats: JPG, PNG, TIFF
  - Color profiles: sRGB, AdobeRGB, ProPhoto
  - Print size calculator (inches and cm)
  - File size estimation

- **WebSocket Real-time Provider** (`WebSocketProvider.tsx`)
  - Real-time connection management
  - Message types: photo uploads, likes, KP updates, events, mosaics
  - Auto-reconnection with exponential backoff
  - Connection status indicator
  - Event subscription system
  - Simulated messages for development

#### Database Schema

**Aurora Events Schema** (`supabase-aurora-events-schema.sql`)
- 4 core tables: `aurora_events`, `aurora_photos`, `aurora_mosaics`, `kp_index_data`
- Automatic event creation function
- Photo quality scoring triggers
- Row Level Security (RLS) policies

**Aurora Enhancements Schema** (`supabase-aurora-enhancements-schema.sql`)
- 10 new tables for enhancement features
- Push notification system
- Challenge and badge system with auto-awarding
- Forecast accuracy tracking
- Email digest preferences
- AR camera recommendations
- Complete RLS policies

#### Type Definitions

- **aurora.types.ts** (200 lines)
  - Core aurora event types
  - Photo and mosaic interfaces
  - KP index data types
  - Utility functions

- **aurora-enhancements.types.ts** (365 lines)
  - Push notification types
  - Challenge and leaderboard types
  - Badge system types
  - Forecast types
  - Email digest types
  - AR camera types
  - AI scoring types
  - WebSocket message types
  - Print download types

### Added - Garage Sale Planner

- **Garage Sale Planner** (`/living/garage-sales`)
  - Interactive Mapbox GL map with custom markers
  - Calendar view for sale dates
  - List view with filtering
  - Smart itinerary generator

- **Route Optimization** (`ItineraryGenerator.tsx`)
  - Nearest Neighbor TSP algorithm implementation
  - Automatic route optimization
  - Distance calculations using Haversine formula
  - Time estimates (3 min/km drive + 30 min per sale)
  - ETA calculations
  - Turn-by-turn waypoint generation

- **Filtering System** (`GarageSaleFilters.tsx`)
  - Date range filtering
  - Status filtering (upcoming, active, past)
  - Keyword search
  - Location filtering
  - Sorting options

- **Database Schema** (`supabase-garage-sales-schema.sql`)
  - 3 tables: `garage_sales`, `saved_garage_sales`, `garage_sale_itineraries`
  - Auto-complete past sales trigger
  - Nearby sales search function
  - RLS policies

### Added - Pixel UI Component Library

- **Pixel UI Demo** (`/pixel-demo`)
  - PixelButton component (4 color variants)
  - PixelCard component with glow effects
  - Press Start 2P pixel font integration
  - Pixel-perfect shadows and animations
  - Usage examples and code snippets

- **Tailwind Configuration**
  - Custom pixel font family
  - Pixel-themed shadows
  - Float animation

### Added - Documentation

- **README.md** - Comprehensive project documentation (365 lines)
- **AURORA-FEATURES.md** - Detailed aurora system documentation (500+ lines)
- **CHANGELOG.md** - This file
- **PARALLEL-WORKFLOW.md** - Git workflow documentation

### Changed

- **Port Configuration**
  - Web app now runs on port 3002 (was 3000)

- **Project Structure**
  - Created `docs/` directory for documentation
  - Organized components into feature folders

### Fixed

- **TypeScript Errors**
  - Fixed lat/lng vs latitude/longitude type mismatches
  - Fixed AuthContext implicit any types
  - Fixed ESLint exhaustive-deps rule error

- **Git File Paths**
  - Cleaned up commit history file paths (removed Desktop/YK-Companion prefix)

### Technical Details

- **Total Files Created**: 40+
- **Total Lines of Code**: 15,000+
- **React Components**: 40+
- **Database Tables**: 20+
- **Database Functions**: 15+
- **TypeScript Interfaces**: 30+

---

## [0.1.0] - 2025-10-22

### Added - Initial Setup

- **Project Foundation**
  - Next.js 14 with App Router
  - TypeScript 5 configuration
  - Tailwind CSS 3 with custom aurora color palette
  - Monorepo structure with npm workspaces

- **Brand Identity**
  - Aurora Orb logo with interactive effects
  - Color palette (aurora green, blue, purple)
  - Brand guidelines documentation

- **Three Pathway System**
  - `/visiting` - Tourist resources
  - `/living` - Resident guides
  - `/moving` - Relocation information

- **Components**
  - NorthernLogo - Interactive aurora orb
  - YKBuddySeasonalBanner - Seasonal messaging
  - Base layout and navigation

- **Deployment**
  - Vercel deployment setup
  - Automatic deployments on push

---

## Version History

- **v1.0.0** (2025-10-23) - Major release with Aurora Live Events and Garage Sale Planner
- **v0.1.0** (2025-10-22) - Initial project setup

---

## Links

- [GitHub Repository](https://github.com/charlesfaubert44-wq/YK-Companion)
- [Live Site](https://web-f149uve7f-charles-projects-5049ee53.vercel.app)
- [Documentation](./docs/)

---

**Maintained by**: Charles Faubert
**Last Updated**: October 23, 2025
