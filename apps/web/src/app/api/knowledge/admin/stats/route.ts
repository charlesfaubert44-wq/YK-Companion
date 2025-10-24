import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/knowledge/admin/stats - Get knowledge database statistics (admin only)
export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication and admin status
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

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
