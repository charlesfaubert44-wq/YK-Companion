-- Aurora Live Events - Future Enhancements
-- WebSockets, Push Notifications, AI Scoring, Challenges, Forecasts, Digests

-- =====================================================
-- ENHANCEMENTS TO EXISTING TABLES
-- =====================================================

-- Add AI scoring and challenges to photos
ALTER TABLE aurora_photos ADD COLUMN IF NOT EXISTS ai_quality_score DECIMAL(3, 2); -- AI-generated score 0.00-1.00
ALTER TABLE aurora_photos ADD COLUMN IF NOT EXISTS composition_score DECIMAL(3, 2); -- AI composition analysis
ALTER TABLE aurora_photos ADD COLUMN IF NOT EXISTS color_score DECIMAL(3, 2); -- AI color vibrancy
ALTER TABLE aurora_photos ADD COLUMN IF NOT EXISTS technical_score DECIMAL(3, 2); -- AI technical quality
ALTER TABLE aurora_photos ADD COLUMN IF NOT EXISTS ai_tags TEXT[]; -- AI-detected features
ALTER TABLE aurora_photos ADD COLUMN IF NOT EXISTS challenge_entry BOOLEAN DEFAULT false;
ALTER TABLE aurora_photos ADD COLUMN IF NOT EXISTS challenge_id UUID;

-- Add forecast data to events
ALTER TABLE aurora_events ADD COLUMN IF NOT EXISTS forecast_accuracy DECIMAL(3, 2); -- How accurate was the forecast?
ALTER TABLE aurora_events ADD COLUMN IF NOT EXISTS predicted_kp DECIMAL(3, 1); -- What was predicted
ALTER TABLE aurora_events ADD COLUMN IF NOT EXISTS weather_conditions JSONB; -- Temperature, clouds, etc.

-- Add print settings to mosaics
ALTER TABLE aurora_mosaics ADD COLUMN IF NOT EXISTS print_resolution TEXT; -- e.g., "4K", "8K"
ALTER TABLE aurora_mosaics ADD COLUMN IF NOT EXISTS print_dpi INTEGER; -- DPI for printing
ALTER TABLE aurora_mosaics ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;

-- =====================================================
-- NEW TABLES
-- =====================================================

-- Push Notification Subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Push subscription data (from browser)
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,

  -- Preferences
  notify_kp_threshold DECIMAL(3, 1) DEFAULT 5.0,
  notify_new_event BOOLEAN DEFAULT true,
  notify_photo_featured BOOLEAN DEFAULT true,
  notify_challenge_start BOOLEAN DEFAULT true,
  notify_mosaic_ready BOOLEAN DEFAULT false,

  -- Metadata
  device_type TEXT, -- 'mobile', 'desktop', 'tablet'
  browser TEXT,
  last_sent TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(endpoint)
);

-- Push Notification Log
CREATE TABLE IF NOT EXISTS push_notifications_sent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES push_subscriptions(id) ON DELETE CASCADE,

  -- Notification details
  notification_type TEXT NOT NULL, -- 'kp_spike', 'new_event', 'featured', 'challenge'
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,

  -- Tracking
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photography Challenges
CREATE TABLE IF NOT EXISTS aurora_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Challenge details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rules TEXT,

  -- Timing
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Requirements
  required_tags TEXT[], -- Must include these elements
  min_kp DECIMAL(3, 1), -- Minimum KP index
  location_specific BOOLEAN DEFAULT false,

  -- Rewards/Recognition
  winner_count INTEGER DEFAULT 3, -- Top 3
  badge_name TEXT,

  -- Stats
  participant_count INTEGER DEFAULT 0,
  entry_count INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'judging', 'completed')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge Winners
CREATE TABLE IF NOT EXISTS challenge_winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES aurora_challenges(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES aurora_photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Placement
  rank INTEGER NOT NULL, -- 1, 2, 3

  -- Scores
  final_score DECIMAL(5, 2),
  community_votes INTEGER DEFAULT 0,
  judge_score DECIMAL(3, 2),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(challenge_id, rank)
);

-- User Badges/Achievements
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Badge info
  badge_type TEXT NOT NULL, -- 'first_upload', 'challenge_winner', 'most_liked', etc.
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,

  -- Achievement details
  earned_for TEXT, -- What earned this badge
  challenge_id UUID REFERENCES aurora_challenges(id) ON DELETE SET NULL,
  photo_id UUID REFERENCES aurora_photos(id) ON DELETE SET NULL,

  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aurora Forecast Predictions
CREATE TABLE IF NOT EXISTS aurora_forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Forecast details
  forecast_date DATE NOT NULL,
  forecast_hour INTEGER NOT NULL, -- 0-23

  -- Predicted values
  predicted_kp DECIMAL(3, 1) NOT NULL,
  predicted_probability INTEGER, -- 0-100

  -- Confidence
  confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high')),
  confidence_score DECIMAL(3, 2), -- 0.00-1.00

  -- Source
  model_version TEXT,
  data_source TEXT, -- 'NOAA', 'AI_MODEL', 'COMBINED'

  -- Actual outcome (filled in later)
  actual_kp DECIMAL(3, 1),
  accuracy_score DECIMAL(3, 2), -- How accurate was this forecast?

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(forecast_date, forecast_hour, data_source)
);

-- Email Digest Preferences
CREATE TABLE IF NOT EXISTS email_digest_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Frequency
  digest_frequency TEXT DEFAULT 'weekly' CHECK (digest_frequency IN ('daily', 'weekly', 'monthly', 'never')),
  digest_day INTEGER, -- Day of week (0-6) for weekly, day of month (1-31) for monthly

  -- Content preferences
  include_top_photos BOOLEAN DEFAULT true,
  include_mosaics BOOLEAN DEFAULT true,
  include_forecast BOOLEAN DEFAULT true,
  include_challenges BOOLEAN DEFAULT true,
  include_personal_stats BOOLEAN DEFAULT true,

  -- Delivery
  last_sent TIMESTAMP WITH TIME ZONE,
  next_scheduled TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Digest Log
CREATE TABLE IF NOT EXISTS email_digests_sent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Digest details
  digest_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Content summary
  photos_included INTEGER,
  mosaics_included INTEGER,
  events_covered INTEGER,

  -- Tracking
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicks INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time Event Subscriptions (for WebSocket)
CREATE TABLE IF NOT EXISTS realtime_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Subscription details
  connection_id TEXT NOT NULL,
  event_id UUID REFERENCES aurora_events(id) ON DELETE CASCADE,

  -- Connection info
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Status
  active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(connection_id, event_id)
);

-- AR Camera Settings Recommendations
CREATE TABLE IF NOT EXISTS ar_camera_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Conditions
  kp_index DECIMAL(3, 1) NOT NULL,
  brightness_level TEXT NOT NULL, -- 'dim', 'moderate', 'bright'

  -- Recommendations by skill level
  beginner_settings JSONB NOT NULL, -- { iso, shutter_speed, aperture, tips }
  intermediate_settings JSONB NOT NULL,
  advanced_settings JSONB NOT NULL,

  -- Phone-specific adjustments
  phone_model_overrides JSONB, -- { "iPhone 14 Pro": {...}, "Pixel 7": {...} }

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(kp_index, brightness_level)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(active);

CREATE INDEX IF NOT EXISTS idx_challenges_status ON aurora_challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_dates ON aurora_challenges(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_forecasts_date ON aurora_forecasts(forecast_date, forecast_hour);
CREATE INDEX IF NOT EXISTS idx_forecasts_accuracy ON aurora_forecasts(accuracy_score);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_type ON user_badges(badge_type);

CREATE INDEX IF NOT EXISTS idx_realtime_subs_event ON realtime_subscriptions(event_id);
CREATE INDEX IF NOT EXISTS idx_realtime_subs_active ON realtime_subscriptions(active);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notifications_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE aurora_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE aurora_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_digest_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_digests_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ar_camera_recommendations ENABLE ROW LEVEL SECURITY;

-- Push Subscriptions Policies
CREATE POLICY "Users can manage own subscriptions"
  ON push_subscriptions FOR ALL
  USING (auth.uid() = user_id);

-- Challenges Policies (Everyone can view)
CREATE POLICY "Anyone can view challenges"
  ON aurora_challenges FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view challenge winners"
  ON challenge_winners FOR SELECT
  USING (true);

-- Badges Policies
CREATE POLICY "Anyone can view badges"
  ON user_badges FOR SELECT
  USING (true);

-- Forecasts Policies (Everyone can view)
CREATE POLICY "Anyone can view forecasts"
  ON aurora_forecasts FOR SELECT
  USING (true);

-- Digest Preferences Policies
CREATE POLICY "Users can manage own digest preferences"
  ON email_digest_preferences FOR ALL
  USING (auth.uid() = user_id);

-- AR Recommendations Policies (Everyone can view)
CREATE POLICY "Anyone can view AR recommendations"
  ON ar_camera_recommendations FOR SELECT
  USING (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate AI quality score
CREATE OR REPLACE FUNCTION calculate_ai_photo_score(
  photo_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
  comp_score DECIMAL;
  color_score DECIMAL;
  tech_score DECIMAL;
  final_score DECIMAL;
BEGIN
  -- Get AI scores
  SELECT composition_score, color_score, technical_score
  INTO comp_score, color_score, tech_score
  FROM aurora_photos
  WHERE id = photo_id;

  -- Calculate weighted average
  final_score := (comp_score * 0.4) + (color_score * 0.3) + (tech_score * 0.3);

  -- Update photo
  UPDATE aurora_photos
  SET ai_quality_score = final_score
  WHERE id = photo_id;

  RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- Function to award badge
CREATE OR REPLACE FUNCTION award_badge(
  p_user_id UUID,
  p_badge_type TEXT,
  p_badge_name TEXT,
  p_description TEXT,
  p_earned_for TEXT DEFAULT NULL,
  p_photo_id UUID DEFAULT NULL,
  p_challenge_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  badge_id UUID;
  existing_badge UUID;
BEGIN
  -- Check if user already has this badge type
  SELECT id INTO existing_badge
  FROM user_badges
  WHERE user_id = p_user_id AND badge_type = p_badge_type
  LIMIT 1;

  -- Only award if they don't have it
  IF existing_badge IS NULL THEN
    INSERT INTO user_badges (
      user_id,
      badge_type,
      badge_name,
      badge_description,
      earned_for,
      photo_id,
      challenge_id
    )
    VALUES (
      p_user_id,
      p_badge_type,
      p_badge_name,
      p_description,
      p_earned_for,
      p_photo_id,
      p_challenge_id
    )
    RETURNING id INTO badge_id;

    RETURN badge_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to send push notification
CREATE OR REPLACE FUNCTION queue_push_notification(
  p_user_id UUID,
  p_notification_type TEXT,
  p_title TEXT,
  p_body TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  notifications_queued INTEGER := 0;
  sub RECORD;
BEGIN
  -- Find all active subscriptions for user
  FOR sub IN
    SELECT id, notify_kp_threshold
    FROM push_subscriptions
    WHERE user_id = p_user_id AND active = true
  LOOP
    -- Insert notification
    INSERT INTO push_notifications_sent (
      user_id,
      subscription_id,
      notification_type,
      title,
      body,
      data
    )
    VALUES (
      p_user_id,
      sub.id,
      p_notification_type,
      p_title,
      p_body,
      p_data
    );

    notifications_queued := notifications_queued + 1;
  END LOOP;

  RETURN notifications_queued;
END;
$$ LANGUAGE plpgsql;

-- Function to check for badge awards on photo upload
CREATE OR REPLACE FUNCTION check_photo_badges()
RETURNS TRIGGER AS $$
DECLARE
  photo_count INTEGER;
BEGIN
  -- Count user's photos
  SELECT COUNT(*) INTO photo_count
  FROM aurora_photos
  WHERE user_id = NEW.user_id AND approved = true;

  -- First photo badge
  IF photo_count = 1 THEN
    PERFORM award_badge(
      NEW.user_id,
      'first_upload',
      'First Light',
      'Uploaded your first aurora photo',
      'First photo upload',
      NEW.id
    );
  END IF;

  -- 10 photos badge
  IF photo_count = 10 THEN
    PERFORM award_badge(
      NEW.user_id,
      '10_uploads',
      'Aurora Chaser',
      'Uploaded 10 aurora photos',
      '10 photo uploads'
    );
  END IF;

  -- 50 photos badge
  IF photo_count = 50 THEN
    PERFORM award_badge(
      NEW.user_id,
      '50_uploads',
      'Aurora Master',
      'Uploaded 50 aurora photos',
      '50 photo uploads'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_badges_on_upload
  AFTER INSERT ON aurora_photos
  FOR EACH ROW
  EXECUTE FUNCTION check_photo_badges();

-- Function to update forecast accuracy
CREATE OR REPLACE FUNCTION update_forecast_accuracy()
RETURNS void AS $$
BEGIN
  UPDATE aurora_forecasts af
  SET
    accuracy_score = 1.0 - ABS(af.predicted_kp - af.actual_kp) / 9.0
  WHERE af.actual_kp IS NOT NULL AND af.accuracy_score IS NULL;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS
-- =====================================================

-- Leaderboard View
CREATE OR REPLACE VIEW v_photography_leaderboard AS
SELECT
  u.id as user_id,
  up.full_name as photographer_name,
  COUNT(DISTINCT ap.id) as total_photos,
  SUM(ap.likes_count) as total_likes,
  AVG(ap.ai_quality_score) as avg_ai_score,
  COUNT(DISTINCT CASE WHEN ap.featured THEN ap.id END) as featured_count,
  COUNT(DISTINCT ub.id) as badge_count,
  MAX(ap.uploaded_at) as last_upload
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
LEFT JOIN aurora_photos ap ON u.id = ap.user_id AND ap.approved = true
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id, up.full_name
HAVING COUNT(DISTINCT ap.id) > 0
ORDER BY total_likes DESC, avg_ai_score DESC
LIMIT 100;

-- Active Challenges View
CREATE OR REPLACE VIEW v_active_challenges AS
SELECT
  c.*,
  (SELECT COUNT(*) FROM aurora_photos WHERE challenge_id = c.id) as current_entries
FROM aurora_challenges c
WHERE c.status IN ('upcoming', 'active')
ORDER BY c.start_date DESC;

-- Forecast Accuracy View
CREATE OR REPLACE VIEW v_forecast_accuracy AS
SELECT
  data_source,
  AVG(accuracy_score) as avg_accuracy,
  COUNT(*) as total_forecasts,
  COUNT(CASE WHEN accuracy_score >= 0.8 THEN 1 END) as accurate_forecasts
FROM aurora_forecasts
WHERE actual_kp IS NOT NULL
GROUP BY data_source;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Sample Challenge
INSERT INTO aurora_challenges (
  title,
  description,
  rules,
  start_date,
  end_date,
  required_tags,
  min_kp,
  status
) VALUES (
  'December Aurora Challenge',
  'Capture the best aurora display of December! Show us your most creative compositions.',
  'Photo must be taken during an active aurora event with KP >= 5.0. Must include at least one foreground element.',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  ARRAY['aurora', 'landscape'],
  5.0,
  'active'
) ON CONFLICT DO NOTHING;

-- Sample AR Camera Recommendations
INSERT INTO ar_camera_recommendations (
  kp_index,
  brightness_level,
  beginner_settings,
  intermediate_settings,
  advanced_settings
) VALUES
(5.0, 'moderate',
  '{"iso": 3200, "shutter_speed": "20s", "aperture": "f/2.8", "white_balance": "3200K", "tips": ["Use tripod", "Turn off flash", "Focus on infinity"]}'::jsonb,
  '{"iso": 1600, "shutter_speed": "15s", "aperture": "f/2.0", "white_balance": "3500K", "tips": ["Try bulb mode", "Use remote shutter", "Bracket exposures"]}'::jsonb,
  '{"iso": 800, "shutter_speed": "10s", "aperture": "f/1.8", "white_balance": "Auto", "tips": ["Shoot RAW", "Use focus stacking", "Multiple exposures for HDR"]}'::jsonb
) ON CONFLICT DO NOTHING;

-- Sample Forecast
INSERT INTO aurora_forecasts (
  forecast_date,
  forecast_hour,
  predicted_kp,
  predicted_probability,
  confidence_level,
  confidence_score,
  data_source
) VALUES
(CURRENT_DATE, 22, 6.5, 85, 'high', 0.85, 'AI_MODEL'),
(CURRENT_DATE, 23, 7.0, 90, 'high', 0.90, 'AI_MODEL'),
(CURRENT_DATE + INTERVAL '1 day', 0, 6.8, 88, 'medium', 0.75, 'AI_MODEL')
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE push_subscriptions IS 'Browser push notification subscriptions';
COMMENT ON TABLE aurora_challenges IS 'Photography challenges and competitions';
COMMENT ON TABLE user_badges IS 'Achievement badges for users';
COMMENT ON TABLE aurora_forecasts IS 'AI-powered aurora forecasts';
COMMENT ON TABLE ar_camera_recommendations IS 'AR overlay camera settings by conditions';

COMMENT ON FUNCTION calculate_ai_photo_score IS 'Calculates weighted AI quality score';
COMMENT ON FUNCTION award_badge IS 'Awards achievement badge to user';
COMMENT ON FUNCTION queue_push_notification IS 'Queues push notification for user';
