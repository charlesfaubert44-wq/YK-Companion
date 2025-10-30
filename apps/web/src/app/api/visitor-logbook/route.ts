import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, rateLimitConfigs } from '@/lib/rate-limiting';
import { z } from 'zod';
import { EXPERIENCE_TYPES } from '@/types/visitor-logbook.types';

// Validation schema for creating logbook entry
const createEntrySchema = z.object({
  visitor_name: z.string().min(2).max(100).trim(),
  visitor_location: z.string().min(2).max(200).trim(),
  title: z.string().min(3).max(100).trim(),
  message: z.string().min(10).max(2000).trim(),
  visit_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  visit_duration: z.string().optional(),
  experience_type: z.array(z.enum(EXPERIENCE_TYPES)).min(1),
  rating: z.number().int().min(1).max(5),
  photos: z.array(z.string().url()).min(1).max(10),
});

/**
 * GET /api/visitor-logbook
 * Fetch visitor logbook entries
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters
    const featured = searchParams.get('featured') === 'true';
    const experienceType = searchParams.get('experience_type');
    const rating = searchParams.get('rating');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('visitor_logbook')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (featured) {
      query = query.eq('is_featured', true);
    }

    if (experienceType && EXPERIENCE_TYPES.includes(experienceType as any)) {
      query = query.contains('experience_type', [experienceType]);
    }

    if (rating) {
      const ratingNum = parseInt(rating);
      if (ratingNum >= 1 && ratingNum <= 5) {
        query = query.gte('rating', ratingNum);
      }
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: entries, error, count } = await query;

    if (error) {
      console.error('Error fetching logbook entries:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch entries' },
        { status: 500 }
      );
    }

    // Check if user has liked each entry (if authenticated)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let entriesWithLikes = entries;

    if (user && entries && entries.length > 0) {
      const entryIds = entries.map(e => e.id);
      const { data: likes } = await supabase
        .from('visitor_logbook_likes')
        .select('entry_id')
        .eq('user_id', user.id)
        .in('entry_id', entryIds);

      const likedEntryIds = new Set(likes?.map(l => l.entry_id) || []);

      entriesWithLikes = entries.map(entry => ({
        ...entry,
        user_liked: likedEntryIds.has(entry.id),
      }));
    }

    return NextResponse.json({
      success: true,
      data: entriesWithLikes || [],
      total: count || 0,
    });
  } catch (error) {
    console.error('Error in GET /api/visitor-logbook:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/visitor-logbook
 * Create a new visitor logbook entry
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to create an entry.' },
        { status: 401 }
      );
    }

    // Rate limiting - 10 entries per hour
    const rateLimit = checkRateLimit(
      request,
      { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // 10 per hour
      user.id
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many entries created. Please try again later.' },
        {
          status: 429,
          headers: rateLimit.headers,
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = createEntrySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input data',
          details: result.error.format(),
        },
        { status: 400 }
      );
    }

    const data = result.data;

    // Determine featured photo (first photo)
    const featuredPhoto = data.photos.length > 0 ? data.photos[0] : null;

    // Insert entry into database
    const { data: entry, error: insertError } = await supabase
      .from('visitor_logbook')
      .insert({
        user_id: user.id,
        visitor_name: data.visitor_name,
        visitor_location: data.visitor_location,
        title: data.title,
        message: data.message,
        visit_date: data.visit_date,
        visit_duration: data.visit_duration || null,
        experience_type: data.experience_type,
        rating: data.rating,
        photos: data.photos,
        featured_photo: featuredPhoto,
        is_approved: false, // Requires admin approval
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating logbook entry:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create entry. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: entry,
        message: 'Your entry has been submitted and is pending approval!',
      },
      {
        status: 201,
        headers: rateLimit.headers,
      }
    );
  } catch (error) {
    console.error('Error in POST /api/visitor-logbook:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
