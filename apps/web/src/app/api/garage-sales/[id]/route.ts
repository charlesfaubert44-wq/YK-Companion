/**
 * Garage Sale Individual Operations
 * GET, PUT, DELETE for specific garage sale
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch single garage sale
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('garage_sales')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Garage sale not found' }, { status: 404 });
      }

      console.error('Error fetching garage sale:', error);
      return NextResponse.json({ error: 'Failed to fetch garage sale' }, { status: 500 });
    }

    return NextResponse.json({ sale: data });
  } catch (error: any) {
    console.error('Garage sale GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update garage sale
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check ownership
    const { data: existing, error: fetchError } = await supabase
      .from('garage_sales')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Garage sale not found' }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own garage sales' },
        { status: 403 }
      );
    }

    // Update
    const { data, error } = await supabase
      .from('garage_sales')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating garage sale:', error);
      return NextResponse.json({ error: 'Failed to update garage sale' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      sale: data,
      message: 'Garage sale updated successfully!',
    });
  } catch (error: any) {
    console.error('Garage sale PUT error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete garage sale
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check ownership
    const { data: existing, error: fetchError } = await supabase
      .from('garage_sales')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Garage sale not found' }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own garage sales' },
        { status: 403 }
      );
    }

    // Soft delete - set is_active to false
    const { error } = await supabase
      .from('garage_sales')
      .update({ is_active: false, status: 'cancelled' })
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting garage sale:', error);
      return NextResponse.json({ error: 'Failed to delete garage sale' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Garage sale deleted successfully!',
    });
  } catch (error: any) {
    console.error('Garage sale DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
