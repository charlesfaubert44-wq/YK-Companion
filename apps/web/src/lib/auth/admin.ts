/**
 * Server-side utilities for super admin authentication and authorization
 */

import { createClient } from '@/lib/supabase/server';

/**
 * Check if the current user is a super admin (server-side)
 * @returns Object with isAdmin boolean and user profile
 */
export async function checkIsAdmin() {
  const supabase = await createClient();

  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return { isAdmin: false, profile: null, user: null };
    }

    // Fetch user profile with admin flag
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !profile) {
      console.error('Error fetching profile:', error);
      return { isAdmin: false, profile: null, user: session.user };
    }

    return {
      isAdmin: profile.is_admin === true,
      profile,
      user: session.user,
    };
  } catch (error) {
    console.error('Error in checkIsAdmin:', error);
    return { isAdmin: false, profile: null, user: null };
  }
}

/**
 * Require admin access - throws error if not admin (for API routes)
 */
export async function requireAdmin() {
  const { isAdmin, profile, user } = await checkIsAdmin();

  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }

  return { profile, user };
}

/**
 * Get admin status for current user (returns boolean only)
 */
export async function getAdminStatus(): Promise<boolean> {
  const { isAdmin } = await checkIsAdmin();
  return isAdmin;
}
