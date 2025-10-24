/**
 * Client-side hook for protecting admin routes
 * Redirects non-admin users away from admin pages
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useAdminGuard() {
  const { profile, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load
    if (loading) {
      return;
    }

    // Redirect if not logged in
    if (!user) {
      router.push('/auth/signin?redirect=/admin');
      return;
    }

    // Redirect if not admin
    if (!profile?.is_admin) {
      router.push('/?error=unauthorized');
      return;
    }
  }, [profile, loading, user, router]);

  return {
    isAdmin: profile?.is_admin === true,
    loading,
    profile,
  };
}
