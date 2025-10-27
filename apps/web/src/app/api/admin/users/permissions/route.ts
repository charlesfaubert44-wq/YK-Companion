/**
 * User Permissions Management API
 *
 * Endpoints for managing granular user permissions.
 * Only accessible by super admins.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requirePermission, logAdminActivity } from '@/lib/auth/admin';

// POST /api/admin/users/permissions - Grant or update permissions
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requirePermission('can_manage_users');
    if (adminCheck instanceof NextResponse) return adminCheck;

    // Only super admins can manage permissions
    if (!adminCheck.permissions?.is_super_admin) {
      return NextResponse.json(
        { error: 'Only super admins can manage permissions' },
        { status: 403 }
      );
    }

    const { user: adminUser } = adminCheck;
    const supabase = await createClient();
    const body = await request.json();

    const {
      userId,
      is_super_admin,
      can_manage_users,
      can_manage_sponsors,
      can_manage_content,
      can_manage_garage_sales,
      can_view_analytics,
      can_manage_settings,
      notes,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Check if user is admin first
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'User must be an admin before granting permissions' },
        { status: 400 }
      );
    }

    // Upsert permissions
    const { data, error } = await supabase
      .from('user_permissions')
      .upsert(
        {
          user_id: userId,
          is_super_admin: is_super_admin || false,
          can_manage_users: can_manage_users || false,
          can_manage_sponsors: can_manage_sponsors || false,
          can_manage_content: can_manage_content || false,
          can_manage_garage_sales: can_manage_garage_sales || false,
          can_view_analytics: can_view_analytics || false,
          can_manage_settings: can_manage_settings || false,
          notes: notes || null,
          granted_by: adminUser.id,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error updating permissions:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await logAdminActivity(
      'update_user_permissions',
      'user_permissions',
      userId,
      { granted_by: adminUser.id, permissions: data }
    );

    return NextResponse.json({
      message: 'Permissions updated successfully',
      data,
    });
  } catch (error: any) {
    console.error('Error in POST /api/admin/users/permissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/users/permissions - Revoke all permissions
export async function DELETE(request: NextRequest) {
  try {
    const adminCheck = await requirePermission('can_manage_users');
    if (adminCheck instanceof NextResponse) return adminCheck;

    // Only super admins can revoke permissions
    if (!adminCheck.permissions?.is_super_admin) {
      return NextResponse.json(
        { error: 'Only super admins can revoke permissions' },
        { status: 403 }
      );
    }

    const { user: adminUser } = adminCheck;
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Delete permissions
    const { error } = await supabase
      .from('user_permissions')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error revoking permissions:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await logAdminActivity(
      'revoke_user_permissions',
      'user_permissions',
      userId,
      { revoked_by: adminUser.id }
    );

    return NextResponse.json({
      message: 'Permissions revoked successfully',
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/users/permissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
