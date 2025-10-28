'use client';

/**
 * Payment Modal Component
 * Wrapper for Stripe checkout with Elements provider
 */

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  sponsorTier: string;
  userEmail: string;
  userName?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  sponsorTier,
  userEmail,
  userName,
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !clientSecret) {
      createPaymentIntent();
    }
  }, [isOpen]);

  const createPaymentIntent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          sponsorTier,
          email: userEmail,
          name: userName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (err: any) {
      console.error('Error creating payment intent:', err);
      setError(err.message || 'Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    // Payment successful
    onClose();
    // Show success message or redirect
    window.location.href = '/sponsor/success';
  };

  const handleError = (error: string) => {
    setError(error);
  };

  if (!isOpen) return null;

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#10B981',
        colorBackground: '#0a192f',
        colorText: '#ffffff',
        colorDanger: '#EF4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl shadow-2xl border border-aurora-green/20 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          Complete Your Purchase
        </h2>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-green"></div>
            <p className="text-gray-400 mt-4">Initializing payment...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={createPaymentIntent}
              className="mt-2 text-sm text-aurora-green hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {clientSecret && !isLoading && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              amount={amount}
              sponsorTier={sponsorTier}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}
