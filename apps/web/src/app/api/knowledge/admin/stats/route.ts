import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/admin';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/knowledge/admin/stats - Get knowledge database statistics (admin only)
export async function GET() {
  try {
    // Check admin authentication with analytics permission
    const adminCheck = await requirePermission('can_view_analytics');
    if (adminCheck instanceof NextResponse) return adminCheck;

    const supabase = await createClient();

    // Fetch stats
    const { data: submissions } = await supabase
      .from('knowledge_submissions')
      .select('status, views, likes');

    const { data: categories } = await supabase
      .from('knowledge_categories')
      .select('id')
      .eq('is_active', true);

    const stats = {
      total_submissions: submissions?.length || 0,
      pending_submissions: submissions?.filter(s => s.status === 'pending').length || 0,
      approved_submissions: submissions?.filter(s => s.status === 'approved').length || 0,
      rejected_submissions: submissions?.filter(s => s.status === 'rejected').length || 0,
      total_views: submissions?.reduce((sum, s) => sum + (s.views || 0), 0) || 0,
      total_likes: submissions?.reduce((sum, s) => sum + (s.likes || 0), 0) || 0,
      total_categories: categories?.length || 0,
    };

    return NextResponse.json({ data: stats });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/knowledge/admin/stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
