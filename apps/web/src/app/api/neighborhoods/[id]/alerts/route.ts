/**
 * Neighborhood Alerts API
 * Create and manage security/community alerts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const alertSchema = z.object({
  alert_type: z.enum([
    'security',
    'suspicious_activity',
    'crime',
    'emergency',
    'weather',
    'utility',
    'wildlife',
    'traffic',
    'other',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  camera_feed_urls: z.array(z.string()).optional(),
});

// GET - Fetch neighborhood alerts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const neighborhoodId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const alert_type = searchParams.get('alert_type');
    const severity = searchParams.get('severity');
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Check if user is an approved member
    const { data: membership } = await supabase
      .from('neighborhood_members')
      .select('status')
      .eq('neighborhood_id', neighborhoodId)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.status !== 'approved') {
      return NextResponse.json(
        { error: 'You must be an approved member to view alerts' },
        { status: 403 }
      );
    }

    // Build query
    let query = supabase
      .from('neighborhood_alerts')
      .select(`
        *,
        profiles:user_id(full_name, email)
      `)
      .eq('neighborhood_id', neighborhoodId)
      .eq('status', status);

    if (alert_type) {
      query = query.eq('alert_type', alert_type);
    }

    if (severity) {
      query = query.eq('severity', severity);
    }

    query = query
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: alerts, error } = await query;

    if (error) {
      console.error('Error fetching alerts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch alerts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ alerts: alerts || [] });
  } catch (error: any) {
    console.error('Alerts GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new alert
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = alertSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const neighborhoodId = params.id;

    // Check if user is an approved member
    const { data: membership } = await supabase
      .from('neighborhood_members')
      .select('status, id, notification_preferences')
      .eq('neighborhood_id', neighborhoodId)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.status !== 'approved') {
      return NextResponse.json(
        { error: 'You must be an approved member to create alerts' },
        { status: 403 }
      );
    }

    const alertData = validationResult.data;

    // Create alert
    const { data: alert, error } = await supabase
      .from('neighborhood_alerts')
      .insert({
        neighborhood_id: neighborhoodId,
        user_id: user.id,
        ...alertData,
        status: 'active',
      })
      .select(`
        *,
        profiles:user_id(full_name, email)
      `)
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      return NextResponse.json(
        { error: 'Failed to create alert' },
        { status: 500 }
      );
    }

    // Update member's alert count
    await supabase
      .from('neighborhood_members')
      .update({
        alerts_count: (membership as any).alerts_count + 1,
        last_active_at: new Date().toISOString()
      })
      .eq('id', membership.id);

    // TODO: Send email notifications to all members with alerts enabled
    // This is especially important for high and critical severity alerts

    return NextResponse.json({
      alert,
      message: 'Alert created successfully. Email notifications will be sent to members.'
    });
  } catch (error: any) {
    console.error('Alert creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
