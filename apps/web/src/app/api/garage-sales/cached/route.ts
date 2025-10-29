/**
 * Cached Garage Sales API
 * 
 * Provides cached garage sales data for improved performance.
 * Uses Next.js caching with revalidation tags.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cachedQuery, CacheTags, CacheTTL } from '@/lib/server-cache';
import { checkRateLimit, rateLimitConfigs } from '@/lib/rate-limiting';

export const dynamic = 'force-dynamic';

/**
 * GET - Fetch cached garage sales
 * 
 * This endpoint uses server-side caching to reduce database load
 * and improve response times for frequently accessed data.
 */
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimit = checkRateLimit(request, rateLimitConfigs.read);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'active';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    // Use cached query
    const data = await cachedQuery(
      `garage-sales-${status}-${limit}`,
      async () => {
        const supabase = await createClient();
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('garage_sales')
          .select(`
            *,
            profiles!garage_sales_user_id_fkey (
              full_name,
              email
            )
          `)
          .eq('status', status)
          .eq('is_active', true)
          .gte('sale_date', today)
          .order('sale_date', { ascending: true })
          .limit(limit);

        if (error) throw error;

        return data || [];
      },
      {
        revalidate: CacheTTL.MEDIUM, // Revalidate every 5 minutes
        tags: [CacheTags.GARAGE_SALES],
      }
    );

    return NextResponse.json(
      {
        sales: data,
        cached: true,
        timestamp: new Date().toISOString(),
      },
      { headers: rateLimit.headers }
    );
  } catch (error: any) {
    console.error('Cached garage sales API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

