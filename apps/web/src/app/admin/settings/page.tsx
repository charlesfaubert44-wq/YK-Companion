'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAdminGuard } from '@/hooks/useAdminGuard';

export default function SystemSettingsPage() {
  const { loading: authLoading, isAdmin, profile } = useAdminGuard();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'integrations'>('general');

  // Show loading state while checking auth
  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      {/* Header */}
      <div className="bg-northern-midnight/80 backdrop-blur-lg border-b border-aurora-green/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="text-aurora-green hover:text-aurora-blue transition-colors inline-flex items-center gap-2 mb-2"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                System Settings
              </h1>
              <p className="text-gray-300 mt-2">
                Configure platform settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'general'
                ? 'bg-aurora-green text-dark-900'
                : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-aurora-green text-dark-900'
                : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-aurora-green text-dark-900'
                : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'integrations'
                ? 'bg-aurora-green text-dark-900'
                : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
            }`}
          >
            Integrations
          </button>
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
              <h3 className="text-xl font-bold text-white mb-4">Platform Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Platform Name</label>
                  <input
                    type="text"
                    defaultValue="YK Buddy"
                    className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Platform Description</label>
                  <textarea
                    defaultValue="Your comprehensive guide to Yellowknife"
                    rows={3}
                    className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Contact Email</label>
                  <input
                    type="email"
                    defaultValue="admin@ykbuddy.com"
                    className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green"
                  />
                </div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
              <h3 className="text-xl font-bold text-white mb-4">Feature Toggles</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Knowledge Submissions</div>
                    <div className="text-gray-400 text-sm">Allow users to submit knowledge entries</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aurora-green"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">User Registration</div>
                    <div className="text-gray-400 text-sm">Allow new users to register</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aurora-green"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Premium Sponsors</div>
                    <div className="text-gray-400 text-sm">Display premium sponsor content</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aurora-green"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Seasonal Banners</div>
                    <div className="text-gray-400 text-sm">Auto-detect and display seasonal banners</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aurora-green"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
              <h3 className="text-xl font-bold text-white mb-4">Admin Information</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-400 text-sm">Your Account</div>
                  <div className="text-white font-semibold mt-1">{profile?.email}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Role</div>
                  <div className="text-aurora-green font-semibold mt-1">Super Administrator</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Account Created</div>
                  <div className="text-white font-semibold mt-1">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
              <h3 className="text-xl font-bold text-white mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Two-Factor Authentication</div>
                    <div className="text-gray-400 text-sm">Add extra security to your account</div>
                  </div>
                  <button className="px-4 py-2 bg-aurora-green/20 text-aurora-green rounded-lg hover:bg-aurora-green/30 transition-all">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Session Timeout</div>
                    <div className="text-gray-400 text-sm">Auto logout after inactivity</div>
                  </div>
                  <select className="px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>Never</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Login Attempts</div>
                    <div className="text-gray-400 text-sm">Max failed attempts before lockout</div>
                  </div>
                  <select className="px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green">
                    <option>3 attempts</option>
                    <option>5 attempts</option>
                    <option>10 attempts</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Clear All Cache</div>
                    <div className="text-gray-400 text-sm">Remove all cached data</div>
                  </div>
                  <button className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all">
                    Clear Cache
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Export All Data</div>
                    <div className="text-gray-400 text-sm">Download complete database backup</div>
                  </div>
                  <button className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
              <h3 className="text-xl font-bold text-white mb-4">Email Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">New User Registration</div>
                    <div className="text-gray-400 text-sm">Get notified when users register</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aurora-green"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Knowledge Submissions</div>
                    <div className="text-gray-400 text-sm">Get notified of new submissions</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aurora-green"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">System Errors</div>
                    <div className="text-gray-400 text-sm">Get notified of critical errors</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aurora-green"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
              <h3 className="text-xl font-bold text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Notification Email</label>
                  <input
                    type="email"
                    defaultValue={profile?.email || ''}
                    className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Digest Frequency</label>
                  <select className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green">
                    <option>Real-time</option>
                    <option>Daily Digest</option>
                    <option>Weekly Digest</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integrations Settings */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
              <h3 className="text-xl font-bold text-white mb-4">Connected Services</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🗄️</div>
                    <div>
                      <div className="text-white font-semibold">Supabase</div>
                      <div className="text-green-400 text-sm">Connected</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg">
                    Configured
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">📊</div>
                    <div>
                      <div className="text-white font-semibold">Analytics</div>
                      <div className="text-gray-400 text-sm">Not connected</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-aurora-green/20 text-aurora-green rounded-lg hover:bg-aurora-green/30 transition-all">
                    Connect
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">📧</div>
                    <div>
                      <div className="text-white font-semibold">Email Service</div>
                      <div className="text-gray-400 text-sm">Not connected</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-aurora-green/20 text-aurora-green rounded-lg hover:bg-aurora-green/30 transition-all">
                    Connect
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
              <h3 className="text-xl font-bold text-white mb-4">API Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">API Base URL</label>
                  <input
                    type="text"
                    defaultValue="https://api.ykbuddy.com"
                    className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">API Rate Limit</label>
                  <select className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green">
                    <option>100 requests/minute</option>
                    <option>500 requests/minute</option>
                    <option>1000 requests/minute</option>
                    <option>Unlimited</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="px-6 py-3 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-colors">
            Cancel
          </button>
          <button className="px-6 py-3 bg-aurora-green text-dark-900 rounded-lg font-semibold hover:bg-aurora-blue transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
