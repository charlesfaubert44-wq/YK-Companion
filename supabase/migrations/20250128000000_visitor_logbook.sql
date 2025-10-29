-- =====================================================
-- VISITOR LOGBOOK FEATURE
-- =====================================================
-- This migration creates a beautiful visitor logbook system
-- where visitors can share photos and messages from their YK experience
-- =====================================================

-- Create visitor_logbook table
CREATE TABLE IF NOT EXISTS visitor_logbook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- User info (denormalized for display even if profile changes)
  visitor_name TEXT NOT NULL,
  visitor_location TEXT, -- Where they're from (e.g., "Toronto, ON")

  -- Entry content
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 100),
  message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 2000),

  -- Photos
  photos TEXT[] DEFAULT '{}', -- Array of Supabase Storage URLs
  featured_photo TEXT, -- Main photo to display in cards

  -- Visit details
  visit_date DATE NOT NULL,
  visit_duration TEXT, -- e.g., "3 days", "1 week", "2 months"

  -- Categorization
  experience_type TEXT[] DEFAULT '{}', -- e.g., ['aurora', 'hiking', 'culture', 'food']
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Overall experience rating

  -- Engagement metrics
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,

  -- Moderation
  is_approved BOOLEAN DEFAULT false, -- Requires admin approval
  is_featured BOOLEAN DEFAULT false, -- Featured on homepage
  is_active BOOLEAN DEFAULT true, -- Soft delete
  moderation_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create visitor_logbook_likes table for like functionality
CREATE TABLE IF NOT EXISTS visitor_logbook_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID REFERENCES visitor_logbook(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- Ensure one like per user per entry
  UNIQUE(entry_id, user_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Performance indexes
CREATE INDEX idx_visitor_logbook_user ON visitor_logbook(user_id);
CREATE INDEX idx_visitor_logbook_created ON visitor_logbook(created_at DESC);
CREATE INDEX idx_visitor_logbook_approved ON visitor_logbook(is_approved, is_active) WHERE is_approved = true AND is_active = true;
CREATE INDEX idx_visitor_logbook_featured ON visitor_logbook(is_featured, is_active) WHERE is_featured = true AND is_active = true;
CREATE INDEX idx_visitor_logbook_visit_date ON visitor_logbook(visit_date DESC);
CREATE INDEX idx_visitor_logbook_rating ON visitor_logbook(rating DESC) WHERE rating IS NOT NULL;
CREATE INDEX idx_visitor_logbook_experience ON visitor_logbook USING GIN(experience_type);

CREATE INDEX idx_visitor_logbook_likes_entry ON visitor_logbook_likes(entry_id);
CREATE INDEX idx_visitor_logbook_likes_user ON visitor_logbook_likes(user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_visitor_logbook_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_visitor_logbook_updated_at
  BEFORE UPDATE ON visitor_logbook
  FOR EACH ROW
  EXECUTE FUNCTION update_visitor_logbook_updated_at();

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_logbook_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE visitor_logbook
  SET likes_count = likes_count + 1
  WHERE id = NEW.entry_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement likes count
CREATE OR REPLACE FUNCTION decrement_logbook_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE visitor_logbook
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = OLD.entry_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers for like count management
CREATE TRIGGER trigger_increment_logbook_likes
  AFTER INSERT ON visitor_logbook_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_logbook_likes();

CREATE TRIGGER trigger_decrement_logbook_likes
  AFTER DELETE ON visitor_logbook_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_logbook_likes();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE visitor_logbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_logbook_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved and active entries
CREATE POLICY "Anyone can view approved entries" ON visitor_logbook
  FOR SELECT
  USING (is_approved = true AND is_active = true);

-- Users can view their own entries (even if not approved)
CREATE POLICY "Users can view own entries" ON visitor_logbook
  FOR SELECT
  USING (user_id = auth.uid());

-- Authenticated users can create entries
CREATE POLICY "Authenticated users can create entries" ON visitor_logbook
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can update their own entries
CREATE POLICY "Users can update own entries" ON visitor_logbook
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can soft-delete their own entries
CREATE POLICY "Users can delete own entries" ON visitor_logbook
  FOR UPDATE
  USING (user_id = auth.uid() AND is_active = true)
  WITH CHECK (user_id = auth.uid());

-- Admins can manage all entries
CREATE POLICY "Admins can manage all entries" ON visitor_logbook
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Anyone can view likes
CREATE POLICY "Anyone can view likes" ON visitor_logbook_likes
  FOR SELECT
  USING (true);

-- Authenticated users can like entries
CREATE POLICY "Authenticated users can like" ON visitor_logbook_likes
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can unlike entries
CREATE POLICY "Users can unlike" ON visitor_logbook_likes
  FOR DELETE
  USING (user_id = auth.uid());

-- =====================================================
-- STORAGE BUCKET SETUP INSTRUCTIONS
-- =====================================================

-- NOTE: Storage buckets must be created manually in Supabase Dashboard
--
-- Bucket name: visitor-logbook-photos
-- Public: Yes
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/heic
--
-- RLS Policies for Storage (run in Supabase SQL Editor):
--
-- -- Anyone can view photos
-- CREATE POLICY "Public Access"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'visitor-logbook-photos');
--
-- -- Authenticated users can upload photos
-- CREATE POLICY "Authenticated Upload"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'visitor-logbook-photos'
--     AND auth.uid() = owner
--   );
--
-- -- Users can delete their own photos
-- CREATE POLICY "Users Delete Own Photos"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'visitor-logbook-photos'
--     AND auth.uid() = owner
--   );

-- =====================================================
-- SAMPLE DATA (for testing)
-- =====================================================

-- Insert sample entries (uncomment for development)
-- INSERT INTO visitor_logbook (
--   user_id,
--   visitor_name,
--   visitor_location,
--   title,
--   message,
--   visit_date,
--   visit_duration,
--   experience_type,
--   rating,
--   is_approved,
--   is_featured
-- ) VALUES
--   (
--     auth.uid(),
--     'Sarah Johnson',
--     'Vancouver, BC',
--     'Amazing Northern Lights!',
--     'I came to Yellowknife specifically to see the aurora borealis and it exceeded all expectations! We saw them every night for a week. The locals were incredibly friendly and helpful. Would definitely come back!',
--     '2025-01-15',
--     '1 week',
--     ARRAY['aurora', 'culture'],
--     5,
--     true,
--     true
--   );

COMMENT ON TABLE visitor_logbook IS 'Visitor logbook entries with photos and messages from YK visitors';
COMMENT ON TABLE visitor_logbook_likes IS 'Like/heart functionality for visitor logbook entries';
