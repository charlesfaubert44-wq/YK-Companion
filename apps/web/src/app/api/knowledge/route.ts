import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { CreateKnowledgeSubmissionInput, KnowledgeFilters } from '@/types/knowledge.types';

// GET /api/knowledge - Browse approved knowledge submissions
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // Parse filters from query params
    const filters: KnowledgeFilters = {
      category_id: searchParams.get('category_id') || undefined,
      content_type: searchParams.get('content_type') as any || undefined,
      season: searchParams.get('season') as any || undefined,
      search: searchParams.get('search') || undefined,
      is_featured: searchParams.get('is_featured') === 'true' ? true : undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
    };

    let query = supabase
      .from('knowledge_submissions')
      .select(`
        *,
        category:knowledge_categories(*)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters.content_type) {
      query = query.eq('content_type', filters.content_type);
    }
    if (filters.season) {
      query = query.eq('season', filters.season);
    }
    if (filters.is_featured) {
      query = query.eq('is_featured', true);
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
    }

    // Pagination
    query = query.range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching knowledge submissions:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      count,
      filters,
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/knowledge:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST /api/knowledge - Create new knowledge submission
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: CreateKnowledgeSubmissionInput = await request.json();

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();

    // Validation
    if (!body.title || !body.content || !body.content_type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, content_type' },
        { status: 400 }
      );
    }

    // Create submission
    const { data, error } = await supabase
      .from('knowledge_submissions')
      .insert({
        title: body.title,
        content: body.content,
        category_id: body.category_id || null,
        content_type: body.content_type,
        tags: body.tags || null,
        images: body.images || null,
        sources: body.sources || null,
        location_name: body.location_name || null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        season: body.season || null,
        submitted_by: user?.id || null,
        submitter_name: body.submitter_name || null,
        submitter_email: body.submitter_email || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating knowledge submission:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Submission created successfully. It will be reviewed by our team.',
      data,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/knowledge:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
