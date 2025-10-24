-- Admin System Tables Migration
-- Creates tables for: profiles, garage_sales, user_permissions, admin_activity_log, site_settings

-- ============================================
-- PROFILES TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  email TEXT NOT NULL,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('visiting', 'living', 'moving')),
  is_admin BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- ============================================
-- GARAGE SALES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS garage_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Basic information
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,

  -- Location
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Dates and times
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Contact
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,

  -- User and moderation
  posted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'flagged')),
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,

  -- Admin notes
  admin_notes TEXT,
  rejection_reason TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false
);

-- ============================================
-- USER PERMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Permission levels
  is_super_admin BOOLEAN DEFAULT false,
  can_manage_users BOOLEAN DEFAULT false,
  can_manage_sponsors BOOLEAN DEFAULT false,
  can_manage_content BOOLEAN DEFAULT false,
  can_manage_garage_sales BOOLEAN DEFAULT false,
  can_view_analytics BOOLEAN DEFAULT false,
  can_manage_settings BOOLEAN DEFAULT false,

  -- Metadata
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT
);

-- ============================================
-- ADMIN ACTIVITY LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Who did what
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  admin_email TEXT,
  action TEXT NOT NULL,

  -- What entity was affected
  entity_type TEXT,
  entity_id UUID,
  entity_name TEXT,

  -- Additional details
  details JSONB,
  ip_address TEXT,
  user_agent TEXT
);

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- ============================================
-- INDEXES
-- ============================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- Garage sales indexes
CREATE INDEX IF NOT EXISTS idx_garage_sales_dates ON garage_sales(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_garage_sales_approval_status ON garage_sales(approval_status);
CREATE INDEX IF NOT EXISTS idx_garage_sales_posted_by ON garage_sales(posted_by);
CREATE INDEX IF NOT EXISTS idx_garage_sales_is_active ON garage_sales(is_active);
CREATE INDEX IF NOT EXISTS idx_garage_sales_location ON garage_sales(latitude, longitude);

-- User permissions indexes
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_super_admin ON user_permissions(is_super_admin);

-- Activity log indexes
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action ON admin_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_entity ON admin_activity_log(entity_type, entity_id);

-- Site settings indexes
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

-- Profiles trigger
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Garage sales trigger
CREATE TRIGGER update_garage_sales_updated_at BEFORE UPDATE ON garage_sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User permissions trigger
CREATE TRIGGER update_user_permissions_updated_at BEFORE UPDATE ON user_permissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Site settings trigger
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Garage sales RLS
ALTER TABLE garage_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved garage sales" ON garage_sales
    FOR SELECT USING (approval_status = 'approved' AND is_active = true);

CREATE POLICY "Users can view their own garage sales" ON garage_sales
    FOR SELECT USING (posted_by = auth.uid());

CREATE POLICY "Users can create garage sales" ON garage_sales
    FOR INSERT WITH CHECK (posted_by = auth.uid());

CREATE POLICY "Users can update their own pending garage sales" ON garage_sales
    FOR UPDATE USING (posted_by = auth.uid() AND approval_status = 'pending');

CREATE POLICY "Admins can manage all garage sales" ON garage_sales
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- User permissions RLS
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own permissions" ON user_permissions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all permissions" ON user_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_permissions
            WHERE user_id = auth.uid() AND is_super_admin = true
        )
    );

-- Admin activity log RLS
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity log" ON admin_activity_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "System can insert into activity log" ON admin_activity_log
    FOR INSERT WITH CHECK (true);

-- Site settings RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
    p_admin_id UUID,
    p_action TEXT,
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_entity_name TEXT DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_log_id UUID;
    v_admin_email TEXT;
BEGIN
    -- Get admin email
    SELECT email INTO v_admin_email FROM profiles WHERE id = p_admin_id;

    -- Insert activity log
    INSERT INTO admin_activity_log (
        admin_id,
        admin_email,
        action,
        entity_type,
        entity_id,
        entity_name,
        details
    ) VALUES (
        p_admin_id,
        v_admin_email,
        p_action,
        p_entity_type,
        p_entity_id,
        p_entity_name,
        p_details
    )
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_admin BOOLEAN;
BEGIN
    SELECT is_admin INTO v_is_admin FROM profiles WHERE id = user_id;
    RETURN COALESCE(v_is_admin, false);
END;
$$;

-- Function to check specific permission
CREATE OR REPLACE FUNCTION has_permission(
    permission_name TEXT,
    user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_has_permission BOOLEAN;
    v_is_super_admin BOOLEAN;
BEGIN
    -- Check if super admin (has all permissions)
    SELECT is_super_admin INTO v_is_super_admin
    FROM user_permissions
    WHERE user_permissions.user_id = has_permission.user_id;

    IF COALESCE(v_is_super_admin, false) THEN
        RETURN true;
    END IF;

    -- Check specific permission
    CASE permission_name
        WHEN 'manage_users' THEN
            SELECT can_manage_users INTO v_has_permission FROM user_permissions WHERE user_permissions.user_id = has_permission.user_id;
        WHEN 'manage_sponsors' THEN
            SELECT can_manage_sponsors INTO v_has_permission FROM user_permissions WHERE user_permissions.user_id = has_permission.user_id;
        WHEN 'manage_content' THEN
            SELECT can_manage_content INTO v_has_permission FROM user_permissions WHERE user_permissions.user_id = has_permission.user_id;
        WHEN 'manage_garage_sales' THEN
            SELECT can_manage_garage_sales INTO v_has_permission FROM user_permissions WHERE user_permissions.user_id = has_permission.user_id;
        WHEN 'view_analytics' THEN
            SELECT can_view_analytics INTO v_has_permission FROM user_permissions WHERE user_permissions.user_id = has_permission.user_id;
        WHEN 'manage_settings' THEN
            SELECT can_manage_settings INTO v_has_permission FROM user_permissions WHERE user_permissions.user_id = has_permission.user_id;
        ELSE
            RETURN false;
    END CASE;

    RETURN COALESCE(v_has_permission, false);
END;
$$;

-- ============================================
-- DEFAULT SITE SETTINGS
-- ============================================

INSERT INTO site_settings (key, value, category, description) VALUES
    ('site_name', '"YK Buddy"', 'general', 'Website name'),
    ('site_tagline', '"Your Yellowknife Companion"', 'general', 'Website tagline'),
    ('contact_email', '"hello@ykbuddy.ca"', 'general', 'Primary contact email'),
    ('default_language', '"en"', 'general', 'Default language code'),
    ('timezone', '"America/Yellowknife"', 'general', 'Site timezone'),
    ('maintenance_mode', 'false', 'general', 'Enable maintenance mode'),
    ('user_registration_enabled', 'true', 'security', 'Allow new user registration'),
    ('email_verification_required', 'true', 'security', 'Require email verification'),
    ('google_analytics_id', '""', 'integrations', 'Google Analytics measurement ID'),
    ('mapbox_api_key', '""', 'integrations', 'Mapbox API key'),
    ('stripe_publishable_key', '""', 'integrations', 'Stripe publishable key')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Create a helper function to automatically create user_permissions when is_admin is set
CREATE OR REPLACE FUNCTION create_admin_permissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NEW.is_admin = true AND OLD.is_admin = false THEN
        INSERT INTO user_permissions (
            user_id,
            is_super_admin,
            can_manage_users,
            can_manage_sponsors,
            can_manage_content,
            can_manage_garage_sales,
            can_view_analytics,
            can_manage_settings
        ) VALUES (
            NEW.id,
            true,
            true,
            true,
            true,
            true,
            true,
            true
        )
        ON CONFLICT (user_id) DO UPDATE SET
            is_super_admin = true,
            can_manage_users = true,
            can_manage_sponsors = true,
            can_manage_content = true,
            can_manage_garage_sales = true,
            can_view_analytics = true,
            can_manage_settings = true;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER auto_create_admin_permissions
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_admin_permissions();

COMMENT ON TABLE profiles IS 'User profiles linked to Supabase Auth';
COMMENT ON TABLE garage_sales IS 'Community garage sale listings with approval workflow';
COMMENT ON TABLE user_permissions IS 'Granular admin permissions for users';
COMMENT ON TABLE admin_activity_log IS 'Audit trail of all admin actions';
COMMENT ON TABLE site_settings IS 'Configurable site-wide settings';
