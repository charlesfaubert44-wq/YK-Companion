# Database Schema - YK Buddy

This document outlines the **current** database schema for YK Buddy (as of January 2025).

**⚠️ NOTE:** This documentation reflects the actual production schema using Supabase. Outdated tables from previous versions have been archived.

---

## Current Active Tables

### 1. profiles
Stores user profile information (linked to Supabase Auth).

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  user_type TEXT CHECK (user_type IN ('visiting', 'living', 'moving')),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

**Purpose:** Extends Supabase Auth with user preferences

**Row Level Security:**
- Users can read their own profile
- Users can update their own profile
- Public read access for basic profile info

---

### 2. garage_sales
Stores community garage sale listings.

```sql
CREATE TABLE garage_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  featured_items TEXT[],
  is_active BOOLEAN DEFAULT true
);
```

**Purpose:** Community garage sale directory with map integration

**Features:**
- Geolocation support for map display
- Time-based filtering
- Contact information for buyers
- Active/inactive status

**Indexes:**
```sql
CREATE INDEX idx_garage_sales_dates ON garage_sales(start_date, end_date);
CREATE INDEX idx_garage_sales_active ON garage_sales(is_active);
```

---

### 3. premium_sponsors
Stores premium spotlight advertising placements.

```sql
CREATE TABLE premium_sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Sponsor details
  name TEXT NOT NULL,
  tagline TEXT,
  link TEXT,

  -- Positioning and scheduling
  position TEXT NOT NULL CHECK (position IN ('home_top', 'home_middle', 'home_bottom', 'visiting', 'living', 'moving')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,

  -- Pricing and payment
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
  duration_days INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled', 'refunded')),

  -- Contact and metadata
  contact_email TEXT,
  contact_name TEXT,
  notes TEXT
);
```

**Purpose:** Monetization through premium spotlight placements

**Position Types:**
- `home_top` - Top of homepage (highest visibility)
- `home_middle` - Middle of homepage
- `home_bottom` - Bottom of homepage
- `visiting` - Visiting section
- `living` - Living section
- `moving` - Moving section

**Payment Status:**
- `pending` - Awaiting payment
- `paid` - Payment received
- `cancelled` - Booking cancelled
- `refunded` - Payment refunded

**Indexes:**
```sql
CREATE INDEX idx_premium_sponsors_active ON premium_sponsors(is_active, position, start_date, end_date);
CREATE INDEX idx_premium_sponsors_dates ON premium_sponsors(start_date, end_date);
```

**Row Level Security:**
- Public can view active sponsors
- Authenticated admins can manage sponsors

---

### 4. premium_pricing_plans
Configurable pricing structure for premium sponsors.

```sql
CREATE TABLE premium_pricing_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
  position TEXT NOT NULL CHECK (position IN ('home_top', 'home_middle', 'home_bottom', 'visiting', 'living', 'moving')),

  -- Pricing structure
  base_price_per_day DECIMAL(10, 2) NOT NULL,
  min_duration_days INTEGER DEFAULT 7,
  max_duration_days INTEGER DEFAULT 365,

  -- Modifiers
  position_multiplier DECIMAL(3, 2) DEFAULT 1.0,
  volume_discount_7days DECIMAL(3, 2) DEFAULT 0.0,
  volume_discount_30days DECIMAL(3, 2) DEFAULT 0.0,
  volume_discount_90days DECIMAL(3, 2) DEFAULT 0.0,

  is_active BOOLEAN DEFAULT true,
  description TEXT
);
```

**Purpose:** Flexible pricing calculator for sponsors

**Default Pricing (Examples):**
| Position | Plan | Base Rate/Day | Multiplier |
|----------|------|---------------|------------|
| Home Top | Premium | $20 | 2.0x |
| Home Middle | Basic | $10 | 1.5x |
| Visiting | Premium | $18 | 1.7x |

**Pricing Formula:**
```javascript
final_price = (base_price_per_day × duration_days × position_multiplier) × (1 - volume_discount)
```

**Volume Discounts:**
- 7+ days: 5-15% off
- 30+ days: 15-25% off
- 90+ days: 25-35% off

---

## Triggers

### Update Timestamp Trigger
Automatically updates `updated_at` on row modifications.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_premium_sponsors_updated_at BEFORE UPDATE ON premium_sponsors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_premium_pricing_plans_updated_at BEFORE UPDATE ON premium_pricing_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Migration Strategy

Migrations are managed using Supabase SQL migrations located in `supabase/migrations/`.

**Migration Files:**
1. `20250123000001_profiles.sql` - User profiles
2. `20250123000002_garage_sales.sql` - Garage sale system
3. `20250124000003_premium_sponsors.sql` - Premium sponsor system

**To Deploy Migrations:**

**Option 1: Supabase CLI**
```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

**Option 2: Manual (Supabase Dashboard)**
1. Go to Supabase Dashboard → SQL Editor
2. Run each migration file in chronological order
3. Verify tables created successfully

---

## Row Level Security (RLS)

All tables have RLS enabled for security.

### profiles
```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### garage_sales
```sql
-- Public can view active sales
CREATE POLICY "Anyone can view active sales" ON garage_sales
  FOR SELECT USING (is_active = true);

-- Authenticated users can create sales
CREATE POLICY "Authenticated users can create sales" ON garage_sales
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### premium_sponsors
```sql
-- Public can view active sponsors
CREATE POLICY "Anyone can view active sponsors" ON premium_sponsors
  FOR SELECT USING (is_active = true);

-- Admins can manage sponsors
CREATE POLICY "Authenticated users can manage sponsors" ON premium_sponsors
  FOR ALL USING (auth.role() = 'authenticated');
```

### premium_pricing_plans
```sql
-- Public can view active plans
CREATE POLICY "Anyone can view active pricing plans" ON premium_pricing_plans
  FOR SELECT USING (is_active = true);

-- Admins can manage plans
CREATE POLICY "Authenticated users can manage pricing plans" ON premium_pricing_plans
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## Database Statistics

| Metric | Count |
|--------|-------|
| Active Tables | 4 |
| Total Columns | ~40 |
| Indexes | 5 |
| Triggers | 3 |
| RLS Policies | 8 |

---

## Archived Tables

The following tables existed in previous documentation but have been **removed**:

### Removed from Old "Trip Planner" Version:
- ❌ `users` (replaced with Supabase Auth + profiles)
- ❌ `activities`
- ❌ `activity_seasons`
- ❌ `activity_images`
- ❌ `accommodations`
- ❌ `itineraries`
- ❌ `itinerary_items`
- ❌ `bookings`
- ❌ `reviews`
- ❌ `weather_cache`
- ❌ `aurora_forecast_cache`

### Removed from "Aurora Live Events" Version:
- ❌ `aurora_events`
- ❌ `aurora_photos`
- ❌ `aurora_mosaics`
- ❌ `kp_index_data`
- ❌ `push_subscriptions`
- ❌ `aurora_challenges`
- ❌ `user_badges`
- ❌ `aurora_forecasts`
- ❌ `email_digest_preferences`
- ❌ `ar_camera_recommendations`

See `ARCHIVED_FEATURES.md` for details on removed features.

---

## Future Planned Tables

These tables may be added in future versions:

### Potential Additions:
- `events` - Community events calendar
- `business_directory` - Local business listings
- `housing_listings` - For people moving to Yellowknife
- `job_postings` - Employment opportunities
- `user_reviews` - Reviews for businesses/services
- `saved_favorites` - User bookmarks

---

**Last Updated:** January 2025
**Database:** Supabase (PostgreSQL 15)
**Total Active Tables:** 4
**Environment:** Production-ready
