-- Seed initial site settings data
INSERT INTO site_settings (key, value, category, description) VALUES
    -- General Settings
    ('site_name', '"YK Buddy"', 'general', 'Website name'),
    ('site_description', '"Your friendly guide to Yellowknife"', 'general', 'Website description'),
    ('contact_email', '"admin@ykbuddy.com"', 'general', 'Primary contact email'),
    ('support_email', '"support@ykbuddy.com"', 'general', 'Support email'),
    ('timezone', '"America/Yellowknife"', 'general', 'Default timezone'),

    -- Security Settings
    ('enable_2fa', 'false', 'security', 'Enable two-factor authentication'),
    ('session_timeout', '3600', 'security', 'Session timeout in seconds'),
    ('max_login_attempts', '5', 'security', 'Maximum login attempts before lockout'),
    ('password_min_length', '8', 'security', 'Minimum password length'),

    -- Email Settings
    ('smtp_host', '""', 'email', 'SMTP server host'),
    ('smtp_port', '587', 'email', 'SMTP server port'),
    ('smtp_user', '""', 'email', 'SMTP username'),
    ('smtp_from', '"noreply@ykbuddy.com"', 'email', 'Email from address'),

    -- Social Media
    ('facebook_url', '"https://facebook.com/ykbuddy"', 'social', 'Facebook page URL'),
    ('twitter_url', '"https://twitter.com/ykbuddy"', 'social', 'Twitter profile URL'),
    ('instagram_url', '"https://instagram.com/ykbuddy"', 'social', 'Instagram profile URL'),
    ('youtube_url', '""', 'social', 'YouTube channel URL'),

    -- Features
    ('enable_garage_sales', 'true', 'features', 'Enable garage sales feature'),
    ('enable_sponsors', 'true', 'features', 'Enable premium sponsors'),
    ('enable_analytics', 'true', 'features', 'Enable analytics tracking'),
    ('maintenance_mode', 'false', 'features', 'Enable maintenance mode')
ON CONFLICT (key) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Site settings seeded successfully!';
END $$;
