'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * ModernPathwayCards - Clean, modern 3-card pathway system
 *
 * Features:
 * - Minimalist, elegant design
 * - Smooth hover effects
 * - Icon-based visual identity
 * - Responsive grid layout
 * - High performance
 */
export default function ModernPathwayCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const pathways = [
    {
      id: 'visiting',
      href: '/visiting',
      title: 'Visiting',
      subtitle: 'Explore Yellowknife',
      description: 'Discover attractions, tours, and experiences',
      icon: '✈️',
      gradient: 'from-emerald-500 to-teal-500',
      hoverGradient: 'from-emerald-400 to-teal-400',
      bgPattern: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400/60',
      textColor: 'text-emerald-400',
    },
    {
      id: 'living',
      href: '/living',
      title: 'Living',
      subtitle: 'Life in the North',
      description: 'Connect with your community',
      icon: '🏔️',
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'from-blue-400 to-cyan-400',
      bgPattern: 'from-blue-500/10 via-cyan-500/5 to-transparent',
      borderColor: 'border-blue-500/30 hover:border-blue-400/60',
      textColor: 'text-blue-400',
    },
    {
      id: 'moving',
      href: '/moving',
      title: 'Moving',
      subtitle: 'Start Your Journey',
      description: 'Everything you need to relocate',
      icon: '🧭',
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'from-purple-400 to-pink-400',
      bgPattern: 'from-purple-500/10 via-pink-500/5 to-transparent',
      borderColor: 'border-purple-500/30 hover:border-purple-400/60',
      textColor: 'text-purple-400',
    },
  ];

  return (
    <div className="w-full py-8 sm:py-12 md:py-16">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
          Choose Your Path
        </h2>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
          Select the experience that matches your needs
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 max-w-7xl mx-auto">
        {pathways.map((pathway) => {
          const isHovered = hoveredCard === pathway.id;

          return (
            <Link
              key={pathway.id}
              href={pathway.href}
              className="group block"
              onMouseEnter={() => setHoveredCard(pathway.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`
                  relative h-[400px] sm:h-[420px] md:h-[450px]
                  rounded-2xl sm:rounded-3xl overflow-hidden
                  backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90
                  border-2 ${pathway.borderColor}
                  transition-all duration-500 ease-out
                  ${isHovered ? 'transform scale-[1.02] shadow-2xl' : 'shadow-lg'}
                `}
              >
                {/* Background Pattern */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pathway.bgPattern} opacity-50`} />

                {/* Gradient Overlay on Hover */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-br ${pathway.hoverGradient}
                    opacity-0 transition-opacity duration-500
                    ${isHovered ? 'opacity-10' : ''}
                  `}
                />

                {/* Content Container */}
                <div className="relative h-full flex flex-col p-8 sm:p-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className={`
                        inline-flex items-center justify-center
                        w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                        rounded-2xl bg-gradient-to-br ${pathway.gradient}
                        shadow-lg transition-all duration-500
                        ${isHovered ? 'scale-110 rotate-3' : ''}
                      `}
                    >
                      <span className="text-4xl sm:text-5xl md:text-6xl">
                        {pathway.icon}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className={`
                      text-3xl sm:text-4xl md:text-5xl font-bold mb-2
                      bg-gradient-to-r ${pathway.gradient} bg-clip-text text-transparent
                      transition-all duration-300
                      ${isHovered ? 'tracking-wide' : ''}
                    `}
                  >
                    {pathway.title}
                  </h3>

                  {/* Subtitle */}
                  <p className={`text-lg sm:text-xl font-medium mb-4 ${pathway.textColor}`}>
                    {pathway.subtitle}
                  </p>

                  {/* Divider */}
                  <div
                    className={`
                      h-1 bg-gradient-to-r ${pathway.gradient} rounded-full mb-6
                      transition-all duration-500
                      ${isHovered ? 'w-24' : 'w-12'}
                    `}
                  />

                  {/* Description */}
                  <p className="text-gray-300 text-base sm:text-lg mb-8 flex-grow">
                    {pathway.description}
                  </p>

                  {/* CTA Button */}
                  <div
                    className={`
                      inline-flex items-center gap-3 text-white font-semibold text-base sm:text-lg
                      transition-all duration-300
                      ${isHovered ? 'translate-x-2' : ''}
                    `}
                  >
                    <span>Explore</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Shine Effect */}
                <div
                  className={`
                    absolute inset-0 opacity-0 transition-opacity duration-700
                    bg-gradient-to-r from-transparent via-white/5 to-transparent
                    ${isHovered ? 'opacity-100 animate-shine' : ''}
                  `}
                />

                {/* Bottom Glow */}
                <div
                  className={`
                    absolute bottom-0 left-0 right-0 h-1
                    bg-gradient-to-r ${pathway.gradient}
                    transition-all duration-500
                    ${isHovered ? 'h-2 opacity-100' : 'opacity-0'}
                  `}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
