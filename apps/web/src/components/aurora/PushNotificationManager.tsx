'use client';

import { useState, useEffect } from 'react';
import {
  PushSubscription as PushSubscriptionType,
  NotificationPreferences,
} from '@/types/aurora-enhancements.types';

interface Props {
  userId: string;
  onClose: () => void;
}

export default function PushNotificationManager({ userId, onClose }: Props) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscriptionType | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push_enabled: false,
    push_kp_threshold: 4.0,
    push_new_event: true,
    push_photo_featured: true,
    push_challenge_start: true,
    push_mosaic_ready: true,
    email_enabled: false,
    email_digest_frequency: 'weekly',
    email_top_photos: true,
    email_mosaics: true,
    email_forecast: true,
    email_challenges: true,
    email_personal_stats: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPushSupport();
    fetchPreferences();
  }, []);

  const checkPushSupport = () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkExistingSubscription();
    }
  };

  const checkExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSub = await registration.pushManager.getSubscription();
      if (existingSub) {
        setIsSubscribed(true);
        // TODO: Fetch subscription from Supabase
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const fetchPreferences = async () => {
    try {
      // TODO: Replace with actual Supabase call
      // const { data } = await supabase
      //   .from('aurora_preferences')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .single();
      // if (data) setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const subscribeToPush = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Please enable notifications to receive aurora alerts!');
        setLoading(false);
        return;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''),
      });

      // Save subscription to database
      // TODO: Replace with actual Supabase call
      // await supabase.from('push_subscriptions').insert({
      //   user_id: userId,
      //   endpoint: subscription.endpoint,
      //   p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
      //   auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
      //   notify_kp_threshold: preferences.push_kp_threshold,
      // });

      setIsSubscribed(true);
      setPreferences({ ...preferences, push_enabled: true });
    } catch (error) {
      console.error('Error subscribing to push:', error);
      alert('Failed to subscribe to notifications. Please try again.');
    }
    setLoading(false);
  };

  const unsubscribeFromPush = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        // TODO: Delete from Supabase
        setIsSubscribed(false);
        setPreferences({ ...preferences, push_enabled: false });
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
    setLoading(false);
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);

    try {
      // TODO: Replace with actual Supabase call
      // await supabase
      //   .from('aurora_preferences')
      //   .upsert({
      //     user_id: userId,
      //     ...newPrefs,
      //   });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-dark-900 rounded-2xl max-w-2xl w-full border-2 border-aurora-green/50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-900 border-b border-gray-800 p-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-aurora-green to-aurora-blue bg-clip-text text-transparent mb-2">
                🔔 Notification Settings
              </h2>
              <p className="text-gray-400">
                Configure how you want to be notified about aurora activity
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Push Notifications */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Push Notifications</h3>

            {!isSupported ? (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-300">
                ⚠️ Push notifications are not supported in your browser
              </div>
            ) : (
              <>
                <div className="bg-dark-800 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-white">Enable Push Notifications</div>
                      <div className="text-sm text-gray-400">
                        Receive real-time alerts on this device
                      </div>
                    </div>
                    <button
                      onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
                      disabled={loading}
                      className={`px-6 py-2 rounded-lg font-bold transition-all ${
                        isSubscribed
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-aurora-green hover:bg-aurora-green/90 text-white'
                      }`}
                    >
                      {loading ? '...' : isSubscribed ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>

                {isSubscribed && (
                  <div className="space-y-4">
                    {/* KP Threshold */}
                    <div className="bg-dark-800 rounded-xl p-4">
                      <label className="block font-semibold text-white mb-2">
                        KP Index Threshold
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="3"
                          max="9"
                          step="0.5"
                          value={preferences.push_kp_threshold}
                          onChange={e =>
                            updatePreferences({ push_kp_threshold: parseFloat(e.target.value) })
                          }
                          className="flex-1"
                        />
                        <span className="text-2xl font-bold text-aurora-green w-16 text-center">
                          {preferences.push_kp_threshold.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Get notified when KP index reaches this level
                      </p>
                    </div>

                    {/* Notification Types */}
                    <div className="bg-dark-800 rounded-xl p-4 space-y-3">
                      <label className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">New Event Starts</div>
                          <div className="text-sm text-gray-400">
                            When a new aurora event begins
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.push_new_event}
                          onChange={e => updatePreferences({ push_new_event: e.target.checked })}
                          className="w-5 h-5"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">Photo Featured</div>
                          <div className="text-sm text-gray-400">When your photo is featured</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.push_photo_featured}
                          onChange={e =>
                            updatePreferences({ push_photo_featured: e.target.checked })
                          }
                          className="w-5 h-5"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">Challenge Starts</div>
                          <div className="text-sm text-gray-400">
                            When a photography challenge begins
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.push_challenge_start}
                          onChange={e =>
                            updatePreferences({ push_challenge_start: e.target.checked })
                          }
                          className="w-5 h-5"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">Mosaic Ready</div>
                          <div className="text-sm text-gray-400">When your mosaic is generated</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.push_mosaic_ready}
                          onChange={e => updatePreferences({ push_mosaic_ready: e.target.checked })}
                          className="w-5 h-5"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Test Notification */}
          {isSubscribed && (
            <div className="bg-aurora-green/10 border border-aurora-green/30 rounded-lg p-4">
              <button
                onClick={() => {
                  new Notification('Aurora Alert Test', {
                    body: 'This is a test notification from YK Companion!',
                    icon: '/aurora-icon.png',
                    badge: '/aurora-badge.png',
                  });
                }}
                className="w-full py-3 bg-aurora-green/20 hover:bg-aurora-green/30 text-aurora-green font-bold rounded-lg transition-colors"
              >
                🧪 Send Test Notification
              </button>
            </div>
          )}

          {/* Info */}
          <div className="bg-dark-800 rounded-lg p-4 text-sm text-gray-400">
            <strong className="text-white">Note:</strong> Push notifications require browser
            permission. You can manage these settings in your browser at any time. Notifications
            will only be sent when conditions match your preferences.
          </div>
        </div>
      </div>
    </div>
  );
}
