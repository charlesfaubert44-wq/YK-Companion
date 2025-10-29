/**
 * Neighborhood Dashboard API
 * Aggregated data for neighborhood dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch comprehensive dashboard data
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

    // Check if user is an approved member
    const { data: membership, error: membershipError } = await supabase
      .from('neighborhood_members')
      .select(`
        *,
        neighborhood:neighborhoods(*)
      `)
      .eq('neighborhood_id', neighborhoodId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership || membership.status !== 'approved') {
      return NextResponse.json(
        { error: 'You must be an approved member to view the dashboard' },
        { status: 403 }
      );
    }

    // Fetch all dashboard data in parallel
    const [
      statsResult,
      recentPostsResult,
      activeAlertsResult,
      featuredBusinessesResult,
      upcomingMeetingsResult,
      pendingApprovalsResult,
    ] = await Promise.all([
      // Stats
      Promise.all([
        supabase
          .from('neighborhood_members')
          .select('id', { count: 'exact', head: true })
          .eq('neighborhood_id', neighborhoodId)
          .eq('status', 'approved'),
        supabase
          .from('neighborhood_alerts')
          .select('id', { count: 'exact', head: true })
          .eq('neighborhood_id', neighborhoodId)
          .eq('status', 'active'),
        supabase
          .from('neighborhood_posts')
          .select('id', { count: 'exact', head: true })
          .eq('neighborhood_id', neighborhoodId)
          .eq('is_archived', false)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from('neighborhood_businesses')
          .select('id', { count: 'exact', head: true })
          .eq('neighborhood_id', neighborhoodId)
          .eq('is_approved', true)
          .eq('is_active', true),
      ]),

      // Recent posts (last 10)
      supabase
        .from('neighborhood_posts')
        .select(`
          *,
          profiles:user_id(full_name)
        `)
        .eq('neighborhood_id', neighborhoodId)
        .eq('is_archived', false)
        .eq('moderation_status', 'approved')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10),

      // Active alerts (high and critical severity first)
      supabase
        .from('neighborhood_alerts')
        .select(`
          *,
          profiles:user_id(full_name)
        `)
        .eq('neighborhood_id', neighborhoodId)
        .eq('status', 'active')
        .order('severity', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10),

      // Featured/verified businesses
      supabase
        .from('neighborhood_businesses')
        .select('*')
        .eq('neighborhood_id', neighborhoodId)
        .eq('is_approved', true)
        .eq('is_active', true)
        .or('is_featured.eq.true,is_verified.eq.true')
        .order('is_featured', { ascending: false })
        .order('is_verified', { ascending: false })
        .limit(6),

      // Upcoming political meetings
      supabase
        .from('neighborhood_politics')
        .select(`
          *,
          profiles:user_id(full_name)
        `)
        .eq('neighborhood_id', neighborhoodId)
        .eq('is_archived', false)
        .in('topic_type', ['meeting', 'vote', 'city_council'])
        .gte('meeting_date', new Date().toISOString())
        .order('meeting_date', { ascending: true })
        .limit(5),

      // Pending approvals (only for moderators/admins)
      ['moderator', 'admin'].includes(membership.role)
        ? supabase
            .from('neighborhood_members')
            .select('id', { count: 'exact', head: true })
            .eq('neighborhood_id', neighborhoodId)
            .eq('status', 'pending')
        : Promise.resolve({ count: null }),
    ]);

    // Process stats
    const [membersCount, alertsCount, recentPostsCount, businessesCount] = statsResult;

    const stats = {
      total_members: membersCount.count || 0,
      active_alerts: alertsCount.count || 0,
      recent_posts_count: recentPostsCount.count || 0,
      local_businesses_count: businessesCount.count || 0,
      pending_approvals: pendingApprovalsResult.count || undefined,
    };

    // Check for errors
    if (recentPostsResult.error) console.error('Error fetching recent posts:', recentPostsResult.error);
    if (activeAlertsResult.error) console.error('Error fetching active alerts:', activeAlertsResult.error);
    if (featuredBusinessesResult.error) console.error('Error fetching businesses:', featuredBusinessesResult.error);
    if (upcomingMeetingsResult.error) console.error('Error fetching meetings:', upcomingMeetingsResult.error);

    const dashboard = {
      neighborhood: membership.neighborhood,
      member: {
        id: membership.id,
        role: membership.role,
        status: membership.status,
        joined_at: membership.requested_at,
        posts_count: membership.posts_count,
        alerts_count: membership.alerts_count,
      },
      stats,
      recent_posts: recentPostsResult.data || [],
      active_alerts: activeAlertsResult.data || [],
      featured_businesses: featuredBusinessesResult.data || [],
      upcoming_meetings: upcomingMeetingsResult.data || [],
    };

    return NextResponse.json({ dashboard });
  } catch (error: any) {
    console.error('Dashboard GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
