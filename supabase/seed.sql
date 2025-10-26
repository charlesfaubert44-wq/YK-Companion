-- Seed data for development
-- This file is optional and can be run with: supabase db seed

-- Insert sample aurora forecasts
INSERT INTO aurora_forecasts (forecast_date, kp_index, visibility_score, cloud_cover, weather_conditions, best_viewing_time)
VALUES
  (CURRENT_DATE, 4.5, 75, 20, 'Clear skies expected', '22:00:00'),
  (CURRENT_DATE + INTERVAL '1 day', 5.2, 85, 15, 'Excellent conditions', '23:00:00'),
  (CURRENT_DATE + INTERVAL '2 days', 3.8, 60, 40, 'Partly cloudy', '21:30:00'),
  (CURRENT_DATE + INTERVAL '3 days', 6.1, 90, 10, 'Perfect viewing conditions', '22:30:00')
ON CONFLICT (forecast_date) DO NOTHING;

-- Insert sample aurora challenge
INSERT INTO aurora_challenges (title, description, start_date, end_date, prize_description)
VALUES
  (
    'Winter Aurora Photography Challenge 2025',
    'Capture the best aurora photo this winter season and win amazing prizes!',
    '2025-12-01 00:00:00',
    '2025-02-28 23:59:59',
    'First place: Professional camera equipment worth $2000'
  )
ON CONFLICT DO NOTHING;

-- Note: Garage sales, photos, and user-specific data should be created through the application
