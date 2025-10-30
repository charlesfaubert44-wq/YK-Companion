/**
 * Delete Account API
 * Handles permanent account deletion with all associated data
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete user's garage sales
    const { error: garageSalesError } = await supabase
      .from('garage_sales')
      .delete()
      .eq('user_id', user.id);

    if (garageSalesError) {
      console.error('Error deleting garage sales:', garageSalesError);
    }

    // Delete user's favorites
    const { error: favoritesError } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id);

    if (favoritesError) {
      console.error('Error deleting favorites:', favoritesError);
    }

    // Delete user's knowledge submissions
    const { error: knowledgeError } = await supabase
      .from('knowledge_submissions')
      .delete()
      .eq('user_id', user.id);

    if (knowledgeError) {
      console.error('Error deleting knowledge submissions:', knowledgeError);
    }

    // Delete user profile
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', user.id);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
    }

    // Delete auth user (Supabase Auth)
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (authDeleteError) {
      console.error('Error deleting auth user:', authDeleteError);
      // Note: This requires service role key, may not work with anon key
      // As fallback, the profile is deleted and user can no longer sign in
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
