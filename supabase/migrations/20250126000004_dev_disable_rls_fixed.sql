-- DEV ONLY: Disable RLS and remove FK constraint for admin dashboard testing
-- WARNING: This allows anyone to access admin data. Only use on DEV branch!
-- Re-enable RLS and restore FK before deploying to production.

-- Temporarily disable RLS on admin tables for dev testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE garage_sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE premium_sponsors DISABLE ROW LEVEL SECURITY;
ALTER TABLE premium_pricing_plans DISABLE ROW LEVEL SECURITY;

-- Drop the foreign key constraint on profiles for dev (so we can create test data without auth users)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add a comment reminder
COMMENT ON TABLE profiles IS '⚠️ DEV MODE: RLS DISABLED & FK REMOVED - Restore before production!';

-- Create test admin profiles for the dashboard to display
INSERT INTO profiles (id, email, user_type, is_admin, is_active, full_name, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'admin@ykbuddy.ca', 'living', true, true, 'Admin User', NOW(), NOW()),
    (gen_random_uuid(), 'user1@example.com', 'visiting', false, true, 'John Visitor', NOW(), NOW()),
    (gen_random_uuid(), 'user2@example.com', 'living', false, true, 'Jane Resident', NOW(), NOW()),
    (gen_random_uuid(), 'user3@example.com', 'moving', false, true, 'Bob Newcomer', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create some test garage sales for the admin dashboard
INSERT INTO garage_sales (
    title,
    description,
    address,
    start_date,
    end_date,
    approval_status,
    contact_name,
    contact_email,
    is_active
)
VALUES
    (
        'Multi-Family Garage Sale',
        'Furniture, toys, electronics, and more!',
        '123 Main St, Yellowknife, NT',
        NOW() + INTERVAL '7 days',
        NOW() + INTERVAL '7 days' + INTERVAL '8 hours',
        'pending',
        'Sarah Johnson',
        'sarah@example.com',
        true
    ),
    (
        'Moving Sale - Everything Must Go!',
        'Household items, kitchen appliances, winter gear',
        '456 Elm Ave, Yellowknife, NT',
        NOW() + INTERVAL '14 days',
        NOW() + INTERVAL '14 days' + INTERVAL '6 hours',
        'approved',
        'Mike Chen',
        'mike@example.com',
        true
    ),
    (
        'Estate Sale',
        'Antiques, collectibles, tools',
        '789 Oak Dr, Yellowknife, NT',
        NOW() + INTERVAL '21 days',
        NOW() + INTERVAL '21 days' + INTERVAL '10 hours',
        'approved',
        'Emma Wilson',
        'emma@example.com',
        true
    )
ON CONFLICT DO NOTHING;

-- Insert test premium sponsors
INSERT INTO premium_sponsors (
    name,
    tagline,
    link,
    position,
    plan_type,
    duration_days,
    start_date,
    end_date,
    total_price,
    payment_status,
    is_active,
    contact_name,
    contact_email
)
VALUES
    (
        'Northern Lights Tours',
        'Experience the magic of the Aurora',
        'https://example.com',
        'home_top',
        'premium',
        30,
        NOW(),
        NOW() + INTERVAL '30 days',
        382.50,
        'paid',
        true,
        'Marketing Manager',
        'marketing@nlttours.com'
    ),
    (
        'Yellowknife Realty',
        'Your trusted real estate partner',
        'https://example.com',
        'moving',
        'basic',
        90,
        NOW(),
        NOW() + INTERVAL '90 days',
        810.00,
        'pending',
        true,
        'Sales Director',
        'sales@ykrealty.com'
    ),
    (
        'Arctic Adventures',
        'Explore the true North',
        'https://example.com',
        'visiting',
        'premium',
        60,
        NOW() - INTERVAL '10 days',
        NOW() + INTERVAL '50 days',
        918.00,
        'paid',
        true,
        'Owner',
        'info@arcticadventures.com'
    )
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ DEV MODE ENABLED: Admin dashboard is now accessible without authentication!';
    RAISE NOTICE '⚠️  WARNING: RLS is DISABLED. Do not use this configuration in production!';
END $$;
