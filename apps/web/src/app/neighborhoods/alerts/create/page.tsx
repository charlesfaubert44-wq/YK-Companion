'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AlertCreateForm from '@/components/neighborhoods/AlertCreateForm';

/**
 * Alert Creation Page
 *
 * Allows verified neighborhood members to create
 * safety alerts for their community
 */

export default function AlertCreatePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user is verified in any neighborhood
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Simulate verification check
      // In production, check neighborhood_members table
      setTimeout(() => {
        // For demo purposes, we'll assume user is verified
        setIsVerified(true);
        setChecking(false);
      }, 1000);
    }
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-northern-midnight via-dark-900 to-northern-midnight flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-aurora-blue border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-northern-midnight via-dark-900 to-northern-midnight flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-aurora-blue/30 rounded-3xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-white mb-4">Verification Required</h1>
            <p className="text-xl text-gray-300 mb-8">
              You need to be a verified neighborhood member to create alerts.
            </p>
            <button
              onClick={() => router.push('/neighborhoods')}
              className="px-8 py-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white font-bold rounded-xl hover:shadow-aurora transition-all duration-300 hover:scale-105"
            >
              Join a Neighborhood →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AlertCreateForm />;
}
