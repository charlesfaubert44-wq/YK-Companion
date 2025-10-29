-- Neighborhood System Migration
-- This migration creates the complete neighborhood feature set including:
-- - Neighborhoods definition
-- - Member management with approval workflow
-- - Bulletin board for community posts
-- - Security alerts system
-- - Local business directory
-- - RCMP complaint tracking
-- - Local politics discussions

-- =====================================================
-- 1. NEIGHBORHOODS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  streets TEXT[] NOT NULL, -- Array of street names that belong to this neighborhood
  boundary_geojson JSONB, -- GeoJSON polygon for map display
  is_active BOOLEAN DEFAULT true,
  requires_approval BOOLEAN DEFAULT true,
  max_members INTEGER, -- Optional limit on neighborhood size
  admin_user_ids UUID[] DEFAULT '{}', -- Users who can moderate this neighborhood
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_neighborhoods_slug ON neighborhoods(slug);
CREATE INDEX idx_neighborhoods_is_active ON neighborhoods(is_active);

-- =====================================================
-- 2. NEIGHBORHOOD MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS neighborhood_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),

  -- Request information
  requested_at TIMESTAMPTZ DEFAULT now(),
  request_reason TEXT,
  provided_address TEXT,

  -- Approval workflow
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  rejection_reason TEXT,

  -- Activity tracking
  last_active_at TIMESTAMPTZ,
  posts_count INTEGER DEFAULT 0,
  alerts_count INTEGER DEFAULT 0,

  -- Settings
  email_notifications BOOLEAN DEFAULT true,
  notification_preferences JSONB DEFAULT '{"alerts": true, "bulletins": true, "events": true, "businesses": true}',

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(neighborhood_id, user_id)
);

CREATE INDEX idx_neighborhood_members_neighborhood_id ON neighborhood_members(neighborhood_id);
CREATE INDEX idx_neighborhood_members_user_id ON neighborhood_members(user_id);
CREATE INDEX idx_neighborhood_members_status ON neighborhood_members(status);
CREATE INDEX idx_neighborhood_members_role ON neighborhood_members(role);

-- =====================================================
-- 3. NEIGHBORHOOD POSTS (BULLETIN BOARD)
-- =====================================================
CREATE TABLE IF NOT EXISTS neighborhood_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Post content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('help_offered', 'help_needed', 'event', 'announcement', 'lost_found', 'recommendation', 'question', 'other')),
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',

  -- Engagement
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,

  -- Moderation
  is_pinned BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  moderation_status TEXT DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'removed')),
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMPTZ,
  moderation_notes TEXT,

  -- Expiry for time-sensitive posts
  expires_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_neighborhood_posts_neighborhood_id ON neighborhood_posts(neighborhood_id);
CREATE INDEX idx_neighborhood_posts_user_id ON neighborhood_posts(user_id);
CREATE INDEX idx_neighborhood_posts_category ON neighborhood_posts(category);
CREATE INDEX idx_neighborhood_posts_created_at ON neighborhood_posts(created_at DESC);
CREATE INDEX idx_neighborhood_posts_moderation_status ON neighborhood_posts(moderation_status);

-- =====================================================
-- 4. POST COMMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS neighborhood_post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES neighborhood_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES neighborhood_post_comments(id) ON DELETE CASCADE,

  likes_count INTEGER DEFAULT 0,

  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_neighborhood_post_comments_post_id ON neighborhood_post_comments(post_id);
CREATE INDEX idx_neighborhood_post_comments_user_id ON neighborhood_post_comments(user_id);
CREATE INDEX idx_neighborhood_post_comments_parent_id ON neighborhood_post_comments(parent_comment_id);

-- =====================================================
-- 5. NEIGHBORHOOD ALERTS (SECURITY & COMMUNITY)
-- =====================================================
CREATE TABLE IF NOT EXISTS neighborhood_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Alert details
  alert_type TEXT NOT NULL CHECK (alert_type IN ('security', 'suspicious_activity', 'crime', 'emergency', 'weather', 'utility', 'wildlife', 'traffic', 'other')),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Location
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Media
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  camera_feed_urls TEXT[] DEFAULT '{}',

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'investigating', 'false_alarm')),
  resolution_notes TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,

  -- Engagement
  views_count INTEGER DEFAULT 0,
  upvotes_count INTEGER DEFAULT 0, -- Community can upvote to indicate they've seen similar activity
  comments_count INTEGER DEFAULT 0,

  -- Moderation
  is_verified BOOLEAN DEFAULT false, -- Moderator verification
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,

  -- Email notification tracking
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  email_recipients_count INTEGER DEFAULT 0,

  expires_at TIMESTAMPTZ, -- Auto-archive old alerts

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_neighborhood_alerts_neighborhood_id ON neighborhood_alerts(neighborhood_id);
CREATE INDEX idx_neighborhood_alerts_user_id ON neighborhood_alerts(user_id);
CREATE INDEX idx_neighborhood_alerts_type ON neighborhood_alerts(alert_type);
CREATE INDEX idx_neighborhood_alerts_severity ON neighborhood_alerts(severity);
CREATE INDEX idx_neighborhood_alerts_status ON neighborhood_alerts(status);
CREATE INDEX idx_neighborhood_alerts_created_at ON neighborhood_alerts(created_at DESC);

-- =====================================================
-- 6. LOCAL BUSINESS DIRECTORY
-- =====================================================
CREATE TABLE IF NOT EXISTS neighborhood_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES auth.users(id),

  -- Business information
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('restaurant', 'retail', 'service', 'health', 'education', 'entertainment', 'professional', 'trades', 'other')),
  subcategory TEXT,

  -- Contact
  phone TEXT,
  email TEXT,
  website TEXT,

  -- Location
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Details
  hours_of_operation JSONB, -- {monday: "9am-5pm", ...}
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  logo_url TEXT,

  -- Engagement
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,

  -- Status
  is_verified BOOLEAN DEFAULT false, -- Business owner verification
  verification_date TIMESTAMPTZ,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,

  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_neighborhood_businesses_neighborhood_id ON neighborhood_businesses(neighborhood_id);
CREATE INDEX idx_neighborhood_businesses_category ON neighborhood_businesses(category);
CREATE INDEX idx_neighborhood_businesses_is_approved ON neighborhood_businesses(is_approved);
CREATE INDEX idx_neighborhood_businesses_is_active ON neighborhood_businesses(is_active);

-- =====================================================
-- 7. RCMP COMPLAINTS
-- =====================================================
CREATE TABLE IF NOT EXISTS rcmp_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id UUID REFERENCES neighborhoods(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Complaint details
  incident_type TEXT NOT NULL CHECK (incident_type IN ('theft', 'vandalism', 'assault', 'break_in', 'suspicious_activity', 'noise', 'traffic', 'drug_activity', 'fraud', 'harassment', 'other')),
  incident_date TIMESTAMPTZ NOT NULL,
  incident_time TEXT,

  -- Location
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Description
  description TEXT NOT NULL,
  suspect_description TEXT,
  vehicle_description TEXT,
  witness_info TEXT,

  -- Attachments
  evidence_images TEXT[] DEFAULT '{}',
  evidence_videos TEXT[] DEFAULT '{}',
  evidence_documents TEXT[] DEFAULT '{}',

  -- Complainant info (optional for privacy)
  complainant_name TEXT,
  complainant_phone TEXT,
  complainant_email TEXT,
  is_anonymous BOOLEAN DEFAULT false,

  -- Status tracking
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'acknowledged', 'investigating', 'resolved', 'closed')),
  rcmp_file_number TEXT,
  rcmp_response TEXT,

  -- Email tracking
  email_sent_to_rcmp BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  rcmp_email TEXT DEFAULT 'yellowknife@rcmp-grc.gc.ca',

  -- Follow-ups
  follow_up_notes TEXT,
  last_followed_up_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rcmp_complaints_neighborhood_id ON rcmp_complaints(neighborhood_id);
CREATE INDEX idx_rcmp_complaints_user_id ON rcmp_complaints(user_id);
CREATE INDEX idx_rcmp_complaints_incident_type ON rcmp_complaints(incident_type);
CREATE INDEX idx_rcmp_complaints_status ON rcmp_complaints(status);
CREATE INDEX idx_rcmp_complaints_incident_date ON rcmp_complaints(incident_date DESC);

-- =====================================================
-- 8. LOCAL POLITICS DISCUSSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS neighborhood_politics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Topic details
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  topic_type TEXT NOT NULL CHECK (topic_type IN ('city_council', 'mla_update', 'development', 'infrastructure', 'bylaw', 'petition', 'meeting', 'vote', 'other')),
  tags TEXT[] DEFAULT '{}',

  -- Related officials/meetings
  related_officials TEXT[], -- MLA, councillor names
  meeting_date TIMESTAMPTZ,
  meeting_agenda_url TEXT,

  -- Attachments
  documents TEXT[] DEFAULT '{}',
  links TEXT[] DEFAULT '{}',

  -- Engagement
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,

  -- Moderation (politics can get heated)
  is_locked BOOLEAN DEFAULT false, -- Lock comments if discussion gets uncivil
  locked_by UUID REFERENCES auth.users(id),
  locked_at TIMESTAMPTZ,
  lock_reason TEXT,

  is_pinned BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_neighborhood_politics_neighborhood_id ON neighborhood_politics(neighborhood_id);
CREATE INDEX idx_neighborhood_politics_user_id ON neighborhood_politics(user_id);
CREATE INDEX idx_neighborhood_politics_topic_type ON neighborhood_politics(topic_type);
CREATE INDEX idx_neighborhood_politics_created_at ON neighborhood_politics(created_at DESC);

-- =====================================================
-- 9. TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_neighborhoods_updated_at BEFORE UPDATE ON neighborhoods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_neighborhood_members_updated_at BEFORE UPDATE ON neighborhood_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_neighborhood_posts_updated_at BEFORE UPDATE ON neighborhood_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_neighborhood_alerts_updated_at BEFORE UPDATE ON neighborhood_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_neighborhood_businesses_updated_at BEFORE UPDATE ON neighborhood_businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rcmp_complaints_updated_at BEFORE UPDATE ON rcmp_complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_neighborhood_politics_updated_at BEFORE UPDATE ON neighborhood_politics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhood_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhood_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhood_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhood_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhood_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcmp_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhood_politics ENABLE ROW LEVEL SECURITY;

-- Neighborhoods: Public read for active neighborhoods
CREATE POLICY "Anyone can view active neighborhoods"
  ON neighborhoods FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage neighborhoods"
  ON neighborhoods FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Neighborhood Members: Users can view their own membership and approved members in their neighborhoods
CREATE POLICY "Users can view their own membership"
  ON neighborhood_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view approved members in their neighborhoods"
  ON neighborhood_members FOR SELECT
  USING (
    status = 'approved' AND
    neighborhood_id IN (
      SELECT neighborhood_id FROM neighborhood_members
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Users can request to join neighborhoods"
  ON neighborhood_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins and neighborhood moderators can manage members"
  ON neighborhood_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
    OR
    EXISTS (
      SELECT 1 FROM neighborhood_members nm
      WHERE nm.user_id = auth.uid()
      AND nm.neighborhood_id = neighborhood_members.neighborhood_id
      AND nm.role IN ('admin', 'moderator')
      AND nm.status = 'approved'
    )
  );

-- Neighborhood Posts: Approved members can view and create
CREATE POLICY "Approved members can view posts in their neighborhoods"
  ON neighborhood_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_posts.neighborhood_id
      AND neighborhood_members.status = 'approved'
    )
  );

CREATE POLICY "Approved members can create posts"
  ON neighborhood_posts FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_posts.neighborhood_id
      AND neighborhood_members.status = 'approved'
    )
  );

CREATE POLICY "Users can update their own posts"
  ON neighborhood_posts FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Moderators can manage posts"
  ON neighborhood_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_posts.neighborhood_id
      AND neighborhood_members.role IN ('admin', 'moderator')
      AND neighborhood_members.status = 'approved'
    )
  );

-- Comments: Similar to posts
CREATE POLICY "Approved members can view comments"
  ON neighborhood_post_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM neighborhood_posts np
      JOIN neighborhood_members nm ON nm.neighborhood_id = np.neighborhood_id
      WHERE np.id = neighborhood_post_comments.post_id
      AND nm.user_id = auth.uid()
      AND nm.status = 'approved'
    )
  );

CREATE POLICY "Approved members can create comments"
  ON neighborhood_post_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM neighborhood_posts np
      JOIN neighborhood_members nm ON nm.neighborhood_id = np.neighborhood_id
      WHERE np.id = neighborhood_post_comments.post_id
      AND nm.user_id = auth.uid()
      AND nm.status = 'approved'
    )
  );

CREATE POLICY "Users can update their own comments"
  ON neighborhood_post_comments FOR UPDATE
  USING (user_id = auth.uid());

-- Alerts: Approved members can view and create
CREATE POLICY "Approved members can view alerts"
  ON neighborhood_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_alerts.neighborhood_id
      AND neighborhood_members.status = 'approved'
    )
  );

CREATE POLICY "Approved members can create alerts"
  ON neighborhood_alerts FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_alerts.neighborhood_id
      AND neighborhood_members.status = 'approved'
    )
  );

CREATE POLICY "Users can update their own alerts"
  ON neighborhood_alerts FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Moderators can manage alerts"
  ON neighborhood_alerts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_alerts.neighborhood_id
      AND neighborhood_members.role IN ('admin', 'moderator')
      AND neighborhood_members.status = 'approved'
    )
  );

-- Businesses: Approved members can view, submit
CREATE POLICY "Approved members can view businesses"
  ON neighborhood_businesses FOR SELECT
  USING (
    is_approved = true OR
    submitted_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_businesses.neighborhood_id
      AND neighborhood_members.status = 'approved'
    )
  );

CREATE POLICY "Approved members can submit businesses"
  ON neighborhood_businesses FOR INSERT
  WITH CHECK (
    submitted_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_businesses.neighborhood_id
      AND neighborhood_members.status = 'approved'
    )
  );

CREATE POLICY "Users can update their own business submissions"
  ON neighborhood_businesses FOR UPDATE
  USING (submitted_by = auth.uid());

CREATE POLICY "Moderators can manage businesses"
  ON neighborhood_businesses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_businesses.neighborhood_id
      AND neighborhood_members.role IN ('admin', 'moderator')
      AND neighborhood_members.status = 'approved'
    )
  );

-- RCMP Complaints: Users can view their own
CREATE POLICY "Users can view their own complaints"
  ON rcmp_complaints FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all complaints"
  ON rcmp_complaints FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Users can create complaints"
  ON rcmp_complaints FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own complaints"
  ON rcmp_complaints FOR UPDATE
  USING (user_id = auth.uid());

-- Politics: Approved members can view and create
CREATE POLICY "Approved members can view politics discussions"
  ON neighborhood_politics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_politics.neighborhood_id
      AND neighborhood_members.status = 'approved'
    )
  );

CREATE POLICY "Approved members can create politics posts"
  ON neighborhood_politics FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_politics.neighborhood_id
      AND neighborhood_members.status = 'approved'
    )
  );

CREATE POLICY "Users can update their own politics posts"
  ON neighborhood_politics FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Moderators can manage politics posts"
  ON neighborhood_politics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE neighborhood_members.user_id = auth.uid()
      AND neighborhood_members.neighborhood_id = neighborhood_politics.neighborhood_id
      AND neighborhood_members.role IN ('admin', 'moderator')
      AND neighborhood_members.status = 'approved'
    )
  );

-- =====================================================
-- 11. SEED DATA - Initial Neighborhoods
-- =====================================================

-- Con Place / Con Road Neighborhood
INSERT INTO neighborhoods (name, slug, description, streets, is_active, requires_approval)
VALUES (
  'Con Place / Con Road',
  'con-place-con-road',
  'A vibrant community in the heart of Yellowknife, connecting neighbors on Con Place and Con Road.',
  ARRAY['Con Place', 'Con Road', 'Con Ave', 'Con Avenue'],
  true,
  true
);

-- Rycon Place Neighborhood
INSERT INTO neighborhoods (name, slug, description, streets, is_active, requires_approval)
VALUES (
  'Rycon Place',
  'rycon-place',
  'A close-knit neighborhood fostering community connections on Rycon Place.',
  ARRAY['Rycon Place', 'Rycon Pl'],
  true,
  true
);

-- =====================================================
-- 12. FUNCTIONS FOR HELPER OPERATIONS
-- =====================================================

-- Function to check if user is a neighborhood member
CREATE OR REPLACE FUNCTION is_neighborhood_member(p_user_id UUID, p_neighborhood_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM neighborhood_members
    WHERE user_id = p_user_id
    AND neighborhood_id = p_neighborhood_id
    AND status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a neighborhood moderator
CREATE OR REPLACE FUNCTION is_neighborhood_moderator(p_user_id UUID, p_neighborhood_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM neighborhood_members
    WHERE user_id = p_user_id
    AND neighborhood_id = p_neighborhood_id
    AND role IN ('admin', 'moderator')
    AND status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-match user to neighborhood based on address
CREATE OR REPLACE FUNCTION suggest_neighborhood_from_address(p_address TEXT)
RETURNS TABLE(neighborhood_id UUID, neighborhood_name TEXT, confidence TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    n.id,
    n.name,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM unnest(n.streets) AS street
        WHERE LOWER(p_address) LIKE LOWER('%' || street || '%')
      ) THEN 'high'
      ELSE 'low'
    END AS confidence
  FROM neighborhoods n
  WHERE n.is_active = true
  AND EXISTS (
    SELECT 1 FROM unnest(n.streets) AS street
    WHERE LOWER(p_address) LIKE LOWER('%' || street || '%')
  )
  ORDER BY confidence DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- This migration creates a comprehensive neighborhood system with:
-- ✓ Neighborhood definitions (Con Place/Road, Rycon Place)
-- ✓ Member management with approval workflow
-- ✓ Community bulletin board
-- ✓ Security alerts with email notifications
-- ✓ Local business directory
-- ✓ RCMP complaint generator
-- ✓ Local politics discussions
-- ✓ Complete RLS policies for security
-- ✓ Helper functions for common operations
