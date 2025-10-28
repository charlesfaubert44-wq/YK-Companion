import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/knowledge/[id] - Get a specific submission
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('knowledge_submissions')
      .select(`
        *,
        category:knowledge_categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Only return if approved OR user owns the submission
    const { data: { user } } = await supabase.auth.getUser();
    if (data.status !== 'approved' && data.submitted_by !== user?.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Increment view count
    await supabase.rpc('increment_submission_views', { submission_uuid: id });

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error in GET /api/knowledge/[id]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/knowledge/[id] - Update submission (user's own pending OR admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;
    const body = await request.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    const { data: submission } = await supabase
      .from('knowledge_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (!submission) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const canEdit = profile?.is_admin || (submission.submitted_by === user.id && submission.status === 'pending');

    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update submission
    const { data, error } = await supabase
      .from('knowledge_submissions')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error in PATCH /api/knowledge/[id]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/knowledge/[id] - Delete submission (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const { error } = await supabase
      .from('knowledge_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    console.error('Error in DELETE /api/knowledge/[id]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
