'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * ModernPathwayCards - User-first pathway selection system
 *
 * Features:
 * - Clear decision-making flow
 * - Self-identifying options
 * - Primary action focus
 * - Excellent UX for first-time users
 */
export default function ModernPathwayCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const pathways = [
    {
      id: 'visiting',
      href: '/visiting',
      title: 'Visiting',
      userLabel: 'I am planning a visit',
      helpText: 'Tourist • First time • Short stay',
      description:
        'Explore attractions, book tours, find accommodations, and plan your northern adventure.',
      gradient: 'from-emerald-500 to-teal-500',
      hoverGradient: 'from-emerald-400 to-teal-400',
      bgPattern: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      textColor: 'text-emerald-400',
      shadowColor: 'shadow-emerald-500/50',
      ctaText: 'Start Planning',
    },
    {
      id: 'living',
      href: '/living',
      title: 'Living',
      userLabel: 'I already live here',
      helpText: 'Resident • Local • Community',
      description:
        'Connect with your community, discover local events, services, and everything happening in Yellowknife.',
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'from-blue-400 to-cyan-400',
      bgPattern: 'from-blue-500/10 via-cyan-500/5 to-transparent',
      borderColor: 'border-blue-500/30 hover:border-blue-400',
      textColor: 'text-blue-400',
      shadowColor: 'shadow-blue-500/50',
      ctaText: 'Explore Local',
    },
    {
      id: 'moving',
      href: '/moving',
      title: 'Moving',
      userLabel: 'I am relocating here',
      helpText: 'New resident • Job transfer • Moving soon',
      description:
        'Get everything you need to relocate: housing, jobs, services, schools, and settling-in resources.',
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'from-purple-400 to-pink-400',
      bgPattern: 'from-purple-500/10 via-pink-500/5 to-transparent',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      textColor: 'text-purple-400',
      shadowColor: 'shadow-purple-500/50',
      ctaText: 'Get Started',
    },
  ];

  return (
    <div className="w-full py-8 sm:py-12 md:py-16">
      {/* Primary Decision Prompt */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-500"></div>
          <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">Step 1</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-500"></div>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-5">
          What brings you to Yellowknife?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Select the option that best describes your situation to get personalized information and
          resources.
        </p>
      </div>

      {/* Cards Grid - Larger with more breathing room */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 max-w-7xl mx-auto">
        {pathways.map(pathway => {
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
                  relative min-h-[440px] sm:min-h-[460px] md:min-h-[480px]
                  rounded-2xl sm:rounded-3xl overflow-hidden
                  backdrop-blur-xl bg-gradient-to-br from-gray-900/95 to-gray-800/95
                  border-2 ${pathway.borderColor}
                  transition-all duration-500 ease-out
                  cursor-pointer
                  ${isHovered ? `transform scale-[1.02] lg:scale-[1.05] shadow-2xl ${pathway.shadowColor}` : 'shadow-xl'}
                `}
              >
                {/* Background Pattern */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${pathway.bgPattern} opacity-40 group-hover:opacity-70 transition-opacity duration-500`}
                />

                {/* Gradient Overlay on Hover */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-br ${pathway.hoverGradient}
                    opacity-0 transition-opacity duration-500
                    ${isHovered ? 'opacity-20' : ''}
                  `}
                />

                {/* Content Container */}
                <div className="relative h-full flex flex-col p-6 sm:p-7 md:p-8">
                  {/* Icon - Centered and Prominent */}
                  <div className="flex justify-center mb-6">
                    <div
                      className={`
                        transition-all duration-500
                        ${isHovered ? 'scale-110 -translate-y-2' : ''}
                      `}
                    >
                      {pathway.id === 'visiting' && <BushPlaneIcon isHovered={isHovered} />}
                      {pathway.id === 'living' && <NorthernCabinIcon isHovered={isHovered} />}
                      {pathway.id === 'moving' && <MovingTruckIcon isHovered={isHovered} />}
                    </div>
                  </div>

                  {/* User-facing Label - Primary identifier */}
                  <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
                    {pathway.userLabel}
                  </h3>

                  {/* Help Text - Secondary identifier */}
                  <p
                    className={`text-center text-sm sm:text-base ${pathway.textColor} mb-4 sm:mb-5 font-medium`}
                  >
                    {pathway.helpText}
                  </p>

                  {/* Divider */}
                  <div className="flex justify-center mb-5 sm:mb-6">
                    <div
                      className={`
                        h-1 bg-gradient-to-r ${pathway.gradient} rounded-full
                        transition-all duration-500
                        ${isHovered ? 'w-24 sm:w-32' : 'w-16 sm:w-20'}
                      `}
                    />
                  </div>

                  {/* Description - What they'll get */}
                  <p className="text-center text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 flex-grow">
                    {pathway.description}
                  </p>

                  {/* Primary CTA Button */}
                  <div className="flex justify-center">
                    <div
                      className={`
                        inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4
                        bg-gradient-to-r ${pathway.gradient}
                        rounded-xl sm:rounded-2xl
                        text-white font-bold text-base sm:text-lg
                        shadow-lg
                        transition-all duration-300
                        ${isHovered ? 'shadow-2xl scale-105 gap-4' : ''}
                      `}
                    >
                      <span>{pathway.ctaText}</span>
                      <svg
                        className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Animated Shine Effect */}
                <div
                  className={`
                    absolute inset-0 opacity-0 transition-opacity duration-700
                    bg-gradient-to-r from-transparent via-white/10 to-transparent
                    ${isHovered ? 'opacity-100 animate-shine' : ''}
                  `}
                />

                {/* Selection Indicator on Hover */}
                <div
                  className={`
                    absolute top-4 right-4
                    w-8 h-8 sm:w-10 sm:h-10
                    rounded-full bg-gradient-to-br ${pathway.gradient}
                    flex items-center justify-center
                    transition-all duration-300
                    ${isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                  `}
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Bottom Accent Bar */}
                <div
                  className={`
                    absolute bottom-0 left-0 right-0
                    bg-gradient-to-r ${pathway.gradient}
                    transition-all duration-500
                    ${isHovered ? 'h-1.5' : 'h-1 opacity-60'}
                  `}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Helper Text Below */}
      <div className="text-center mt-8 sm:mt-10 px-4">
        <p className="text-xs sm:text-sm text-gray-500">
          Not sure? You can always explore other sections later.
        </p>
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

// Custom Bush Plane Icon for Visiting
function BushPlaneIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg
      className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 transition-all duration-500 ${isHovered ? 'drop-shadow-[0_0_16px_rgba(16,185,129,0.9)]' : 'drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]'}`}
      viewBox="0 0 80 80"
      fill="none"
    >
      <defs>
        <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>

      {/* Propeller blur */}
      <ellipse cx="40" cy="12" rx="6" ry="1.5" fill="rgba(203,213,225,0.5)" opacity="0.7">
        <animate
          attributeName="opacity"
          values="0.4;0.8;0.4"
          dur="0.15s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Fuselage */}
      <path
        d="M38 14 L40 16 L40 32 L38 32 L36 32 L36 16 Z"
        fill="url(#planeGrad)"
        stroke="#10b981"
        strokeWidth="2"
      >
        <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
      </path>

      {/* Cockpit */}
      <ellipse
        cx="38"
        cy="20"
        rx="3"
        ry="4"
        fill="rgba(59,130,246,0.7)"
        stroke="#3b82f6"
        strokeWidth="1.5"
      />

      {/* Wings */}
      <path
        d="M8 38 L12 36 L36 36 L36 42 L12 42 L8 40 Z"
        fill="rgba(16,185,129,0.6)"
        stroke="#10b981"
        strokeWidth="2"
      />
      <path
        d="M68 38 L64 36 L40 36 L40 42 L64 42 L68 40 Z"
        fill="rgba(16,185,129,0.6)"
        stroke="#10b981"
        strokeWidth="2"
      />

      {/* Wing tips glow */}
      <circle cx="8" cy="39" r="2.5" fill="#10b981">
        <animate attributeName="r" values="2.5;3.5;2.5" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="68" cy="39" r="2.5" fill="#10b981">
        <animate attributeName="r" values="2.5;3.5;2.5" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Fuselage body */}
      <rect
        x="35"
        y="32"
        width="6"
        height="22"
        rx="1"
        fill="url(#planeGrad)"
        stroke="#10b981"
        strokeWidth="2"
      />

      {/* Pontoons */}
      <ellipse
        cx="32"
        cy="58"
        rx="10"
        ry="3"
        fill="rgba(6,182,212,0.5)"
        stroke="#06b6d4"
        strokeWidth="2"
      />
      <ellipse
        cx="44"
        cy="58"
        rx="10"
        ry="3"
        fill="rgba(6,182,212,0.5)"
        stroke="#06b6d4"
        strokeWidth="2"
      />

      {/* Struts */}
      <line x1="34" y1="54" x2="36" y2="48" stroke="#10b981" strokeWidth="1.5" />
      <line x1="42" y1="54" x2="40" y2="48" stroke="#10b981" strokeWidth="1.5" />

      {/* Tail */}
      <path d="M36 62 L38 66 L40 62 Z" fill="url(#planeGrad)" stroke="#10b981" strokeWidth="1.5" />
    </svg>
  );
}

// Custom Northern Cabin Icon for Living
function NorthernCabinIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg
      className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 transition-all duration-500 ${isHovered ? 'drop-shadow-[0_0_16px_rgba(59,130,246,0.9)]' : 'drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]'}`}
      viewBox="0 0 80 80"
      fill="none"
    >
      <defs>
        <linearGradient id="cabinWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>
        <linearGradient id="cabinRoof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Snow ground */}
      <ellipse cx="40" cy="70" rx="35" ry="6" fill="rgba(255,255,255,0.2)" />

      {/* Cabin walls */}
      <rect
        x="20"
        y="40"
        width="40"
        height="30"
        rx="2"
        fill="url(#cabinWall)"
        stroke="#92400e"
        strokeWidth="1.5"
      />

      {/* Wood planks */}
      <line x1="20" y1="48" x2="60" y2="48" stroke="#92400e" strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="56" x2="60" y2="56" stroke="#92400e" strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="64" x2="60" y2="64" stroke="#92400e" strokeWidth="0.5" opacity="0.3" />

      {/* Roof */}
      <path d="M15 40 L40 20 L65 40 Z" fill="url(#cabinRoof)" stroke="#7f1d1d" strokeWidth="2" />

      {/* Snow on roof */}
      <path d="M15 40 L18 38 L40 22 L62 38 L65 40 L40 24 Z" fill="rgba(255,255,255,0.7)" />

      {/* Chimney */}
      <rect
        x="48"
        y="26"
        width="8"
        height="16"
        rx="1"
        fill="#7f1d1d"
        stroke="#450a0a"
        strokeWidth="1.5"
      />
      <rect x="47" y="25" width="10" height="3" fill="#991b1b" />

      {/* Animated smoke */}
      <circle cx="52" cy="20" r="3" fill="rgba(203,213,225,0.6)">
        <animate attributeName="cy" values="20;14;8" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="r" values="3;4;5" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.4;0" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* Windows with warm glow */}
      <rect
        x="28"
        y="48"
        width="10"
        height="12"
        rx="1"
        fill="url(#windowGlow)"
        stroke="#d97706"
        strokeWidth="1.5"
      >
        <animate
          attributeName="fill-opacity"
          values="0.7;0.9;0.7"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x="42"
        y="48"
        width="10"
        height="12"
        rx="1"
        fill="url(#windowGlow)"
        stroke="#d97706"
        strokeWidth="1.5"
      >
        <animate
          attributeName="fill-opacity"
          values="0.7;0.9;0.7"
          dur="3s"
          repeatCount="indefinite"
          begin="0.5s"
        />
      </rect>

      {/* Window panes */}
      <line x1="33" y1="48" x2="33" y2="60" stroke="#d97706" strokeWidth="1" />
      <line x1="28" y1="54" x2="38" y2="54" stroke="#d97706" strokeWidth="1" />
      <line x1="47" y1="48" x2="47" y2="60" stroke="#d97706" strokeWidth="1" />
      <line x1="42" y1="54" x2="52" y2="54" stroke="#d97706" strokeWidth="1" />

      {/* Door */}
      <rect
        x="34"
        y="58"
        width="12"
        height="12"
        rx="1"
        fill="#92400e"
        stroke="#78350f"
        strokeWidth="1.5"
      />
      <circle cx="43" cy="64" r="0.8" fill="#fbbf24" />

      {/* Pine trees */}
      <g opacity="0.4">
        <path d="M10 55 L13 48 L16 55 Z" fill="#065f46" />
        <path d="M10 60 L13 53 L16 60 Z" fill="#064e3b" />
        <rect x="12" y="60" width="2" height="5" fill="#78350f" />
      </g>
    </svg>
  );
}

// Custom Moving Truck Icon for Moving
function MovingTruckIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg
      className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 transition-all duration-500 ${isHovered ? 'drop-shadow-[0_0_16px_rgba(168,85,247,0.9)]' : 'drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]'}`}
      viewBox="0 0 80 80"
      fill="none"
    >
      <defs>
        <linearGradient id="truckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Road */}
      <rect x="0" y="60" width="80" height="4" fill="rgba(100,116,139,0.3)" />
      <line
        x1="0"
        y1="62"
        x2="80"
        y2="62"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.5"
        strokeDasharray="4 4"
      >
        <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite" />
      </line>

      {/* Exhaust smoke */}
      <ellipse cx="12" cy="48" rx="3" ry="2" fill="rgba(203,213,225,0.5)">
        <animate attributeName="cx" values="12;6;0" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="3;4;5" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.3;0" dur="1.5s" repeatCount="indefinite" />
      </ellipse>

      {/* Truck cargo box */}
      <rect
        x="15"
        y="32"
        width="35"
        height="24"
        rx="2"
        fill="url(#truckGrad)"
        stroke="#a855f7"
        strokeWidth="2"
      />

      {/* Box details */}
      <line x1="30" y1="32" x2="30" y2="56" stroke="#c084fc" strokeWidth="1" opacity="0.4" />
      <line x1="15" y1="44" x2="50" y2="44" stroke="#c084fc" strokeWidth="1" opacity="0.4" />

      {/* Cab */}
      <rect
        x="50"
        y="38"
        width="18"
        height="18"
        rx="1.5"
        fill="rgba(168,85,247,0.8)"
        stroke="#a855f7"
        strokeWidth="2"
      />

      {/* Windows */}
      <rect x="52" y="40" width="6" height="8" rx="0.5" fill="rgba(192,132,252,0.5)" />
      <rect x="59" y="40" width="7" height="8" rx="0.5" fill="rgba(192,132,252,0.5)" />

      {/* Headlight */}
      <circle cx="66" cy="50" r="1.5" fill="#fbbf24">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Wheels */}
      <circle cx="25" cy="56" r="5" fill="rgba(31,41,55,0.9)" stroke="#4b5563" strokeWidth="2" />
      <circle cx="25" cy="56" r="2.5" fill="#6b7280" />
      <circle cx="45" cy="56" r="5" fill="rgba(31,41,55,0.9)" stroke="#4b5563" strokeWidth="2" />
      <circle cx="45" cy="56" r="2.5" fill="#6b7280" />
      <circle cx="60" cy="56" r="5" fill="rgba(31,41,55,0.9)" stroke="#4b5563" strokeWidth="2" />
      <circle cx="60" cy="56" r="2.5" fill="#6b7280" />

      {/* Movement lines */}
      {isHovered && (
        <>
          <line
            x1="8"
            y1="35"
            x2="12"
            y2="35"
            stroke="rgba(168,85,247,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <animate attributeName="x1" values="8;0" dur="0.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="12;4" dur="0.5s" repeatCount="indefinite" />
          </line>
          <line
            x1="6"
            y1="42"
            x2="10"
            y2="42"
            stroke="rgba(168,85,247,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <animate attributeName="x1" values="6;0" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="x2" values="10;4" dur="0.6s" repeatCount="indefinite" />
          </line>
          <line
            x1="8"
            y1="49"
            x2="12"
            y2="49"
            stroke="rgba(168,85,247,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <animate attributeName="x1" values="8;0" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="x2" values="12;4" dur="0.7s" repeatCount="indefinite" />
          </line>
        </>
      )}
    </svg>
  );
}
