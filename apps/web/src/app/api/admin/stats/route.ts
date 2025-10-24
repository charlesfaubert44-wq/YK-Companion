import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/stats
 * Get comprehensive dashboard statistics
 */
export async function GET() {
  try {
    // Check admin access
    await requireAdmin();

    const supabase = await createClient();

    // Run multiple queries in parallel
    const [
      totalUsersResult,
      newUsersResult,
      totalActivitiesResult,
      totalItinerariesResult,
      knowledgeStatsResult,
      usersByTypeResult,
    ] = await Promise.all([
      // Total users
      supabase.from('profiles').select('*', { count: 'exact', head: true }),

      // New users (last 30 days)
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

      // Total saved items (activities)
      supabase.from('saved_items').select('*', { count: 'exact', head: true }),

      // Total itineraries
      supabase.from('itineraries').select('*', { count: 'exact', head: true }),

      // Knowledge submissions stats
      supabase.from('knowledge_submissions').select('status', { count: 'exact' }),

      // Users by type
      supabase.from('profiles').select('user_type'),
    ]);

    // Process knowledge stats
    const knowledgeStats = {
      total: knowledgeStatsResult.count || 0,
      pending: knowledgeStatsResult.data?.filter((s) => s.status === 'pending').length || 0,
      approved: knowledgeStatsResult.data?.filter((s) => s.status === 'approved').length || 0,
      rejected: knowledgeStatsResult.data?.filter((s) => s.status === 'rejected').length || 0,
    };

    // Process users by type
    const usersByType = {
      visiting: usersByTypeResult.data?.filter((u) => u.user_type === 'visiting').length || 0,
      living: usersByTypeResult.data?.filter((u) => u.user_type === 'living').length || 0,
      moving: usersByTypeResult.data?.filter((u) => u.user_type === 'moving').length || 0,
      unknown: usersByTypeResult.data?.filter((u) => !u.user_type).length || 0,
    };

    return NextResponse.json({
      users: {
        total: totalUsersResult.count || 0,
        newThisMonth: newUsersResult.count || 0,
        byType: usersByType,
      },
      content: {
        savedItems: totalActivitiesResult.count || 0,
        itineraries: totalItinerariesResult.count || 0,
        knowledge: knowledgeStats,
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/admin/stats:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized: Admin access required' ? 403 : 500 }
    );
  }
}
