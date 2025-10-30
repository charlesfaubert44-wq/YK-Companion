import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/visitor-logbook/[id]/like
 * Toggle like status for a visitor logbook entry
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { id: entryId } = params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to like entries' },
        { status: 401 }
      );
    }

    // Check if entry exists and is viewable
    const { data: entry, error: entryError } = await supabase
      .from('visitor_logbook')
      .select('id, is_active, is_approved, likes_count')
      .eq('id', entryId)
      .single();

    if (entryError || !entry) {
      return NextResponse.json({ success: false, error: 'Entry not found' }, { status: 404 });
    }

    if (!entry.is_active || !entry.is_approved) {
      return NextResponse.json(
        { success: false, error: 'This entry is not available' },
        { status: 404 }
      );
    }

    // Check if user has already liked this entry
    const { data: existingLike } = await supabase
      .from('visitor_logbook_likes')
      .select('id')
      .eq('entry_id', entryId)
      .eq('user_id', user.id)
      .maybeSingle();

    let liked = false;
    let newLikesCount = entry.likes_count;

    if (existingLike) {
      // Unlike - delete the like
      const { error: deleteError } = await supabase
        .from('visitor_logbook_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('Error unliking entry:', deleteError);
        return NextResponse.json(
          { success: false, error: 'Failed to unlike entry' },
          { status: 500 }
        );
      }

      liked = false;
      newLikesCount = Math.max(0, newLikesCount - 1);
    } else {
      // Like - insert new like
      const { error: insertError } = await supabase.from('visitor_logbook_likes').insert({
        entry_id: entryId,
        user_id: user.id,
      });

      if (insertError) {
        console.error('Error liking entry:', insertError);
        return NextResponse.json(
          { success: false, error: 'Failed to like entry' },
          { status: 500 }
        );
      }

      liked = true;
      newLikesCount = newLikesCount + 1;
    }

    // Fetch updated likes count (triggers should have updated it)
    const { data: updatedEntry } = await supabase
      .from('visitor_logbook')
      .select('likes_count')
      .eq('id', entryId)
      .single();

    return NextResponse.json({
      success: true,
      liked,
      likes_count: updatedEntry?.likes_count || newLikesCount,
    });
  } catch (error) {
    console.error('Error in POST /api/visitor-logbook/[id]/like:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
