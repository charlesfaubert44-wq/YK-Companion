import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/visitor-logbook/[id]
 * Fetch a single visitor logbook entry
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data: entry, error } = await supabase
      .from('visitor_logbook')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !entry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    // Check if entry is viewable (approved or owned by user)
    const { data: { user } } = await supabase.auth.getUser();
    const isOwner = user && entry.user_id === user.id;
    const isViewable = entry.is_approved && entry.is_active;

    if (!isViewable && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Entry not found or not yet approved' },
        { status: 404 }
      );
    }

    // Increment view count
    await supabase
      .from('visitor_logbook')
      .update({ views_count: (entry.views_count || 0) + 1 })
      .eq('id', id);

    // Check if user has liked this entry
    let userLiked = false;
    if (user) {
      const { data: like } = await supabase
        .from('visitor_logbook_likes')
        .select('id')
        .eq('entry_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      userLiked = !!like;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...entry,
        user_liked: userLiked,
      },
    });

  } catch (error) {
    console.error('Error in GET /api/visitor-logbook/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/visitor-logbook/[id]
 * Update a visitor logbook entry (only by owner)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch existing entry
    const { data: existingEntry, error: fetchError } = await supabase
      .from('visitor_logbook')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingEntry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (existingEntry.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own entries' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const allowedFields = ['title', 'message', 'visitor_location', 'visit_date', 'visit_duration', 'experience_type', 'rating', 'photos'];

    // Filter only allowed fields
    const updates: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Update featured photo if photos changed
    if (updates.photos && updates.photos.length > 0) {
      updates.featured_photo = updates.photos[0];
    }

    // Update entry
    const { data: updatedEntry, error: updateError } = await supabase
      .from('visitor_logbook')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating logbook entry:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update entry' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedEntry,
      message: 'Entry updated successfully'
    });

  } catch (error) {
    console.error('Error in PUT /api/visitor-logbook/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/visitor-logbook/[id]
 * Soft-delete a visitor logbook entry (only by owner)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch existing entry
    const { data: existingEntry, error: fetchError } = await supabase
      .from('visitor_logbook')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingEntry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (existingEntry.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own entries' },
        { status: 403 }
      );
    }

    // Soft delete
    const { error: deleteError } = await supabase
      .from('visitor_logbook')
      .update({ is_active: false })
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting logbook entry:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete entry' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Entry deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/visitor-logbook/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
