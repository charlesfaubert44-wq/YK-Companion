-- =====================================================
-- COMPLETE VISITOR LOGBOOK MIGRATION (SAFE)
-- =====================================================
-- This script safely completes the migration by only
-- creating what doesn't already exist
-- =====================================================

-- Drop and recreate indexes (safe - indexes can be rebuilt)
DROP INDEX IF EXISTS idx_visitor_logbook_user;
DROP INDEX IF EXISTS idx_visitor_logbook_created;
DROP INDEX IF EXISTS idx_visitor_logbook_approved;
DROP INDEX IF EXISTS idx_visitor_logbook_featured;
DROP INDEX IF EXISTS idx_visitor_logbook_visit_date;
DROP INDEX IF EXISTS idx_visitor_logbook_rating;
DROP INDEX IF EXISTS idx_visitor_logbook_experience;
DROP INDEX IF EXISTS idx_visitor_logbook_likes_entry;
DROP INDEX IF EXISTS idx_visitor_logbook_likes_user;

-- Recreate indexes
CREATE INDEX idx_visitor_logbook_user ON visitor_logbook(user_id);
CREATE INDEX idx_visitor_logbook_created ON visitor_logbook(created_at DESC);
CREATE INDEX idx_visitor_logbook_approved ON visitor_logbook(is_approved, is_active) WHERE is_approved = true AND is_active = true;
CREATE INDEX idx_visitor_logbook_featured ON visitor_logbook(is_featured, is_active) WHERE is_featured = true AND is_active = true;
CREATE INDEX idx_visitor_logbook_visit_date ON visitor_logbook(visit_date DESC);
CREATE INDEX idx_visitor_logbook_rating ON visitor_logbook(rating DESC) WHERE rating IS NOT NULL;
CREATE INDEX idx_visitor_logbook_experience ON visitor_logbook USING GIN(experience_type);
CREATE INDEX idx_visitor_logbook_likes_entry ON visitor_logbook_likes(entry_id);
CREATE INDEX idx_visitor_logbook_likes_user ON visitor_logbook_likes(user_id);

-- Recreate functions and triggers
DROP TRIGGER IF EXISTS trigger_visitor_logbook_updated_at ON visitor_logbook;
DROP TRIGGER IF EXISTS trigger_increment_logbook_likes ON visitor_logbook_likes;
DROP TRIGGER IF EXISTS trigger_decrement_logbook_likes ON visitor_logbook_likes;
DROP FUNCTION IF EXISTS update_visitor_logbook_updated_at();
DROP FUNCTION IF EXISTS increment_logbook_likes();
DROP FUNCTION IF EXISTS decrement_logbook_likes();

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

-- Enable RLS (safe - won't error if already enabled)
ALTER TABLE visitor_logbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_logbook_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe)
DROP POLICY IF EXISTS "Anyone can view approved entries" ON visitor_logbook;
DROP POLICY IF EXISTS "Users can view own entries" ON visitor_logbook;
DROP POLICY IF EXISTS "Authenticated users can create entries" ON visitor_logbook;
DROP POLICY IF EXISTS "Users can update own entries" ON visitor_logbook;
DROP POLICY IF EXISTS "Users can delete own entries" ON visitor_logbook;
DROP POLICY IF EXISTS "Admins can manage all entries" ON visitor_logbook;
DROP POLICY IF EXISTS "Anyone can view likes" ON visitor_logbook_likes;
DROP POLICY IF EXISTS "Authenticated users can like" ON visitor_logbook_likes;
DROP POLICY IF EXISTS "Users can unlike" ON visitor_logbook_likes;

-- Recreate RLS policies
CREATE POLICY "Anyone can view approved entries" ON visitor_logbook
  FOR SELECT
  USING (is_approved = true AND is_active = true);

CREATE POLICY "Users can view own entries" ON visitor_logbook
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can create entries" ON visitor_logbook
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update own entries" ON visitor_logbook
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own entries" ON visitor_logbook
  FOR UPDATE
  USING (user_id = auth.uid() AND is_active = true)
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all entries" ON visitor_logbook
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Anyone can view likes" ON visitor_logbook_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like" ON visitor_logbook_likes
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can unlike" ON visitor_logbook_likes
  FOR DELETE
  USING (user_id = auth.uid());

-- Add table comments
COMMENT ON TABLE visitor_logbook IS 'Visitor logbook entries with photos and messages from YK visitors';
COMMENT ON TABLE visitor_logbook_likes IS 'Like/heart functionality for visitor logbook entries';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Visitor logbook migration completed successfully!';
END $$;
