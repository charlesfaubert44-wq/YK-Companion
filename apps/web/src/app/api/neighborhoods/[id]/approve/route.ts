/**
 * Neighborhood Member Approval API
 * Approve or reject join requests (moderators/admins only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const approvalSchema = z.object({
  member_id: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  review_notes: z.string().optional(),
  rejection_reason: z.string().optional(),
});

// POST - Approve or reject a join request
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = approvalSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { member_id, action, review_notes, rejection_reason } = validationResult.data;
    const neighborhoodId = params.id;

    // Check if user is a moderator or admin
    const { data: userMembership } = await supabase
      .from('neighborhood_members')
      .select('role, status')
      .eq('neighborhood_id', neighborhoodId)
      .eq('user_id', user.id)
      .single();

    if (
      !userMembership ||
      userMembership.status !== 'approved' ||
      !['moderator', 'admin'].includes(userMembership.role)
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to approve members' },
        { status: 403 }
      );
    }

    // Check if the membership request exists
    const { data: membership, error: fetchError } = await supabase
      .from('neighborhood_members')
      .select('*, profiles:user_id(email, full_name)')
      .eq('id', member_id)
      .eq('neighborhood_id', neighborhoodId)
      .single();

    if (fetchError || !membership) {
      return NextResponse.json({ error: 'Membership request not found' }, { status: 404 });
    }

    if (membership.status !== 'pending') {
      return NextResponse.json(
        { error: 'This request has already been processed' },
        { status: 400 }
      );
    }

    // Update membership status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const { data: updatedMembership, error: updateError } = await supabase
      .from('neighborhood_members')
      .update({
        status: newStatus,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        review_notes,
        rejection_reason: action === 'reject' ? rejection_reason : null,
      })
      .eq('id', member_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating membership:', updateError);
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }

    // TODO: Send email notification to the user
    // This will be implemented in the email notifications section

    return NextResponse.json({
      membership: updatedMembership,
      message: action === 'approve' ? 'Member approved successfully' : 'Request rejected',
    });
  } catch (error: any) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
