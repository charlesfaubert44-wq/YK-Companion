/**
 * Neighborhood Politics API
 * Local politics discussions and civic engagement
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const politicsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  topic_type: z.enum([
    'city_council',
    'mla_update',
    'development',
    'infrastructure',
    'bylaw',
    'petition',
    'meeting',
    'vote',
    'other',
  ]),
  tags: z.array(z.string()).optional(),
  related_officials: z.array(z.string()).optional(),
  meeting_date: z.string().optional(),
  meeting_agenda_url: z.string().url().optional(),
  documents: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
});

// GET - Fetch politics discussions
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
    const topic_type = searchParams.get('topic_type');
    const is_pinned = searchParams.get('is_pinned');
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
        { error: 'You must be an approved member to view politics discussions' },
        { status: 403 }
      );
    }

    // Build query
    let query = supabase
      .from('neighborhood_politics')
      .select(
        `
        *,
        profiles:user_id(full_name, email)
      `
      )
      .eq('neighborhood_id', neighborhoodId)
      .eq('is_archived', false);

    if (topic_type) {
      query = query.eq('topic_type', topic_type);
    }

    if (is_pinned === 'true') {
      query = query.eq('is_pinned', true);
    }

    query = query
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: politics, error } = await query;

    if (error) {
      console.error('Error fetching politics:', error);
      return NextResponse.json({ error: 'Failed to fetch politics discussions' }, { status: 500 });
    }

    return NextResponse.json({ politics: politics || [] });
  } catch (error: any) {
    console.error('Politics GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new politics discussion
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
    const validationResult = politicsSchema.safeParse(body);

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
        { error: 'You must be an approved member to create politics posts' },
        { status: 403 }
      );
    }

    const politicsData = validationResult.data;

    // Create politics post
    const { data: politics, error } = await supabase
      .from('neighborhood_politics')
      .insert({
        neighborhood_id: neighborhoodId,
        user_id: user.id,
        ...politicsData,
      })
      .select(
        `
        *,
        profiles:user_id(full_name, email)
      `
      )
      .single();

    if (error) {
      console.error('Error creating politics post:', error);
      return NextResponse.json({ error: 'Failed to create politics post' }, { status: 500 });
    }

    return NextResponse.json({ politics });
  } catch (error: any) {
    console.error('Politics creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
