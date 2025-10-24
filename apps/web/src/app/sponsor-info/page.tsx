'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SponsorInfoPage() {
  const [selectedPosition, setSelectedPosition] = useState<string>('home_top');
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');

  const positions = [
    { id: 'home_top', name: 'Home - Top', multiplier: 2.0, description: 'Premium visibility at the top of the home page' },
    { id: 'home_middle', name: 'Home - Middle', multiplier: 1.5, description: 'Good visibility in the middle section' },
    { id: 'home_bottom', name: 'Home - Bottom', multiplier: 1.0, description: 'Footer area placement' },
    { id: 'visiting', name: 'Visiting Section', multiplier: 1.7, description: 'Target tourists and visitors' },
    { id: 'living', name: 'Living Section', multiplier: 1.4, description: 'Target local residents' },
    { id: 'moving', name: 'Moving Section', multiplier: 1.6, description: 'Target people relocating to Yellowknife' }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      basePrice: 10,
      features: [
        'Standard listing with name and tagline',
        'Clickable link to your website',
        'Display in selected position',
        'Basic analytics'
      ],
      color: 'aurora-blue'
    },
    {
      id: 'premium',
      name: 'Premium',
      basePrice: 15,
      features: [
        'Enhanced styling with aurora effects',
        'Priority placement in position',
        'Clickable link to your website',
        'Detailed analytics dashboard',
        'Featured badge'
      ],
      color: 'aurora-purple',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      basePrice: 25,
      features: [
        'Maximum visibility with custom animations',
        'Premium aurora background effects',
        'Top priority in all positions',
        'Advanced analytics and insights',
        'Custom integration options',
        'Dedicated account manager'
      ],
      color: 'yellow-400'
    }
  ];

  const calculatePrice = (days: number) => {
    const position = positions.find(p => p.id === selectedPosition);
    const plan = plans.find(p => p.id === selectedPlan);

    if (!position || !plan) return 0;

    let discount = 0;
    if (days >= 90) discount = 0.25;
    else if (days >= 30) discount = 0.15;
    else if (days >= 7) discount = 0.05;

    const basePrice = plan.basePrice * position.multiplier * days;
    return basePrice * (1 - discount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="text-aurora-blue hover:text-aurora-green transition-colors text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent">
            Become a Premium Sponsor
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Showcase your business to thousands of Yellowknife visitors, residents, and newcomers every month
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-green/5 backdrop-blur-sm p-6 rounded-xl border border-aurora-green/30 text-center">
            <div className="text-4xl font-bold text-aurora-green mb-2">10K+</div>
            <div className="text-gray-300">Monthly Visitors</div>
          </div>
          <div className="bg-gradient-to-br from-aurora-blue/20 to-aurora-blue/5 backdrop-blur-sm p-6 rounded-xl border border-aurora-blue/30 text-center">
            <div className="text-4xl font-bold text-aurora-blue mb-2">3</div>
            <div className="text-gray-300">Target Audiences</div>
          </div>
          <div className="bg-gradient-to-br from-aurora-purple/20 to-aurora-purple/5 backdrop-blur-sm p-6 rounded-xl border border-aurora-purple/30 text-center">
            <div className="text-4xl font-bold text-aurora-purple mb-2">6</div>
            <div className="text-gray-300">Premium Positions</div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border-2 p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? `border-${plan.color} shadow-lg`
                    : 'border-gray-700/50 hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-aurora-purple text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-aurora-green">
                    ${plan.basePrice}
                    <span className="text-sm text-gray-400">/day</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">base price</div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-300">
                      <span className="text-aurora-green mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {selectedPlan === plan.id && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className={`h-1 bg-gradient-to-r from-${plan.color} to-aurora-green rounded-full`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Position Selection */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Select Your Position</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {positions.map((position) => (
              <div
                key={position.id}
                onClick={() => setSelectedPosition(position.id)}
                className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border-2 p-6 cursor-pointer transition-all ${
                  selectedPosition === position.id
                    ? 'border-aurora-blue shadow-lg'
                    : 'border-gray-700/50 hover:border-gray-600'
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-2">{position.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{position.description}</p>
                <div className="text-sm text-aurora-green">
                  {position.multiplier}x multiplier
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Calculator */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Calculate Your Price</h2>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">7 Days</div>
                <div className="text-2xl font-bold text-white">
                  ${calculatePrice(7).toFixed(2)}
                </div>
                <div className="text-xs text-aurora-green mt-1">5% discount</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">30 Days</div>
                <div className="text-2xl font-bold text-white">
                  ${calculatePrice(30).toFixed(2)}
                </div>
                <div className="text-xs text-aurora-green mt-1">15% discount</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">90 Days</div>
                <div className="text-2xl font-bold text-white">
                  ${calculatePrice(90).toFixed(2)}
                </div>
                <div className="text-xs text-aurora-green mt-1">25% discount</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">365 Days</div>
                <div className="text-2xl font-bold text-white">
                  ${calculatePrice(365).toFixed(2)}
                </div>
                <div className="text-xs text-aurora-green mt-1">25% discount</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">
                Selected: {plans.find(p => p.id === selectedPlan)?.name} plan at{' '}
                {positions.find(p => p.id === selectedPosition)?.name}
              </p>
              <a href="mailto:sponsors@ykbuddy.com" className="inline-block">
                <button className="px-8 py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all">
                  Contact Us to Get Started
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Sponsor YK Buddy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">Targeted Audience</h3>
              <p className="text-gray-300">
                Reach people actively looking for businesses and services in Yellowknife - tourists planning trips,
                residents exploring local options, and newcomers settling into the community.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Analytics Dashboard</h3>
              <p className="text-gray-300">
                Track impressions, clicks, and engagement with your sponsored listing. Understand your ROI
                and make data-driven decisions about your advertising.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="text-xl font-bold text-white mb-3">Premium Visibility</h3>
              <p className="text-gray-300">
                Stand out with eye-catching aurora-themed designs that capture attention. Enterprise sponsors
                get animated backgrounds and top placement.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="text-xl font-bold text-white mb-3">Flexible Options</h3>
              <p className="text-gray-300">
                Choose from multiple positions and plans to fit your budget and goals. Start with a week
                and scale up to year-long campaigns.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-aurora-green/20 to-aurora-blue/20 backdrop-blur-sm rounded-2xl border-2 border-aurora-blue/30 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the growing list of businesses connecting with the Yellowknife community through YK Buddy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:sponsors@ykbuddy.com">
              <button className="px-8 py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all">
                Contact Sales
              </button>
            </a>
            <Link href="/admin/sponsors">
              <button className="px-8 py-4 bg-gray-800/50 border border-gray-700 text-white font-semibold rounded-lg hover:border-aurora-blue transition-all">
                Admin Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
