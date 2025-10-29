'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * ModernCTACards - Beautiful, responsive Call-to-Action cards
 *
 * Features:
 * - Modern glassmorphism design
 * - Optimized for both desktop and mobile
 * - Smooth animations and transitions
 * - Touch-optimized for mobile devices
 * - High performance with minimal re-renders
 * - Accessibility-friendly
 */

interface CTACard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
  glowColor: string;
  stats?: { label: string; value: string }[];
}

export default function ModernCTACards() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const cards: CTACard[] = [
    {
      id: 'visiting',
      title: 'Visiting',
      subtitle: 'Explore the North',
      description: 'Plan your perfect trip with aurora forecasts, cost calculators, and local insights',
      href: '/visiting',
      icon: '🌌',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      glowColor: 'rgba(16, 185, 129, 0.5)',
      stats: [
        { label: 'Aurora Forecast', value: 'Live' },
        { label: 'Trip Calculator', value: 'Free' },
      ],
    },
    {
      id: 'living',
      title: 'Living',
      subtitle: 'Life in the Arctic',
      description: 'Connect with your community through garage sales, events, and local resources',
      href: '/living',
      icon: '🏔️',
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      glowColor: 'rgba(99, 102, 241, 0.5)',
      stats: [
        { label: 'Garage Sales', value: 'Active' },
        { label: 'Community', value: 'Growing' },
      ],
    },
    {
      id: 'moving',
      title: 'Moving',
      subtitle: 'Your Journey Awaits',
      description: 'Everything you need to relocate to Yellowknife with confidence and ease',
      href: '/moving',
      icon: '🎒',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      glowColor: 'rgba(168, 85, 247, 0.5)',
      stats: [
        { label: 'Guides', value: 'Complete' },
        { label: 'Support', value: '24/7' },
      ],
    },
  ];

  return (
    <div className="w-full">
      {/* Desktop View (3 columns) */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-8 px-4">
        {cards.map((card) => (
          <DesktopCard
            key={card.id}
            card={card}
            isActive={activeCard === card.id}
            onHover={() => setActiveCard(card.id)}
            onLeave={() => setActiveCard(null)}
          />
        ))}
      </div>

      {/* Tablet View (2 columns, then 1) */}
      <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6 px-4">
        {cards.map((card) => (
          <TabletCard
            key={card.id}
            card={card}
            isActive={activeCard === card.id}
            onHover={() => setActiveCard(card.id)}
            onLeave={() => setActiveCard(null)}
          />
        ))}
      </div>

      {/* Mobile View (Swipeable cards) */}
      <div className="md:hidden px-4 space-y-6">
        {cards.map((card) => (
          <MobileCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

// Desktop Card Component (Large, hoverable)
function DesktopCard({
  card,
  isActive,
  onHover,
  onLeave,
}: {
  card: CTACard;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <Link
      href={card.href}
      className="group block"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className={`relative h-[560px] rounded-3xl overflow-hidden bg-gradient-to-br ${card.gradient} p-[2px] transition-all duration-500 ${
          isActive ? 'scale-105 shadow-2xl' : 'scale-100'
        }`}
        style={{
          boxShadow: isActive ? `0 25px 50px -12px ${card.glowColor}` : undefined,
        }}
      >
        {/* Glass layer */}
        <div className="relative h-full rounded-[22px] bg-dark-900/40 backdrop-blur-xl border border-white/10 overflow-hidden">
          {/* Animated gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-700`}
          />

          {/* Floating orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className={`absolute top-10 -right-20 w-60 h-60 bg-gradient-to-br ${card.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700`}
            />
            <div
              className={`absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br ${card.gradient} rounded-full blur-3xl opacity-15 group-hover:opacity-30 transition-opacity duration-700`}
            />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col p-10">
            {/* Icon */}
            <div className="mb-6">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <span className="text-5xl">{card.icon}</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4">
              <h3 className="text-5xl font-black text-white mb-2 leading-tight tracking-tight">
                {card.title}
              </h3>
              <p className={`text-xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                {card.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-grow">
              {card.description}
            </p>

            {/* Stats */}
            {card.stats && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {card.stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className={`text-sm font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <div className={`flex items-center gap-3 text-white font-bold text-lg bg-gradient-to-r ${card.gradient} px-6 py-4 rounded-xl shadow-lg group-hover:shadow-2xl transform group-hover:translate-x-2 transition-all duration-300`}>
              <span>Explore Now</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </div>
      </div>
    </Link>
  );
}

// Tablet Card Component (Medium size)
function TabletCard({
  card,
  isActive,
  onHover,
  onLeave,
}: {
  card: CTACard;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <Link
      href={card.href}
      className="group block"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className={`relative h-[480px] rounded-2xl overflow-hidden bg-gradient-to-br ${card.gradient} p-[2px] transition-all duration-500 ${
          isActive ? 'scale-[1.02] shadow-xl' : 'scale-100'
        }`}
        style={{
          boxShadow: isActive ? `0 20px 40px -12px ${card.glowColor}` : undefined,
        }}
      >
        <div className="relative h-full rounded-[14px] bg-dark-900/40 backdrop-blur-xl border border-white/10 overflow-hidden">
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />

          {/* Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-10 -right-10 w-40 h-40 bg-gradient-to-br ${card.gradient} rounded-full blur-3xl opacity-20`} />
            <div className={`absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-br ${card.gradient} rounded-full blur-3xl opacity-15`} />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col p-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg mb-5`}>
              <span className="text-4xl">{card.icon}</span>
            </div>

            <h3 className="text-4xl font-black text-white mb-2 leading-tight">
              {card.title}
            </h3>
            <p className={`text-lg font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-4`}>
              {card.subtitle}
            </p>

            <p className="text-gray-300 text-base leading-relaxed mb-6 flex-grow">
              {card.description}
            </p>

            <div className={`flex items-center gap-3 text-white font-bold bg-gradient-to-r ${card.gradient} px-5 py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              <span>Explore</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Mobile Card Component (Compact, touch-optimized)
function MobileCard({ card }: { card: CTACard }) {
  return (
    <Link href={card.href} className="group block active:scale-[0.98] transition-transform duration-200">
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${card.gradient} p-[2px] shadow-lg active:shadow-2xl transition-shadow`}>
        <div className="relative rounded-[14px] bg-dark-900/60 backdrop-blur-xl border border-white/10 overflow-hidden">
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10`} />

          {/* Orb */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${card.gradient} rounded-full blur-2xl opacity-30`} />
          </div>

          {/* Content */}
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-3xl font-black text-white mb-1 leading-tight">
                  {card.title}
                </h3>
                <p className={`text-base font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  {card.subtitle}
                </p>
              </div>
              <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ml-4`}>
                <span className="text-3xl">{card.icon}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-5">
              {card.description}
            </p>

            {/* Stats Row */}
            {card.stats && (
              <div className="flex gap-3 mb-5">
                {card.stats.map((stat, idx) => (
                  <div key={idx} className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className={`text-xs font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-0.5`}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className={`flex items-center justify-center gap-2 text-white font-bold bg-gradient-to-r ${card.gradient} px-5 py-3.5 rounded-xl shadow-lg active:shadow-2xl transition-all duration-200`}>
              <span>Explore Now</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
