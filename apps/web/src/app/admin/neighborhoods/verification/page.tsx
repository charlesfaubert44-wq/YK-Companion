'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminVerificationDashboard from '@/components/neighborhoods/AdminVerificationDashboard';

/**
 * Admin Neighborhood Verification Page
 *
 * Dashboard for admins to review and approve neighborhood
 * verification requests
 */

export default function AdminNeighborhoodVerificationPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Check admin status
      // In production, check profile.is_admin or user_permissions table
      if (!profile?.is_admin) {
        // For demo purposes, we'll allow access
        // In production, redirect non-admins
        // router.push('/');
        // return;
      }

      setChecking(false);
    }
  }, [user, profile, loading, router]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-northern-midnight via-dark-900 to-northern-midnight flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-aurora-blue border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-xl font-semibold">Checking permissions...</div>
        </div>
      </div>
    );
  }

  return <AdminVerificationDashboard />;
}
