-- Grant Admin Access to Current User
-- This migration grants full admin rights to your account

-- Update the email below to match your account email
-- Replace 'your-email@example.com' with your actual email address

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find the user by email (UPDATE THIS EMAIL!)
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'your-email@example.com'  -- CHANGE THIS TO YOUR EMAIL
  LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    -- Update profile to be admin
    UPDATE profiles
    SET is_admin = true,
        is_active = true,
        updated_at = NOW()
    WHERE id = admin_user_id;

    -- Create or update user permissions with full admin rights
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
      admin_user_id,
      true,  -- Super admin
      true,  -- Can manage users
      true,  -- Can manage sponsors
      true,  -- Can manage content
      true,  -- Can manage garage sales
      true,  -- Can view analytics
      true   -- Can manage settings
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      is_super_admin = true,
      can_manage_users = true,
      can_manage_sponsors = true,
      can_manage_content = true,
      can_manage_garage_sales = true,
      can_view_analytics = true,
      can_manage_settings = true,
      updated_at = NOW();

    RAISE NOTICE 'Admin access granted to user: %', admin_user_id;
  ELSE
    RAISE NOTICE 'User not found with that email. Please update the email in the migration file.';
  END IF;
END $$;

-- Quick check to see all admin users
SELECT
  p.id,
  p.email,
  p.full_name,
  p.is_admin,
  up.is_super_admin
FROM profiles p
LEFT JOIN user_permissions up ON p.id = up.user_id
WHERE p.is_admin = true OR up.is_super_admin = true;
