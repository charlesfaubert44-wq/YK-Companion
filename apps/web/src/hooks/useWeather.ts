'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface WeatherData {
  temp: number;
  feels_like: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  description: string;
  isFallback?: boolean;
}

export interface UseWeatherOptions {
  refreshInterval?: number; // in milliseconds, default 600000 (10 minutes)
  enableFallback?: boolean; // whether to use fallback data when API fails
}

/**
 * Custom hook for fetching Yellowknife weather data
 * Uses OpenWeatherMap API with automatic refresh and fallback data
 */
export function useWeather(options: UseWeatherOptions = {}) {
  const { refreshInterval = 600000, enableFallback = true } = options;

  const { language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Yellowknife coordinates
        const lat = 62.454;
        const lon = -114.3718;

        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        if (!apiKey) {
          throw new Error('OpenWeatherMap API key not configured');
        }

        // Use language code for API (OpenWeatherMap supports multilingual responses)
        const langCode = language === 'zh' ? 'zh_cn' : language;

        // Add timestamp to prevent any caching issues
        const timestamp = Date.now();
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${langCode}&appid=${apiKey}&_t=${timestamp}`,
          {
            cache: 'no-store', // Always fetch fresh data
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Weather API request failed: ${response.status}`);
        }

        const data = await response.json();

        // Validate the response structure
        if (
          !data ||
          !data.main ||
          !data.weather ||
          !Array.isArray(data.weather) ||
          data.weather.length === 0
        ) {
          throw new Error('Invalid weather API response format');
        }

        // Log the actual API response for debugging
        console.log('[useWeather] API Response:', {
          temp: data.main.temp,
          rounded: Math.round(data.main.temp),
          feels_like: data.main.feels_like,
          condition: data.weather[0].main,
          timestamp: new Date().toLocaleString(),
          location: data.name,
        });

        const weatherData = {
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          condition: data.weather[0].main,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          description: data.weather[0].description,
          isFallback: false,
        };

        console.log('[useWeather] Setting weather:', weatherData);
        setWeather(weatherData);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');

        // Use fallback data based on season if enabled
        if (enableFallback) {
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
            icon = '02d';
            description = 'spring conditions';
          } else if (month === 6 || month === 7 || month === 8) {
            fallbackTemp = 18; // Summer
            condition = 'Clear';
            icon = '01d';
            description = 'summer conditions';
          } else if (month === 9 || month === 10) {
            fallbackTemp = 5; // Fall
            condition = 'Clouds';
            icon = '03d';
            description = 'fall conditions';
          } else {
            fallbackTemp = -15; // Early winter
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
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Set up refresh interval if specified
    if (refreshInterval > 0) {
      const interval = setInterval(fetchWeather, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [language, refreshInterval, enableFallback]);

  return { weather, loading, error };
}

/**
 * Get weather emoji based on condition and time of day
 *
 * @param {string} condition - Weather condition (e.g., 'Clear', 'Rain', 'Snow')
 * @param {string} iconCode - OpenWeatherMap icon code (e.g., '01d', '01n')
 * @returns {string} Emoji representing the weather condition
 *
 * @example
 * ```ts
 * const emoji = getWeatherEmoji('Clear', '01d'); // Returns '☀️'
 * const nightEmoji = getWeatherEmoji('Clear', '01n'); // Returns '🌙'
 * ```
 */
export function getWeatherEmoji(condition: string, iconCode: string): string {
  const isNight = iconCode.includes('n');

  switch (condition.toLowerCase()) {
    case 'clear':
      return isNight ? '🌙' : '☀️';
    case 'clouds':
      return isNight ? '☁️' : '⛅';
    case 'rain':
    case 'drizzle':
      return '🌧️';
    case 'thunderstorm':
      return '⛈️';
    case 'snow':
      return '❄️';
    case 'mist':
    case 'fog':
      return '🌫️';
    default:
      return '🌡️';
  }
}

/**
 * Get temperature color class based on Celsius value
 *
 * Returns Tailwind CSS color class appropriate for the temperature.
 * Uses blue tones for freezing temps, through to red for hot temps.
 *
 * @param {number} temp - Temperature in Celsius
 * @returns {string} Tailwind CSS color class (e.g., 'text-blue-400')
 *
 * @example
 * ```ts
 * const colorClass = getTempColor(-25); // Returns 'text-blue-400'
 * const warmClass = getTempColor(25); // Returns 'text-orange-300'
 * ```
 */
export function getTempColor(temp: number): string {
  if (temp <= -30) return 'text-blue-400';
  if (temp <= -20) return 'text-blue-300';
  if (temp <= -10) return 'text-cyan-300';
  if (temp <= 0) return 'text-cyan-200';
  if (temp <= 10) return 'text-green-300';
  if (temp <= 20) return 'text-yellow-300';
  if (temp <= 30) return 'text-orange-300';
  return 'text-red-400';
}
