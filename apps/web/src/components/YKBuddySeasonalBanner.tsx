'use client';

import { useState, useEffect } from 'react';
import { useBannerSettings } from '@/lib/banners/useBannerSettings';
import { BANNER_THEMES } from './banners/BannerThemes';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeatherData {
  temp: number;
  feels_like: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  description: string;
  isFallback?: boolean;
}

export default function YKBuddySeasonalBanner() {
  const { currentTheme } = useBannerSettings();
  const { language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);

        // Yellowknife coordinates
        const lat = 62.4540;
        const lon = -114.3718;

        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        if (!apiKey) {
          console.warn('OpenWeatherMap API key not configured - using seasonal average temperature');
          console.log('Using fallback weather data for month:', new Date().getMonth() + 1);
          // Fallback to seasonal average temperature based on month
          const month = new Date().getMonth() + 1;
          let fallbackTemp = -25;
          let condition = 'Clear';
          let icon = '01d';
          let description = 'typical for season';

          if (month === 12 || month === 1 || month === 2) {
            fallbackTemp = -28; // Deep winter
            condition = 'Snow';
            icon = '13d';
            description = 'typical winter conditions';
          } else if (month === 3) {
            fallbackTemp = -18; // Late winter
            condition = 'Clouds';
            icon = '02d';
            description = 'late winter conditions';
          } else if (month === 4 || month === 5) {
            fallbackTemp = 2; // Spring
            condition = 'Clouds';
            icon = '03d';
            description = 'spring thaw';
          } else if (month === 6 || month === 7 || month === 8) {
            fallbackTemp = 17; // Summer
            condition = 'Clear';
            icon = '01d';
            description = 'summer warmth';
          } else if (month === 9) {
            fallbackTemp = 2; // Early fall
            condition = 'Clouds';
            icon = '04d';
            description = 'early autumn';
          } else if (month === 10) {
            fallbackTemp = -8; // Late fall
            condition = 'Clouds';
            icon = '04d';
            description = 'late autumn chill';
          } else {
            fallbackTemp = -15; // November
            condition = 'Snow';
            icon = '13d';
            description = 'early winter';
          }

          setWeather({
            temp: fallbackTemp,
            feels_like: fallbackTemp - 5,
            condition,
            icon,
            humidity: 70,
            wind_speed: 15,
            description,
            isFallback: true,
          });
          setLoading(false);
          return;
        }

        const langCode = language === 'zh' ? 'zh_cn' : language;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${langCode}&appid=${apiKey}`,
          {
            next: { revalidate: 600 } // Cache for 10 minutes
          }
        );

        if (!response.ok) {
          throw new Error('Weather API request failed');
        }

        const data = await response.json();

        console.log('Weather API response:', {
          temp: data.main.temp,
          location: data.name,
          condition: data.weather[0].main
        });

        setWeather({
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          condition: data.weather[0].main,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          description: data.weather[0].description,
        });
      } catch (err) {
        console.error('Error fetching weather:', err);
        console.log('Using fallback weather data for month:', new Date().getMonth() + 1);
        // Fallback to seasonal average temperature
        const month = new Date().getMonth() + 1;
        let fallbackTemp = -25;
        let condition = 'Clear';
        let icon = '01d';
        let description = 'typical for season';

        if (month === 12 || month === 1 || month === 2) {
          fallbackTemp = -28; // Deep winter
          condition = 'Snow';
          icon = '13d';
          description = 'typical winter conditions';
        } else if (month === 3) {
          fallbackTemp = -18; // Late winter
          condition = 'Clouds';
          icon = '02d';
          description = 'late winter conditions';
        } else if (month === 4 || month === 5) {
          fallbackTemp = 2; // Spring
          condition = 'Clouds';
          icon = '03d';
          description = 'spring thaw';
        } else if (month === 6 || month === 7 || month === 8) {
          fallbackTemp = 17; // Summer
          condition = 'Clear';
          icon = '01d';
          description = 'summer warmth';
        } else if (month === 9) {
          fallbackTemp = 2; // Early fall
          condition = 'Clouds';
          icon = '04d';
          description = 'early autumn';
        } else if (month === 10) {
          fallbackTemp = -8; // Late fall
          condition = 'Clouds';
          icon = '04d';
          description = 'late autumn chill';
        } else {
          fallbackTemp = -15; // November
          condition = 'Snow';
          icon = '13d';
          description = 'early winter';
        }

        setWeather({
          temp: fallbackTemp,
          feels_like: fallbackTemp - 5,
          condition,
          icon,
          humidity: 70,
          wind_speed: 15,
          description,
          isFallback: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 600000);

    return () => clearInterval(interval);
  }, [language]);

  const BannerComponent = BANNER_THEMES[currentTheme];

  if (loading || !weather) {
    // Show banner with loading state
    return <BannerComponent temperature={-30} weather={null} />;
  }

  return <BannerComponent temperature={weather.temp} weather={weather} />;
}
