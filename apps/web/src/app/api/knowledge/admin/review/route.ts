import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { ReviewSubmissionInput } from '@/types/knowledge.types';

// POST /api/knowledge/admin/review - Review a submission (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { submission_id, ...reviewInput }: ReviewSubmissionInput & { submission_id: string } = await request.json();

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

    // Validate input
    if (!submission_id || !reviewInput.status) {
      return NextResponse.json(
        { error: 'Missing required fields: submission_id, status' },
        { status: 400 }
      );
    }

    // Update submission with review
    const { data, error } = await supabase
      .from('knowledge_submissions')
      .update({
        status: reviewInput.status,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewInput.review_notes || null,
        rejection_reason: reviewInput.rejection_reason || null,
      })
      .eq('id', submission_id)
      .select()
      .single();

    if (error) {
      console.error('Error reviewing submission:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Submission ${reviewInput.status} successfully`,
      data,
    });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/knowledge/admin/review:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
