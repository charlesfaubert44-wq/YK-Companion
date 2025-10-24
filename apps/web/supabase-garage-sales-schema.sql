-- Garage Sale Planner Database Schema for YK Buddy
-- Integrated into the "Living in Yellowknife" section

-- =====================================================
-- TABLES
-- =====================================================

-- Garage Sales Table
CREATE TABLE IF NOT EXISTS garage_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Information
  title TEXT NOT NULL,
  description TEXT,

  -- Location
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL, -- Yellowknife coords: ~62.4540
  longitude DECIMAL(11, 8) NOT NULL, -- Yellowknife coords: ~-114.3718
  location_details TEXT, -- e.g., "Basement entrance", "Follow signs"

  -- Date and Time
  sale_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  -- Sale Details
  photos TEXT[], -- Array of image URLs
  tags TEXT[], -- e.g., ["furniture", "kids toys", "electronics"]
  items_description TEXT,

  -- Preferences
  cash_only BOOLEAN DEFAULT false,
  early_birds_welcome BOOLEAN DEFAULT false,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes
  CONSTRAINT valid_times CHECK (end_time > start_time)
);

-- Favorites/Saved Sales Table
CREATE TABLE IF NOT EXISTS saved_garage_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES garage_sales(id) ON DELETE CASCADE,
  notes TEXT, -- Personal notes about this sale
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure user can't save same sale twice
  UNIQUE(user_id, sale_id)
);

-- Itineraries Table (for route planning)
CREATE TABLE IF NOT EXISTS garage_sale_itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Itinerary Details
  name TEXT NOT NULL,
  date DATE NOT NULL,
  sale_ids UUID[], -- Array of garage_sale IDs in optimized order
  optimized_route JSONB, -- Store route data from optimization algorithm

  -- Route Stats
  total_distance_km DECIMAL(10, 2),
  estimated_duration_minutes INTEGER,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles Extension (if not exists from main schema)
-- This adds garage-sale specific fields to user profiles
DO $$
BEGIN
  -- Add notification preferences if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles'
    AND column_name = 'notify_new_sales'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN notify_new_sales BOOLEAN DEFAULT true;
    ALTER TABLE user_profiles ADD COLUMN notify_day_before BOOLEAN DEFAULT true;
    ALTER TABLE user_profiles ADD COLUMN favorite_sale_types TEXT[];
  END IF;
END $$;

-- =====================================================
-- INDEXES
-- =====================================================

-- Performance indexes for common queries
CREATE INDEX IF NOT EXISTS idx_garage_sales_date ON garage_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_garage_sales_status ON garage_sales(status);
CREATE INDEX IF NOT EXISTS idx_garage_sales_user ON garage_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_garage_sales_location ON garage_sales USING GIST (
  ll_to_earth(latitude::float8, longitude::float8)
);

CREATE INDEX IF NOT EXISTS idx_saved_sales_user ON saved_garage_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_user ON garage_sale_itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_date ON garage_sale_itineraries(date);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_garage_sales_search ON garage_sales
  USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(items_description, '')));

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE garage_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_garage_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE garage_sale_itineraries ENABLE ROW LEVEL SECURITY;

-- Garage Sales Policies

-- Anyone can view active garage sales
CREATE POLICY "Anyone can view active garage sales"
  ON garage_sales FOR SELECT
  USING (status = 'active' AND sale_date >= CURRENT_DATE);

-- Users can insert their own sales
CREATE POLICY "Users can create their own sales"
  ON garage_sales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own sales
CREATE POLICY "Users can update their own sales"
  ON garage_sales FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own sales
CREATE POLICY "Users can delete their own sales"
  ON garage_sales FOR DELETE
  USING (auth.uid() = user_id);

-- Saved Sales Policies

-- Users can view their own saved sales
CREATE POLICY "Users can view their own saved sales"
  ON saved_garage_sales FOR SELECT
  USING (auth.uid() = user_id);

-- Users can save sales
CREATE POLICY "Users can save sales"
  ON saved_garage_sales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their saved sales
CREATE POLICY "Users can delete saved sales"
  ON saved_garage_sales FOR DELETE
  USING (auth.uid() = user_id);

-- Itineraries Policies

-- Users can view their own itineraries
CREATE POLICY "Users can view their own itineraries"
  ON garage_sale_itineraries FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create itineraries
CREATE POLICY "Users can create itineraries"
  ON garage_sale_itineraries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own itineraries
CREATE POLICY "Users can update their own itineraries"
  ON garage_sale_itineraries FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own itineraries
CREATE POLICY "Users can delete their own itineraries"
  ON garage_sale_itineraries FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_garage_sales_updated_at
  BEFORE UPDATE ON garage_sales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON garage_sale_itineraries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get nearby garage sales
CREATE OR REPLACE FUNCTION get_nearby_garage_sales(
  lat DECIMAL,
  lng DECIMAL,
  radius_km INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  address TEXT,
  sale_date DATE,
  start_time TIME,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    gs.id,
    gs.title,
    gs.address,
    gs.sale_date,
    gs.start_time,
    ROUND(
      earth_distance(
        ll_to_earth(gs.latitude::float8, gs.longitude::float8),
        ll_to_earth(lat::float8, lng::float8)
      ) / 1000, 2
    ) AS distance_km
  FROM garage_sales gs
  WHERE
    gs.status = 'active'
    AND gs.sale_date >= CURRENT_DATE
    AND earth_distance(
      ll_to_earth(gs.latitude::float8, gs.longitude::float8),
      ll_to_earth(lat::float8, lng::float8)
    ) <= (radius_km * 1000)
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- Function to get sales by date range
CREATE OR REPLACE FUNCTION get_sales_by_date_range(
  start_date DATE,
  end_date DATE
)
RETURNS SETOF garage_sales AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM garage_sales
  WHERE
    status = 'active'
    AND sale_date BETWEEN start_date AND end_date
  ORDER BY sale_date, start_time;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-cancel past sales
CREATE OR REPLACE FUNCTION auto_complete_past_sales()
RETURNS void AS $$
BEGIN
  UPDATE garage_sales
  SET status = 'completed'
  WHERE
    status = 'active'
    AND sale_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA (for development/testing)
-- =====================================================

-- Insert sample garage sales in Yellowknife
-- Note: In production, replace this with real user submissions

INSERT INTO garage_sales (
  title, description, address, latitude, longitude,
  sale_date, start_time, end_time,
  tags, items_description,
  cash_only, early_birds_welcome, status
) VALUES
(
  'Moving Sale - Everything Must Go!',
  'We''re moving south and need to sell everything! Furniture, appliances, tools, winter gear, and more.',
  '50 Street, Yellowknife, NT',
  62.4540,
  -114.3718,
  CURRENT_DATE + INTERVAL '2 days',
  '09:00',
  '17:00',
  ARRAY['furniture', 'appliances', 'tools', 'winter gear'],
  'Sectional couch, dining table set, KitchenAid mixer, snow blower, skis, camping equipment',
  true,
  false,
  'active'
),
(
  'Multi-Family Garage Sale',
  'Three families combined for a huge sale! Kids toys, clothes, household items, and more.',
  'Bretzlaff Drive, Yellowknife, NT',
  62.4620,
  -114.3950,
  CURRENT_DATE + INTERVAL '3 days',
  '10:00',
  '16:00',
  ARRAY['kids', 'toys', 'clothes', 'household'],
  'Baby gear, toys (ages 0-10), books, kitchen items, decorations',
  false,
  true,
  'active'
),
(
  'Tools & Equipment Sale',
  'Downsizing workshop. Power tools, hand tools, fishing gear, and outdoor equipment.',
  'Lessard Drive, Yellowknife, NT',
  62.4450,
  -114.3600,
  CURRENT_DATE + INTERVAL '5 days',
  '08:00',
  '14:00',
  ARRAY['tools', 'fishing', 'outdoor'],
  'Dewalt drill set, table saw, fishing rods, tackle boxes, canoe paddles',
  true,
  true,
  'active'
);

-- =====================================================
-- VIEWS
-- =====================================================

-- View for upcoming garage sales with user info
CREATE OR REPLACE VIEW v_upcoming_garage_sales AS
SELECT
  gs.*,
  up.full_name as host_name,
  up.email as host_email,
  (SELECT COUNT(*) FROM saved_garage_sales WHERE sale_id = gs.id) as save_count
FROM garage_sales gs
LEFT JOIN user_profiles up ON gs.user_id = up.id
WHERE
  gs.status = 'active'
  AND gs.sale_date >= CURRENT_DATE
ORDER BY gs.sale_date, gs.start_time;

-- View for today's sales
CREATE OR REPLACE VIEW v_todays_garage_sales AS
SELECT *
FROM v_upcoming_garage_sales
WHERE sale_date = CURRENT_DATE;

-- View for weekend sales
CREATE OR REPLACE VIEW v_weekend_garage_sales AS
SELECT *
FROM v_upcoming_garage_sales
WHERE
  EXTRACT(DOW FROM sale_date) IN (0, 6) -- Sunday = 0, Saturday = 6
  AND sale_date >= CURRENT_DATE
  AND sale_date <= CURRENT_DATE + INTERVAL '7 days';

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE garage_sales IS 'Stores garage sale listings for the Yellowknife community';
COMMENT ON TABLE saved_garage_sales IS 'User''s saved/favorited garage sales';
COMMENT ON TABLE garage_sale_itineraries IS 'User-created route plans for visiting multiple garage sales';

COMMENT ON COLUMN garage_sales.latitude IS 'Yellowknife latitude approximately 62.4540';
COMMENT ON COLUMN garage_sales.longitude IS 'Yellowknife longitude approximately -114.3718';
COMMENT ON COLUMN garage_sales.tags IS 'Searchable tags like furniture, electronics, kids, tools';
COMMENT ON COLUMN garage_sales.status IS 'active, cancelled, or completed';

COMMENT ON FUNCTION get_nearby_garage_sales IS 'Find garage sales within specified radius (km) of coordinates';
COMMENT ON FUNCTION get_sales_by_date_range IS 'Get all active sales between two dates';
COMMENT ON FUNCTION auto_complete_past_sales IS 'Automatically mark past sales as completed';
