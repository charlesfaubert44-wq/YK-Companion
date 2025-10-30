/**
 * Neighborhoods API
 * Fetch available neighborhoods and suggest based on address
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch all active neighborhoods
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    // If address is provided, suggest neighborhoods
    if (address) {
      const { data, error } = await supabase.rpc('suggest_neighborhood_from_address', {
        p_address: address,
      });

      if (error) {
        console.error('Error suggesting neighborhoods:', error);
        return NextResponse.json({ error: 'Failed to suggest neighborhoods' }, { status: 500 });
      }

      return NextResponse.json({ suggestions: data || [] });
    }

    // Otherwise, fetch all active neighborhoods
    const { data, error } = await supabase
      .from('neighborhoods')
      .select(
        `
        *,
        member_count:neighborhood_members(count)
      `
      )
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching neighborhoods:', error);
      return NextResponse.json({ error: 'Failed to fetch neighborhoods' }, { status: 500 });
    }

    // Process data to flatten the count
    const neighborhoods = data?.map(n => ({
      ...n,
      member_count: n.member_count?.[0]?.count || 0,
    }));

    return NextResponse.json({ neighborhoods: neighborhoods || [] });
  } catch (error: any) {
    console.error('Neighborhoods GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
