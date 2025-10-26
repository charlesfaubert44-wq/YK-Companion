'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeatherData {
  temp: number;
  feels_like: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  description: string;
}

export default function WeatherWidget() {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(false);

        // Yellowknife coordinates
        const lat = 62.4540;
        const lon = -114.3718;

        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        if (!apiKey) {
          console.warn('OpenWeatherMap API key not configured');
          setError(true);
          setLoading(false);
          return;
        }

        // Use language code for API (OpenWeatherMap supports multilingual responses)
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
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 600000);

    return () => clearInterval(interval);
  }, [language]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-aurora-blue/10 to-aurora-purple/10 backdrop-blur-lg p-4 rounded-2xl border border-aurora-blue/20 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-700/50 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-700/50 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-700/50 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg p-4 rounded-2xl border border-gray-700/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌡️</span>
          <div>
            <p className="text-xs text-gray-400">Yellowknife Weather</p>
            <p className="text-sm text-gray-500">Unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  // Get weather emoji based on condition
  const getWeatherEmoji = (condition: string, iconCode: string) => {
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
  };

  // Temperature color based on actual temperature (Celsius)
  const getTempColor = (temp: number) => {
    if (temp <= -30) return 'text-blue-300';
    if (temp <= -20) return 'text-blue-200';
    if (temp <= -10) return 'text-cyan-200';
    if (temp <= 0) return 'text-cyan-300';
    if (temp <= 10) return 'text-green-300';
    if (temp <= 20) return 'text-yellow-300';
    if (temp <= 30) return 'text-orange-300';
    return 'text-red-300';
  };

  return (
    <div className="bg-gradient-to-br from-aurora-blue/10 to-aurora-purple/10 backdrop-blur-lg p-4 rounded-2xl border border-aurora-blue/20 hover:border-aurora-blue/40 transition-all">
      <div className="flex items-center gap-4">
        {/* Weather Icon */}
        <div className="text-4xl" title={weather.description}>
          {getWeatherEmoji(weather.condition, weather.icon)}
        </div>

        {/* Weather Info */}
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">Yellowknife, NT</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${getTempColor(weather.temp)}`}>
              {weather.temp}°
            </span>
            <span className="text-sm text-gray-500">
              feels {weather.feels_like}°
            </span>
          </div>
          <p className="text-xs text-gray-400 capitalize mt-1">
            {weather.description}
          </p>
        </div>

        {/* Additional Details */}
        <div className="text-right">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>💧</span>
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>💨</span>
            <span>{weather.wind_speed} km/h</span>
          </div>
        </div>
      </div>

      {/* Extreme Cold Warning */}
      {weather.temp <= -30 && (
        <div className="mt-3 pt-3 border-t border-aurora-blue/20">
          <div className="flex items-center gap-2 text-xs text-blue-300">
            <span>⚠️</span>
            <span className="font-semibold">Extreme Cold Alert</span>
          </div>
        </div>
      )}
    </div>
  );
}
