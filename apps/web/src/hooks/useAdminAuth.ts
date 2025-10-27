/**
 * Admin Authentication Hook
 *
 * Client-side hook for checking admin status and permissions.
 * Use this in components that need to show/hide admin features.
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createBrowserClient } from '@supabase/ssr';

export interface UserPermissions {
  id: string;
  user_id: string;
  is_super_admin: boolean;
  can_manage_users: boolean;
  can_manage_sponsors: boolean;
  can_manage_content: boolean;
  can_manage_garage_sales: boolean;
  can_view_analytics: boolean;
  can_manage_settings: boolean;
  notes?: string;
}

export interface AdminAuthState {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  permissions: UserPermissions | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to check if the current user is an admin and get their permissions
 *
 * @example
 * function AdminDashboard() {
 *   const { isAdmin, permissions, loading } = useAdminAuth();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (!isAdmin) return <div>Access denied</div>;
 *
 *   return <div>Welcome, admin!</div>;
 * }
 */
export function useAdminAuth(): AdminAuthState {
  const { user, profile, loading: authLoading } = useAuth();
  const [state, setState] = useState<AdminAuthState>({
    isAdmin: false,
    isSuperAdmin: false,
    permissions: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function checkAdminStatus() {
      // Wait for auth to finish loading
      if (authLoading) {
        setState((prev) => ({ ...prev, loading: true }));
        return;
      }

      // No user logged in
      if (!user || !profile) {
        setState({
          isAdmin: false,
          isSuperAdmin: false,
          permissions: null,
          loading: false,
          error: null,
        });
        return;
      }

      // Check if user has is_admin flag in profile
      const isAdmin = (profile as any).is_admin === true;

      if (!isAdmin) {
        setState({
          isAdmin: false,
          isSuperAdmin: false,
          permissions: null,
          loading: false,
          error: null,
        });
        return;
      }

      // Fetch detailed permissions
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: permissions, error } = await supabase
          .from('user_permissions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          // User is admin but doesn't have permissions row yet
          // This is okay - they just don't have granular permissions set
          console.warn('No permissions found for admin user:', error);
          setState({
            isAdmin: true,
            isSuperAdmin: false,
            permissions: null,
            loading: false,
            error: null,
          });
          return;
        }

        setState({
          isAdmin: true,
          isSuperAdmin: permissions?.is_super_admin || false,
          permissions: permissions as UserPermissions,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching admin permissions:', error);
        setState({
          isAdmin: true, // Still admin even if permissions fetch fails
          isSuperAdmin: false,
          permissions: null,
          loading: false,
          error: 'Failed to fetch permissions',
        });
      }
    }

    checkAdminStatus();
  }, [user, profile, authLoading]);

  return state;
}

/**
 * Hook to check if user has a specific permission
 *
 * @example
 * function UserManagement() {
 *   const canManage = usePermission('can_manage_users');
 *
 *   if (!canManage) return <div>No permission</div>;
 *   return <div>User management panel</div>;
 * }
 */
export function usePermission(
  permission: keyof Omit<UserPermissions, 'id' | 'user_id' | 'notes'>
): boolean {
  const { isAdmin, isSuperAdmin, permissions, loading } = useAdminAuth();

  if (loading || !isAdmin) {
    return false;
  }

  // Super admins have all permissions
  if (isSuperAdmin) {
    return true;
  }

  // Check specific permission
  return permissions?.[permission] === true;
}

/**
 * Hook that redirects non-admin users
 * Use this in admin pages to protect them
 *
 * @example
 * function AdminPage() {
 *   const { isAdmin, loading } = useRequireAdmin('/');
 *
 *   if (loading) return <div>Loading...</div>;
 *
 *   return <div>Admin content</div>;
 * }
 */
export function useRequireAdmin(redirectTo: string = '/') {
  const adminAuth = useAdminAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!adminAuth.loading && !adminAuth.isAdmin) {
      setShouldRedirect(true);
      // Redirect using Next.js router
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
    }
  }, [adminAuth.loading, adminAuth.isAdmin, redirectTo]);

  return { ...adminAuth, shouldRedirect };
}
