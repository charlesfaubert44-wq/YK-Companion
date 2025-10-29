-- Migration: Add Profile & Saved Items Features
-- Created: 2025-10-29
-- Description: Adds avatar storage, favorites/saved items functionality

-- =====================================================
-- 1. CREATE STORAGE BUCKET FOR AVATARS
-- =====================================================

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for avatars
-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to avatars
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- 2. ADD AVATAR_URL TO PROFILES TABLE
-- =====================================================

-- Add avatar_url column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- =====================================================
-- 3. CREATE SAVED_FAVORITES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS saved_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('garage-sales', 'articles', 'events', 'businesses')),
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure user can't save the same item twice
  UNIQUE(user_id, item_type, item_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_favorites_user_id ON saved_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_favorites_item_type ON saved_favorites(item_type);
CREATE INDEX IF NOT EXISTS idx_saved_favorites_item_id ON saved_favorites(item_id);
CREATE INDEX IF NOT EXISTS idx_saved_favorites_created_at ON saved_favorites(created_at DESC);

-- Add RLS policies for saved_favorites
ALTER TABLE saved_favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved items
CREATE POLICY "Users can view their own favorites"
ON saved_favorites FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can add their own favorites
CREATE POLICY "Users can add their own favorites"
ON saved_favorites FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
ON saved_favorites FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- 4. ADD SAVE_COUNT TO GARAGE_SALES TABLE
-- =====================================================

-- Add save_count column for denormalized count (optional performance optimization)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'garage_sales' AND column_name = 'save_count'
  ) THEN
    ALTER TABLE garage_sales ADD COLUMN save_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- =====================================================
-- 5. CREATE TRIGGER TO UPDATE SAVE_COUNT
-- =====================================================

-- Function to update save count when favorite is added/removed
CREATE OR REPLACE FUNCTION update_garage_sale_save_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.item_type = 'garage-sales' THEN
    UPDATE garage_sales 
    SET save_count = COALESCE(save_count, 0) + 1
    WHERE id = NEW.item_id;
  ELSIF TG_OP = 'DELETE' AND OLD.item_type = 'garage-sales' THEN
    UPDATE garage_sales 
    SET save_count = GREATEST(COALESCE(save_count, 0) - 1, 0)
    WHERE id = OLD.item_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_garage_sale_save_count ON saved_favorites;
CREATE TRIGGER trigger_update_garage_sale_save_count
AFTER INSERT OR DELETE ON saved_favorites
FOR EACH ROW
EXECUTE FUNCTION update_garage_sale_save_count();

-- =====================================================
-- 6. CREATE VIEW FOR USER'S SUBMISSIONS
-- =====================================================

CREATE OR REPLACE VIEW user_garage_sale_submissions AS
SELECT 
  gs.*,
  p.full_name as host_name,
  p.email as host_email
FROM garage_sales gs
LEFT JOIN profiles p ON gs.user_id = p.id
ORDER BY gs.created_at DESC;

-- Grant access to authenticated users
GRANT SELECT ON user_garage_sale_submissions TO authenticated;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE saved_favorites IS 'Stores user favorite/saved items across different content types';
COMMENT ON COLUMN saved_favorites.item_type IS 'Type of saved item: garage-sales, articles, events, businesses';
COMMENT ON COLUMN saved_favorites.item_id IS 'UUID of the saved item';
COMMENT ON COLUMN profiles.avatar_url IS 'Public URL to user avatar image in storage bucket';
COMMENT ON COLUMN garage_sales.save_count IS 'Denormalized count of how many users saved this garage sale';

