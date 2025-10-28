'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

/**
 * EnhancedPathwayCards - Stunning 3D pathway cards with Northern Lights theme
 *
 * Features:
 * - 3D tilt effects with mouse tracking
 * - Animated SVG illustrations
 * - Dynamic northern lights animations
 * - Glassmorphism with backdrop blur
 * - Particle snow effects
 * - Smooth transitions and micro-interactions
 * - Responsive design for all screen sizes
 * - Accessibility with proper ARIA labels
 *
 * @example
 * <EnhancedPathwayCards />
 */
export default function EnhancedPathwayCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRefs = {
    visiting: useRef<HTMLDivElement>(null),
    living: useRef<HTMLDivElement>(null),
    moving: useRef<HTMLDivElement>(null),
  };

  // Track mouse position for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardName: string) => {
    const card = cardRefs[cardName as keyof typeof cardRefs].current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative">
      {/* Unified Glassmorphic Container with enhanced depth - Mobile Optimized */}
      <div className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/70 via-slate-800/70 to-slate-900/70 border-l border-r border-b sm:border-l-2 sm:border-r-2 sm:border-b-2 border-slate-700/60 rounded-b-2xl sm:rounded-b-3xl px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 shadow-2xl -mt-px relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-green/5 via-aurora-blue/5 to-aurora-purple/5 animate-aurora opacity-40" />

        {/* Three Pathway Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative z-10">
          {/* VISITING Card - Explorer with Northern Lights */}
          <Link href="/visiting" className="group block">
            <div
              ref={cardRefs.visiting}
              className="relative min-h-[280px] h-[320px] sm:h-[340px] md:h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-emerald-500/40 transition-all duration-500 hover:border-emerald-400/70 hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transform-gpu perspective-1000 touch-manipulation"
              style={{
                transform: hoveredCard === 'visiting'
                  ? `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg) translateZ(10px) scale(1.02)`
                  : 'rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)',
                transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), border 0.5s ease, box-shadow 0.5s ease',
              }}
              onMouseEnter={() => setHoveredCard('visiting')}
              onMouseLeave={() => {
                setHoveredCard(null);
                handleMouseLeave();
              }}
              onMouseMove={(e) => handleMouseMove(e, 'visiting')}
              role="article"
              aria-label="Visiting pathway - Explore the North"
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Enhanced falling snow particles with depth */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white shadow-lg"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-${Math.random() * 20}%`,
                      width: `${2 + Math.random() * 4}px`,
                      height: `${2 + Math.random() * 4}px`,
                      animation: `snow-fall ${8 + Math.random() * 6}s linear infinite`,
                      animationDelay: `${Math.random() * 5}s`,
                      opacity: 0.4 + Math.random() * 0.5,
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                    }}
                  />
                ))}
              </div>

              {/* Enhanced Northern Lights Waves */}
              <div className="absolute top-0 left-0 right-0 h-28 opacity-50 group-hover:opacity-80 transition-opacity duration-700">
                <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="filter drop-shadow-lg">
                  <path
                    d="M0,50 Q100,20 200,50 T400,50 L400,0 L0,0 Z"
                    fill="url(#visitingGradient)"
                    opacity="0.7"
                  >
                    <animate
                      attributeName="d"
                      values="M0,50 Q100,20 200,50 T400,50 L400,0 L0,0 Z;
                              M0,50 Q100,70 200,50 T400,50 L400,0 L0,0 Z;
                              M0,50 Q100,20 200,50 T400,50 L400,0 L0,0 Z"
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <defs>
                    <linearGradient id="visitingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                {/* Title with enhanced gradient */}
                <div>
                  <h3 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl animate-shimmer bg-[length:200%_auto]">
                    VISITING
                  </h3>
                  <p className="text-sm text-emerald-200/90 font-medium">Explore the North</p>

                  {/* Decorative line */}
                  <div className="mt-3 w-16 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full group-hover:w-24 transition-all duration-500" />
                </div>

                {/* Enhanced plane illustration */}
                <div className="flex justify-center">
                  <svg
                    width="100"
                    height="80"
                    viewBox="0 0 100 80"
                    className="drop-shadow-[0_0_25px_rgba(16,185,129,0.7)] transform transition-all duration-700 group-hover:scale-125 group-hover:translate-y-[-10px]"
                    style={{
                      filter: hoveredCard === 'visiting' ? 'drop-shadow(0 0 30px rgba(16,185,129,0.9))' : '',
                    }}
                  >
                    {/* Animated propeller blur */}
                    <ellipse cx="50" cy="7" rx="8" ry="2" fill="rgba(203, 213, 225, 0.5)" opacity="0.7">
                      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="0.2s" repeatCount="indefinite" />
                    </ellipse>

                    {/* Fuselage with gradient */}
                    <defs>
                      <linearGradient id="planeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>

                    <path d="M 50 8 L 52 10 L 52 32 L 50 32 L 48 32 L 48 10 Z" fill="url(#planeGradient)" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <ellipse cx="50" cy="14" rx="4" ry="5" fill="rgba(59, 130, 246, 0.6)" stroke="#3b82f6" strokeWidth="2" />

                    {/* Wings with glow */}
                    <path d="M 10 38 L 15 36 L 48 36 L 48 42 L 15 42 L 10 40 Z" fill="rgba(16, 185, 129, 0.5)" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 90 38 L 85 36 L 52 36 L 52 42 L 85 42 L 90 40 Z" fill="rgba(16, 185, 129, 0.5)" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Wing tips with pulse animation */}
                    <circle cx="10" cy="39" r="3" fill="#10b981">
                      <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="90" cy="39" r="3" fill="#10b981">
                      <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
                    </circle>

                    {/* Fuselage body */}
                    <rect x="47" y="32" width="6" height="28" rx="1.5" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="2.5" />

                    {/* Pontoon Floats */}
                    <ellipse cx="38" cy="62" rx="14" ry="4" fill="rgba(6, 182, 212, 0.5)" stroke="#06b6d4" strokeWidth="2.5" />
                    <ellipse cx="62" cy="62" rx="14" ry="4" fill="rgba(6, 182, 212, 0.5)" stroke="#06b6d4" strokeWidth="2.5" />

                    {/* Float Struts */}
                    <line x1="42" y1="58" x2="48" y2="50" stroke="#10b981" strokeWidth="2" />
                    <line x1="58" y1="58" x2="52" y2="50" stroke="#10b981" strokeWidth="2" />

                    {/* Tail sections */}
                    <path d="M 42 66 L 50 66 L 50 70 L 42 70 Z" fill="rgba(6, 182, 212, 0.5)" stroke="#06b6d4" strokeWidth="2.5" />
                    <path d="M 58 66 L 50 66 L 50 70 L 58 70 Z" fill="rgba(6, 182, 212, 0.5)" stroke="#06b6d4" strokeWidth="2.5" />
                    <path d="M 48 68 L 50 74 L 52 68 Z" fill="rgba(16, 185, 129, 0.5)" stroke="#10b981" strokeWidth="2.5" />
                  </svg>
                </div>

                {/* Interactive badge */}
                <div className="flex items-center gap-2 text-emerald-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="animate-pulse">→</span>
                  <span className="font-semibold">Explore Now</span>
                </div>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none" />
            </div>
          </Link>

          {/* LIVING Card - House with Smoke, Snow & Car */}
          <Link href="/living" className="group block">
            <div
              ref={cardRefs.living}
              className="relative min-h-[280px] h-[320px] sm:h-[340px] md:h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-blue-500/40 transition-all duration-500 hover:border-blue-400/70 hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transform-gpu perspective-1000 touch-manipulation"
              style={{
                transform: hoveredCard === 'living'
                  ? `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg) translateZ(10px) scale(1.02)`
                  : 'rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)',
                transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), border 0.5s ease, box-shadow 0.5s ease',
              }}
              onMouseEnter={() => setHoveredCard('living')}
              onMouseLeave={() => {
                setHoveredCard(null);
                handleMouseLeave();
              }}
              onMouseMove={(e) => handleMouseMove(e, 'living')}
              role="article"
              aria-label="Living pathway - Life in the Arctic"
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Enhanced falling snow */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white shadow-lg"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-${Math.random() * 20}%`,
                      width: `${1.5 + Math.random() * 4}px`,
                      height: `${1.5 + Math.random() * 4}px`,
                      animation: `snow-fall ${6 + Math.random() * 8}s linear infinite`,
                      animationDelay: `${Math.random() * 5}s`,
                      opacity: 0.5 + Math.random() * 0.5,
                      boxShadow: '0 0 8px rgba(255, 255, 255, 0.7)',
                    }}
                  />
                ))}
              </div>

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                {/* Title with enhanced gradient */}
                <div>
                  <h3 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-blue-300 via-orange-300 to-blue-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl animate-shimmer bg-[length:200%_auto]">
                    LIVING
                  </h3>
                  <p className="text-sm text-blue-200/90 font-medium">Life in the Arctic</p>

                  {/* Decorative line */}
                  <div className="mt-3 w-16 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full group-hover:w-24 transition-all duration-500" />
                </div>

                {/* Enhanced house illustration */}
                <div className="flex justify-center">
                  <svg
                    width="100%"
                    height="160"
                    viewBox="0 0 300 140"
                    preserveAspectRatio="xMidYMax meet"
                    className="transform transition-all duration-700 group-hover:scale-110"
                    style={{
                      filter: hoveredCard === 'living' ? 'drop-shadow(0 0 20px rgba(59,130,246,0.6))' : '',
                    }}
                  >
                    {/* Snow piles with gradient */}
                    <defs>
                      <radialGradient id="snowGradient" cx="50%" cy="30%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.3)" />
                      </radialGradient>
                    </defs>

                    <ellipse cx="60" cy="125" rx="32" ry="13" fill="url(#snowGradient)" />
                    <ellipse cx="50" cy="122" rx="24" ry="10" fill="rgba(255, 255, 255, 0.6)" />
                    <ellipse cx="240" cy="125" rx="32" ry="13" fill="url(#snowGradient)" />
                    <ellipse cx="250" cy="122" rx="24" ry="10" fill="rgba(255, 255, 255, 0.6)" />

                    {/* House body with gradient */}
                    <rect x="110" y="70" width="80" height="60" rx="3" fill="rgba(71, 85, 105, 0.8)" stroke="rgba(148, 163, 184, 0.6)" strokeWidth="2" />

                    {/* Roof with snow */}
                    <path d="M100 70 L150 35 L200 70 Z" fill="rgba(51, 65, 85, 0.9)" stroke="rgba(100, 116, 139, 0.7)" strokeWidth="2" />
                    <path d="M100 70 L150 40 L200 70 L195 72 L150 45 L105 72 Z" fill="rgba(255, 255, 255, 0.6)" />

                    {/* Chimney */}
                    <rect x="165" y="45" width="14" height="28" rx="1.5" fill="rgba(127, 29, 29, 0.9)" stroke="rgba(185, 28, 28, 0.6)" strokeWidth="2" />
                    <rect x="163" y="43" width="18" height="4" rx="1" fill="rgba(153, 27, 27, 1)" />
                    <ellipse cx="172" cy="43" rx="11" ry="3" fill="rgba(255, 255, 255, 0.7)" />

                    {/* Enhanced animated smoke */}
                    <g opacity="0.8">
                      <ellipse cx="172" cy="32" rx="7" ry="7" fill="rgba(203, 213, 225, 0.7)">
                        <animate attributeName="cy" values="32;22;12;2" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="rx" values="7;9;12;15" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.7;0.5;0.3;0" dur="3s" repeatCount="indefinite" />
                      </ellipse>
                      <ellipse cx="176" cy="32" rx="6" ry="6" fill="rgba(226, 232, 240, 0.6)">
                        <animate attributeName="cy" values="32;22;12;2" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                        <animate attributeName="rx" values="6;8;11;14" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                        <animate attributeName="opacity" values="0.6;0.4;0.2;0" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                      </ellipse>
                    </g>

                    {/* Windows with warm glow and animation */}
                    <rect x="125" y="85" width="16" height="20" rx="2" fill="rgba(251, 191, 36, 0.7)" stroke="rgba(217, 119, 6, 0.5)" strokeWidth="2">
                      <animate attributeName="fill" values="rgba(251, 191, 36, 0.7);rgba(251, 191, 36, 0.9);rgba(251, 191, 36, 0.7)" dur="4s" repeatCount="indefinite" />
                    </rect>
                    <rect x="159" y="85" width="16" height="20" rx="2" fill="rgba(251, 191, 36, 0.7)" stroke="rgba(217, 119, 6, 0.5)" strokeWidth="2">
                      <animate attributeName="fill" values="rgba(251, 191, 36, 0.7);rgba(251, 191, 36, 0.9);rgba(251, 191, 36, 0.7)" dur="4s" repeatCount="indefinite" begin="0.5s" />
                    </rect>

                    {/* Window panes */}
                    <line x1="133" y1="85" x2="133" y2="105" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="1.5" />
                    <line x1="125" y1="95" x2="141" y2="95" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="1.5" />
                    <line x1="167" y1="85" x2="167" y2="105" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="1.5" />
                    <line x1="159" y1="95" x2="175" y2="95" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="1.5" />

                    {/* Door */}
                    <rect x="144" y="105" width="12" height="25" rx="1.5" fill="rgba(120, 53, 15, 0.9)" stroke="rgba(146, 64, 14, 0.6)" strokeWidth="2" />
                    <circle cx="153" cy="117" r="1.5" fill="rgba(251, 191, 36, 0.8)" />

                    {/* Animated car with headlights */}
                    <g transform="translate(20, 110)">
                      <rect x="0" y="8" width="40" height="15" rx="2" fill="rgba(30, 58, 138, 0.8)" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" />
                      <path d="M6 8 L10 2 L28 2 L32 8 Z" fill="rgba(30, 58, 138, 0.7)" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" />

                      {/* Windows */}
                      <rect x="11" y="4" width="6" height="4" rx="0.5" fill="rgba(96, 165, 250, 0.5)" />
                      <rect x="20" y="4" width="6" height="4" rx="0.5" fill="rgba(96, 165, 250, 0.5)" />

                      {/* Wheels */}
                      <circle cx="10" cy="23" r="4" fill="rgba(31, 41, 55, 0.9)" stroke="rgba(75, 85, 99, 0.7)" strokeWidth="2" />
                      <circle cx="30" cy="23" r="4" fill="rgba(31, 41, 55, 0.9)" stroke="rgba(75, 85, 99, 0.7)" strokeWidth="2" />

                      {/* Animated headlight */}
                      <circle cx="37" cy="13" r="1.5" fill="rgba(253, 224, 71, 0.9)">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                      </circle>

                      {/* Exhaust smoke */}
                      <ellipse cx="-2" cy="18" rx="5" ry="3" fill="rgba(203, 213, 225, 0.6)">
                        <animate attributeName="cx" values="-2;-10;-18" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="rx" values="5;7;9" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0.4;0" dur="2s" repeatCount="indefinite" />
                      </ellipse>
                    </g>
                  </svg>
                </div>

                {/* Interactive badge */}
                <div className="flex items-center gap-2 text-blue-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="animate-pulse">→</span>
                  <span className="font-semibold">Discover More</span>
                </div>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none" />
            </div>
          </Link>

          {/* MOVING Card - Journey with Compass & Northern Path */}
          <Link href="/moving" className="group block">
            <div
              ref={cardRefs.moving}
              className="relative min-h-[280px] h-[320px] sm:h-[340px] md:h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-purple-500/40 transition-all duration-500 hover:border-purple-400/70 hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transform-gpu perspective-1000 touch-manipulation"
              style={{
                transform: hoveredCard === 'moving'
                  ? `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg) translateZ(10px) scale(1.02)`
                  : 'rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)',
                transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), border 0.5s ease, box-shadow 0.5s ease',
              }}
              onMouseEnter={() => setHoveredCard('moving')}
              onMouseLeave={() => {
                setHoveredCard(null);
                handleMouseLeave();
              }}
              onMouseMove={(e) => handleMouseMove(e, 'moving')}
              role="article"
              aria-label="Moving pathway - Journey Awaits"
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Enhanced falling snow */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white shadow-lg"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-${Math.random() * 20}%`,
                      width: `${2 + Math.random() * 3}px`,
                      height: `${2 + Math.random() * 3}px`,
                      animation: `snow-fall ${7 + Math.random() * 7}s linear infinite`,
                      animationDelay: `${Math.random() * 5}s`,
                      opacity: 0.4 + Math.random() * 0.5,
                      boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
                    }}
                  />
                ))}
              </div>

              {/* Enhanced Northern Lights */}
              <div className="absolute top-0 left-0 right-0 h-32 opacity-40 group-hover:opacity-70 transition-opacity duration-700">
                <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none" className="filter drop-shadow-lg">
                  <path
                    d="M0,70 Q100,30 200,70 T400,70 L400,0 L0,0 Z"
                    fill="url(#movingGradient)"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="d"
                      values="M0,70 Q100,30 200,70 T400,70 L400,0 L0,0 Z;
                              M0,70 Q100,90 200,70 T400,70 L400,0 L0,0 Z;
                              M0,70 Q100,30 200,70 T400,70 L400,0 L0,0 Z"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <defs>
                    <linearGradient id="movingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                {/* Title with enhanced gradient */}
                <div>
                  <h3 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl animate-shimmer bg-[length:200%_auto]">
                    MOVING
                  </h3>
                  <p className="text-sm text-purple-200/90 font-medium">Journey Awaits</p>

                  {/* Decorative line */}
                  <div className="mt-3 w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:w-24 transition-all duration-500" />
                </div>

                {/* Enhanced compass and journey elements */}
                <div className="relative flex justify-center items-end">
                  {/* Animated journey path */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 opacity-50">
                    <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="xMidYMax meet">
                      <path
                        d="M-20,80 Q100,50 150,40 T320,20"
                        fill="none"
                        stroke="rgba(168, 85, 247, 0.5)"
                        strokeWidth="35"
                        strokeLinecap="round"
                      />
                      <path
                        d="M-20,80 Q100,50 150,40 T320,20"
                        fill="none"
                        stroke="rgba(236, 72, 153, 0.7)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="12 10"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          values="0;22;0"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>
                  </div>

                  {/* Enhanced compass icon */}
                  <div className="relative z-10 mb-2">
                    <svg
                      width="90"
                      height="90"
                      viewBox="0 0 100 100"
                      className="drop-shadow-[0_0_25px_rgba(168,85,247,0.7)] transform transition-all duration-700 group-hover:scale-125 group-hover:rotate-[360deg]"
                      style={{
                        filter: hoveredCard === 'moving' ? 'drop-shadow(0 0 30px rgba(168,85,247,0.9))' : '',
                      }}
                    >
                      {/* Outer ring with gradient */}
                      <defs>
                        <linearGradient id="compassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>

                      <circle cx="50" cy="50" r="38" fill="url(#compassGradient)" stroke="#a855f7" strokeWidth="3" />
                      <circle cx="50" cy="50" r="30" fill="rgba(88, 28, 135, 0.4)" stroke="#c084fc" strokeWidth="2.5" />

                      {/* Cardinal directions */}
                      <text x="50" y="23" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">N</text>
                      <text x="77" y="54" textAnchor="middle" fill="#e0e7ff" fontSize="10" fontWeight="bold">E</text>
                      <text x="50" y="82" textAnchor="middle" fill="#e0e7ff" fontSize="10" fontWeight="bold">S</text>
                      <text x="23" y="54" textAnchor="middle" fill="#e0e7ff" fontSize="10" fontWeight="bold">W</text>

                      {/* Animated compass needle */}
                      <g>
                        <path d="M50,50 L50,28 L46,50 Z" fill="#ef4444" opacity="0.9">
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="0 50 50;6 50 50;-6 50 50;0 50 50"
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        </path>
                        <path d="M50,50 L50,72 L54,50 Z" fill="#e0e7ff" opacity="0.8">
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="0 50 50;6 50 50;-6 50 50;0 50 50"
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        </path>
                      </g>

                      {/* Pulsing center pin */}
                      <circle cx="50" cy="50" r="4" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2">
                        <animate attributeName="r" values="4;5.5;4" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </div>

                  {/* Moving truck with animation */}
                  <div className="absolute left-4 bottom-8 opacity-60 group-hover:opacity-90 transition-all duration-700 group-hover:translate-x-2">
                    <svg width="55" height="40" viewBox="0 0 60 40">
                      <defs>
                        <linearGradient id="truckGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
                        </linearGradient>
                      </defs>

                      <rect x="5" y="12" width="32" height="18" rx="2" fill="url(#truckGradient)" stroke="#a855f7" strokeWidth="2" />
                      <rect x="37" y="16" width="15" height="14" rx="1.5" fill="rgba(168, 85, 247, 0.5)" stroke="#a855f7" strokeWidth="2" />

                      <rect x="39" y="18" width="5" height="6" rx="0.5" fill="rgba(192, 132, 252, 0.4)" />
                      <rect x="45" y="18" width="5" height="6" rx="0.5" fill="rgba(192, 132, 252, 0.4)" />

                      <circle cx="16" cy="30" r="4.5" fill="rgba(88, 28, 135, 0.7)" stroke="#c084fc" strokeWidth="2" />
                      <circle cx="44" cy="30" r="4.5" fill="rgba(88, 28, 135, 0.7)" stroke="#c084fc" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Interactive badge */}
                <div className="flex items-center gap-2 text-purple-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="animate-pulse">→</span>
                  <span className="font-semibold">Start Journey</span>
                </div>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none" />
            </div>
          </Link>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
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
            transform: translateY(120vh) translateX(40px) rotate(360deg);
            opacity: 0;
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
