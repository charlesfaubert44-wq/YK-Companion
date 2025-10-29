/**
 * Neighborhood Join Request API
 * Handle requests to join a neighborhood
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const joinRequestSchema = z.object({
  request_reason: z.string().optional(),
  provided_address: z.string().optional(),
});

// POST - Request to join a neighborhood
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = joinRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { request_reason, provided_address } = validationResult.data;
    const neighborhoodId = params.id;

    // Check if neighborhood exists and is active
    const { data: neighborhood, error: neighborhoodError } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('id', neighborhoodId)
      .single();

    if (neighborhoodError || !neighborhood) {
      return NextResponse.json(
        { error: 'Neighborhood not found' },
        { status: 404 }
      );
    }

    if (!neighborhood.is_active) {
      return NextResponse.json(
        { error: 'This neighborhood is not accepting new members' },
        { status: 400 }
      );
    }

    // Check if user already has a membership
    const { data: existingMember } = await supabase
      .from('neighborhood_members')
      .select('*')
      .eq('neighborhood_id', neighborhoodId)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      if (existingMember.status === 'approved') {
        return NextResponse.json(
          { error: 'You are already a member of this neighborhood' },
          { status: 400 }
        );
      } else if (existingMember.status === 'pending') {
        return NextResponse.json(
          { error: 'You already have a pending request for this neighborhood' },
          { status: 400 }
        );
      } else if (existingMember.status === 'rejected') {
        return NextResponse.json(
          { error: 'Your request to join this neighborhood was previously rejected' },
          { status: 400 }
        );
      }
    }

    // Create membership request
    const { data: membership, error: membershipError } = await supabase
      .from('neighborhood_members')
      .insert({
        neighborhood_id: neighborhoodId,
        user_id: user.id,
        status: neighborhood.requires_approval ? 'pending' : 'approved',
        request_reason,
        provided_address,
        role: 'member',
      })
      .select()
      .single();

    if (membershipError) {
      console.error('Error creating membership:', membershipError);
      return NextResponse.json(
        { error: 'Failed to submit join request' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to neighborhood admins
    // This will be implemented in the email notifications section

    return NextResponse.json({
      membership,
      message: neighborhood.requires_approval
        ? 'Your request has been submitted and is pending approval'
        : 'You have been added to the neighborhood',
    });
  } catch (error: any) {
    console.error('Join request error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Check membership status
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

    // Get user's membership status
    const { data: membership, error } = await supabase
      .from('neighborhood_members')
      .select(`
        *,
        neighborhood:neighborhoods(*)
      `)
      .eq('neighborhood_id', neighborhoodId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching membership:', error);
      return NextResponse.json(
        { error: 'Failed to fetch membership status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      membership: membership || null,
      is_member: membership?.status === 'approved',
      is_pending: membership?.status === 'pending',
    });
  } catch (error: any) {
    console.error('Membership check error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
