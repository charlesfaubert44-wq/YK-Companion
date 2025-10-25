-- Move weather effects settings to 'banner' category and add force weather option

-- Update existing weather settings to 'banner' category
UPDATE site_settings
SET category = 'banner'
WHERE key IN (
    'weather_effects_enabled',
    'weather_effects_snow',
    'weather_effects_rain',
    'weather_effects_thunderstorm',
    'weather_effects_fog',
    'weather_effects_clouds',
    'weather_effects_wind',
    'weather_effects_clear'
);

-- Add force weather setting
INSERT INTO site_settings (key, value, category, description) VALUES
    ('weather_force_enabled', 'false', 'banner', 'Enable forced weather override (ignores live weather)'),
    ('weather_force_condition', '"none"', 'banner', 'Forced weather condition: none, snow, rain, drizzle, thunderstorm, fog, mist, haze, clouds, clear')
ON CONFLICT (key) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Weather settings moved to banner category and force weather added!';
END $$;
