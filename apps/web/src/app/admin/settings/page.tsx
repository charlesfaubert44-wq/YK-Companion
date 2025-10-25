'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Setting {
  key: string;
  value: any;
  category: string;
  description?: string;
}

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    console.log('AdminSettingsPage mounted');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase client:', supabase);
    setDebugInfo('Component mounted, starting fetch...');
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setDebugInfo('Creating query...');
      console.log('[1] Creating Supabase query');

      const query = supabase
        .from('site_settings')
        .select('key, value, category, description');

      console.log('[2] Query object created, executing...');
      setDebugInfo('Executing query...');

      const startTime = Date.now();
      const result = await query;
      const endTime = Date.now();

      console.log(`[3] Query completed in ${endTime - startTime}ms`);
      console.log('[4] Result:', result);

      const { data, error } = result;
      setDebugInfo(`Query took ${endTime - startTime}ms. Rows: ${data?.length || 0}`);

      if (data && !error) {
        const settingsObj: Record<string, any> = {};
        data.forEach((setting: any) => {
          // Values are stored as plain text, not JSON - use them directly
          settingsObj[setting.key] = setting.value;
        });
        console.log('Parsed settings:', settingsObj);
        setDebugInfo(`Successfully loaded ${Object.keys(settingsObj).length} settings`);
        setSettings(settingsObj);
      } else if (error) {
        console.error('Error fetching settings:', error);
        setDebugInfo(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error('Unexpected error in fetchSettings:', err);
      setDebugInfo(`Unexpected error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setSaving(true);

    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key,
        value: value, // Store as plain text
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (!error) {
      setSettings({ ...settings, [key]: value });
      alert('Setting updated successfully');
    } else {
      alert('Error updating setting: ' + error.message);
    }

    setSaving(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Update all settings in batch
    const updates = Object.keys(settings).map(key => ({
      key,
      value: settings[key], // Store as plain text
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('site_settings')
      .upsert(updates, { onConflict: 'key' });

    if (!error) {
      alert('All settings saved successfully');
    } else {
      alert('Error saving settings: ' + error.message);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-xl mb-4">Loading settings...</div>
          {debugInfo && (
            <div className="text-sm text-aurora-purple">Debug: {debugInfo}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Site Settings</h1>
            <p className="text-gray-400">Configure platform-wide settings</p>
          </div>
          <Link href="/admin" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
            ← Back to Admin
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">General</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.site_name || 'YK Buddy'}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Site Tagline
                </label>
                <input
                  type="text"
                  value={settings.site_tagline || 'Your Yellowknife Companion'}
                  onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email || 'hello@ykbuddy.ca'}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Language
                </label>
                <select
                  value={settings.default_language || 'en'}
                  onChange={(e) => setSettings({ ...settings, default_language: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="vi">Tiếng Việt</option>
                  <option value="tl">Tagalog</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone || 'America/Yellowknife'}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                >
                  <option value="America/Yellowknife">America/Yellowknife</option>
                  <option value="America/Edmonton">America/Edmonton</option>
                  <option value="America/Vancouver">America/Vancouver</option>
                  <option value="America/Toronto">America/Toronto</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenance_mode === true}
                    onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="text-white font-medium">Maintenance Mode</div>
                    <div className="text-sm text-gray-400">Temporarily disable public access to the site</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Security</h2>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.user_registration_enabled !== false}
                    onChange={(e) => setSettings({ ...settings, user_registration_enabled: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="text-white font-medium">Allow User Registration</div>
                    <div className="text-sm text-gray-400">Enable new users to create accounts</div>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email_verification_required !== false}
                    onChange={(e) => setSettings({ ...settings, email_verification_required: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="text-white font-medium">Require Email Verification</div>
                    <div className="text-sm text-gray-400">Users must verify their email before accessing the platform</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Integration Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Integrations</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={settings.google_analytics_id || ''}
                  onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Your Google Analytics measurement ID</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mapbox API Key
                </label>
                <input
                  type="text"
                  value={settings.mapbox_api_key || ''}
                  onChange={(e) => setSettings({ ...settings, mapbox_api_key: e.target.value })}
                  placeholder="pk.ey..."
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">For garage sale map functionality</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stripe Publishable Key
                </label>
                <input
                  type="text"
                  value={settings.stripe_publishable_key || ''}
                  onChange={(e) => setSettings({ ...settings, stripe_publishable_key: e.target.value })}
                  placeholder="pk_live_..."
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">For payment processing</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Social Media</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={settings.facebook_url || ''}
                  onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/ykbuddy"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Twitter/X URL
                </label>
                <input
                  type="url"
                  value={settings.twitter_url || ''}
                  onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                  placeholder="https://twitter.com/ykbuddy"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={settings.instagram_url || ''}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/ykbuddy"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Weather Effects */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Weather Effects</h2>
            <p className="text-gray-400 text-sm mb-6">
              Control live weather effects that appear on seasonal banners based on real-time Yellowknife weather conditions.
            </p>

            <div className="space-y-6">
              {/* Master Toggle */}
              <div className="pb-6 border-b border-gray-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weather_effects_enabled !== false}
                    onChange={(e) => setSettings({ ...settings, weather_effects_enabled: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="text-white font-medium">Enable Weather Effects</div>
                    <div className="text-sm text-gray-400">Master toggle for all weather effects on banners</div>
                  </div>
                </label>
              </div>

              {/* Individual Effect Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weather_effects_snow !== false}
                    onChange={(e) => setSettings({ ...settings, weather_effects_snow: e.target.checked })}
                    disabled={settings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="text-white text-sm font-medium">❄️ Snow Effect</div>
                    <div className="text-xs text-gray-500">80 falling particles with wind drift</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weather_effects_rain !== false}
                    onChange={(e) => setSettings({ ...settings, weather_effects_rain: e.target.checked })}
                    disabled={settings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="text-white text-sm font-medium">🌧️ Rain Effect</div>
                    <div className="text-xs text-gray-500">Rainfall with intensity variations</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weather_effects_thunderstorm !== false}
                    onChange={(e) => setSettings({ ...settings, weather_effects_thunderstorm: e.target.checked })}
                    disabled={settings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="text-white text-sm font-medium">⛈️ Thunderstorm Effect</div>
                    <div className="text-xs text-gray-500">Heavy rain + lightning flashes</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weather_effects_fog !== false}
                    onChange={(e) => setSettings({ ...settings, weather_effects_fog: e.target.checked })}
                    disabled={settings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="text-white text-sm font-medium">🌫️ Fog/Mist Effect</div>
                    <div className="text-xs text-gray-500">Drifting fog layers</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weather_effects_clouds !== false}
                    onChange={(e) => setSettings({ ...settings, weather_effects_clouds: e.target.checked })}
                    disabled={settings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="text-white text-sm font-medium">☁️ Clouds Effect</div>
                    <div className="text-xs text-gray-500">Drifting cloud shapes</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weather_effects_wind !== false}
                    onChange={(e) => setSettings({ ...settings, weather_effects_wind: e.target.checked })}
                    disabled={settings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="text-white text-sm font-medium">💨 Wind Effect</div>
                    <div className="text-xs text-gray-500">Streaks when wind &gt; 20 km/h</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weather_effects_clear !== false}
                    onChange={(e) => setSettings({ ...settings, weather_effects_clear: e.target.checked })}
                    disabled={settings.weather_effects_enabled === false}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="text-white text-sm font-medium">✨ Clear Sky Effect</div>
                    <div className="text-xs text-gray-500">Floating sparkles for sunny weather</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={fetchSettings}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              Reset Changes
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
