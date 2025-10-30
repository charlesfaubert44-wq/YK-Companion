'use client';

import { useState, useEffect } from 'react';
import { AuroraForecast, ForecastAccuracy } from '@/types/aurora-enhancements.types';
import { getKPLevelInfo } from '@/types/aurora.types';

interface Props {
  compact?: boolean;
}

export default function ForecastDisplay({ compact = false }: Props) {
  const [forecasts, setForecasts] = useState<AuroraForecast[]>([]);
  const [accuracy, setAccuracy] = useState<ForecastAccuracy[]>([]);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today, 1 = tomorrow, etc.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecasts();
    fetchAccuracy();
  }, []);

  const fetchForecasts = async () => {
    try {
      // TODO: Replace with actual Supabase call
      // const { data } = await supabase
      //   .from('aurora_forecasts')
      //   .select('*')
      //   .gte('forecast_date', new Date().toISOString().split('T')[0])
      //   .order('forecast_date', { ascending: true })
      //   .order('forecast_hour', { ascending: true });

      // Mock 3-day forecast
      const mockForecasts: AuroraForecast[] = [];
      for (let day = 0; day < 3; day++) {
        for (let hour = 0; hour < 24; hour++) {
          const date = new Date();
          date.setDate(date.getDate() + day);
          date.setHours(hour, 0, 0, 0);

          // Generate realistic KP values (higher at night)
          let baseKP = 3.5;
          if (hour >= 20 || hour <= 4) {
            baseKP = 5.5 + Math.random() * 2; // Night: 5.5-7.5
          } else if (hour >= 8 && hour <= 18) {
            baseKP = 2.0 + Math.random() * 1.5; // Day: 2.0-3.5
          }

          mockForecasts.push({
            id: `forecast-${day}-${hour}`,
            forecast_date: date.toISOString().split('T')[0],
            forecast_hour: hour,
            predicted_kp: Math.round(baseKP * 10) / 10,
            predicted_probability: Math.min(95, Math.max(20, baseKP * 15)),
            confidence_level: baseKP > 6 ? 'high' : baseKP > 4 ? 'medium' : 'low',
            confidence_score: 0.7 + Math.random() * 0.25,
            model_version: 'v2.1',
            data_source: 'NOAA',
            actual_kp:
              day === 0 && hour < new Date().getHours() ? baseKP + (Math.random() - 0.5) * 1 : null,
            accuracy_score: null,
            created_at: new Date().toISOString(),
          });
        }
      }

      setForecasts(mockForecasts);
    } catch (error) {
      console.error('Error fetching forecasts:', error);
    }
    setLoading(false);
  };

  const fetchAccuracy = async () => {
    try {
      // TODO: Replace with actual Supabase call
      const mockAccuracy: ForecastAccuracy[] = [
        {
          data_source: 'NOAA',
          avg_accuracy: 0.87,
          total_forecasts: 1542,
          accurate_forecasts: 1341,
        },
        {
          data_source: 'Space Weather',
          avg_accuracy: 0.82,
          total_forecasts: 1120,
          accurate_forecasts: 918,
        },
        {
          data_source: 'Aurora Watch',
          avg_accuracy: 0.79,
          total_forecasts: 890,
          accurate_forecasts: 703,
        },
      ];

      setAccuracy(mockAccuracy);
    } catch (error) {
      console.error('Error fetching accuracy:', error);
    }
  };

  const getDateLabel = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    if (daysFromNow === 0) return 'Today';
    if (daysFromNow === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getHourLabel = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const getBestViewingTimes = (dayForecasts: AuroraForecast[]) => {
    const goodHours = dayForecasts
      .filter(f => (f.predicted_kp >= 4.0 && f.forecast_hour >= 20) || f.forecast_hour <= 4)
      .sort((a, b) => b.predicted_kp - a.predicted_kp)
      .slice(0, 3);

    return goodHours;
  };

  const selectedDateString = new Date(Date.now() + selectedDay * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  const dayForecasts = forecasts.filter(f => f.forecast_date === selectedDateString);
  const bestTimes = getBestViewingTimes(dayForecasts);

  if (compact) {
    const nextGoodForecast = forecasts.find(f => f.predicted_kp >= 4.0);
    if (!nextGoodForecast) {
      return (
        <div className="bg-dark-800 rounded-lg p-4">
          <div className="text-center text-gray-400">
            No high aurora activity expected in the next 3 days
          </div>
        </div>
      );
    }

    const kpInfo = getKPLevelInfo(nextGoodForecast.predicted_kp);
    return (
      <div className="bg-dark-800 rounded-lg p-4 border-2 border-aurora-green/30">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🔮</div>
          <div className="flex-1">
            <div className="text-sm text-gray-400">Next Good Viewing</div>
            <div className="font-bold text-white">
              {new Date(
                `${nextGoodForecast.forecast_date}T${nextGoodForecast.forecast_hour.toString().padStart(2, '0')}:00`
              ).toLocaleString('en-US', {
                weekday: 'short',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: kpInfo.color }}>
              KP {nextGoodForecast.predicted_kp.toFixed(1)}
            </div>
            <div className="text-xs text-gray-400">
              {nextGoodForecast.predicted_probability}% chance
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Model Accuracy */}
      {accuracy.length > 0 && (
        <div className="bg-dark-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">🎯 Forecast Accuracy</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {accuracy.map(acc => (
              <div key={acc.data_source} className="bg-dark-900 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">{acc.data_source}</div>
                <div className="text-3xl font-bold text-aurora-green mb-1">
                  {(acc.avg_accuracy * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">
                  {acc.accurate_forecasts}/{acc.total_forecasts} accurate
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day Selector */}
      <div className="flex gap-2">
        {[0, 1, 2].map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
              selectedDay === day
                ? 'bg-aurora-purple text-white'
                : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            {getDateLabel(day)}
          </button>
        ))}
      </div>

      {/* Best Viewing Times */}
      {bestTimes.length > 0 && (
        <div className="bg-gradient-to-r from-aurora-green/10 to-aurora-blue/10 border border-aurora-green/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">⭐ Best Viewing Times</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {bestTimes.map(forecast => {
              const kpInfo = getKPLevelInfo(forecast.predicted_kp);
              return (
                <div key={forecast.id} className="bg-dark-900 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🌌</div>
                  <div className="font-bold text-white mb-1">
                    {getHourLabel(forecast.forecast_hour)}
                  </div>
                  <div className="text-3xl font-bold mb-1" style={{ color: kpInfo.color }}>
                    {forecast.predicted_kp.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {forecast.predicted_probability}% probability
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {forecast.confidence_level} confidence
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 24-Hour Timeline */}
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">📊 24-Hour Forecast</h3>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading forecast...</div>
        ) : (
          <>
            {/* Timeline Chart */}
            <div className="relative h-48 mb-6">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[9, 7, 5, 3, 1].map(kp => (
                  <div key={kp} className="flex items-center">
                    <span className="text-xs text-gray-500 w-8">{kp}</span>
                    <div className="flex-1 border-t border-gray-700/50" />
                  </div>
                ))}
              </div>

              {/* KP Threshold Line */}
              <div className="absolute left-8 right-0" style={{ top: '60%' }}>
                <div className="border-t-2 border-dashed border-aurora-green/30" />
                <span className="text-xs text-aurora-green/70">KP 4.0 (Good viewing)</span>
              </div>

              {/* Forecast Line */}
              <svg className="absolute left-8 right-0 top-0 bottom-0 w-full h-full">
                <defs>
                  <linearGradient id="auroraGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(0, 255, 136, 0.3)" />
                    <stop offset="100%" stopColor="rgba(0, 255, 136, 0)" />
                  </linearGradient>
                </defs>
                {dayForecasts.length > 0 && (
                  <>
                    <polyline
                      points={dayForecasts
                        .map((f, i) => {
                          const x = (i / 23) * 100;
                          const y = ((9 - f.predicted_kp) / 8) * 100;
                          return `${x}%,${y}%`;
                        })
                        .join(' ')}
                      fill="url(#auroraGradient)"
                      stroke="none"
                    />
                    <polyline
                      points={dayForecasts
                        .map((f, i) => {
                          const x = (i / 23) * 100;
                          const y = ((9 - f.predicted_kp) / 8) * 100;
                          return `${x}%,${y}%`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#00FF88"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>
            </div>

            {/* Hour Labels */}
            <div className="flex justify-between text-xs text-gray-500 pl-8">
              {[0, 6, 12, 18, 23].map(hour => (
                <span key={hour}>{getHourLabel(hour)}</span>
              ))}
            </div>

            {/* Hourly Details */}
            <div className="mt-6 grid grid-cols-4 md:grid-cols-8 gap-2">
              {dayForecasts
                .filter((_, i) => i % 3 === 0)
                .map(forecast => {
                  const kpInfo = getKPLevelInfo(forecast.predicted_kp);
                  const isGood = forecast.predicted_kp >= 4.0;

                  return (
                    <div
                      key={forecast.id}
                      className={`bg-dark-900 rounded-lg p-2 text-center border-2 transition-all ${
                        isGood ? 'border-aurora-green/50' : 'border-gray-700'
                      }`}
                    >
                      <div className="text-xs text-gray-400 mb-1">
                        {getHourLabel(forecast.forecast_hour)}
                      </div>
                      <div className="text-lg font-bold" style={{ color: kpInfo.color }}>
                        {forecast.predicted_kp.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">{forecast.predicted_probability}%</div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>

      {/* Forecast Info */}
      <div className="bg-dark-800 rounded-lg p-4 text-sm text-gray-400">
        <strong className="text-white">About Forecasts:</strong> Predictions are based on NOAA solar
        wind data and historical aurora patterns. Forecasts are most accurate within 24 hours.
        Actual conditions may vary due to local weather and geomagnetic activity.
      </div>
    </div>
  );
}
