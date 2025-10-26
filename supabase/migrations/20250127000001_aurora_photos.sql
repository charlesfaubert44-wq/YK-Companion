-- Create aurora_photos table
CREATE TABLE IF NOT EXISTS aurora_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- User information
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Photo details
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Photo metadata
  taken_at TIMESTAMP WITH TIME ZONE,
  camera_settings JSONB, -- ISO, aperture, shutter speed, etc.

  -- AI scoring
  ai_score DECIMAL(3, 2), -- 0-10 score
  ai_analysis JSONB, -- detailed AI analysis results

  -- Engagement metrics
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,

  -- Moderation
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  moderation_notes TEXT,

  -- Challenge participation
  challenge_id UUID,

  is_active BOOLEAN DEFAULT true
);

-- Create aurora_photo_likes table
CREATE TABLE IF NOT EXISTS aurora_photo_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  photo_id UUID REFERENCES aurora_photos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  UNIQUE(photo_id, user_id)
);

-- Create aurora_forecasts table
CREATE TABLE IF NOT EXISTS aurora_forecasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  forecast_date DATE NOT NULL UNIQUE,
  kp_index DECIMAL(2, 1), -- 0-9 scale
  visibility_score INTEGER, -- 0-100 scale
  cloud_cover INTEGER, -- 0-100 percentage
  weather_conditions TEXT,
  best_viewing_time TIME,
  forecast_data JSONB, -- raw forecast data

  is_active BOOLEAN DEFAULT true
);

-- Create aurora_challenges table
CREATE TABLE IF NOT EXISTS aurora_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Challenge rules
  rules JSONB,
  prize_description TEXT,

  is_active BOOLEAN DEFAULT true
);

-- Create email_digest_subscriptions table
CREATE TABLE IF NOT EXISTS email_digest_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,

  -- Subscription preferences
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  is_active BOOLEAN DEFAULT true,

  -- Tracking
  last_sent_at TIMESTAMP WITH TIME ZONE,
  unsubscribe_token UUID DEFAULT gen_random_uuid() UNIQUE
);

-- Create push_notification_subscriptions table
CREATE TABLE IF NOT EXISTS push_notification_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Push subscription data
  endpoint TEXT NOT NULL UNIQUE,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,

  -- Preferences
  alert_high_kp BOOLEAN DEFAULT true,
  alert_new_photos BOOLEAN DEFAULT false,
  alert_challenges BOOLEAN DEFAULT true,

  is_active BOOLEAN DEFAULT true
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL, -- 'first_photo', 'high_scorer', 'challenge_winner', etc.
  badge_data JSONB,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  UNIQUE(user_id, badge_type)
);

-- Create indexes
CREATE INDEX idx_aurora_photos_user ON aurora_photos(user_id, created_at DESC);
CREATE INDEX idx_aurora_photos_approved ON aurora_photos(is_approved, is_featured, created_at DESC);
CREATE INDEX idx_aurora_photos_challenge ON aurora_photos(challenge_id, created_at DESC);
CREATE INDEX idx_aurora_photo_likes_user ON aurora_photo_likes(user_id);
CREATE INDEX idx_aurora_photo_likes_photo ON aurora_photo_likes(photo_id);
CREATE INDEX idx_aurora_forecasts_date ON aurora_forecasts(forecast_date DESC);
CREATE INDEX idx_aurora_challenges_dates ON aurora_challenges(start_date, end_date);
CREATE INDEX idx_email_subscriptions_user ON email_digest_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_user ON push_notification_subscriptions(user_id);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_aurora_photos_updated_at BEFORE UPDATE ON aurora_photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aurora_challenges_updated_at BEFORE UPDATE ON aurora_challenges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_digest_subscriptions_updated_at BEFORE UPDATE ON email_digest_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_push_notification_subscriptions_updated_at BEFORE UPDATE ON push_notification_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update likes_count when a like is added/removed
CREATE OR REPLACE FUNCTION update_photo_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE aurora_photos
    SET likes_count = likes_count + 1
    WHERE id = NEW.photo_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE aurora_photos
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.photo_id;
    RETURN OLD;
  END IF;
END;
$$ language 'plpgsql';

CREATE TRIGGER aurora_photo_likes_count_trigger
AFTER INSERT OR DELETE ON aurora_photo_likes
FOR EACH ROW EXECUTE FUNCTION update_photo_likes_count();

-- RLS Policies
ALTER TABLE aurora_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aurora_photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE aurora_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE aurora_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_digest_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notification_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Aurora photos policies
CREATE POLICY "Anyone can view approved photos" ON aurora_photos
    FOR SELECT USING (is_approved = true AND is_active = true);

CREATE POLICY "Users can view their own photos" ON aurora_photos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can upload photos" ON aurora_photos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" ON aurora_photos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" ON aurora_photos
    FOR DELETE USING (auth.uid() = user_id);

-- Photo likes policies
CREATE POLICY "Anyone can view likes" ON aurora_photo_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can like photos" ON aurora_photo_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike photos" ON aurora_photo_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Forecasts policies
CREATE POLICY "Anyone can view active forecasts" ON aurora_forecasts
    FOR SELECT USING (is_active = true);

-- Challenges policies
CREATE POLICY "Anyone can view active challenges" ON aurora_challenges
    FOR SELECT USING (is_active = true);

-- Email subscriptions policies
CREATE POLICY "Users can manage their own email subscriptions" ON email_digest_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Push subscriptions policies
CREATE POLICY "Users can manage their own push subscriptions" ON push_notification_subscriptions
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Badges policies
CREATE POLICY "Users can view their own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view all badges" ON user_badges
    FOR SELECT USING (true);
