-- Aurora Live Events & Photo Mosaic System
-- Real-time aurora tracking with automatic event creation and community photo mosaics

-- =====================================================
-- TABLES
-- =====================================================

-- Aurora Events Table (auto-generated when KP is good)
CREATE TABLE IF NOT EXISTS aurora_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Event Details
  event_date DATE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,

  -- Aurora Conditions
  kp_index DECIMAL(3, 1) NOT NULL, -- 0.0 to 9.0
  kp_max DECIMAL(3, 1), -- Maximum KP reached during event
  visibility_score INTEGER CHECK (visibility_score BETWEEN 1 AND 10), -- 1-10 rating
  cloud_coverage INTEGER CHECK (cloud_coverage BETWEEN 0 AND 100), -- 0-100%

  -- Event Status
  status TEXT DEFAULT 'active' CHECK (status IN ('upcoming', 'active', 'ended', 'archived')),
  auto_generated BOOLEAN DEFAULT true,

  -- Stats
  photo_count INTEGER DEFAULT 0,
  participant_count INTEGER DEFAULT 0,
  mosaic_generated BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aurora Photos Table (user uploads during events)
CREATE TABLE IF NOT EXISTS aurora_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES aurora_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Photo Details
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  location_lat DECIMAL(10, 8), -- Where photo was taken
  location_lng DECIMAL(11, 8),
  location_name TEXT, -- e.g., "Frame Lake", "Ingraham Trail Km 5"

  -- Camera Settings (for AI assistant)
  camera_model TEXT,
  iso INTEGER,
  shutter_speed TEXT, -- e.g., "15s", "30s"
  aperture TEXT, -- e.g., "f/2.8"
  focal_length TEXT, -- e.g., "24mm"

  -- Photo Metadata
  taken_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Engagement
  likes_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false, -- Featured in mosaic/gallery
  quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 10), -- AI or manual rating

  -- Moderation
  approved BOOLEAN DEFAULT true,
  flagged BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aurora Photo Mosaics (auto-generated collections)
CREATE TABLE IF NOT EXISTS aurora_mosaics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES aurora_events(id) ON DELETE CASCADE,

  -- Mosaic Details
  title TEXT NOT NULL,
  description TEXT,
  mosaic_url TEXT, -- URL to generated mosaic image
  thumbnail_url TEXT,

  -- Composition
  photo_ids UUID[], -- Array of photo IDs used in mosaic
  grid_size TEXT, -- e.g., "4x4", "5x6"
  total_photos INTEGER,

  -- Time Window
  time_window_start TIMESTAMP WITH TIME ZONE,
  time_window_end TIMESTAMP WITH TIME ZONE,
  moment_description TEXT, -- e.g., "Peak intensity at 11:30 PM"

  -- Stats
  views_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,

  -- Metadata
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aurora Photo Likes
CREATE TABLE IF NOT EXISTS aurora_photo_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES aurora_photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(photo_id, user_id)
);

-- KP Index History (for tracking and predictions)
CREATE TABLE IF NOT EXISTS kp_index_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- KP Data
  kp_index DECIMAL(3, 1) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Source
  source TEXT, -- e.g., "NOAA", "Space Weather", "Manual"
  forecast BOOLEAN DEFAULT false, -- true if forecast, false if actual

  -- Location-specific (Yellowknife)
  aurora_probability INTEGER CHECK (aurora_probability BETWEEN 0 AND 100), -- %

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(timestamp, source)
);

-- User Aurora Preferences
CREATE TABLE IF NOT EXISTS aurora_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Notifications
  notify_kp_threshold DECIMAL(3, 1) DEFAULT 4.0, -- Notify when KP >= this
  notify_event_start BOOLEAN DEFAULT true,
  notify_new_photos BOOLEAN DEFAULT false,
  notify_mosaic_ready BOOLEAN DEFAULT true,

  -- Preferences
  favorite_locations TEXT[], -- Saved viewing spots
  camera_model TEXT, -- For personalized camera settings

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_aurora_events_date ON aurora_events(event_date);
CREATE INDEX IF NOT EXISTS idx_aurora_events_status ON aurora_events(status);
CREATE INDEX IF NOT EXISTS idx_aurora_events_kp ON aurora_events(kp_index);

CREATE INDEX IF NOT EXISTS idx_aurora_photos_event ON aurora_photos(event_id);
CREATE INDEX IF NOT EXISTS idx_aurora_photos_user ON aurora_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_aurora_photos_taken_at ON aurora_photos(taken_at);
CREATE INDEX IF NOT EXISTS idx_aurora_photos_featured ON aurora_photos(featured);

CREATE INDEX IF NOT EXISTS idx_aurora_mosaics_event ON aurora_mosaics(event_id);

CREATE INDEX IF NOT EXISTS idx_kp_history_timestamp ON kp_index_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_kp_history_kp ON kp_index_history(kp_index);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE aurora_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE aurora_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aurora_mosaics ENABLE ROW LEVEL SECURITY;
ALTER TABLE aurora_photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE kp_index_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE aurora_preferences ENABLE ROW LEVEL SECURITY;

-- Aurora Events Policies (Everyone can view)
CREATE POLICY "Anyone can view aurora events"
  ON aurora_events FOR SELECT
  USING (true);

-- Aurora Photos Policies
CREATE POLICY "Anyone can view approved photos"
  ON aurora_photos FOR SELECT
  USING (approved = true);

CREATE POLICY "Users can upload photos"
  ON aurora_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON aurora_photos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON aurora_photos FOR DELETE
  USING (auth.uid() = user_id);

-- Mosaics Policies (Everyone can view)
CREATE POLICY "Anyone can view mosaics"
  ON aurora_mosaics FOR SELECT
  USING (true);

-- Photo Likes Policies
CREATE POLICY "Anyone can view likes"
  ON aurora_photo_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like photos"
  ON aurora_photo_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike photos"
  ON aurora_photo_likes FOR DELETE
  USING (auth.uid() = user_id);

-- KP History Policies
CREATE POLICY "Anyone can view KP history"
  ON kp_index_history FOR SELECT
  USING (true);

-- Preferences Policies
CREATE POLICY "Users can view their own preferences"
  ON aurora_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON aurora_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON aurora_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_aurora_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_aurora_events_updated_at
  BEFORE UPDATE ON aurora_events
  FOR EACH ROW
  EXECUTE FUNCTION update_aurora_updated_at();

CREATE TRIGGER update_aurora_preferences_updated_at
  BEFORE UPDATE ON aurora_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_aurora_updated_at();

-- Function to auto-create aurora event when KP is good
CREATE OR REPLACE FUNCTION create_aurora_event_if_needed(
  current_kp DECIMAL,
  current_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
  existing_event_id UUID;
BEGIN
  -- Check if there's already an active event today
  SELECT id INTO existing_event_id
  FROM aurora_events
  WHERE event_date = current_time::DATE
    AND status = 'active'
  LIMIT 1;

  -- If KP >= 4.0 and no active event, create one
  IF current_kp >= 4.0 AND existing_event_id IS NULL THEN
    INSERT INTO aurora_events (
      event_date,
      start_time,
      kp_index,
      kp_max,
      visibility_score,
      status,
      auto_generated
    )
    VALUES (
      current_time::DATE,
      current_time,
      current_kp,
      current_kp,
      LEAST(10, FLOOR(current_kp * 1.5))::INTEGER, -- Estimate visibility
      'active',
      true
    )
    RETURNING id INTO event_id;

    RETURN event_id;
  END IF;

  -- If event exists and KP is higher, update max
  IF existing_event_id IS NOT NULL AND current_kp > (SELECT kp_max FROM aurora_events WHERE id = existing_event_id) THEN
    UPDATE aurora_events
    SET kp_max = current_kp,
        visibility_score = LEAST(10, FLOOR(current_kp * 1.5))::INTEGER
    WHERE id = existing_event_id;
  END IF;

  RETURN existing_event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment photo count when photo uploaded
CREATE OR REPLACE FUNCTION increment_event_photo_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE aurora_events
  SET photo_count = photo_count + 1,
      participant_count = (
        SELECT COUNT(DISTINCT user_id)
        FROM aurora_photos
        WHERE event_id = NEW.event_id
      )
  WHERE id = NEW.event_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_photo_upload
  AFTER INSERT ON aurora_photos
  FOR EACH ROW
  EXECUTE FUNCTION increment_event_photo_count();

-- Function to increment photo likes
CREATE OR REPLACE FUNCTION increment_photo_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE aurora_photos
  SET likes_count = likes_count + 1
  WHERE id = NEW.photo_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_photo_like
  AFTER INSERT ON aurora_photo_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_photo_likes();

-- Function to decrement photo likes
CREATE OR REPLACE FUNCTION decrement_photo_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE aurora_photos
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = OLD.photo_id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_photo_unlike
  AFTER DELETE ON aurora_photo_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_photo_likes();

-- Get current active event
CREATE OR REPLACE FUNCTION get_active_aurora_event()
RETURNS TABLE (
  id UUID,
  event_date DATE,
  start_time TIMESTAMP WITH TIME ZONE,
  kp_index DECIMAL,
  kp_max DECIMAL,
  photo_count INTEGER,
  participant_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ae.id,
    ae.event_date,
    ae.start_time,
    ae.kp_index,
    ae.kp_max,
    ae.photo_count,
    ae.participant_count
  FROM aurora_events ae
  WHERE ae.status = 'active'
    AND ae.event_date >= CURRENT_DATE - INTERVAL '1 day'
  ORDER BY ae.start_time DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Get photos for time window (for mosaic generation)
CREATE OR REPLACE FUNCTION get_photos_for_time_window(
  p_event_id UUID,
  window_start TIMESTAMP WITH TIME ZONE,
  window_end TIMESTAMP WITH TIME ZONE
)
RETURNS SETOF aurora_photos AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM aurora_photos
  WHERE event_id = p_event_id
    AND taken_at BETWEEN window_start AND window_end
    AND approved = true
    AND quality_score >= 5
  ORDER BY quality_score DESC, likes_count DESC
  LIMIT 20; -- Max 20 photos per mosaic
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS
-- =====================================================

-- View for live event dashboard
CREATE OR REPLACE VIEW v_live_aurora_dashboard AS
SELECT
  ae.*,
  (SELECT COUNT(*) FROM aurora_photos ap WHERE ap.event_id = ae.id AND ap.uploaded_at > NOW() - INTERVAL '5 minutes') as recent_uploads,
  (SELECT json_agg(json_build_object(
    'id', ap.id,
    'photo_url', ap.photo_url,
    'thumbnail_url', ap.thumbnail_url,
    'caption', ap.caption,
    'likes_count', ap.likes_count,
    'uploaded_at', ap.uploaded_at
  ) ORDER BY ap.uploaded_at DESC)
  FROM aurora_photos ap
  WHERE ap.event_id = ae.id
  LIMIT 20) as recent_photos
FROM aurora_events ae
WHERE ae.status = 'active';

-- View for photo leaderboard
CREATE OR REPLACE VIEW v_aurora_photo_leaderboard AS
SELECT
  ap.*,
  up.full_name as photographer_name
FROM aurora_photos ap
LEFT JOIN user_profiles up ON ap.user_id = up.id
WHERE ap.approved = true
ORDER BY ap.likes_count DESC, ap.quality_score DESC
LIMIT 50;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample KP index data
INSERT INTO kp_index_history (kp_index, timestamp, source, forecast, aurora_probability) VALUES
(5.3, NOW() - INTERVAL '2 hours', 'NOAA', false, 85),
(6.7, NOW() - INTERVAL '1 hour', 'NOAA', false, 95),
(7.2, NOW(), 'NOAA', false, 98);

-- Create sample active event
INSERT INTO aurora_events (
  event_date,
  start_time,
  kp_index,
  kp_max,
  visibility_score,
  status,
  auto_generated,
  photo_count,
  participant_count
) VALUES (
  CURRENT_DATE,
  NOW() - INTERVAL '2 hours',
  7.2,
  7.2,
  9,
  'active',
  true,
  0,
  0
);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE aurora_events IS 'Auto-generated aurora events based on KP index';
COMMENT ON TABLE aurora_photos IS 'User-uploaded aurora photos during live events';
COMMENT ON TABLE aurora_mosaics IS 'Auto-generated photo mosaics from event moments';
COMMENT ON TABLE kp_index_history IS 'Historical KP index data for tracking and predictions';

COMMENT ON FUNCTION create_aurora_event_if_needed IS 'Auto-creates aurora event when KP >= 4.0';
COMMENT ON FUNCTION get_photos_for_time_window IS 'Gets best photos from time window for mosaic generation';
