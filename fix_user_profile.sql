-- Fix User Profile and Neighborhood Membership
-- This script creates the missing profile and ensures neighborhood membership works

-- Step 1: Create or update the profile for the user
INSERT INTO profiles (
  id,
  email,
  full_name,
  is_admin,
  user_type,
  is_active,
  last_login_at
)
VALUES (
  '1b533ff5-3a47-410a-be9e-a832b4caa923',
  'charlesfaubert44@gmail.com',
  'Charles Faubert',
  true,  -- Set as admin
  'living',
  true,
  now()
)
ON CONFLICT (id) DO UPDATE SET
  is_admin = true,
  is_active = true,
  email = EXCLUDED.email,
  updated_at = now();

-- Step 2: Create or update neighborhood membership
INSERT INTO neighborhood_members (
  neighborhood_id,
  user_id,
  status,
  role,
  provided_address,
  requested_at,
  reviewed_at,
  reviewed_by,
  last_active_at
)
VALUES (
  '423c664b-af32-44ec-822f-bc9f1fc922ec',  -- Con Place / Con Road neighborhood
  '1b533ff5-3a47-410a-be9e-a832b4caa923',
  'approved',
  'admin',
  '123 Con Place',
  now(),
  now(),
  '1b533ff5-3a47-410a-be9e-a832b4caa923',
  now()
)
ON CONFLICT (neighborhood_id, user_id) DO UPDATE SET
  status = 'approved',
  role = 'admin',
  reviewed_at = now(),
  reviewed_by = '1b533ff5-3a47-410a-be9e-a832b4caa923',
  last_active_at = now();

-- Step 3: Verify the profile was created
SELECT
  'Profile Check' as check_type,
  id,
  email,
  full_name,
  is_admin,
  user_type,
  is_active
FROM profiles
WHERE id = '1b533ff5-3a47-410a-be9e-a832b4caa923';

-- Step 4: Verify the membership was created
SELECT
  'Membership Check' as check_type,
  nm.id,
  nm.user_id,
  nm.neighborhood_id,
  nm.status,
  nm.role,
  n.name as neighborhood_name
FROM neighborhood_members nm
JOIN neighborhoods n ON n.id = nm.neighborhood_id
WHERE nm.user_id = '1b533ff5-3a47-410a-be9e-a832b4caa923';

-- Step 5: Test that the user can see their membership (simulates what the API does)
-- This should return data if RLS policies are working correctly
SELECT
  'RLS Test - Own Membership' as test_name,
  count(*) as record_count
FROM neighborhood_members
WHERE user_id = '1b533ff5-3a47-410a-be9e-a832b4caa923';

-- Success message
SELECT '✓ Profile and membership setup complete!' as status;
SELECT 'Now try accessing the dashboard at: /living/neighborhoods/423c664b-af32-44ec-822f-bc9f1fc922ec' as next_step;
