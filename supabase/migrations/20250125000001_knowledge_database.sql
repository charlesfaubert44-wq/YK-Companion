-- Knowledge Database Schema for Yellowknife
-- Stores facts, stories, and local knowledge with admin review workflow

-- Create knowledge_categories table
CREATE TABLE knowledge_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- emoji or icon name
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Create knowledge_submissions table
CREATE TABLE knowledge_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES knowledge_categories(id) ON DELETE SET NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('fact', 'story', 'tip', 'history', 'culture', 'activity')),

  -- Metadata
  tags TEXT[],
  images TEXT[], -- Array of image URLs
  sources TEXT[], -- Array of source URLs/references
  location_name TEXT, -- e.g., "Old Town", "Frame Lake"
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  season TEXT CHECK (season IN ('winter', 'spring', 'summer', 'fall', 'year-round')),

  -- Submission info
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitter_name TEXT, -- For anonymous/guest submissions
  submitter_email TEXT,

  -- Review workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  rejection_reason TEXT,

  -- Engagement metrics
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  featured_until TIMESTAMP WITH TIME ZONE
);

-- Create knowledge_comments table (for approved submissions)
CREATE TABLE knowledge_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  submission_id UUID REFERENCES knowledge_submissions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  commenter_name TEXT,

  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,

  parent_comment_id UUID REFERENCES knowledge_comments(id) ON DELETE CASCADE
);

-- Create knowledge_likes table (track user likes)
CREATE TABLE knowledge_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  submission_id UUID REFERENCES knowledge_submissions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT, -- For anonymous likes

  UNIQUE(submission_id, user_id),
  UNIQUE(submission_id, ip_address)
);

-- Create indexes for performance
CREATE INDEX idx_knowledge_submissions_status ON knowledge_submissions(status);
CREATE INDEX idx_knowledge_submissions_category ON knowledge_submissions(category_id);
CREATE INDEX idx_knowledge_submissions_type ON knowledge_submissions(content_type);
CREATE INDEX idx_knowledge_submissions_featured ON knowledge_submissions(is_featured, featured_until) WHERE is_featured = true;
CREATE INDEX idx_knowledge_submissions_location ON knowledge_submissions(latitude, longitude) WHERE latitude IS NOT NULL;
CREATE INDEX idx_knowledge_comments_submission ON knowledge_comments(submission_id);
CREATE INDEX idx_knowledge_likes_submission ON knowledge_likes(submission_id);

-- Triggers for updated_at
CREATE TRIGGER update_knowledge_categories_updated_at BEFORE UPDATE ON knowledge_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_submissions_updated_at BEFORE UPDATE ON knowledge_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_comments_updated_at BEFORE UPDATE ON knowledge_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_likes ENABLE ROW LEVEL SECURITY;

-- knowledge_categories policies
CREATE POLICY "Anyone can view active categories" ON knowledge_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON knowledge_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- knowledge_submissions policies
CREATE POLICY "Anyone can view approved submissions" ON knowledge_submissions
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own submissions" ON knowledge_submissions
  FOR SELECT USING (submitted_by = auth.uid());

CREATE POLICY "Anyone can create submissions" ON knowledge_submissions
  FOR INSERT WITH CHECK (true); -- Anyone can submit

CREATE POLICY "Users can update their pending submissions" ON knowledge_submissions
  FOR UPDATE USING (submitted_by = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage all submissions" ON knowledge_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- knowledge_comments policies
CREATE POLICY "Anyone can view approved comments" ON knowledge_comments
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Authenticated users can create comments" ON knowledge_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all comments" ON knowledge_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- knowledge_likes policies
CREATE POLICY "Anyone can view likes count" ON knowledge_likes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can add likes" ON knowledge_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can remove their own likes" ON knowledge_likes
  FOR DELETE USING (user_id = auth.uid() OR ip_address IS NOT NULL);

-- Seed initial categories
INSERT INTO knowledge_categories (name, slug, description, icon, display_order) VALUES
  ('Culture & Heritage', 'culture-heritage', 'Indigenous culture, traditions, and local heritage', '🪶', 1),
  ('Outdoor Activities', 'outdoor-activities', 'Fishing, hunting, hiking, and outdoor adventures', '🎣', 2),
  ('Aurora & Nature', 'aurora-nature', 'Northern Lights, wildlife, and natural wonders', '🌌', 3),
  ('Local History', 'local-history', 'Historical events, stories, and landmarks', '📜', 4),
  ('Food & Dining', 'food-dining', 'Local cuisine, restaurants, and food traditions', '🍴', 5),
  ('Winter Living', 'winter-living', 'Tips for surviving and thriving in -40°C', '❄️', 6),
  ('Community Events', 'community-events', 'Festivals, gatherings, and local celebrations', '🎉', 7),
  ('Hidden Gems', 'hidden-gems', 'Secret spots and local favorites', '💎', 8);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_submission_views(submission_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE knowledge_submissions
  SET views = views + 1
  WHERE id = submission_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update likes count when knowledge_likes changes
CREATE OR REPLACE FUNCTION update_submission_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE knowledge_submissions
    SET likes = likes + 1
    WHERE id = NEW.submission_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE knowledge_submissions
    SET likes = likes - 1
    WHERE id = OLD.submission_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_likes_count
  AFTER INSERT OR DELETE ON knowledge_likes
  FOR EACH ROW EXECUTE FUNCTION update_submission_likes_count();

COMMENT ON TABLE knowledge_categories IS 'Categories for organizing knowledge submissions';
COMMENT ON TABLE knowledge_submissions IS 'User-submitted facts, stories, and local knowledge with admin review';
COMMENT ON TABLE knowledge_comments IS 'Comments on approved knowledge submissions';
COMMENT ON TABLE knowledge_likes IS 'Tracks likes for knowledge submissions';
