/**
 * Favorites API
 * Handles saving and managing user favorites
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch user's favorites
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
    const itemType = searchParams.get('type'); // Optional filter by type

    let favorites: any[] = [];

    // Fetch garage sales favorites
    if (!itemType || itemType === 'garage-sales') {
      const { data: garageSalesData, error: garageSalesError } = await supabase
        .from('saved_favorites')
        .select('*, garage_sales(*)')
        .eq('user_id', user.id)
        .eq('item_type', 'garage-sales')
        .order('created_at', { ascending: false });

      if (!garageSalesError && garageSalesData) {
        favorites = [
          ...favorites,
          ...garageSalesData.map(fav => ({
            ...fav,
            garage_sale: fav.garage_sales,
          })),
        ];
      }
    }

    // Fetch articles favorites
    if (!itemType || itemType === 'articles') {
      const { data: articlesData, error: articlesError } = await supabase
        .from('saved_favorites')
        .select('*, knowledge_articles(*)')
        .eq('user_id', user.id)
        .eq('item_type', 'articles')
        .order('created_at', { ascending: false });

      if (!articlesError && articlesData) {
        favorites = [
          ...favorites,
          ...articlesData.map(fav => ({
            ...fav,
            article: fav.knowledge_articles,
          })),
        ];
      }
    }

    return NextResponse.json({ favorites });
  } catch (error: any) {
    console.error('Favorites GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST - Add a favorite
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
    const { itemType, itemId } = body;

    if (!itemType || !itemId) {
      return NextResponse.json({ error: 'Missing itemType or itemId' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('saved_favorites')
      .insert({
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
      })
      .select()
      .single();

    if (error) {
      // Check if already exists
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Already in favorites' }, { status: 409 });
      }

      console.error('Error adding favorite:', error);
      return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      favorite: data,
    });
  } catch (error: any) {
    console.error('Favorites POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove a favorite
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

    const searchParams = request.nextUrl.searchParams;
    const favoriteId = searchParams.get('id');

    if (!favoriteId) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    // Delete by the favorite record ID
    const { error } = await supabase
      .from('saved_favorites')
      .delete()
      .eq('id', favoriteId)
      .eq('user_id', user.id); // Ensure user can only delete their own

    if (error) {
      console.error('Error removing favorite:', error);
      return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Favorites DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
