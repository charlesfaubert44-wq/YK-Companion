'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NeighborhoodDashboard from '@/components/neighborhoods/NeighborhoodDashboard';

/**
 * Neighborhood Dashboard Page
 *
 * Main hub for verified neighborhood members
 * Shows alerts, posts, resources, and events
 */

// Mock neighborhood data - will be replaced with API call
const NEIGHBORHOODS = {
  'range-lake': { name: 'Range Lake', icon: '🏡', memberCount: 134 },
  'old-town': { name: 'Old Town', icon: '🏛️', memberCount: 87 },
  'niven-lake': { name: 'Niven Lake', icon: '🌲', memberCount: 112 },
  'downtown': { name: 'Downtown', icon: '🏢', memberCount: 56 },
  'kam-lake': { name: 'Kam Lake', icon: '🏭', memberCount: 43 },
  'yellowknife-bay': { name: 'Yellowknife Bay', icon: '⚓', memberCount: 29 },
};

export default function NeighborhoodPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const slug = params?.slug as string;

  const [isVerified, setIsVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);

  const neighborhood = NEIGHBORHOODS[slug as keyof typeof NEIGHBORHOODS] || {
    name: 'Unknown Neighborhood',
    icon: '🏘️',
    memberCount: 0,
  };

  useEffect(() => {
    // Check if user is verified for this neighborhood
    // This is a mock - replace with actual API call
    const checkVerification = async () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Simulate API call
      setTimeout(() => {
        // For demo purposes, we'll assume user is verified
        // In production, check neighborhood_members table
        setIsVerified(true);
        setCheckingVerification(false);
      }, 1000);
    };

    if (!loading) {
      checkVerification();
    }
  }, [user, loading, router, slug]);

  if (loading || checkingVerification) {
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
              You need to verify your residency in {neighborhood.name} to access this page.
            </p>
            <button
              onClick={() => router.push(`/neighborhoods/${slug}/verify`)}
              className="px-8 py-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white font-bold rounded-xl hover:shadow-aurora transition-all duration-300 hover:scale-105"
            >
              Verify Your Residence →
            </button>
            <button
              onClick={() => router.push('/neighborhoods')}
              className="block w-full mt-4 px-8 py-3 bg-dark-800 text-gray-300 font-semibold rounded-xl hover:bg-dark-700 transition-colors"
            >
              ← Back to Neighborhoods
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <NeighborhoodDashboard
      neighborhoodName={neighborhood.name}
      memberCount={neighborhood.memberCount}
      neighborhoodIcon={neighborhood.icon}
    />
  );
}
