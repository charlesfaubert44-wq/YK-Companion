'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProfileForm from '@/components/profile/ProfileForm';
import AvatarUpload from '@/components/profile/AvatarUpload';
import Link from 'next/link';

/**
 * Profile Page
 * 
 * Displays and allows editing of user profile information.
 * Includes avatar upload, profile editing, and account management.
 */
export default function ProfilePage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.')) {
      setShowDeleteConfirm(false);
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-aurora-blue border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-xl font-semibold">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-aurora-green transition mb-6"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Avatar and Quick Info */}
          <div className="lg:col-span-1">
            <div className="bg-dark-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6">
              <AvatarUpload 
                userId={user.id}
                currentAvatarUrl={profile.avatar_url}
              />

              <div className="mt-6 space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-white font-medium">{user.email}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">User Type</label>
                  <p className="text-white font-medium capitalize">
                    {profile.user_type || 'Not set'}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Member Since</label>
                  <p className="text-white font-medium">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-700/50 space-y-2">
                <Link
                  href="/saved"
                  className="block w-full px-4 py-2 bg-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue/30 rounded-lg transition text-center font-medium"
                >
                  📑 Saved Items
                </Link>
                <Link
                  href="/living/garage-sales"
                  className="block w-full px-4 py-2 bg-aurora-green/20 text-aurora-green hover:bg-aurora-green/30 rounded-lg transition text-center font-medium"
                >
                  🏷️ My Garage Sales
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-dark-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Profile Information
              </h2>
              
              <ProfileForm 
                userId={user.id}
                initialData={{
                  full_name: profile.full_name || '',
                  user_type: profile.user_type || '',
                  address: profile.address || '',
                }}
              />
            </div>

            {/* Danger Zone */}
            <div className="mt-8 bg-red-900/20 backdrop-blur-lg border-2 border-red-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-2">
                Danger Zone
              </h3>
              <p className="text-gray-400 mb-4">
                Once you delete your account, there is no going back. This will permanently delete all your data.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 font-semibold">
                      ⚠️ Are you absolutely sure? This action cannot be undone.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      This will permanently delete:
                    </p>
                    <ul className="text-gray-400 text-sm mt-2 ml-4 list-disc">
                      <li>Your profile and account data</li>
                      <li>All your garage sale listings</li>
                      <li>All your saved items</li>
                      <li>All your submitted content</li>
                    </ul>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deleting}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
