/**
 * Neighborhood Businesses API
 * Local business directory
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const businessSchema = z.object({
  name: z.string().min(2, 'Business name is required'),
  description: z.string().optional(),
  category: z.enum([
    'restaurant',
    'retail',
    'service',
    'health',
    'education',
    'entertainment',
    'professional',
    'trades',
    'other',
  ]),
  subcategory: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  address: z.string().min(5, 'Address is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  hours_of_operation: z.record(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  logo_url: z.string().optional(),
});

// GET - Fetch neighborhood businesses
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const neighborhoodId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const is_verified = searchParams.get('is_verified');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Check if user is an approved member
    const { data: membership } = await supabase
      .from('neighborhood_members')
      .select('status')
      .eq('neighborhood_id', neighborhoodId)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.status !== 'approved') {
      return NextResponse.json(
        { error: 'You must be an approved member to view businesses' },
        { status: 403 }
      );
    }

    // Build query
    let query = supabase
      .from('neighborhood_businesses')
      .select(
        `
        *,
        profiles:submitted_by(full_name, email)
      `
      )
      .eq('neighborhood_id', neighborhoodId)
      .eq('is_approved', true)
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    if (is_verified === 'true') {
      query = query.eq('is_verified', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query
      .order('is_featured', { ascending: false })
      .order('is_verified', { ascending: false })
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data: businesses, error } = await query;

    if (error) {
      console.error('Error fetching businesses:', error);
      return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 });
    }

    return NextResponse.json({ businesses: businesses || [] });
  } catch (error: any) {
    console.error('Businesses GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST - Submit a new business
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
    const validationResult = businessSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const neighborhoodId = params.id;

    // Check if user is an approved member
    const { data: membership } = await supabase
      .from('neighborhood_members')
      .select('status')
      .eq('neighborhood_id', neighborhoodId)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.status !== 'approved') {
      return NextResponse.json(
        { error: 'You must be an approved member to submit businesses' },
        { status: 403 }
      );
    }

    const businessData = validationResult.data;

    // Create business listing
    const { data: business, error } = await supabase
      .from('neighborhood_businesses')
      .insert({
        neighborhood_id: neighborhoodId,
        submitted_by: user.id,
        ...businessData,
        is_approved: false, // Requires approval
      })
      .select(
        `
        *,
        profiles:submitted_by(full_name, email)
      `
      )
      .single();

    if (error) {
      console.error('Error creating business:', error);
      return NextResponse.json({ error: 'Failed to submit business' }, { status: 500 });
    }

    // TODO: Notify moderators about new business submission

    return NextResponse.json({
      business,
      message: 'Business submitted successfully and is pending approval',
    });
  } catch (error: any) {
    console.error('Business submission error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
