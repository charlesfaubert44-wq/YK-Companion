-- Add weather effects settings to site_settings table
INSERT INTO site_settings (key, value, category, description) VALUES
    ('weather_effects_enabled', 'true', 'features', 'Enable live weather effects on seasonal banners'),
    ('weather_effects_snow', 'true', 'features', 'Enable snow effect'),
    ('weather_effects_rain', 'true', 'features', 'Enable rain effect'),
    ('weather_effects_thunderstorm', 'true', 'features', 'Enable thunderstorm effect'),
    ('weather_effects_fog', 'true', 'features', 'Enable fog/mist effect'),
    ('weather_effects_clouds', 'true', 'features', 'Enable clouds effect'),
    ('weather_effects_wind', 'true', 'features', 'Enable wind particles effect'),
    ('weather_effects_clear', 'true', 'features', 'Enable clear sky sparkles effect')
ON CONFLICT (key) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Weather effects settings added successfully!';
END $$;
