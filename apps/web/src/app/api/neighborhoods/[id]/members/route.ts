/**
 * Neighborhood Members API
 * View and manage neighborhood members
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch neighborhood members
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const neighborhoodId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'approved';
    const includeProfile = searchParams.get('includeProfile') === 'true';

    // Check if user is a member or moderator
    const { data: userMembership } = await supabase
      .from('neighborhood_members')
      .select('status, role')
      .eq('neighborhood_id', neighborhoodId)
      .eq('user_id', user.id)
      .single();

    if (!userMembership || userMembership.status !== 'approved') {
      return NextResponse.json(
        { error: 'You must be an approved member to view members' },
        { status: 403 }
      );
    }

    // Only moderators/admins can see pending requests
    const canSeePending = ['moderator', 'admin'].includes(userMembership.role);
    if (status === 'pending' && !canSeePending) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Fetch members
    let query = supabase
      .from('neighborhood_members')
      .select(`
        *,
        ${includeProfile ? 'profiles:user_id(id, full_name, email)' : ''}
      `)
      .eq('neighborhood_id', neighborhoodId)
      .eq('status', status)
      .order('requested_at', { ascending: false });

    const { data: members, error } = await query;

    if (error) {
      console.error('Error fetching members:', error);
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      );
    }

    return NextResponse.json({ members: members || [] });
  } catch (error: any) {
    console.error('Members GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
