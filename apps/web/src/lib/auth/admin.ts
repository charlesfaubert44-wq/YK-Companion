/**
 * Admin Authentication & Authorization Utilities
 *
 * Provides server-side utilities for checking admin status and permissions
 * in API routes and server components.
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
}

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

export interface AdminCheckResult {
  isAdmin: boolean;
  user: AdminProfile | null;
  permissions: UserPermissions | null;
  error?: string;
}

/**
 * Check if the current authenticated user is an admin
 * Returns user profile and permissions if admin, null otherwise
 */
export async function checkAdminAuth(): Promise<AdminCheckResult> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        isAdmin: false,
        user: null,
        permissions: null,
        error: 'Not authenticated',
      };
    }

    // Get user profile with admin status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return {
        isAdmin: false,
        user: null,
        permissions: null,
        error: 'Profile not found',
      };
    }

    // If not admin, return early
    if (!profile.is_admin) {
      return {
        isAdmin: false,
        user: profile as AdminProfile,
        permissions: null,
        error: 'User is not an admin',
      };
    }

    // Get detailed permissions
    const { data: permissions } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return {
      isAdmin: true,
      user: profile as AdminProfile,
      permissions: permissions as UserPermissions | null,
    };
  } catch (error) {
    console.error('Admin auth check error:', error);
    return {
      isAdmin: false,
      user: null,
      permissions: null,
      error: 'Internal error',
    };
  }
}

/**
 * Check if the current user has a specific permission
 * @param permission - The permission to check (e.g., 'can_manage_users')
 */
export async function checkPermission(
  permission: keyof Omit<UserPermissions, 'id' | 'user_id' | 'notes'>
): Promise<boolean> {
  const { isAdmin, permissions } = await checkAdminAuth();

  if (!isAdmin || !permissions) {
    return false;
  }

  // Super admins have all permissions
  if (permissions.is_super_admin) {
    return true;
  }

  return permissions[permission] === true;
}

/**
 * Middleware wrapper for protecting API routes
 * Usage in API route:
 *
 * export async function GET(request: NextRequest) {
 *   const adminCheck = await requireAdmin();
 *   if (adminCheck instanceof NextResponse) return adminCheck;
 *
 *   // Your protected code here
 *   const { user, permissions } = adminCheck;
 * }
 */
export async function requireAdmin(): Promise<
  AdminCheckResult | NextResponse
> {
  const result = await checkAdminAuth();

  if (!result.isAdmin) {
    if (result.error === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }

  return result;
}

/**
 * Middleware wrapper for protecting API routes with specific permission
 *
 * @example
 * export async function POST(request: NextRequest) {
 *   const adminCheck = await requirePermission('can_manage_users');
 *   if (adminCheck instanceof NextResponse) return adminCheck;
 *
 *   // Your protected code here
 * }
 */
export async function requirePermission(
  permission: keyof Omit<UserPermissions, 'id' | 'user_id' | 'notes'>
): Promise<AdminCheckResult | NextResponse> {
  const result = await checkAdminAuth();

  if (!result.isAdmin) {
    if (result.error === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }

  // Check specific permission
  const hasPermission =
    result.permissions?.is_super_admin ||
    result.permissions?.[permission] === true;

  if (!hasPermission) {
    return NextResponse.json(
      { error: `Permission denied: ${permission}` },
      { status: 403 }
    );
  }

  return result;
}

/**
 * Log admin activity
 * Should be called after successful admin actions
 */
export async function logAdminActivity(
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, any>
) {
  try {
    const supabase = await createClient();

    await supabase.from('admin_activity_log').insert({
      action,
      target_type: targetType,
      target_id: targetId,
      details: details ? JSON.stringify(details) : null,
    });
  } catch (error) {
    console.error('Failed to log admin activity:', error);
    // Don't throw - logging failure shouldn't break the action
  }
}
