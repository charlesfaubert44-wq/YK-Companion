/**
 * Stripe Server-Side Utilities
 * Handles payment processing, customer management, and webhooks
 */

import Stripe from 'stripe';
import { stripeConfig } from './config';

// Initialize Stripe with secret key (only if configured)
export const stripe = stripeConfig.isConfigured
  ? new Stripe(stripeConfig.secretKey, {
      apiVersion: stripeConfig.apiVersion,
      typescript: true,
    })
  : null;

/**
 * Create a payment intent for sponsor checkout
 */
export async function createPaymentIntent({
  amount,
  currency = 'cad',
  metadata,
}: {
  amount: number;
  currency?: string;
  metadata?: Stripe.MetadataParam;
}): Promise<Stripe.PaymentIntent> {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
}

/**
 * Create or retrieve a Stripe customer
 */
export async function createOrRetrieveCustomer({
  email,
  name,
  metadata,
}: {
  email: string;
  name?: string;
  metadata?: Stripe.MetadataParam;
}): Promise<Stripe.Customer> {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }

  try {
    // Check if customer exists
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });

    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new Error('Failed to create customer');
  }
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }

  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeConfig.webhookSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Create a refund
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return refund;
  } catch (error) {
    console.error('Error creating refund:', error);
    throw new Error('Failed to create refund');
  }
}

/**
 * Retrieve payment intent
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }

  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw new Error('Failed to retrieve payment intent');
  }
}
