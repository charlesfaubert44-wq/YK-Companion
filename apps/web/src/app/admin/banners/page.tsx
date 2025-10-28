'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBannerSettings } from '@/lib/banners/useBannerSettings';
import { BANNER_THEMES, BannerTheme } from '@/components/banners/BannerThemes';
import { createClient } from '@/lib/supabase/client';

export default function BannerShowcasePage() {
  const { currentTheme, settings, setActiveTheme, toggleAutoDetect } = useBannerSettings();
  const [previewTheme, setPreviewTheme] = useState<BannerTheme>(currentTheme);
  const [weatherSettings, setWeatherSettings] = useState<Record<string, any>>({});
  const [savingWeather, setSavingWeather] = useState(false);

  const bannerVariations = [
    // Seasonal Banners
    { id: 'winter' as BannerTheme, name: 'Winter', category: 'seasonal', description: 'Aurora and frozen landscapes' },
    { id: 'spring' as BannerTheme, name: 'Spring', category: 'seasonal', description: 'Ice breakup and returning birds' },
    { id: 'summer' as BannerTheme, name: 'Summer', category: 'seasonal', description: 'Midnight sun and wildflowers' },
    { id: 'fall' as BannerTheme, name: 'Fall', category: 'seasonal', description: 'Autumn colors and migrating geese' },

    // Holiday Themes
    { id: 'halloween' as BannerTheme, name: 'Halloween', category: 'holiday', description: 'Spooky northern lights and pumpkins' },
    { id: 'remembrance' as BannerTheme, name: 'Remembrance Day', category: 'holiday', description: 'Respectful tribute with poppies' },
    { id: 'christmas' as BannerTheme, name: 'Christmas', category: 'holiday', description: 'Festive northern lights' },
    { id: 'newyear' as BannerTheme, name: 'New Year', category: 'holiday', description: 'Fireworks over Great Slave Lake' },
    { id: 'canada' as BannerTheme, name: 'Canada Day', category: 'holiday', description: 'Red and white with maple leaves' },
    { id: 'indigenous' as BannerTheme, name: 'Indigenous Peoples Day', category: 'holiday', description: 'Cultural celebration' },
    { id: 'easter' as BannerTheme, name: 'Easter', category: 'holiday', description: 'Spring renewal theme' },
  ];

  const categories = {
    seasonal: bannerVariations.filter(b => b.category === 'seasonal'),
    holiday: bannerVariations.filter(b => b.category === 'holiday'),
  };

  // Fetch weather settings on mount
  useEffect(() => {
    const fetchWeatherSettings = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .eq('category', 'banner');

        if (data && !error) {
          const settingsObj: Record<string, any> = {};
          data.forEach((setting: any) => {
            settingsObj[setting.key] = setting.value;
          });
          setWeatherSettings(settingsObj);
        }
      } catch (err) {
        console.error('Error fetching weather settings:', err);
      }
    };

    fetchWeatherSettings();
  }, []);

  const handleSetActive = () => {
    setActiveTheme(previewTheme);
    alert(`Banner set to: ${bannerVariations.find(b => b.id === previewTheme)?.name}`);
  };

  const handleSaveWeatherSettings = async () => {
    setSavingWeather(true);
    try {
      const supabase = createClient();
      const updates = Object.keys(weatherSettings).map(key => ({
        key,
        value: weatherSettings[key],
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates, { onConflict: 'key' });

      if (!error) {
        alert('Weather settings saved successfully!');
      } else {
        alert('Error saving weather settings: ' + error.message);
      }
    } catch (err) {
      alert('Error saving weather settings: ' + err);
    } finally {
      setSavingWeather(false);
    }
  };

  const PreviewBanner = BANNER_THEMES[previewTheme];

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      {/* Header */}
      <div className="bg-northern-midnight/80 backdrop-blur-lg border-b border-aurora-green/10 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link
                href="/admin"
                className="text-aurora-green hover:text-aurora-blue transition-colors inline-flex items-center gap-2 mb-2"
              >
                ← Back to Admin
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                Banner Management
              </h1>
              <p className="text-gray-300 mt-2">
                Preview and manage all banner variations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Variation Selector */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Variations</h2>

              {/* Auto Mode Toggle */}
              <div className="mb-6 p-4 bg-dark-700/50 rounded-lg border border-aurora-green/20">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoDetect}
                    onChange={toggleAutoDetect}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="text-white font-semibold">Auto Mode</div>
                    <div className="text-xs text-gray-400">Detect season & holidays</div>
                  </div>
                </label>
              </div>

              {/* Seasonal */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Seasonal</h3>
                <div className="space-y-2">
                  {categories.seasonal.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => setPreviewTheme(variation.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        previewTheme === variation.id
                          ? 'bg-gradient-to-r from-aurora-green to-aurora-blue text-white shadow-aurora'
                          : 'bg-dark-700/50 text-gray-300 hover:bg-dark-700'
                      }`}
                    >
                      {variation.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Holidays */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Holidays</h3>
                <div className="space-y-2">
                  {categories.holiday.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => setPreviewTheme(variation.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        previewTheme === variation.id
                          ? 'bg-gradient-to-r from-aurora-green to-aurora-blue text-white shadow-aurora'
                          : 'bg-dark-700/50 text-gray-300 hover:bg-dark-700'
                      }`}
                    >
                      {variation.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="lg:col-span-3">
            {/* Banner Preview */}
            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {bannerVariations.find(b => b.id === previewTheme)?.name}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {bannerVariations.find(b => b.id === previewTheme)?.description}
                  </p>
                </div>
                <button
                  onClick={handleSetActive}
                  className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
                >
                  Set as Active
                </button>
              </div>

              {/* Preview Container */}
              <div className="bg-dark-900 rounded-lg overflow-hidden border-2 border-gray-700">
                <PreviewBanner temperature={-25} />
              </div>

              {/* Status */}
              {currentTheme === previewTheme && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="text-xl">✓</span>
                    <span className="font-semibold">This banner is currently active on your site</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-dark-800 rounded-xl p-6 border border-aurora-blue/20">
                <h3 className="text-white font-semibold mb-4">Current Settings</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Theme:</span>
                    <span className="text-white font-semibold capitalize">{currentTheme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auto Detection:</span>
                    <span className={`font-semibold ${settings.autoDetect ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {settings.autoDetect ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Themes:</span>
                    <span className="text-white font-semibold">11</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-800 rounded-xl p-6 border border-aurora-purple/20">
                <h3 className="text-white font-semibold mb-4">How It Works</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex gap-2">
                    <span className="text-aurora-green">•</span>
                    <span>Auto mode switches banners based on season</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-aurora-blue">•</span>
                    <span>Holiday themes appear 2 weeks before holidays</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-aurora-purple">•</span>
                    <span>Manual mode lets you pick any theme</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Weather Effects Controls */}
            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Weather Effects</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Control live weather effects on seasonal banners
                  </p>
                </div>
                <button
                  onClick={handleSaveWeatherSettings}
                  disabled={savingWeather}
                  className="px-4 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all disabled:opacity-50"
                >
                  {savingWeather ? 'Saving...' : 'Save Weather Settings'}
                </button>
              </div>

              {/* Force Weather Override */}
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span>⚡</span>
                  Force Weather Override
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  Override live weather data and manually display specific weather effects
                </p>

                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={weatherSettings.weather_force_enabled === true}
                      onChange={(e) => setWeatherSettings({
                        ...weatherSettings,
                        weather_force_enabled: e.target.checked
                      })}
                      className="w-5 h-5"
                    />
                    <span className="text-white font-medium">Enable Force Weather</span>
                  </label>

                  {weatherSettings.weather_force_enabled && (
                    <select
                      value={weatherSettings.weather_force_condition || 'none'}
                      onChange={(e) => setWeatherSettings({
                        ...weatherSettings,
                        weather_force_condition: e.target.value
                      })}
                      className="flex-1 min-w-[200px] px-4 py-2 bg-dark-700 border border-aurora-green/30 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                    >
                      <option value="none">None (Use Live Weather)</option>
                      <option value="snow">❄️ Snow</option>
                      <option value="rain">🌧️ Rain</option>
                      <option value="drizzle">🌦️ Drizzle</option>
                      <option value="thunderstorm">⛈️ Thunderstorm</option>
                      <option value="fog">🌫️ Fog</option>
                      <option value="mist">🌫️ Mist</option>
                      <option value="haze">🌫️ Haze</option>
                      <option value="clouds">☁️ Clouds</option>
                      <option value="clear">☀️ Clear Sky</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Master Toggle */}
              <div className="mb-6 pb-6 border-b border-gray-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weatherSettings.weather_effects_enabled !== false}
                    onChange={(e) => setWeatherSettings({
                      ...weatherSettings,
                      weather_effects_enabled: e.target.checked
                    })}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="text-white font-medium">Enable All Weather Effects</div>
                    <div className="text-sm text-gray-400">Master toggle for all weather effects on banners</div>
                  </div>
                </label>
              </div>

              {/* Individual Effect Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={weatherSettings.weather_effects_snow !== false}
                    onChange={(e) => setWeatherSettings({
                      ...weatherSettings,
                      weather_effects_snow: e.target.checked
                    })}
                    disabled={weatherSettings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">❄️ Snow</div>
                    <div className="text-xs text-gray-500">80 particles</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={weatherSettings.weather_effects_rain !== false}
                    onChange={(e) => setWeatherSettings({
                      ...weatherSettings,
                      weather_effects_rain: e.target.checked
                    })}
                    disabled={weatherSettings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">🌧️ Rain</div>
                    <div className="text-xs text-gray-500">Intensity-based</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={weatherSettings.weather_effects_thunderstorm !== false}
                    onChange={(e) => setWeatherSettings({
                      ...weatherSettings,
                      weather_effects_thunderstorm: e.target.checked
                    })}
                    disabled={weatherSettings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">⛈️ Storm</div>
                    <div className="text-xs text-gray-500">Lightning</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={weatherSettings.weather_effects_fog !== false}
                    onChange={(e) => setWeatherSettings({
                      ...weatherSettings,
                      weather_effects_fog: e.target.checked
                    })}
                    disabled={weatherSettings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">🌫️ Fog</div>
                    <div className="text-xs text-gray-500">Drifting layers</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={weatherSettings.weather_effects_clouds !== false}
                    onChange={(e) => setWeatherSettings({
                      ...weatherSettings,
                      weather_effects_clouds: e.target.checked
                    })}
                    disabled={weatherSettings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">☁️ Clouds</div>
                    <div className="text-xs text-gray-500">Drifting shapes</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={weatherSettings.weather_effects_wind !== false}
                    onChange={(e) => setWeatherSettings({
                      ...weatherSettings,
                      weather_effects_wind: e.target.checked
                    })}
                    disabled={weatherSettings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">💨 Wind</div>
                    <div className="text-xs text-gray-500">&gt;20 km/h</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={weatherSettings.weather_effects_clear !== false}
                    onChange={(e) => setWeatherSettings({
                      ...weatherSettings,
                      weather_effects_clear: e.target.checked
                    })}
                    disabled={weatherSettings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">✨ Clear</div>
                    <div className="text-xs text-gray-500">Sparkles</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
