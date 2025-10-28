/**
 * Garage Sales API
 * Full CRUD operations for garage sale listings
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for garage sale
const garageSaleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  sale_date: z.string(), // YYYY-MM-DD
  start_time: z.string(), // HH:MM
  end_time: z.string(), // HH:MM
  items_description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(),
  cash_only: z.boolean().optional(),
  early_birds_welcome: z.boolean().optional(),
});

// GET - Fetch all garage sales
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;

    // Query parameters
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('garage_sales')
      .select('*')
      .eq('status', status)
      .eq('is_active', true)
      .order('sale_date', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching garage sales:', error);
      return NextResponse.json(
        { error: 'Failed to fetch garage sales' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sales: data || [],
      count: count || 0,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Garage sales GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new garage sale
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = garageSaleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const saleData = validationResult.data;

    // Insert garage sale
    const { data, error } = await supabase
      .from('garage_sales')
      .insert({
        ...saleData,
        user_id: user.id,
        posted_by: user.id,
        status: 'active',
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating garage sale:', error);
      return NextResponse.json(
        { error: 'Failed to create garage sale' },
        { status: 500 }
      );
    }

    // TODO: Send notification to admins for approval (if needed)

    return NextResponse.json({
      success: true,
      sale: data,
      message: 'Garage sale created successfully!',
    });
  } catch (error: any) {
    console.error('Garage sale POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
