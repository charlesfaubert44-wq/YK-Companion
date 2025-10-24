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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (data && !error) {
      const settingsObj: Record<string, any> = {};
      data.forEach((setting: any) => {
        settingsObj[setting.key] = typeof setting.value === 'string'
          ? JSON.parse(setting.value)
          : setting.value;
      });
      setSettings(settingsObj);
    }
    setLoading(false);
  };

  const updateSetting = async (key: string, value: any) => {
    setSaving(true);

    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key,
        value: JSON.stringify(value),
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
      value: JSON.stringify(settings[key]),
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
        <div className="text-white text-xl">Loading settings...</div>
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
