'use client';

import { useState, useEffect } from 'react';
import { EmailDigestPreferences } from '@/types/aurora-enhancements.types';

interface Props {
  userId: string;
  onClose?: () => void;
}

export default function EmailDigestSettings({ userId, onClose }: Props) {
  const [preferences, setPreferences] = useState<EmailDigestPreferences>({
    user_id: userId,
    digest_frequency: 'weekly',
    digest_day: 0, // 0 = Sunday
    include_top_photos: true,
    include_mosaics: true,
    include_forecast: true,
    include_challenges: true,
    include_personal_stats: true,
    last_sent: null,
    next_scheduled: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, [userId]);

  const fetchPreferences = async () => {
    try {
      // TODO: Replace with actual Supabase call
      // const { data } = await supabase
      //   .from('email_digest_preferences')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .single();
      // if (data) setPreferences(data);
    } catch (error) {
      console.error('Error fetching email preferences:', error);
    }
  };

  const updatePreferences = (updates: Partial<EmailDigestPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const savePreferences = async () => {
    setSaving(true);
    setSaved(false);

    try {
      // TODO: Replace with actual Supabase call
      // await supabase
      //   .from('email_digest_preferences')
      //   .upsert({
      //     user_id: userId,
      //     ...preferences,
      //     updated_at: new Date().toISOString(),
      //   });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    }

    setSaving(false);
  };

  const getDayName = (dayIndex: number) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
  };

  const getNextSendDate = () => {
    if (preferences.digest_frequency === 'never') return null;

    const now = new Date();
    const nextSend = new Date();

    if (preferences.digest_frequency === 'daily') {
      nextSend.setDate(now.getDate() + 1);
      nextSend.setHours(9, 0, 0, 0);
    } else if (preferences.digest_frequency === 'weekly') {
      const daysUntilTarget = ((preferences.digest_day || 0) - now.getDay() + 7) % 7 || 7;
      nextSend.setDate(now.getDate() + daysUntilTarget);
      nextSend.setHours(9, 0, 0, 0);
    } else if (preferences.digest_frequency === 'monthly') {
      nextSend.setMonth(now.getMonth() + 1);
      nextSend.setDate(preferences.digest_day || 1);
      nextSend.setHours(9, 0, 0, 0);
    }

    return nextSend;
  };

  const nextSendDate = getNextSendDate();

  return (
    <div className={onClose ? "fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto" : ""}>
      <div className={`${onClose ? 'bg-dark-900 rounded-2xl max-w-2xl w-full border-2 border-aurora-blue/50 max-h-[90vh] overflow-y-auto' : 'w-full'}`}>
        {/* Header */}
        <div className={`${onClose ? 'sticky top-0 bg-dark-900 border-b border-gray-800 p-6 z-10' : 'mb-6'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-aurora-blue to-aurora-purple bg-clip-text text-transparent mb-2">
                📧 Email Digest Settings
              </h2>
              <p className="text-gray-400">
                Configure your aurora activity email summaries
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className={onClose ? "p-6 space-y-6" : "space-y-6"}>
          {/* Frequency */}
          <div>
            <label className="block text-lg font-bold text-white mb-3">
              📅 Digest Frequency
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['daily', 'weekly', 'monthly', 'never'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => updatePreferences({ digest_frequency: freq })}
                  className={`py-3 px-4 rounded-lg font-bold border-2 transition-all capitalize ${
                    preferences.digest_frequency === freq
                      ? 'bg-aurora-blue border-aurora-blue text-white'
                      : 'bg-dark-800 border-gray-700 text-gray-400 hover:border-aurora-blue/50'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Day Selection for Weekly/Monthly */}
          {(preferences.digest_frequency === 'weekly' || preferences.digest_frequency === 'monthly') && (
            <div>
              <label className="block text-lg font-bold text-white mb-3">
                {preferences.digest_frequency === 'weekly' ? '📆 Day of Week' : '📆 Day of Month'}
              </label>
              {preferences.digest_frequency === 'weekly' ? (
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                    <button
                      key={day}
                      onClick={() => updatePreferences({ digest_day: day })}
                      className={`py-3 px-2 rounded-lg font-bold border-2 transition-all ${
                        preferences.digest_day === day
                          ? 'bg-aurora-purple border-aurora-purple text-white'
                          : 'bg-dark-800 border-gray-700 text-gray-400 hover:border-aurora-purple/50'
                      }`}
                    >
                      {getDayName(day).slice(0, 3)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <button
                      key={day}
                      onClick={() => updatePreferences({ digest_day: day })}
                      className={`py-2 px-2 rounded-lg font-bold border-2 transition-all ${
                        preferences.digest_day === day
                          ? 'bg-aurora-purple border-aurora-purple text-white'
                          : 'bg-dark-800 border-gray-700 text-gray-400 hover:border-aurora-purple/50'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content Preferences */}
          {preferences.digest_frequency !== 'never' && (
            <div>
              <label className="block text-lg font-bold text-white mb-3">
                📋 Include in Digest
              </label>
              <div className="bg-dark-800 rounded-xl p-4 space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📸</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-aurora-blue transition-colors">
                        Top Community Photos
                      </div>
                      <div className="text-sm text-gray-400">
                        Best photos from the community
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.include_top_photos}
                    onChange={(e) => updatePreferences({ include_top_photos: e.target.checked })}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-aurora-blue transition-colors">
                        New Mosaics
                      </div>
                      <div className="text-sm text-gray-400">
                        Recently created photo mosaics
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.include_mosaics}
                    onChange={(e) => updatePreferences({ include_mosaics: e.target.checked })}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔮</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-aurora-blue transition-colors">
                        Aurora Forecast
                      </div>
                      <div className="text-sm text-gray-400">
                        Upcoming viewing predictions
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.include_forecast}
                    onChange={(e) => updatePreferences({ include_forecast: e.target.checked })}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-aurora-blue transition-colors">
                        Photography Challenges
                      </div>
                      <div className="text-sm text-gray-400">
                        Active and upcoming challenges
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.include_challenges}
                    onChange={(e) => updatePreferences({ include_challenges: e.target.checked })}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-aurora-blue transition-colors">
                        Your Personal Stats
                      </div>
                      <div className="text-sm text-gray-400">
                        Your activity summary and achievements
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.include_personal_stats}
                    onChange={(e) => updatePreferences({ include_personal_stats: e.target.checked })}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Next Send Info */}
          {nextSendDate && preferences.digest_frequency !== 'never' && (
            <div className="bg-gradient-to-r from-aurora-blue/10 to-aurora-purple/10 border border-aurora-blue/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📬</span>
                <div>
                  <div className="font-semibold text-white">Next Digest Scheduled</div>
                  <div className="text-sm text-gray-400">
                    {nextSendDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {preferences.digest_frequency === 'never' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-yellow-300">
              ⚠️ Email digests are disabled. You won't receive any aurora activity summaries.
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-dark-800 text-white hover:bg-dark-700 rounded-lg font-bold transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={savePreferences}
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white font-bold rounded-xl hover:shadow-glow transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Preferences'}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-dark-800 rounded-lg p-4 text-sm text-gray-400">
            <strong className="text-white">Note:</strong> Digests are sent at 9:00 AM in your local timezone.
            You can update these settings at any time.
          </div>
        </div>
      </div>
    </div>
  );
}
