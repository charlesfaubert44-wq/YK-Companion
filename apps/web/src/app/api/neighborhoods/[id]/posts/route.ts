/**
 * Neighborhood Posts API (Bulletin Board)
 * Create and fetch community posts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.enum([
    'help_offered',
    'help_needed',
    'event',
    'announcement',
    'lost_found',
    'recommendation',
    'question',
    'other',
  ]),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  expires_at: z.string().optional(),
});

// GET - Fetch neighborhood posts
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
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const is_pinned = searchParams.get('is_pinned');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Check if user is an approved member
    const { data: membership } = await supabase
      .from('neighborhood_members')
      .select('status, id')
      .eq('neighborhood_id', neighborhoodId)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.status !== 'approved') {
      return NextResponse.json(
        { error: 'You must be an approved member to view posts' },
        { status: 403 }
      );
    }

    // Build query
    let query = supabase
      .from('neighborhood_posts')
      .select(`
        *,
        profiles:user_id(full_name, email)
      `)
      .eq('neighborhood_id', neighborhoodId)
      .eq('is_archived', false)
      .eq('moderation_status', 'approved');

    if (category) {
      query = query.eq('category', category);
    }

    if (is_pinned === 'true') {
      query = query.eq('is_pinned', true);
    }

    query = query
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: posts, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ posts: posts || [] });
  } catch (error: any) {
    console.error('Posts GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new post
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
    const validationResult = postSchema.safeParse(body);

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
      .select('status, id')
      .eq('neighborhood_id', neighborhoodId)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.status !== 'approved') {
      return NextResponse.json(
        { error: 'You must be an approved member to create posts' },
        { status: 403 }
      );
    }

    const postData = validationResult.data;

    // Create post
    const { data: post, error } = await supabase
      .from('neighborhood_posts')
      .insert({
        neighborhood_id: neighborhoodId,
        user_id: user.id,
        ...postData,
        moderation_status: 'approved', // Auto-approve for now, can add review later
      })
      .select(`
        *,
        profiles:user_id(full_name, email)
      `)
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }

    // Update member's post count
    await supabase.rpc('increment', {
      table_name: 'neighborhood_members',
      column_name: 'posts_count',
      row_id: membership.id,
    });

    // TODO: Send notifications to members who have bulletin notifications enabled

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
