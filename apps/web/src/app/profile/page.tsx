'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import InteractiveHeader from '@/components/InteractiveHeader';

export default function ProfilePage() {
  const { user, profile, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in
  if (!loading && !user) {
    router.push('/');
    return null;
  }

  if (loading) {
    return (
      <>
        <InteractiveHeader />
        <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20">
          <div className="container mx-auto px-4 py-12 flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      await updateProfile({
        full_name: fullName || null,
        address: address || null,
      });
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(profile?.full_name || '');
    setAddress(profile?.address || '');
    setEditing(false);
    setError(null);
  };

  return (
    <>
      <InteractiveHeader />
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple rounded-full blur-md opacity-75"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple flex items-center justify-center text-4xl font-bold shadow-2xl">
                  {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
              <p className="text-gray-400">Manage your account information</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-aurora-green/10 border border-aurora-green/30 text-aurora-green rounded-lg p-4 text-center animate-pulse">
                Profile updated successfully!
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-4 text-center">
                {error}
              </div>
            )}

            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              {/* Account Information */}
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <div className="px-4 py-3 bg-dark-800/50 border border-gray-700 rounded-lg text-white">
                    {user?.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
                      placeholder="Your name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-dark-800/50 border border-gray-700 rounded-lg text-white">
                      {profile?.full_name || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                  {editing ? (
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
                      placeholder="Your address (optional)"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-dark-800/50 border border-gray-700 rounded-lg text-white">
                      {profile?.address || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">User Type</label>
                  <div className="px-4 py-3 bg-dark-800/50 border border-gray-700 rounded-lg">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-2xl">
                        {profile?.user_type === 'visiting' && '🏔️'}
                        {profile?.user_type === 'living' && '🏠'}
                        {profile?.user_type === 'moving' && '📦'}
                      </span>
                      <span className="text-white capitalize">{profile?.user_type || 'Not set'}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Account Created</label>
                  <div className="px-4 py-3 bg-dark-800/50 border border-gray-700 rounded-lg text-white">
                    {new Date(profile?.created_at || '').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-8 py-6 bg-gradient-to-r from-aurora-green/10 via-aurora-blue/10 to-aurora-purple/10 border-t border-white/10 flex gap-4">
                {editing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold py-3 rounded-lg hover:shadow-aurora transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 bg-dark-800 text-gray-300 font-semibold py-3 rounded-lg hover:bg-dark-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold py-3 rounded-lg hover:shadow-aurora transition-all"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Account Stats */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-blue/20 backdrop-blur-lg p-6 rounded-xl border border-aurora-green/30">
                <div className="text-3xl mb-2">🔖</div>
                <div className="text-sm text-gray-400">Saved Items</div>
                <div className="text-2xl font-bold text-white">0</div>
              </div>
              <div className="bg-gradient-to-br from-aurora-blue/20 to-aurora-purple/20 backdrop-blur-lg p-6 rounded-xl border border-aurora-blue/30">
                <div className="text-3xl mb-2">📍</div>
                <div className="text-sm text-gray-400">Places Visited</div>
                <div className="text-2xl font-bold text-white">0</div>
              </div>
              <div className="bg-gradient-to-br from-aurora-purple/20 to-aurora-pink/20 backdrop-blur-lg p-6 rounded-xl border border-aurora-purple/30">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-sm text-gray-400">Days Active</div>
                <div className="text-2xl font-bold text-white">
                  {Math.floor((Date.now() - new Date(profile?.created_at || '').getTime()) / (1000 * 60 * 60 * 24))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
