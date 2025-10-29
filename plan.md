# YK Buddy - Comprehensive Implementation Blueprint

**Version:** 1.0  
**Date:** October 29, 2025  
**Status:** Ready for Implementation

---

## Executive Summary

This document provides a complete, test-driven implementation blueprint for building the YK Buddy platform from scratch. The plan is broken down into small, incremental steps that build on each other, with comprehensive prompts for LLM-assisted code generation.

### Project Overview
- **Platform:** Community platform for Yellowknife (visitors, residents, movers)
- **Tech Stack:** Next.js 14, TypeScript, Supabase, Tailwind CSS, Mapbox
- **Architecture:** Serverless monolith with modular features
- **Target:** Production-ready application in 14 weeks

### Implementation Approach
- **Test-Driven Development:** Write tests first, then implementation
- **Incremental Progress:** Small, safe steps that build on each other
- **No Orphaned Code:** Every step integrates into the working application
- **Best Practices:** Production-ready code from the start

---

## Blueprint Structure

### Phase 0: Foundation (Week 1-2, 30 hours)
Setting up the development environment, tooling, and project structure.

### Phase 1: Core Infrastructure (Week 3-4, 40 hours)
Authentication, database, basic routing, and core components.

### Phase 2: Essential Features (Week 5-7, 50 hours)
Multilingual support, content pages, and user pathways.

### Phase 3: Monetization Features (Week 8-9, 40 hours)
Premium Spotlight system and admin dashboard.

### Phase 4: Community Features (Week 10-11, 40 hours)
Garage Sale Planner, Knowledge Base, and interactive features.

### Phase 5: Production Hardening (Week 12-13, 35 hours)
Testing, security, performance, and monitoring.

### Phase 6: Launch Preparation (Week 14, 15 hours)
SEO, analytics, final polish, and deployment.

**Total Estimated Time:** 250 hours over 14 weeks

---

## Phase Breakdown with Detailed Prompts

## PHASE 0: FOUNDATION

### Goals
- Initialize monorepo structure
- Set up Next.js with TypeScript
- Configure tooling (ESLint, Prettier, testing)
- Create base configuration files
- Set up version control and CI/CD foundation

---

### Step 0.1: Initialize Monorepo Structure

**Prompt 0.1:**

```
You are building a production-ready monorepo for a Next.js application called YK Buddy. This is a community platform for Yellowknife with web and potentially mobile apps.

REQUIREMENTS:
1. Create a monorepo structure using npm workspaces
2. Set up directories for:
   - apps/web (Next.js 14 app)
   - packages/shared (shared utilities)
   - packages/types (TypeScript types)
   - packages/ui (shared components)
3. Create root package.json with workspace configuration
4. Set up .gitignore for Node.js/Next.js projects
5. Create basic README.md with project description

TESTING:
- Verify workspace configuration by running `npm install`
- Ensure all workspace packages are recognized

DELIVERABLES:
- Complete folder structure
- Root package.json with workspaces
- .gitignore file
- README.md with setup instructions

OUTPUT FORMAT:
Provide the complete file structure and all file contents. Use test-first approach where applicable.
```

---

### Step 0.2: Initialize Next.js Application

**Prompt 0.2:**

```
Building on the monorepo structure from Step 0.1, initialize the Next.js 14 application in apps/web.

REQUIREMENTS:
1. Create Next.js 14 app with App Router (not Pages Router)
2. Configure TypeScript with strict mode
3. Set up Tailwind CSS with custom configuration
4. Create base layout and page structure
5. Configure environment variables (.env.example)
6. Set up proper port configuration (port 3002)

PROJECT CONTEXT:
- App name: YK Buddy
- Purpose: Community platform for Yellowknife
- Color scheme: Aurora colors (green, blue, purple)
- Target users: Visitors, Residents, Movers

TESTING:
- Create a smoke test that verifies the app starts
- Test that TypeScript compilation works
- Verify Tailwind CSS is properly configured

DELIVERABLES:
- apps/web/package.json with all dependencies
- apps/web/tsconfig.json
- apps/web/tailwind.config.ts with custom colors
- apps/web/src/app/layout.tsx
- apps/web/src/app/page.tsx
- apps/web/.env.example
- apps/web/next.config.js

INTEGRATION:
- Ensure this integrates with the workspace from Step 0.1
- Verify that `npm run dev:web` starts the development server
```

---

### Step 0.3: Configure Code Quality Tools

**Prompt 0.3:**

```
Building on Steps 0.1-0.2, set up code quality and formatting tools.

REQUIREMENTS:
1. Configure ESLint with:
   - Next.js recommended rules
   - TypeScript rules
   - Accessibility rules (jsx-a11y)
   - React hooks rules
2. Configure Prettier with opinionated settings
3. Set up Husky for pre-commit hooks
4. Configure lint-staged to run on staged files
5. Add scripts to package.json for linting and formatting

TESTING:
- Create intentionally bad code and verify ESLint catches it
- Test that Prettier formats code correctly
- Verify pre-commit hooks work (create a test commit)

DELIVERABLES:
- .eslintrc.json with comprehensive rules
- .prettierrc with formatting configuration
- .prettierignore
- .husky/ directory with pre-commit hook
- lint-staged configuration in package.json
- Updated package.json with lint/format scripts

INTEGRATION:
- Ensure ESLint works with existing Next.js code from Step 0.2
- Verify all existing files pass linting
- Test that `npm run lint` and `npm run format` work correctly
```

---

### Step 0.4: Set Up Testing Infrastructure

**Prompt 0.4:**

```
Building on Steps 0.1-0.3, configure a comprehensive testing infrastructure.

REQUIREMENTS:
1. Set up Vitest for unit testing (faster than Jest for Vite-based projects)
2. Configure React Testing Library
3. Set up test utilities and custom render functions
4. Configure code coverage reporting (70% target)
5. Create example tests for components and utilities
6. Add test scripts to package.json

PROJECT CONTEXT:
- Using Next.js 14 App Router
- TypeScript strict mode
- Need to test React Server Components and Client Components

TESTING APPROACH:
1. Create a test utilities file (test-utils.tsx) with custom render
2. Write example tests for:
   - A simple utility function (test/lib/utils.test.ts)
   - A client component (test/components/Button.test.tsx)
3. Configure coverage thresholds

DELIVERABLES:
- vitest.config.ts
- apps/web/src/test-utils.tsx
- apps/web/__tests__/lib/utils.test.ts (example)
- apps/web/__tests__/components/Button.test.tsx (example)
- Updated package.json with test scripts
- Coverage configuration

INTEGRATION:
- Verify tests run with `npm test`
- Check coverage report with `npm run test:coverage`
- Ensure tests pass in CI environment
```

---

### Step 0.5: Configure CI/CD Pipeline

**Prompt 0.5:**

```
Building on Steps 0.1-0.4, create GitHub Actions workflows for continuous integration and deployment.

REQUIREMENTS:
1. Create CI workflow that:
   - Runs on every push and PR
   - Installs dependencies
   - Runs linting
   - Runs type checking
   - Runs tests with coverage
   - Builds the application
2. Create dependency update workflow (Dependabot or similar)
3. Create PR preview deployment workflow (Vercel integration)

TESTING:
- Include workflow testing in the CI pipeline
- Verify builds succeed
- Test that failed tests block PR merging

DELIVERABLES:
- .github/workflows/ci.yml
- .github/workflows/dependency-updates.yml
- .github/dependabot.yml
- Documentation on CI/CD setup

INTEGRATION:
- Ensure workflows use the scripts from previous steps
- Verify all checks pass for current codebase
- Document expected CI/CD behavior in README
```

---

## PHASE 1: CORE INFRASTRUCTURE

### Goals
- Implement authentication system
- Set up Supabase database
- Create base components and layouts
- Implement routing structure
- Build reusable UI components

---

### Step 1.1: Supabase Project Setup and Database Schema

**Prompt 1.1:**

```
Building on Phase 0, integrate Supabase as the backend for authentication and database.

REQUIREMENTS:
1. Create Supabase project configuration
2. Design and implement core database schema:
   - profiles table (user information)
   - Enable Row Level Security (RLS) policies
3. Create database migration files
4. Set up Supabase client for Next.js
5. Configure environment variables

DATABASE SCHEMA:
Table: profiles
- id (uuid, primary key, references auth.users)
- email (text)
- user_type (enum: 'visiting', 'living', 'moving')
- is_admin (boolean, default false)
- created_at (timestamp)
- updated_at (timestamp)

RLS POLICIES:
- Users can read their own profile
- Users can update their own profile
- Service role can do anything

TESTING:
1. Write tests for database migrations
2. Test RLS policies (users can't access others' data)
3. Verify Supabase client connection

DELIVERABLES:
- supabase/config.toml
- supabase/migrations/20250101000001_create_profiles.sql
- apps/web/src/lib/supabase/client.ts
- apps/web/src/lib/supabase/server.ts
- apps/web/.env.example (updated with Supabase vars)
- __tests__/lib/supabase.test.ts

INTEGRATION:
- Ensure Supabase client works in both client and server components
- Verify migrations can be applied with `supabase db push`
- Test connection with a simple query
```

---

### Step 1.2: Authentication Context and Components

**Prompt 1.2:**

```
Building on Step 1.1, implement a complete authentication system.

REQUIREMENTS:
1. Create AuthContext with:
   - Current user state
   - Sign in, sign out, sign up methods
   - Loading states
   - Error handling
2. Create authentication UI components:
   - AuthModal (modal dialog for auth)
   - Sign in form
   - Sign up form
   - Password reset form
3. Implement auth callback route for email confirmation
4. Add proper TypeScript types

TESTING (Test-Driven Approach):
1. Write tests FIRST for:
   - AuthContext provider
   - Sign in flow
   - Sign up flow
   - Error states
2. Then implement to make tests pass
3. Test auth persistence across page refreshes

DELIVERABLES:
- apps/web/src/contexts/AuthContext.tsx
- apps/web/src/components/auth/AuthModal.tsx
- apps/web/src/components/auth/SignInForm.tsx
- apps/web/src/components/auth/SignUpForm.tsx
- apps/web/src/app/auth/callback/route.ts
- apps/web/src/types/auth.types.ts
- __tests__/contexts/AuthContext.test.tsx
- __tests__/components/auth/AuthModal.test.tsx

INTEGRATION:
- Wrap app layout with AuthContext provider
- Ensure auth state persists on page refresh
- Test sign in/out flow end-to-end
- Verify email confirmation works
```

---

### Step 1.3: Base Layout and Navigation

**Prompt 1.3:**

```
Building on Steps 1.1-1.2, create the base layout and navigation components.

REQUIREMENTS:
1. Create responsive Header component with:
   - Logo (YK Buddy branding)
   - Navigation links (Home, About, Contact)
   - Auth state (sign in/out buttons)
   - Mobile hamburger menu
2. Create Footer component
3. Update root layout with header and footer
4. Implement mobile-responsive design (Tailwind breakpoints)

BRANDING:
- Name: YK Buddy
- Tagline: "Because Nobody Should Face -40° Alone"
- Colors: Aurora green (#10B981), blue (#3B82F6), purple (#8B5CF6)
- Font: Modern, friendly sans-serif

TESTING:
1. Test header renders correctly
2. Test navigation links work
3. Test mobile menu toggles properly
4. Test auth buttons show correct state
5. Accessibility tests (ARIA labels, keyboard navigation)

DELIVERABLES:
- apps/web/src/components/Header.tsx
- apps/web/src/components/Footer.tsx
- apps/web/src/components/MobileMenu.tsx
- apps/web/src/app/layout.tsx (updated)
- apps/web/src/styles/globals.css (updated with custom styles)
- __tests__/components/Header.test.tsx
- __tests__/components/Footer.test.tsx

INTEGRATION:
- Ensure Header uses AuthContext for user state
- Verify navigation works with Next.js routing
- Test layout on mobile, tablet, and desktop viewports
```

---

### Step 1.4: Core Page Structure and Routing

**Prompt 1.4:**

```
Building on Steps 1.1-1.3, set up the core page structure and routing.

REQUIREMENTS:
1. Create basic page structure for:
   - Home page (/)
   - About page (/about)
   - Contact page (/contact)
   - Visiting page (/visiting)
   - Living page (/living)
   - Moving page (/moving)
2. Each page should have:
   - Proper metadata (SEO)
   - Basic content structure
   - Responsive layout
3. Implement loading and error states

TESTING:
1. Test each route renders correctly
2. Test metadata is properly set
3. Test loading states work
4. Test error boundaries catch errors
5. Navigation between pages works

DELIVERABLES:
- apps/web/src/app/page.tsx (home page)
- apps/web/src/app/about/page.tsx
- apps/web/src/app/contact/page.tsx
- apps/web/src/app/visiting/page.tsx
- apps/web/src/app/living/page.tsx
- apps/web/src/app/moving/page.tsx
- apps/web/src/app/loading.tsx
- apps/web/src/app/error.tsx
- __tests__/app/pages.test.tsx

INTEGRATION:
- Ensure all pages use the layout from Step 1.3
- Verify navigation in Header links to these pages
- Test that metadata appears in page <head>
```

---

### Step 1.5: Reusable UI Component Library

**Prompt 1.5:**

```
Building on Steps 1.1-1.4, create a library of reusable UI components.

REQUIREMENTS:
Create the following components with full TypeScript types and tests:

1. Button component with variants:
   - primary, secondary, outline, ghost
   - sizes: sm, md, lg
   - loading state
   - disabled state

2. Card component for content containers

3. Modal/Dialog component with:
   - Backdrop
   - Close button
   - Keyboard accessibility (ESC to close)
   - Focus trap

4. Input components:
   - TextInput
   - TextArea
   - Select dropdown

5. LoadingSkeleton for loading states

DESIGN SYSTEM:
- Use Tailwind CSS for styling
- Aurora color palette
- Consistent spacing (Tailwind scale)
- Smooth animations/transitions
- Mobile-first responsive

TESTING (TDD Approach):
1. Write comprehensive tests for each component FIRST
2. Test all variants and states
3. Test accessibility (ARIA, keyboard navigation)
4. Test responsive behavior

DELIVERABLES:
- apps/web/src/components/ui/Button.tsx
- apps/web/src/components/ui/Card.tsx
- apps/web/src/components/ui/Modal.tsx
- apps/web/src/components/ui/Input.tsx
- apps/web/src/components/ui/TextArea.tsx
- apps/web/src/components/ui/Select.tsx
- apps/web/src/components/ui/LoadingSkeleton.tsx
- __tests__/components/ui/ (test for each component)
- Storybook or component documentation

INTEGRATION:
- Use these components in existing pages from Step 1.4
- Replace any inline buttons/inputs with these components
- Verify consistent styling across the app
```

---

## PHASE 2: ESSENTIAL FEATURES

### Goals
- Implement multilingual support (9 languages)
- Create pathway cards for user segments
- Build About and Contact pages with content
- Add custom northern-themed icons
- Implement seasonal banner system

---

### Step 2.1: Multilingual System Implementation

**Prompt 2.1:**

```
Building on Phase 1, implement a comprehensive multilingual system supporting 9 languages.

REQUIREMENTS:
1. Create LanguageContext for language state management:
   - Current language
   - Language switcher
   - localStorage persistence
   - Default to English

2. Supported languages:
   - English (en), French (fr), Chinese (zh), Japanese (ja)
   - Korean (ko), Spanish (es), German (de), Vietnamese (vi), Tagalog (tl)

3. Translation system:
   - Create translation JSON files for each language
   - Translation helper hook (useTranslation)
   - Type-safe translation keys

4. Language selector component:
   - Dropdown in header
   - Flag icons for each language
   - Persist selection

TESTING:
1. Test language switching
2. Test localStorage persistence
3. Test missing translation fallback
4. Test all 9 languages load correctly

DELIVERABLES:
- apps/web/src/contexts/LanguageContext.tsx
- apps/web/src/components/LanguageSelector.tsx
- apps/web/src/locales/en.json
- apps/web/src/locales/fr.json
- apps/web/src/locales/[zh, ja, ko, es, de, vi, tl].json (all languages)
- apps/web/src/hooks/useTranslation.ts
- apps/web/src/types/i18n.types.ts
- __tests__/contexts/LanguageContext.test.tsx
- __tests__/hooks/useTranslation.test.ts

TRANSLATION STRUCTURE:
{
  "common": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "home": {
    "title": "Welcome to YK Buddy",
    "tagline": "Because Nobody Should Face -40° Alone"
  },
  "visiting": { ... },
  "living": { ... },
  "moving": { ... }
}

INTEGRATION:
- Add LanguageContext provider to root layout
- Add LanguageSelector to Header component
- Update all existing pages to use translations
- Test language switching updates all content
```

---

### Step 2.2: Custom Northern-Themed Icon Components

**Prompt 2.2:**

```
Building on Phase 1-2.1, create custom SVG icon components with animations.

REQUIREMENTS:
Create three custom animated SVG icons:

1. Bush Plane icon (for Visiting):
   - Simple bush plane silhouette
   - Spinning propeller animation on hover
   - Bounce animation

2. Northern Cabin icon (for Living):
   - Cozy cabin with chimney
   - Smoking chimney animation (puffs of smoke)
   - Warm glow in windows

3. Old Truck icon (for Moving):
   - Vintage pickup truck loaded with boxes
   - Slight wobble animation
   - Spinning wheels on hover

TECHNICAL REQUIREMENTS:
- Pure SVG components (no external dependencies)
- TypeScript with proper props
- Tailwind CSS for colors
- CSS animations for movement
- Accessible (proper ARIA labels)
- Responsive sizing

TESTING:
1. Test icons render correctly
2. Test animations trigger on hover
3. Test accessibility labels
4. Visual regression testing (snapshot tests)

DELIVERABLES:
- apps/web/src/components/icons/BushPlaneIcon.tsx
- apps/web/src/components/icons/NorthernCabinIcon.tsx
- apps/web/src/components/icons/OldTruckIcon.tsx
- apps/web/src/components/NorthernIcons.tsx (export all)
- __tests__/components/icons/NorthernIcons.test.tsx
- Documentation on icon usage

INTEGRATION:
- Use icons on Home page pathway cards
- Use icons on /visiting, /living, /moving pages
- Ensure icons work with dark/light themes
```

---

### Step 2.3: Enhanced Pathway Cards for Home Page

**Prompt 2.3:**

```
Building on Steps 2.1-2.2, create interactive pathway cards for the three user segments.

REQUIREMENTS:
1. Create PathwayCard component with:
   - Custom icon (from Step 2.2)
   - Title and description (multilingual from Step 2.1)
   - Hover effects (lift, shadow)
   - Click to navigate to segment page
   - Smooth animations

2. Create three cards:
   - Visiting Yellowknife (Bush Plane icon)
   - Living in Yellowknife (Northern Cabin icon)
   - Moving to Yellowknife (Old Truck icon)

3. Responsive layout:
   - Mobile: Stack vertically
   - Tablet: 2 columns
   - Desktop: 3 columns

DESIGN:
- Aurora-themed gradient backgrounds
- Card elevation on hover
- Icon animation on hover
- Smooth transitions
- Accessible focus states

TESTING:
1. Test card rendering
2. Test click navigation
3. Test hover animations
4. Test responsive layouts (mobile, tablet, desktop)
5. Test keyboard navigation
6. Test with screen readers

DELIVERABLES:
- apps/web/src/components/PathwayCard.tsx
- apps/web/src/components/PathwayCards.tsx (container)
- apps/web/src/app/page.tsx (updated with cards)
- __tests__/components/PathwayCard.test.tsx
- Updated translation files with pathway card content

INTEGRATION:
- Add PathwayCards to home page
- Ensure navigation works (clicking navigates to correct page)
- Test with all 9 languages
- Verify icons and animations work correctly
```

---

### Step 2.4: About and Contact Pages with Content

**Prompt 2.4:**

```
Building on Steps 2.1-2.3, build comprehensive About and Contact pages.

REQUIREMENTS:

ABOUT PAGE (/about):
1. Hero section with tagline
2. Mission statement
3. Story of Yellowknife (brief, engaging)
4. Platform features overview
5. Community focus messaging
6. Fun, conversational tone
7. Images/illustrations (placeholder or northern-themed)

CONTACT PAGE (/contact):
1. Contact form with validation:
   - Name (required)
   - Email (required, validated)
   - Message (required)
   - Subject dropdown
2. Alternative contact methods
3. Response time expectations
4. Privacy notice
5. Success/error states

FORM FUNCTIONALITY:
- Client-side validation (Zod schema)
- Server-side API route to handle submission
- Integration with email service (placeholder for now)
- Rate limiting protection
- Accessibility compliance

TESTING:
1. Test form validation (empty fields, invalid email)
2. Test form submission (success/error states)
3. Test rate limiting
4. Test accessibility
5. Test multilingual content

DELIVERABLES:
- apps/web/src/app/about/page.tsx (enhanced with content)
- apps/web/src/app/contact/page.tsx (enhanced with form)
- apps/web/src/components/ContactForm.tsx
- apps/web/src/app/api/contact/submit/route.ts
- apps/web/src/lib/validation/contact.schema.ts
- __tests__/components/ContactForm.test.tsx
- __tests__/app/api/contact.test.ts
- Updated translation files for About and Contact pages

INTEGRATION:
- Ensure forms work with React Hook Form
- Add loading states during submission
- Display success/error messages
- Test with all languages
```

---

### Step 2.5: Seasonal Banner System

**Prompt 2.5:**

```
Building on previous steps, create a dynamic seasonal banner system.

REQUIREMENTS:
1. Create banner component that displays:
   - Seasonal greeting
   - Current temperature (placeholder for now)
   - Seasonal advice/tip
   - Appropriate seasonal colors/themes

2. Seasons:
   - Winter (Nov-Mar): Northern Lights theme
   - Spring (Apr-May): Breakup/Thaw theme
   - Summer (Jun-Aug): Midnight Sun theme
   - Fall (Sep-Oct): Fall colors theme

3. Auto-detect current season based on date

4. Banner themes:
   - Different background gradients
   - Seasonal icons
   - Relevant messaging
   - Temperature display

TESTING:
1. Test season detection logic
2. Test banner renders for each season
3. Test temperature display
4. Test multilingual messages
5. Test responsive design

DELIVERABLES:
- apps/web/src/components/banners/SeasonalBanner.tsx
- apps/web/src/components/banners/BannerThemes.tsx
- apps/web/src/lib/utils/seasons.ts
- apps/web/src/hooks/useSeason.ts
- __tests__/components/banners/SeasonalBanner.test.tsx
- __tests__/lib/utils/seasons.test.ts
- Updated translation files with seasonal messages

INTEGRATION:
- Add SeasonalBanner to home page
- Ensure it updates based on current date
- Test all four seasons (mock dates in tests)
- Verify multilingual support
```

---

## PHASE 3: MONETIZATION FEATURES

### Goals
- Implement Premium Spotlight system
- Create admin dashboard
- Build sponsor management
- Add pricing calculator
- Set up payment tracking (Stripe placeholder)

---

### Step 3.1: Database Schema for Premium Sponsors

**Prompt 3.1:**

```
Building on Phase 1-2, extend the database schema for the Premium Spotlight monetization system.

REQUIREMENTS:
1. Create database tables:

   premium_sponsors:
   - id (uuid, primary key)
   - name (text) - sponsor company name
   - tagline (text) - display text
   - link (text) - sponsor website URL
   - position (enum: home_top, home_middle, home_bottom, visiting, living, moving)
   - start_date (date)
   - end_date (date)
   - plan_type (enum: basic, premium, enterprise)
   - total_price (numeric)
   - payment_status (enum: pending, paid, cancelled)
   - is_active (boolean)
   - created_at, updated_at

   premium_pricing_plans:
   - id (uuid, primary key)
   - plan_name (text)
   - plan_type (enum)
   - position (text)
   - base_price_per_day (numeric)
   - position_multiplier (numeric)
   - volume_discount_7days (numeric) - percentage
   - volume_discount_30days (numeric)
   - volume_discount_90days (numeric)
   - min_duration_days (integer)
   - max_duration_days (integer)
   - is_active (boolean)

2. Row Level Security policies:
   - Public can read active sponsors
   - Only admins can create/update/delete
   - Only admins can read pricing plans

3. Helper functions:
   - get_active_sponsors(position)
   - calculate_sponsor_price(plan_id, duration)

TESTING:
1. Test RLS policies (non-admin cannot write)
2. Test helper functions
3. Test sponsor activation/deactivation
4. Test date range queries

DELIVERABLES:
- supabase/migrations/20250102000001_premium_sponsors.sql
- supabase/migrations/20250102000002_premium_pricing_plans.sql
- apps/web/src/types/sponsors.types.ts
- __tests__/database/sponsors.test.ts

INTEGRATION:
- Apply migrations to local Supabase
- Test queries from app
- Verify RLS works correctly
```

---

### Step 3.2: Premium Spotlight Component

**Prompt 3.2:**

```
Building on Step 3.1, create the Premium Spotlight display component with Northern Lights animation.

REQUIREMENTS:
1. Create PremiumSpotlight component:
   - Animated Northern Lights background:
     * Flowing gradient waves
     * Aurora colors (green, blue, purple)
     * Subtle animation loop
   - Golden sponsor text with shimmer effect
   - Clickable link to sponsor website
   - Auto-rotate if multiple sponsors
   - Position-based display

2. Features:
   - Fetch active sponsors for current position
   - Display only if sponsor is active and within date range
   - Smooth transitions between sponsors
   - Responsive design
   - Loading state while fetching

NORTHERN LIGHTS ANIMATION:
- CSS gradients with multiple colors
- Keyframe animations for movement
- Blur and blend modes for effect
- Performance-optimized (GPU-accelerated)

TESTING:
1. Test fetching sponsors from database
2. Test date range filtering (only show active)
3. Test rotation with multiple sponsors
4. Test animations don't cause performance issues
5. Test click tracking (analytics placeholder)

DELIVERABLES:
- apps/web/src/components/PremiumSpotlight.tsx
- apps/web/src/components/aurora/NorthernLightsBackground.tsx
- apps/web/src/hooks/useActiveSponsors.ts
- apps/web/src/lib/supabase/sponsors.ts
- __tests__/components/PremiumSpotlight.test.tsx
- __tests__/hooks/useActiveSponsors.test.ts

INTEGRATION:
- Add PremiumSpotlight to home page (home_top position)
- Add to /visiting, /living, /moving pages (respective positions)
- Test with real sponsor data
- Verify animation performance on mobile
```

---

### Step 3.3: Admin Dashboard Structure and Authentication

**Prompt 3.3:**

```
Building on previous steps, create the admin dashboard with role-based access control.

REQUIREMENTS:
1. Admin authentication:
   - Check user.is_admin in database
   - Create AdminAuthProvider (wraps AuthContext)
   - Redirect non-admins to home
   - Protect admin routes with middleware

2. Admin dashboard layout:
   - Sidebar navigation:
     * Dashboard home
     * Sponsors management
     * Pricing plans
     * Analytics (placeholder)
     * Settings
   - Header with user info
   - Responsive (mobile sidebar collapses)

3. Admin role management:
   - Database function to grant admin role
   - Only existing admins can grant admin to others

TESTING:
1. Test admin authentication (admin vs non-admin)
2. Test route protection (redirect non-admins)
3. Test admin role granting
4. Test sidebar navigation
5. Test mobile responsive behavior

DELIVERABLES:
- apps/web/src/app/admin/layout.tsx
- apps/web/src/app/admin/page.tsx
- apps/web/src/components/admin/AdminSidebar.tsx
- apps/web/src/components/admin/AdminHeader.tsx
- apps/web/src/hooks/useAdminAuth.ts
- apps/web/src/middleware.ts (updated for admin protection)
- supabase/migrations/20250103000001_admin_functions.sql
- __tests__/hooks/useAdminAuth.test.ts
- __tests__/app/admin/protection.test.ts

INTEGRATION:
- Protect all /admin routes
- Test with admin and non-admin users
- Ensure navigation works
- Add link to admin in Header (only for admins)
```

---

### Step 3.4: Sponsor Management Admin Interface

**Prompt 3.4:**

```
Building on Step 3.3, create the sponsor management interface in the admin dashboard.

REQUIREMENTS:
1. Sponsors list page (/admin/sponsors):
   - Table showing all sponsors
   - Filters: status, position, date range
   - Search by name
   - Sortable columns
   - Pagination

2. Create/Edit sponsor form:
   - All sponsor fields with validation
   - Real-time pricing calculator:
     * Select plan type and position
     * Enter duration (days)
     * Show calculated price with discounts
   - Date picker for start/end dates
   - Payment status tracking
   - Form validation (Zod schema)

3. CRUD operations:
   - Create new sponsor
   - Edit existing sponsor
   - Delete sponsor (soft delete - mark inactive)
   - Quick activate/deactivate toggle

PRICING CALCULATOR LOGIC:
- Base price per day × duration
- Apply position multiplier
- Apply volume discount (7, 30, 90+ days)
- Show breakdown of calculation

TESTING:
1. Test CRUD operations
2. Test pricing calculator accuracy
3. Test form validation
4. Test date range validation (end > start)
5. Test search and filters
6. Test pagination

DELIVERABLES:
- apps/web/src/app/admin/sponsors/page.tsx
- apps/web/src/components/admin/sponsors/SponsorList.tsx
- apps/web/src/components/admin/sponsors/SponsorForm.tsx
- apps/web/src/components/admin/sponsors/PricingCalculator.tsx
- apps/web/src/app/api/admin/sponsors/route.ts (CRUD API)
- apps/web/src/lib/validation/sponsor.schema.ts
- apps/web/src/lib/utils/pricing.ts
- __tests__/components/admin/sponsors/SponsorForm.test.tsx
- __tests__/lib/utils/pricing.test.ts

INTEGRATION:
- Ensure only admins can access
- Test full create-to-display flow
- Verify sponsors appear on frontend after creation
- Test pricing calculator matches database logic
```

---

### Step 3.5: Pricing Plans Management

**Prompt 3.5:**

```
Building on Step 3.4, create the pricing plans management interface.

REQUIREMENTS:
1. Pricing plans list page (/admin/pricing-plans):
   - Display all pricing plans
   - Show active/inactive status
   - Edit existing plans
   - Create new plans
   - Clone plans (copy to create similar plan)

2. Pricing plan form:
   - Plan name and type
   - Base price per day
   - Position selection
   - Position multiplier
   - Volume discounts (7, 30, 90+ days percentages)
   - Min/max duration
   - Active/inactive toggle
   - Validation

3. Pricing preview:
   - Show example calculations
   - Visual pricing table
   - Comparison with other plans

TESTING:
1. Test creating new pricing plans
2. Test editing plans
3. Test plan activation/deactivation
4. Test validation (discounts 0-100%, multipliers > 0)
5. Test preview calculations
6. Test that changes reflect in sponsor pricing calculator

DELIVERABLES:
- apps/web/src/app/admin/pricing-plans/page.tsx
- apps/web/src/components/admin/pricing/PricingPlanList.tsx
- apps/web/src/components/admin/pricing/PricingPlanForm.tsx
- apps/web/src/components/admin/pricing/PricingPreview.tsx
- apps/web/src/app/api/admin/pricing-plans/route.ts
- apps/web/src/lib/validation/pricing.schema.ts
- __tests__/components/admin/pricing/PricingPlanForm.test.tsx

INTEGRATION:
- Link to pricing plans from sponsor form
- Ensure changes to plans update sponsor calculations
- Test with various plan configurations
```

---

## PHASE 4: COMMUNITY FEATURES

### Goals
- Implement Garage Sale Planner with maps
- Create Knowledge Base system
- Add user favorites and saved items
- Build interactive features

---

### Step 4.1: Garage Sales Database and API

**Prompt 4.1:**

```
Building on previous phases, create the database schema and API for the Garage Sale Planner feature.

REQUIREMENTS:
1. Database schema:

   garage_sales:
   - id (uuid, primary key)
   - title (text)
   - description (text)
   - address (text)
   - latitude (numeric)
   - longitude (numeric)
   - start_date (timestamp)
   - end_date (timestamp)
   - contact_info (text)
   - created_by (uuid, references profiles)
   - is_approved (boolean) - requires admin approval
   - created_at, updated_at

   user_favorites:
   - user_id (uuid)
   - garage_sale_id (uuid)
   - created_at

2. RLS policies:
   - Anyone can read approved sales
   - Authenticated users can create sales (pending approval)
   - Users can edit their own sales
   - Admins can approve/reject sales

3. API endpoints:
   - GET /api/garage-sales (list, with filters)
   - POST /api/garage-sales (create)
   - PATCH /api/garage-sales/[id] (update)
   - DELETE /api/garage-sales/[id] (soft delete)
   - GET /api/garage-sales/nearby (geo-based query)

TESTING:
1. Test CRUD operations
2. Test RLS policies
3. Test approval workflow
4. Test nearby search with coordinates
5. Test favorites functionality

DELIVERABLES:
- supabase/migrations/20250104000001_garage_sales.sql
- apps/web/src/app/api/garage-sales/route.ts
- apps/web/src/app/api/garage-sales/[id]/route.ts
- apps/web/src/types/garage-sales.types.ts
- apps/web/src/lib/supabase/garage-sales.ts
- __tests__/app/api/garage-sales.test.ts

INTEGRATION:
- Test API endpoints with Postman or similar
- Verify RLS prevents unauthorized access
- Test with authenticated and non-authenticated users
```

---

### Step 4.2: Mapbox Integration and Map Component

**Prompt 4.2:**

```
Building on Step 4.1, integrate Mapbox for interactive maps.

REQUIREMENTS:
1. Set up Mapbox:
   - Mapbox account and access token
   - Environment variable configuration
   - Install mapbox-gl and react-map-gl

2. Create reusable Map component:
   - Display Mapbox map centered on Yellowknife
   - Markers for garage sale locations
   - Popup on marker click (sale details)
   - User location marker (if permitted)
   - Zoom and pan controls
   - Responsive sizing

3. Features:
   - Click marker to see sale details
   - Directions link to Google Maps
   - Cluster markers when zoomed out
   - Custom marker icons

TESTING:
1. Test map renders correctly
2. Test markers appear for garage sales
3. Test popup shows correct information
4. Test user location (with/without permission)
5. Test on mobile devices

DELIVERABLES:
- apps/web/src/components/maps/MapView.tsx
- apps/web/src/components/maps/GarageSaleMarker.tsx
- apps/web/src/components/maps/SalePopup.tsx
- apps/web/src/hooks/useMapbox.ts
- apps/web/src/lib/mapbox/config.ts
- apps/web/.env.example (updated with Mapbox token)
- __tests__/components/maps/MapView.test.tsx

INTEGRATION:
- Ensure Mapbox token is loaded from environment
- Test with real garage sale data
- Verify markers match database locations
```

---

### Step 4.3: Garage Sales Page with Calendar and Map Views

**Prompt 4.3:**

```
Building on Steps 4.1-4.2, create the complete Garage Sales page at /living/garage-sales.

REQUIREMENTS:
1. Page features:
   - Toggle between Map view and Calendar view
   - Filters: date range, distance from location
   - Search by address or title
   - "Add New Sale" button (auth required)
   - List view showing all sales

2. Map view:
   - Interactive map with all sale markers
   - Click marker to highlight in list
   - Show user's location
   - Calculate distances from user

3. Calendar view:
   - Monthly calendar layout
   - Sales displayed on their dates
   - Click date to see sales that day
   - Color-coded by status

4. List view:
   - Card layout for each sale
   - Thumbnail image (optional)
   - Distance from user
   - Favorite button
   - Details button

TESTING:
1. Test view switching (map/calendar/list)
2. Test filters work correctly
3. Test search functionality
4. Test distance calculations
5. Test responsive design
6. Test favorites work

DELIVERABLES:
- apps/web/src/app/living/garage-sales/page.tsx
- apps/web/src/components/garage-sales/MapView.tsx
- apps/web/src/components/garage-sales/CalendarView.tsx
- apps/web/src/components/garage-sales/ListView.tsx
- apps/web/src/components/garage-sales/SaleCard.tsx
- apps/web/src/components/garage-sales/SaleFilters.tsx
- apps/web/src/components/garage-sales/AddSaleModal.tsx
- apps/web/src/hooks/useGarageSales.ts
- __tests__/app/living/garage-sales.test.tsx

INTEGRATION:
- Ensure all views show the same data
- Test view switching maintains filters
- Verify favorites persist across page reloads
- Test with various data scenarios (no sales, many sales)
```

---

### Step 4.4: Knowledge Base System

**Prompt 4.4:**

```
Building on previous phases, create a community Knowledge Base for tips and guides.

REQUIREMENTS:
1. Database schema:

   knowledge_articles:
   - id (uuid)
   - title (text)
   - content (text)
   - category (enum: visiting, living, moving, general)
   - language (text)
   - author_id (uuid)
   - status (enum: draft, pending_review, published)
   - views (integer)
   - helpful_count (integer)
   - created_at, updated_at

   knowledge_categories:
   - id (uuid)
   - name (text)
   - slug (text)
   - description (text)

2. Features:
   - Anyone can read published articles
   - Authenticated users can submit articles (pending review)
   - Admins can review and publish
   - Search and filter by category
   - Multilingual support
   - "Was this helpful?" voting

3. Knowledge Base page (/knowledge):
   - Browse by category
   - Search articles
   - Popular articles
   - Recent articles
   - Submit article button

TESTING:
1. Test article submission
2. Test admin review workflow
3. Test search functionality
4. Test category filtering
5. Test helpful voting
6. Test multilingual articles

DELIVERABLES:
- supabase/migrations/20250105000001_knowledge_base.sql
- apps/web/src/app/knowledge/page.tsx
- apps/web/src/components/knowledge/ArticleList.tsx
- apps/web/src/components/knowledge/ArticleCard.tsx
- apps/web/src/components/knowledge/SubmitArticleForm.tsx
- apps/web/src/app/api/knowledge/route.ts
- apps/web/src/app/admin/knowledge/page.tsx (review interface)
- __tests__/app/knowledge/page.test.tsx

INTEGRATION:
- Link to knowledge base from main navigation
- Add knowledge tab in admin dashboard
- Test full submission-to-publication workflow
- Verify multilingual articles display correctly
```

---

### Step 4.5: User Profile and Saved Items

**Prompt 4.5:**

```
Building on previous steps, create user profile page and saved items functionality.

REQUIREMENTS:
1. Profile page (/profile):
   - User information display
   - Edit profile (email, user_type)
   - Avatar upload (Supabase Storage)
   - Account settings
   - Delete account option

2. Saved/Favorites system:
   - Saved garage sales
   - Saved knowledge articles
   - Favorite pathways/pages
   - "My Submissions" (garage sales, articles)

3. Saved page (/saved):
   - Tabs for different saved item types
   - Remove from saved
   - Quick access to saved items
   - Empty states

TESTING:
1. Test profile editing
2. Test avatar upload
3. Test saved items persistence
4. Test removing saved items
5. Test "my submissions" shows correct items
6. Test account deletion flow

DELIVERABLES:
- apps/web/src/app/profile/page.tsx
- apps/web/src/app/saved/page.tsx
- apps/web/src/components/profile/ProfileForm.tsx
- apps/web/src/components/profile/AvatarUpload.tsx
- apps/web/src/components/saved/SavedGarageSales.tsx
- apps/web/src/components/saved/SavedArticles.tsx
- apps/web/src/app/api/profile/route.ts
- apps/web/src/app/api/favorites/route.ts
- __tests__/app/profile/page.test.tsx

INTEGRATION:
- Add profile link to Header (when authenticated)
- Test saved functionality across garage sales and knowledge base
- Verify avatar upload to Supabase Storage
- Test account deletion removes all user data
```

---

## PHASE 5: PRODUCTION HARDENING

### Goals
- Comprehensive testing (unit, integration, E2E)
- Security hardening (CSP, rate limiting, input validation)
- Performance optimization (caching, lazy loading)
- Error monitoring and logging
- Health checks and metrics

---

### Step 5.1: Comprehensive Test Coverage

**Prompt 5.1:**

```
Building on all previous phases, achieve comprehensive test coverage (70%+ target).

REQUIREMENTS:
1. Expand unit tests:
   - All utility functions (100% coverage)
   - All hooks (useTranslation, useAdminAuth, etc.)
   - All validation schemas
   - Pricing calculations
   - Distance calculations

2. Component tests:
   - All UI components (Button, Card, Modal, etc.)
   - All page components
   - Form validation flows
   - Loading and error states

3. Integration tests:
   - Auth flow (sign up, sign in, sign out)
   - Garage sale creation flow
   - Sponsor management flow
   - Knowledge base submission flow

4. API tests:
   - All API endpoints
   - Error handling
   - Rate limiting
   - Authentication checks

TESTING TOOLS:
- Vitest for unit/integration tests
- React Testing Library for component tests
- MSW (Mock Service Worker) for API mocking
- Coverage reporting with Istanbul

DELIVERABLES:
- Expand __tests__/ directory with comprehensive tests
- vitest.config.ts with coverage thresholds
- Coverage report configuration
- CI integration for test running
- Test documentation and conventions

TEST COVERAGE TARGETS:
- Statements: 70%+
- Branches: 65%+
- Functions: 70%+
- Lines: 70%+

INTEGRATION:
- All tests must pass before merging
- Coverage report generated on every CI run
- Block PRs if coverage drops below threshold
```

---

### Step 5.2: Security Hardening

**Prompt 5.2:**

```
Building on Phase 5.1, implement comprehensive security measures.

REQUIREMENTS:
1. Content Security Policy (CSP):
   - Strict CSP headers in next.config.js
   - Allow only trusted sources
   - Block inline scripts (use nonces where needed)
   - Report violations

2. Security Headers:
   - HSTS (HTTP Strict Transport Security)
   - X-Frame-Options (prevent clickjacking)
   - X-Content-Type-Options
   - Referrer-Policy
   - Permissions-Policy

3. Input Validation:
   - Comprehensive Zod schemas for all user inputs
   - Sanitize HTML in user-generated content
   - Prevent XSS and SQL injection
   - File upload validation (type, size)

4. Rate Limiting:
   - API route rate limiting
   - Login attempt limiting
   - Contact form rate limiting
   - Per-user and per-IP limits

5. Authentication Security:
   - Secure session handling
   - CSRF protection
   - Password complexity requirements
   - Account lockout after failed attempts

TESTING:
1. Test CSP doesn't block legitimate content
2. Test XSS prevention
3. Test rate limiting kicks in
4. Test SQL injection attempts fail
5. Security audit with tools (OWASP ZAP, npm audit)

DELIVERABLES:
- apps/web/next.config.js (updated with security headers)
- apps/web/src/middleware.ts (rate limiting, CSRF)
- apps/web/src/lib/security/sanitize.ts
- apps/web/src/lib/security/rate-limiter.ts
- apps/web/src/lib/security/csp.ts
- All validation schemas updated
- Security documentation
- __tests__/security/ (security tests)

INTEGRATION:
- Verify all forms still work with validation
- Test API rate limits don't break legitimate use
- Run security audit and fix vulnerabilities
- Document security measures in README
```

---

### Step 5.3: Performance Optimization

**Prompt 5.3:**

```
Building on Phase 5.2, optimize application performance.

REQUIREMENTS:
1. Image Optimization:
   - Next.js Image component for all images
   - Lazy loading
   - Responsive images
   - Modern formats (WebP, AVIF)
   - Proper sizing and compression

2. Code Splitting:
   - Dynamic imports for heavy components
   - Route-based code splitting (already in Next.js)
   - Lazy load admin dashboard
   - Lazy load Mapbox

3. Caching Strategy:
   - Client-side caching with TanStack Query
   - Server-side caching for API routes
   - Static generation where possible
   - ISR (Incremental Static Regeneration) for content pages

4. Bundle Optimization:
   - Analyze bundle size
   - Tree-shaking unused code
   - Minimize third-party dependencies
   - Use dynamic imports for large libraries

5. Performance Monitoring:
   - Web Vitals tracking
   - Custom performance metrics
   - Lighthouse CI integration
   - Performance budgets

PERFORMANCE TARGETS:
- Lighthouse Performance Score: 90+
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Total Blocking Time (TBT): < 200ms
- Cumulative Layout Shift (CLS): < 0.1

TESTING:
1. Run Lighthouse audits
2. Test on slow 3G networks
3. Test on low-end devices
4. Monitor bundle size
5. Test lazy loading works correctly

DELIVERABLES:
- apps/web/src/lib/performance/metrics.ts
- apps/web/src/lib/performance/cache.ts
- Updated components with lazy loading
- next.config.js with optimization settings
- Bundle analyzer configuration
- Performance documentation
- Lighthouse CI configuration

INTEGRATION:
- Verify lazy loading doesn't break functionality
- Test caching doesn't serve stale data
- Ensure images load properly on all devices
- Run performance tests in CI
```

---

### Step 5.4: Error Monitoring and Structured Logging

**Prompt 5.4:**

```
Building on Phase 5.3, implement comprehensive error monitoring and logging.

REQUIREMENTS:
1. Centralized Logger:
   - Winston or Pino for structured logging
   - Log levels (debug, info, warn, error)
   - Context-aware logging (user ID, request ID)
   - No console.log in production

2. Error Boundaries:
   - React Error Boundaries for components
   - Fallback UI for errors
   - Error logging to monitoring service
   - Recovery mechanisms

3. Error Pages:
   - Custom 404 page
   - Custom 500 page
   - Custom error page with helpful messaging
   - Error reporting to users

4. Monitoring Integration:
   - Sentry integration (or similar)
   - Error tracking and grouping
   - Source map upload for debugging
   - User context and breadcrumbs
   - Performance monitoring

5. Logging Strategy:
   - API request/response logging
   - Database query logging
   - Authentication events
   - Admin actions audit log
   - No sensitive data in logs (PII, passwords)

TESTING:
1. Test error boundaries catch errors
2. Test errors are logged correctly
3. Test error pages display properly
4. Test Sentry integration works
5. Verify no sensitive data in logs

DELIVERABLES:
- apps/web/src/lib/logger.ts
- apps/web/src/components/ErrorBoundary.tsx
- apps/web/src/app/error.tsx (enhanced)
- apps/web/src/app/not-found.tsx
- apps/web/src/app/global-error.tsx
- Sentry configuration files
- sentry.client.config.ts
- sentry.server.config.ts
- Error logging throughout app
- __tests__/lib/logger.test.ts

INTEGRATION:
- Replace all console.log with logger
- Wrap app in error boundary
- Test error scenarios trigger monitoring
- Verify Sentry dashboard shows errors
```

---

### Step 5.5: Health Checks and Monitoring

**Prompt 5.5:**

```
Building on Phase 5.4, implement health checks and application monitoring.

REQUIREMENTS:
1. Health Check Endpoint (/api/health):
   - Database connectivity check
   - External API checks (Mapbox, Supabase)
   - System status
   - Response time metrics
   - Returns 200 if healthy, 503 if unhealthy

2. Metrics Endpoint (/api/metrics):
   - Application metrics (requests, errors, latency)
   - User metrics (active users, new signups)
   - Feature usage metrics
   - Database metrics
   - Prometheus-compatible format (optional)

3. Uptime Monitoring:
   - Integration with UptimeRobot or similar
   - Ping health endpoint every 5 minutes
   - Alert on downtime
   - Status page

4. Application Insights:
   - Custom analytics events
   - User behavior tracking
   - Feature usage tracking
   - Conversion funnels

TESTING:
1. Test health endpoint returns correct status
2. Test health check fails when dependencies are down
3. Test metrics endpoint returns accurate data
4. Test uptime monitoring integration
5. Test custom analytics events fire

DELIVERABLES:
- apps/web/src/app/api/health/route.ts
- apps/web/src/app/api/metrics/route.ts
- apps/web/src/lib/monitoring/health.ts
- apps/web/src/lib/monitoring/metrics.ts
- apps/web/src/lib/analytics/events.ts
- Uptime monitoring configuration
- Monitoring documentation

INTEGRATION:
- Set up UptimeRobot to ping /api/health
- Configure alerts for downtime
- Verify metrics are accurate
- Test custom analytics in production
```

---

## PHASE 6: LAUNCH PREPARATION

### Goals
- SEO optimization
- Google Analytics integration
- Social media meta tags
- Sitemap and robots.txt
- Final performance audit
- Deployment and domain setup

---

### Step 6.1: SEO Optimization and Meta Tags

**Prompt 6.1:**

```
Building on all previous phases, optimize the application for search engines.

REQUIREMENTS:
1. Page Metadata:
   - Unique title and description for each page
   - Open Graph tags for social sharing
   - Twitter Card tags
   - Canonical URLs
   - Language tags (hreflang for multilingual)

2. Structured Data (Schema.org):
   - Organization schema
   - LocalBusiness schema
   - Event schema for garage sales
   - Article schema for knowledge base
   - BreadcrumbList schema

3. SEO Best Practices:
   - Semantic HTML (proper heading hierarchy)
   - Alt text for all images
   - Descriptive link text
   - Mobile-friendly (already done)
   - Fast loading (already optimized)

4. Sitemap:
   - Dynamic sitemap.xml generation
   - Include all public pages
   - Priority and change frequency
   - Multilingual sitemaps

5. Robots.txt:
   - Allow search engines
   - Block admin routes
   - Point to sitemap

TESTING:
1. Test metadata appears correctly
2. Validate structured data (Google Rich Results Test)
3. Test social sharing (Facebook, Twitter debuggers)
4. Verify sitemap is accessible
5. Lighthouse SEO score 95+

DELIVERABLES:
- apps/web/src/lib/seo/metadata.ts
- apps/web/src/components/StructuredData.tsx
- apps/web/src/app/sitemap.ts (enhanced)
- apps/web/src/app/robots.ts (enhanced)
- Metadata for all pages updated
- SEO documentation
- __tests__/lib/seo.test.ts

INTEGRATION:
- Ensure all pages have proper metadata
- Test social sharing works correctly
- Submit sitemap to Google Search Console
- Verify structured data is valid
```

---

### Step 6.2: Analytics and Tracking

**Prompt 6.2:**

```
Building on Step 6.1, implement comprehensive analytics and tracking.

REQUIREMENTS:
1. Google Analytics 4:
   - GA4 property setup
   - Page view tracking
   - Event tracking (custom events)
   - Conversion tracking
   - E-commerce tracking (for sponsor purchases)

2. Custom Events:
   - User pathway selection (visiting/living/moving)
   - Language changes
   - Sponsor clicks
   - Garage sale views
   - Knowledge article views
   - Form submissions
   - Button clicks (CTA tracking)

3. Privacy Compliance:
   - Cookie consent banner
   - GDPR compliance
   - Privacy policy
   - Data retention policy
   - User data deletion

4. Analytics Dashboard:
   - Key metrics display in admin
   - Popular pages
   - User demographics
   - Conversion rates
   - Sponsor click-through rates

TESTING:
1. Test GA4 tracking works
2. Test custom events fire correctly
3. Test cookie consent blocks tracking until accepted
4. Verify data appears in GA4 dashboard
5. Test analytics dashboard in admin

DELIVERABLES:
- apps/web/src/components/GoogleAnalytics.tsx
- apps/web/src/lib/analytics/gtag.ts
- apps/web/src/lib/analytics/events.ts
- apps/web/src/components/CookieConsent.tsx
- apps/web/src/app/privacy/page.tsx (privacy policy)
- apps/web/src/app/admin/analytics/page.tsx
- Analytics documentation

INTEGRATION:
- Add GA4 script to layout
- Implement event tracking throughout app
- Test with GA4 real-time view
- Ensure privacy compliance
```

---

### Step 6.3: Email Integration and Notifications

**Prompt 6.3:**

```
Building on previous phases, implement email functionality for notifications and communications.

REQUIREMENTS:
1. Email Service Setup:
   - Resend or similar service integration
   - Email templates (React Email)
   - Transactional emails
   - Environment configuration

2. Email Templates:
   - Welcome email (new user)
   - Email verification
   - Password reset
   - Garage sale approval notification
   - Knowledge article published notification
   - Sponsor payment reminder
   - Weekly digest (optional)

3. Email Functionality:
   - Contact form emails
   - Admin notifications (new submissions)
   - User notifications (approvals, reminders)
   - HTML and plain text versions

4. Email Settings:
   - User notification preferences
   - Unsubscribe functionality
   - Email frequency controls

TESTING:
1. Test email sending works
2. Test templates render correctly
3. Test unsubscribe works
4. Test notification preferences
5. Test email delivery (check spam)

DELIVERABLES:
- apps/web/src/lib/email/client.ts
- email-templates/welcome.tsx
- email-templates/verification.tsx
- email-templates/password-reset.tsx
- email-templates/garage-sale-approval.tsx
- apps/web/src/app/api/email/send/route.ts
- apps/web/src/app/profile/notifications/page.tsx
- Email documentation

INTEGRATION:
- Wire up contact form to send emails
- Send notification emails on admin actions
- Test full email flow (send → receive → click links)
- Verify emails don't go to spam
```

---

### Step 6.4: Progressive Web App (PWA) Setup

**Prompt 6.4:**

```
Building on all previous work, add PWA capabilities for mobile app-like experience.

REQUIREMENTS:
1. Web App Manifest:
   - App name and short name
   - Icons (multiple sizes)
   - Theme colors (aurora colors)
   - Display mode (standalone)
   - Start URL
   - Orientation

2. Service Worker:
   - Cache static assets
   - Offline page
   - Network-first for API calls
   - Cache-first for images
   - Background sync (optional)

3. Install Prompt:
   - "Add to Home Screen" prompt
   - iOS Safari instructions
   - Android Chrome install

4. Offline Support:
   - Offline page (/offline)
   - Cached pages work offline
   - Queue actions when offline
   - Sync when back online

TESTING:
1. Test PWA installation (Android, iOS)
2. Test offline functionality
3. Test service worker caching
4. Lighthouse PWA score 100
5. Test on various devices

DELIVERABLES:
- apps/web/public/manifest.json
- apps/web/public/service-worker.js
- apps/web/src/components/PWAInstaller.tsx
- apps/web/src/app/offline/page.tsx
- PWA icons (multiple sizes)
- PWA documentation

INTEGRATION:
- Register service worker in layout
- Test install prompt appears
- Verify offline page shows when offline
- Test cached content works offline
```

---

### Step 6.5: Final Deployment and Domain Setup

**Prompt 6.5:**

```
Final step: Deploy the application to production and set up the custom domain.

REQUIREMENTS:
1. Production Environment Setup:
   - Vercel project configuration
   - Production environment variables
   - Supabase production project
   - Database migrations to production
   - Mapbox production token

2. Domain Setup:
   - Purchase ykbuddy.com domain
   - Configure DNS (Vercel nameservers)
   - SSL certificate (automatic with Vercel)
   - WWW redirect setup
   - Email forwarding (optional)

3. Pre-Launch Checklist:
   - All tests passing
   - Security audit complete
   - Performance audit (Lighthouse 90+)
   - SEO audit complete
   - Analytics working
   - Error monitoring active
   - Backups configured
   - Admin account created

4. Deployment Process:
   - Deploy to staging first
   - Full QA testing on staging
   - Load testing
   - Deploy to production
   - Verify production works
   - DNS propagation

5. Post-Launch Monitoring:
   - Monitor error logs (first 24 hours)
   - Check analytics data
   - Verify uptime monitoring
   - Test all critical paths
   - Monitor performance metrics

DELIVERABLES:
- vercel.json with production configuration
- Production environment setup guide
- Deployment checklist
- Rollback procedure documentation
- Launch announcement template
- Post-launch monitoring dashboard

LAUNCH CHECKLIST:
□ All features tested and working
□ Security audit passed
□ Performance score 90+
□ SEO optimized
□ Analytics tracking
□ Error monitoring active
□ Backup strategy in place
□ Domain configured
□ SSL certificate active
□ Health checks passing
□ Staging environment tested
□ Production deploy successful
□ Critical paths verified
□ Monitoring dashboards set up

INTEGRATION:
- Complete end-to-end testing in production
- Verify all external integrations work
- Test with real users (beta testing)
- Monitor for issues in first week
```

---

## TESTING STRATEGY

### Test-Driven Development Approach

For every feature, follow this pattern:

1. **Write Tests First**
   - Define expected behavior
   - Write failing tests
   - Consider edge cases

2. **Implement Feature**
   - Write minimal code to pass tests
   - Refactor for quality
   - Keep it simple

3. **Verify Integration**
   - Test with existing features
   - End-to-end testing
   - Manual QA

### Test Coverage Goals

| Type | Target | Priority |
|------|--------|----------|
| Utility Functions | 100% | High |
| Business Logic | 90% | High |
| Components | 70% | Medium |
| API Routes | 85% | High |
| Integration Paths | 60% | Medium |
| Overall | 70%+ | High |

### Testing Tools

- **Unit Tests:** Vitest
- **Component Tests:** React Testing Library
- **E2E Tests:** Playwright (optional Phase 7)
- **API Tests:** Vitest + MSW
- **Visual Tests:** Storybook (optional)
- **Performance Tests:** Lighthouse CI
- **Security Tests:** npm audit, OWASP ZAP

---

## CODE QUALITY STANDARDS

### TypeScript

- Strict mode enabled
- No `any` types (use `unknown` if needed)
- Proper interface/type definitions
- Comprehensive JSDoc comments

### React

- Functional components only
- Custom hooks for reusable logic
- Proper dependency arrays
- Memoization where needed (React.memo, useMemo, useCallback)

### Styling

- Tailwind CSS utility classes
- No inline styles
- Consistent spacing and colors
- Mobile-first responsive design

### File Organization

```
src/
├── app/               # Next.js pages (App Router)
├── components/        # Reusable components
│   ├── ui/           # Base UI components
│   ├── auth/         # Auth-related
│   ├── admin/        # Admin components
│   └── ...           # Feature-specific
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── lib/               # Utility functions
│   ├── supabase/     # Database queries
│   ├── validation/   # Zod schemas
│   └── ...           # Other utilities
├── types/             # TypeScript types
└── styles/            # Global styles
```

---

## INTEGRATION GUIDELINES

### For Each Prompt

After implementing each step:

1. **Run Tests**
   ```bash
   npm test
   npm run test:coverage
   ```

2. **Lint and Format**
   ```bash
   npm run lint:fix
   npm run format
   ```

3. **Type Check**
   ```bash
   npm run type-check
   ```

4. **Build Verification**
   ```bash
   npm run build
   ```

5. **Manual Testing**
   - Test in browser
   - Test on mobile device
   - Test all user flows
   - Test edge cases

6. **Integration Verification**
   - Ensure new code works with existing features
   - No orphaned or unused code
   - All imports resolve
   - No breaking changes

7. **Documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update type definitions
   - Document any new environment variables

---

## MILESTONE CHECKLIST

### Phase 0 Complete ✓
- [ ] Monorepo structure initialized
- [ ] Next.js app running
- [ ] Code quality tools configured
- [ ] Testing infrastructure set up
- [ ] CI/CD pipeline working

### Phase 1 Complete ✓
- [ ] Supabase integrated
- [ ] Authentication working
- [ ] Base layout and navigation
- [ ] Core pages created
- [ ] UI component library built

### Phase 2 Complete ✓
- [ ] Multilingual support (9 languages)
- [ ] Custom northern icons
- [ ] Pathway cards on home page
- [ ] About and Contact pages with content
- [ ] Seasonal banner system

### Phase 3 Complete ✓
- [ ] Premium Spotlight system working
- [ ] Admin dashboard with auth
- [ ] Sponsor management interface
- [ ] Pricing calculator functional
- [ ] Payment tracking (placeholder)

### Phase 4 Complete ✓
- [ ] Garage Sale Planner with maps
- [ ] Knowledge Base system
- [ ] User profiles
- [ ] Saved/favorites functionality

### Phase 5 Complete ✓
- [ ] 70%+ test coverage
- [ ] Security hardened (A+ score)
- [ ] Performance optimized (90+ Lighthouse)
- [ ] Error monitoring active
- [ ] Health checks working

### Phase 6 Complete ✓
- [ ] SEO optimized (95+ score)
- [ ] Analytics tracking
- [ ] Email notifications working
- [ ] PWA capabilities
- [ ] Deployed to production with custom domain

---

## PRODUCTION READINESS CHECKLIST

### Security ✓
- [ ] CSP headers configured
- [ ] HTTPS enforced
- [ ] Input validation on all forms
- [ ] SQL injection prevention (using Supabase)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting on APIs
- [ ] Secure authentication
- [ ] RLS policies in database
- [ ] Regular security audits

### Performance ✓
- [ ] Lighthouse score 90+
- [ ] Images optimized
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Caching strategy
- [ ] CDN for static assets
- [ ] Database query optimization
- [ ] Bundle size optimized

### Reliability ✓
- [ ] Error boundaries
- [ ] Graceful error handling
- [ ] Health checks
- [ ] Uptime monitoring
- [ ] Automated backups
- [ ] Disaster recovery plan
- [ ] Load tested
- [ ] Failover strategy

### Monitoring ✓
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Analytics (GA4)
- [ ] Uptime monitoring
- [ ] Log aggregation
- [ ] Alerts configured
- [ ] Dashboards set up

### Documentation ✓
- [ ] README with setup instructions
- [ ] API documentation
- [ ] Architecture documentation
- [ ] Deployment guide
- [ ] Contributing guidelines
- [ ] Code comments
- [ ] Environment variables documented

### Compliance ✓
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie consent
- [ ] GDPR compliance
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Data retention policy

---

## ESTIMATED TIMELINE

| Phase | Duration | Hours | Complexity |
|-------|----------|-------|------------|
| Phase 0: Foundation | Week 1-2 | 30h | Medium |
| Phase 1: Core Infrastructure | Week 3-4 | 40h | Medium |
| Phase 2: Essential Features | Week 5-7 | 50h | Medium |
| Phase 3: Monetization | Week 8-9 | 40h | High |
| Phase 4: Community Features | Week 10-11 | 40h | High |
| Phase 5: Production Hardening | Week 12-13 | 35h | High |
| Phase 6: Launch Preparation | Week 14 | 15h | Medium |
| **Total** | **14 weeks** | **250h** | - |

### Effort Distribution

- **Solo Developer (5 hrs/day):** 10 weeks
- **Part-time (20 hrs/week):** 12-13 weeks
- **Full-time (40 hrs/week):** 6-7 weeks
- **Team of 2-3:** 4-5 weeks

---

## RISK MITIGATION

### Technical Risks

| Risk | Mitigation |
|------|------------|
| Third-party API changes | Version locking, fallback options |
| Database performance issues | Query optimization, indexing, caching |
| Security vulnerabilities | Regular audits, automated scanning |
| Browser compatibility | Testing matrix, polyfills |
| Mobile performance | Performance budgets, testing on real devices |

### Business Risks

| Risk | Mitigation |
|------|------------|
| Low user adoption | Marketing strategy, user research |
| Insufficient revenue | Multiple revenue streams, cost optimization |
| Content moderation load | Automated filtering, community guidelines |
| Scalability limits | Free-tier optimized, upgrade path planned |

---

## NEXT STEPS AFTER LAUNCH

### Phase 7: Growth Features (Optional)

1. **Enhanced Features:**
   - Event calendar system
   - Business directory
   - Housing listings
   - Job board
   - User reviews and ratings

2. **Mobile Apps:**
   - React Native app (iOS/Android)
   - Push notifications
   - Offline-first architecture
   - App store deployment

3. **Advanced Analytics:**
   - User behavior analysis
   - A/B testing framework
   - Conversion optimization
   - Retention metrics

4. **Community Building:**
   - Forums/discussion boards
   - User-generated content
   - Community guidelines
   - Moderation tools
   - Social features

5. **Monetization Expansion:**
   - Stripe payment integration
   - Subscription model
   - Affiliate partnerships
   - Premium features

---

## CONCLUSION

This blueprint provides a comprehensive, test-driven approach to building YK Buddy from scratch. Each step builds incrementally on the previous ones, with no orphaned code and strong integration testing throughout.

### Key Principles

1. **Test-Driven:** Write tests first, implement second
2. **Incremental:** Small, safe steps that build on each other
3. **Production-Ready:** Best practices from day one
4. **Well-Integrated:** Every piece connects to the whole
5. **Documented:** Clear documentation at every step

### Success Criteria

- ✅ All tests passing (70%+ coverage)
- ✅ Security audit passed (A+ score)
- ✅ Performance optimized (90+ Lighthouse)
- ✅ SEO optimized (95+ score)
- ✅ Production deployed successfully
- ✅ Monitoring and alerts active
- ✅ User-tested and validated

### Final Note

This plan is designed for LLM-assisted implementation. Each prompt can be fed to a code-generation LLM (like Claude, GPT-4, or similar) to implement that specific step. The prompts are detailed enough to generate working code while flexible enough to allow for creative solutions.

**Remember:** Test early, test often, and integrate continuously. Good luck building YK Buddy! 🚀

---

**Document Version:** 1.0  
**Last Updated:** October 29, 2025  
**Total Estimated Effort:** 250 hours over 14 weeks  
**Target Launch Date:** 14 weeks from project start


