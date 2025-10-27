import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { ReviewSubmissionInput } from '@/types/knowledge.types';
import { requirePermission, logAdminActivity } from '@/lib/auth/admin';

// POST /api/knowledge/admin/review - Review a submission (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication with content management permission
    const adminCheck = await requirePermission('can_manage_content');
    if (adminCheck instanceof NextResponse) return adminCheck;

    const { user } = adminCheck;
    const supabase = await createClient();
    const { submission_id, ...reviewInput }: ReviewSubmissionInput & { submission_id: string } = await request.json();

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

    // Log admin activity
    await logAdminActivity(
      'review_knowledge_submission',
      'knowledge_submission',
      submission_id,
      { status: reviewInput.status }
    );

    return NextResponse.json({
      message: `Submission ${reviewInput.status} successfully`,
      data,
    });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/knowledge/admin/review:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
