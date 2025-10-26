'use client';

import Link from 'next/link';
import { useState } from 'react';
import Carousel, { CarouselCard } from './Carousel';

export default function EnhancedPathwayCardsCarousel() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const pathwayCards = [
    {
      id: 'visiting',
      href: '/visiting',
      title: 'VISITING',
      subtitle: 'Explore the North',
      borderColor: 'emerald-500',
      gradient: 'from-emerald-500/20 via-cyan-500/10 to-transparent',
      titleGradient: 'from-emerald-400 to-cyan-400',
      icon: (
        // Plane SVG (keeping the original detailed plane)
        <svg width="90" height="70" viewBox="0 0 100 80" className="drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] transform transition-all duration-700 group-hover:scale-110">
          <path d="M 50 8 L 52 10 L 52 32 L 50 32 L 48 32 L 48 10 Z" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="50" cy="14" rx="3" ry="4" fill="rgba(59, 130, 246, 0.5)" stroke="#3b82f6" strokeWidth="1.5" />
          <path d="M 10 38 L 15 36 L 48 36 L 48 42 L 15 42 L 10 40 Z" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 90 38 L 85 36 L 52 36 L 52 42 L 85 42 L 90 40 Z" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="39" r="2.5" fill="#10b981" />
          <circle cx="90" cy="39" r="2.5" fill="#10b981" />
          <rect x="47" y="32" width="6" height="28" rx="1" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />
          <ellipse cx="38" cy="62" rx="12" ry="3" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="2" />
          <ellipse cx="62" cy="62" rx="12" ry="3" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="2" />
          <line x1="42" y1="59" x2="48" y2="50" stroke="#10b981" strokeWidth="1.5" />
          <line x1="58" y1="59" x2="52" y2="50" stroke="#10b981" strokeWidth="1.5" />
          <path d="M 42 66 L 50 66 L 50 70 L 42 70 Z" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="2" />
          <path d="M 58 66 L 50 66 L 50 70 L 58 70 Z" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="2" />
          <path d="M 48 68 L 50 72 L 52 68 Z" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="2" />
          <ellipse cx="50" cy="7" rx="6" ry="1.5" fill="rgba(203, 213, 225, 0.4)" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
        </svg>
      )
    },
    {
      id: 'living',
      href: '/living',
      title: 'LIVING',
      subtitle: 'Life in the Arctic',
      borderColor: 'blue-500',
      gradient: 'from-blue-500/20 via-orange-500/10 to-transparent',
      titleGradient: 'from-blue-400 to-orange-400',
      icon: (
        // House emoji placeholder - could be enhanced with SVG
        <div className="text-6xl mb-2 transform transition-all duration-700 group-hover:scale-110">🏠</div>
      )
    },
    {
      id: 'moving',
      href: '/moving',
      title: 'MOVING',
      subtitle: 'Journey Awaits',
      borderColor: 'purple-500',
      gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
      titleGradient: 'from-purple-400 to-pink-400',
      icon: (
        // Compass SVG (from original)
        <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-[0_0_20px_rgba(168,85,247,0.6)] transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
          <circle cx="50" cy="50" r="35" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="28" fill="rgba(88, 28, 135, 0.3)" stroke="#c084fc" strokeWidth="2" />
          <text x="50" y="25" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">N</text>
          <text x="75" y="54" textAnchor="middle" fill="#e0e7ff" fontSize="9">E</text>
          <text x="50" y="80" textAnchor="middle" fill="#e0e7ff" fontSize="9">S</text>
          <text x="25" y="54" textAnchor="middle" fill="#e0e7ff" fontSize="9">W</text>
          <g>
            <path d="M50,50 L50,30 L47,50 Z" fill="#ef4444" opacity="0.8">
              <animateTransform attributeName="transform" type="rotate" values="0 50 50;5 50 50;-5 50 50;0 50 50" dur="4s" repeatCount="indefinite" />
            </path>
            <path d="M50,50 L50,70 L53,50 Z" fill="#e0e7ff" opacity="0.7">
              <animateTransform attributeName="transform" type="rotate" values="0 50 50;5 50 50;-5 50 50;0 50 50" dur="4s" repeatCount="indefinite" />
            </path>
          </g>
          <circle cx="50" cy="50" r="3.5" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5">
            <animate attributeName="r" values="3.5;4.5;3.5" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      )
    }
  ];

  return (
    <div className="relative">
      {/* Unified Glassmorphic Container */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-slate-900/60 via-slate-800/60 to-slate-900/60 border-l border-r border-b border-slate-700/50 rounded-b-3xl px-4 md:px-8 py-8 md:py-12 shadow-2xl -mt-px">
        {/* Desktop: Grid Layout (hidden on mobile) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {pathwayCards.map((card) => (
            <PathwayCard
              key={card.id}
              card={card}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
            />
          ))}
        </div>

        {/* Mobile: Carousel Layout (visible only on mobile) */}
        <div className="block md:hidden">
          <Carousel
            showDots={true}
            showArrows={false}
            loop={true}
            itemsPerView={{ mobile: 1, tablet: 1, desktop: 3 }}
            gap={16}
            snap={true}
            className="px-2"
          >
            {pathwayCards.map((card) => (
              <CarouselCard key={card.id}>
                <PathwayCard
                  card={card}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                />
              </CarouselCard>
            ))}
          </Carousel>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes snow-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(30px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function PathwayCard({
  card,
  hoveredCard,
  setHoveredCard
}: {
  card: any;
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) {
  return (
    <Link href={card.href} className="group block">
      <div
        className={`relative h-[300px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-${card.borderColor}/30 transition-all duration-500 hover:border-${card.borderColor}/60 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]`}
        onMouseEnter={() => setHoveredCard(card.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />

        {/* Falling Snow Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                animation: `snow-fall ${8 + Math.random() * 6}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>

        {/* Content Container - Bottom Aligned */}
        <div className="absolute inset-0 flex flex-col justify-end pb-6 px-6">
          {/* Title - Fixed Position from Bottom */}
          <div className="absolute bottom-[140px] left-6 right-6">
            <h3 className={`text-3xl font-bold text-white mb-2 bg-gradient-to-r ${card.titleGradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
              {card.title}
            </h3>
            <p className="text-xs text-gray-300/90">{card.subtitle}</p>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-2">
            {card.icon}
          </div>
        </div>

        {/* Glow Effect on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${card.borderColor}/0 to-${card.borderColor}/0 group-hover:from-${card.borderColor}/10 group-hover:to-transparent transition-all duration-500 pointer-events-none`} />
      </div>
    </Link>
  );
}
