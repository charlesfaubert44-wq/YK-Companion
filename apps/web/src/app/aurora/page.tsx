'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AuroraPage() {
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  // Mock data - would come from API
  const current = {
    kpIndex: 5.2,
    cloudCover: 25,
    visibility: 78,
    moonPhase: 'Waning Crescent',
    bestTime: '11:00 PM - 2:00 AM',
    quality: 'excellent',
  };

  const forecast = [
    { date: 'Tonight', kp: 5.2, clouds: 25, quality: 'excellent' },
    { date: 'Tomorrow', kp: 4.8, clouds: 35, quality: 'good' },
    { date: 'Thu Oct 24', kp: 6.1, clouds: 15, quality: 'excellent' },
    { date: 'Fri Oct 25', kp: 3.2, clouds: 60, quality: 'fair' },
    { date: 'Sat Oct 26', kp: 4.5, clouds: 40, quality: 'good' },
    { date: 'Sun Oct 27', kp: 5.8, clouds: 20, quality: 'excellent' },
    { date: 'Mon Oct 28', kp: 2.8, clouds: 75, quality: 'poor' },
  ];

  const viewingLocations = [
    {
      name: 'Frame Lake Trail',
      distance: '2 km from downtown',
      accessibility: 'Easy',
      lightPollution: 'Low',
      emoji: '🏞️',
    },
    {
      name: 'Ingraham Trail',
      distance: '10-60 km from city',
      accessibility: 'Moderate',
      lightPollution: 'Very Low',
      emoji: '🚗',
    },
    {
      name: 'Pontoon Lake',
      distance: '30 km from city',
      accessibility: 'Easy',
      lightPollution: 'Very Low',
      emoji: '⭐',
    },
    {
      name: 'Aurora Village',
      distance: '25 km from city',
      accessibility: 'Easy (Guided)',
      lightPollution: 'None',
      emoji: '🏕️',
    },
  ];

  const getQualityColor = (quality: string) => {
    const colors = {
      excellent: 'text-aurora-green',
      good: 'text-aurora-blue',
      fair: 'text-yellow-400',
      poor: 'text-gray-400',
    };
    return colors[quality as keyof typeof colors] || 'text-gray-400';
  };

  const getQualityBg = (quality: string) => {
    const colors = {
      excellent: 'bg-aurora-green/20 border-aurora-green/50',
      good: 'bg-aurora-blue/20 border-aurora-blue/50',
      fair: 'bg-yellow-400/20 border-yellow-400/50',
      poor: 'bg-gray-400/20 border-gray-400/50',
    };
    return colors[quality as keyof typeof colors] || 'bg-gray-400/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-gray-400 hover:text-aurora-green transition inline-flex items-center gap-2 mb-8">
          ← YK Buddy
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-aurora-green/20 border border-aurora-green/30 rounded-full text-aurora-green text-sm font-semibold mb-6">
              🌌 Updated 5 minutes ago
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Aurora Forecast
            </h1>
            <p className="text-xl text-gray-300">
              Real-time northern lights predictions for Yellowknife
            </p>
          </div>

          {/* Current Conditions - Hero Card */}
          <div className={`bg-gradient-to-br from-aurora-green/20 to-aurora-purple/20 backdrop-blur-lg p-8 rounded-2xl border-2 ${getQualityBg(current.quality)} mb-8`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Tonight's Forecast</h2>
                <p className="text-gray-300">{current.bestTime}</p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${getQualityColor(current.quality)} mb-1`}>
                  {current.quality.toUpperCase()}
                </div>
                <div className="text-sm text-gray-400">Viewing Quality</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">KP Index</div>
                <div className="text-4xl font-bold text-aurora-green">{current.kpIndex}</div>
                <div className="text-xs text-gray-500 mt-1">0-9 scale</div>
                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-aurora-green"
                    style={{ width: `${(current.kpIndex / 9) * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">Cloud Cover</div>
                <div className="text-4xl font-bold text-aurora-blue">{current.cloudCover}%</div>
                <div className="text-xs text-gray-500 mt-1">Lower is better</div>
                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-aurora-blue"
                    style={{ width: `${100 - current.cloudCover}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">Visibility</div>
                <div className="text-4xl font-bold text-aurora-purple">{current.visibility}%</div>
                <div className="text-xs text-gray-500 mt-1">Probability</div>
                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-aurora-purple"
                    style={{ width: `${current.visibility}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">Moon Phase</div>
                <div className="text-3xl mb-1">🌘</div>
                <div className="text-sm text-white font-semibold">{current.moonPhase}</div>
                <div className="text-xs text-gray-500 mt-1">Minimal interference</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-aurora-green/30 to-aurora-purple/30 p-4 rounded-lg border border-aurora-green/40">
              <div className="flex items-start gap-3">
                <span className="text-3xl">✨</span>
                <div>
                  <p className="text-white font-semibold mb-1">Excellent viewing conditions tonight!</p>
                  <p className="text-gray-200 text-sm">
                    High solar activity and clear skies. Best viewing window is between 11:00 PM and 2:00 AM.
                    Head to a dark location away from city lights for optimal experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* 7-Day Forecast */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">7-Day Forecast</h3>
                <div className="space-y-3">
                  {forecast.map((day, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${getQualityBg(day.quality)} transition hover:scale-105`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{day.date}</div>
                          <div className="text-sm text-gray-400">
                            KP {day.kp} • {day.clouds}% clouds
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="h-16 w-2 bg-white/10 rounded-full overflow-hidden relative">
                              <div
                                className={`absolute bottom-0 w-full ${
                                  day.quality === 'excellent'
                                    ? 'bg-aurora-green'
                                    : day.quality === 'good'
                                    ? 'bg-aurora-blue'
                                    : day.quality === 'fair'
                                    ? 'bg-yellow-400'
                                    : 'bg-gray-400'
                                }`}
                                style={{ height: `${(day.kp / 9) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className={`font-bold capitalize ${getQualityColor(day.quality)} w-24 text-right`}>
                            {day.quality}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Aurora Alerts */}
            <div>
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Aurora Alerts</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Get notifications when viewing conditions are optimal
                </p>
                <button
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
                    alertsEnabled
                      ? 'bg-aurora-green/20 border-2 border-aurora-green text-aurora-green'
                      : 'bg-aurora-gradient text-white hover:shadow-aurora'
                  }`}
                >
                  {alertsEnabled ? '✓ Alerts Enabled' : 'Enable Alerts'}
                </button>

                {alertsEnabled && (
                  <div className="mt-4 p-3 bg-aurora-green/10 border border-aurora-green/30 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">You'll be notified when:</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• KP Index ≥ 4</li>
                      <li>• Cloud cover &lt; 40%</li>
                      <li>• Within your trip dates</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Photography Tips */}
              <div className="bg-gradient-to-br from-aurora-purple/20 to-aurora-blue/20 backdrop-blur-lg p-6 rounded-2xl border border-aurora-purple/30">
                <h3 className="text-xl font-bold text-white mb-4">📸 Photography Tips</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-aurora-purple flex-shrink-0">•</span>
                    <span>Use manual mode with 15-30s exposure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-aurora-purple flex-shrink-0">•</span>
                    <span>Set ISO 1600-3200</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-aurora-purple flex-shrink-0">•</span>
                    <span>Wide aperture (f/2.8 or lower)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-aurora-purple flex-shrink-0">•</span>
                    <span>Bring extra batteries (cold drains them fast!)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-aurora-purple flex-shrink-0">•</span>
                    <span>Use a sturdy tripod</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Best Viewing Locations */}
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Best Viewing Locations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {viewingLocations.map((location, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-aurora-green/50 transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{location.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-2">{location.name}</h4>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div>📍 {location.distance}</div>
                        <div>🚶 {location.accessibility}</div>
                        <div>💡 Light Pollution: {location.lightPollution}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Understanding KP Index */}
          <div className="mt-8 bg-gradient-to-r from-dark-800 to-dark-900 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3">Understanding the KP Index</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-400 mb-1">KP 0-2</div>
                <div className="text-gray-500">Quiet. Unlikely to see aurora.</div>
              </div>
              <div>
                <div className="font-semibold text-yellow-400 mb-1">KP 3-4</div>
                <div className="text-gray-500">Active. Good chance in Yellowknife.</div>
              </div>
              <div>
                <div className="font-semibold text-aurora-blue mb-1">KP 5-6</div>
                <div className="text-gray-500">Strong. Excellent displays likely.</div>
              </div>
              <div>
                <div className="font-semibold text-aurora-green mb-1">KP 7-9</div>
                <div className="text-gray-500">Severe storm. Spectacular show!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
