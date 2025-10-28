/**
 * Admin User Management API
 *
 * Endpoints for managing users and their permissions.
 * Only accessible by super admins.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requirePermission, logAdminActivity } from '@/lib/auth/admin';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await requirePermission('can_manage_users');
    if (adminCheck instanceof NextResponse) return adminCheck;

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const adminOnly = searchParams.get('adminOnly') === 'true';

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query
    let query = supabase
      .from('profiles')
      .select(
        `
        id,
        email,
        full_name,
        user_type,
        is_admin,
        created_at,
        user_permissions (
          is_super_admin,
          can_manage_users,
          can_manage_sponsors,
          can_manage_content,
          can_manage_garage_sales,
          can_view_analytics,
          can_manage_settings,
          notes
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false });

    // Filter by admin status
    if (adminOnly) {
      query = query.eq('is_admin', true);
    }

    // Search filter
    if (search) {
      query = query.or(
        `email.ilike.%${search}%,full_name.ilike.%${search}%`
      );
    }

    // Pagination
    query = query.range(from, to);

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/users - Update user admin status
export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await requirePermission('can_manage_users');
    if (adminCheck instanceof NextResponse) return adminCheck;

    const { user: adminUser } = adminCheck;
    
    // Ensure adminUser exists
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 401 }
      );
    }
    
    const supabase = await createClient();
    const body = await request.json();

    const { userId, is_admin } = body;

    if (!userId || typeof is_admin !== 'boolean') {
      return NextResponse.json(
        { error: 'userId and is_admin are required' },
        { status: 400 }
      );
    }

    // Update admin status
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_admin })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await logAdminActivity(
      is_admin ? 'grant_admin_status' : 'revoke_admin_status',
      'user',
      userId,
      { granted_by: adminUser.id }
    );

    return NextResponse.json({
      message: `Admin status ${is_admin ? 'granted' : 'revoked'} successfully`,
      data,
    });
  } catch (error: any) {
    console.error('Error in PATCH /api/admin/users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
