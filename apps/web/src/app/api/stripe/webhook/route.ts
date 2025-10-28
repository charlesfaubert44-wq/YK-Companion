/**
 * Stripe Webhook Handler
 * Processes Stripe webhook events for payment confirmations
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import {
  sendPaymentConfirmation,
  sendPaymentFailedNotification,
} from '@/lib/email/client';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent, supabase);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(paymentIntent, supabase);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge, supabase);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const metadata = paymentIntent.metadata;
  const userId = metadata.userId;
  const sponsorTier = metadata.sponsorTier;

  // Update payment intent status
  await supabase
    .from('payment_intents')
    .update({ status: 'succeeded' })
    .eq('id', paymentIntent.id);

  // Create or update sponsor record
  const { error: sponsorError } = await supabase
    .from('premium_sponsors')
    .insert({
      user_id: userId,
      tier: sponsorTier,
      payment_status: 'paid',
      payment_intent_id: paymentIntent.id,
      amount_paid: paymentIntent.amount / 100, // Convert from cents
      is_active: true,
    })
    .onConflict('user_id')
    .merge();

  if (sponsorError) {
    console.error('Error creating sponsor record:', sponsorError);
  }

  // Send confirmation email
  const email = metadata.email;
  const name = metadata.name || 'Valued Sponsor';
  const billingPeriod = metadata.billingPeriod || 'monthly';

  if (email) {
    await sendPaymentConfirmation({
      to: email,
      name,
      amount: paymentIntent.amount,
      sponsorTier: sponsorTier || 'Unknown',
      billingPeriod,
      paymentIntentId: paymentIntent.id,
    });
  }

  console.log(`Payment succeeded for user ${userId}, tier: ${sponsorTier}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  await supabase
    .from('payment_intents')
    .update({ status: 'failed' })
    .eq('id', paymentIntent.id);

  // Send failure notification email
  const metadata = paymentIntent.metadata;
  const email = metadata.email;
  const name = metadata.name || 'Valued Customer';
  const sponsorTier = metadata.sponsorTier || 'Unknown';
  const errorMessage = paymentIntent.last_payment_error?.message || 'Payment processing failed';

  if (email) {
    await sendPaymentFailedNotification({
      to: email,
      name,
      amount: paymentIntent.amount,
      sponsorTier,
      error: errorMessage,
    });
  }

  console.log(`Payment failed: ${paymentIntent.id}`);
}

/**
 * Handle refund
 */
async function handleRefund(charge: Stripe.Charge, supabase: any) {
  const paymentIntentId = charge.payment_intent as string;

  await supabase
    .from('payment_intents')
    .update({ status: 'refunded' })
    .eq('id', paymentIntentId);

  // Deactivate sponsor
  await supabase
    .from('premium_sponsors')
    .update({ is_active: false, payment_status: 'refunded' })
    .eq('payment_intent_id', paymentIntentId);

  console.log(`Refund processed for payment: ${paymentIntentId}`);
}

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};
