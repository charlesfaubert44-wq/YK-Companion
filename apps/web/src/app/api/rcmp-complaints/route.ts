/**
 * RCMP Complaints API
 * Generate and manage formal police complaints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const complaintSchema = z.object({
  neighborhood_id: z.string().uuid().optional(),
  incident_type: z.enum([
    'theft',
    'vandalism',
    'assault',
    'break_in',
    'suspicious_activity',
    'noise',
    'traffic',
    'drug_activity',
    'fraud',
    'harassment',
    'other',
  ]),
  incident_date: z.string(),
  incident_time: z.string().optional(),
  location: z.string().min(5, 'Location is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().min(20, 'Please provide a detailed description'),
  suspect_description: z.string().optional(),
  vehicle_description: z.string().optional(),
  witness_info: z.string().optional(),
  evidence_images: z.array(z.string()).optional(),
  evidence_videos: z.array(z.string()).optional(),
  evidence_documents: z.array(z.string()).optional(),
  complainant_name: z.string().optional(),
  complainant_phone: z.string().optional(),
  complainant_email: z.string().email().optional(),
  is_anonymous: z.boolean().optional(),
});

// GET - Fetch user's complaints
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const neighborhood_id = searchParams.get('neighborhood_id');

    // Build query
    let query = supabase
      .from('rcmp_complaints')
      .select(
        `
        *,
        neighborhood:neighborhoods(name)
      `
      )
      .eq('user_id', user.id);

    if (status) {
      query = query.eq('status', status);
    }

    if (neighborhood_id) {
      query = query.eq('neighborhood_id', neighborhood_id);
    }

    query = query.order('created_at', { ascending: false });

    const { data: complaints, error } = await query;

    if (error) {
      console.error('Error fetching complaints:', error);
      return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 });
    }

    return NextResponse.json({ complaints: complaints || [] });
  } catch (error: any) {
    console.error('Complaints GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new complaint
export async function POST(request: NextRequest) {
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
    const validationResult = complaintSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const complaintData = validationResult.data;

    // Create complaint
    const { data: complaint, error } = await supabase
      .from('rcmp_complaints')
      .insert({
        user_id: user.id,
        ...complaintData,
        status: 'draft', // User can review before submitting
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating complaint:', error);
      return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 });
    }

    return NextResponse.json({
      complaint,
      message: 'Complaint created as draft. You can review and submit it to RCMP.',
    });
  } catch (error: any) {
    console.error('Complaint creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
