'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface WeatherEffectsSettings {
  enabled: boolean;
  snow: boolean;
  rain: boolean;
  thunderstorm: boolean;
  fog: boolean;
  clouds: boolean;
  wind: boolean;
  clear: boolean;
}

export function useWeatherEffectsSettings(): WeatherEffectsSettings {
  const [settings, setSettings] = useState<WeatherEffectsSettings>({
    enabled: true, // Default to enabled
    snow: true,
    rain: true,
    thunderstorm: true,
    fog: true,
    clouds: true,
    wind: true,
    clear: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', [
            'weather_effects_enabled',
            'weather_effects_snow',
            'weather_effects_rain',
            'weather_effects_thunderstorm',
            'weather_effects_fog',
            'weather_effects_clouds',
            'weather_effects_wind',
            'weather_effects_clear',
          ]);

        if (data && !error) {
          const settingsMap: Record<string, boolean> = {};
          data.forEach((setting: any) => {
            // Parse JSONB boolean values
            settingsMap[setting.key] = setting.value === true || setting.value === 'true';
          });

          setSettings({
            enabled: settingsMap.weather_effects_enabled !== false,
            snow: settingsMap.weather_effects_snow !== false,
            rain: settingsMap.weather_effects_rain !== false,
            thunderstorm: settingsMap.weather_effects_thunderstorm !== false,
            fog: settingsMap.weather_effects_fog !== false,
            clouds: settingsMap.weather_effects_clouds !== false,
            wind: settingsMap.weather_effects_wind !== false,
            clear: settingsMap.weather_effects_clear !== false,
          });
        }
      } catch (err) {
        console.error('Error fetching weather effects settings:', err);
        // Keep default settings on error
      }
    };

    fetchSettings();
  }, []);

  return settings;
}
