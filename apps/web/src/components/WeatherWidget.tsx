'use client';

import { useWeather, getWeatherEmoji, getTempColor } from '@/hooks/useWeather';

export default function WeatherWidget() {
  const { weather, loading, error } = useWeather({ refreshInterval: 600000, enableFallback: true });

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

  if (error && !weather) {
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

  if (!weather) {
    return null;
  }

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
