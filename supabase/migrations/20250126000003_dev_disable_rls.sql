-- DEV ONLY: Disable RLS for admin dashboard testing
-- WARNING: This allows anyone to access admin data. Only use on DEV branch!
-- Re-enable RLS before deploying to production.

-- Temporarily disable RLS on admin tables for dev testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE garage_sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE premium_sponsors DISABLE ROW LEVEL SECURITY;
ALTER TABLE premium_pricing_plans DISABLE ROW LEVEL SECURITY;

-- Add a comment reminder
COMMENT ON TABLE profiles IS '⚠️ DEV MODE: RLS DISABLED - Re-enable before production!';

-- Insert some test data for the admin dashboard to display

-- Create a test admin profile (if needed for reference)
INSERT INTO profiles (id, email, user_type, is_admin, is_active, full_name)
VALUES (
    gen_random_uuid(),
    'dev-admin@test.local',
    'living',
    true,
    true,
    'Dev Admin'
) ON CONFLICT DO NOTHING;

-- You can add more test data here as needed
