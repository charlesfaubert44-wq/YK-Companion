/**
 * Create Payment Intent API Route
 * Handles creation of Stripe payment intents for sponsor purchases
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent, createOrRetrieveCustomer } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, sponsorTier, email, name, userId } = body;

    // Validate required fields
    if (!amount || !email || !sponsorTier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user authentication
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create or retrieve Stripe customer
    const customer = await createOrRetrieveCustomer({
      email,
      name,
      metadata: {
        userId: user.id,
        sponsorTier,
      },
    });

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      amount,
      metadata: {
        userId: user.id,
        customerId: customer.id,
        sponsorTier,
        email,
      },
    });

    // Store payment intent in database
    const { error: dbError } = await supabase
      .from('payment_intents')
      .insert({
        id: paymentIntent.id,
        user_id: user.id,
        amount: amount,
        currency: 'cad',
        status: paymentIntent.status,
        sponsor_tier: sponsorTier,
        metadata: paymentIntent.metadata,
      });

    if (dbError) {
      console.error('Error storing payment intent:', dbError);
      // Continue anyway - payment intent was created
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
