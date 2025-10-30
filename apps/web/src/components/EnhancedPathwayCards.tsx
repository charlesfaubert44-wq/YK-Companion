'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';

/**
 * EnhancedPathwayCards - Visually Stunning Full-Card Animated CTA Cards
 *
 * Features:
 * - Full-card aurora animations that fill the entire space
 * - Large, bold, prominent typography
 * - 3D tilt effects with mouse tracking
 * - Dynamic gradient animations
 * - Particle effects throughout the entire card
 * - Smooth transitions and micro-interactions
 * - Responsive design for all screen sizes
 * - Highly polished and vibrant design
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 relative z-10">
          {/* VISITING Card - Full Aurora Background */}
          <Link href="/visiting" className="group block">
            <div
              ref={cardRefs.visiting}
              className="relative h-[420px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden border-2 border-emerald-400/50 transition-all duration-700 hover:border-emerald-300 hover:shadow-[0_0_80px_rgba(16,185,129,0.7)] transform-gpu perspective-1000 touch-manipulation cursor-pointer"
              style={{
                transform:
                  hoveredCard === 'visiting'
                    ? `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg) translateZ(10px) scale(1.03)`
                    : 'rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)',
                transition:
                  'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), border 0.7s ease, box-shadow 0.7s ease',
              }}
              onMouseEnter={() => setHoveredCard('visiting')}
              onMouseLeave={() => {
                setHoveredCard(null);
                handleMouseLeave();
              }}
              onMouseMove={e => handleMouseMove(e, 'visiting')}
              role="article"
              aria-label="Visiting pathway - Explore the North"
            >
              {/* Full-Card Aurora Background - Fills Entire Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 via-cyan-500/30 to-teal-600/40">
                {/* Animated Aurora Waves - Multiple Layers Filling The Card */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="visitingAurora1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="visitingAurora2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#0891b2" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="visitingAurora3" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  {/* Aurora Wave 1 - Bottom Layer */}
                  <path
                    d="M0,300 Q200,200 400,300 T800,300 L800,600 L0,600 Z"
                    fill="url(#visitingAurora1)"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="d"
                      values="M0,300 Q200,200 400,300 T800,300 L800,600 L0,600 Z;
                              M0,350 Q200,250 400,350 T800,350 L800,600 L0,600 Z;
                              M0,300 Q200,200 400,300 T800,300 L800,600 L0,600 Z"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Aurora Wave 2 - Middle Layer */}
                  <path
                    d="M0,150 Q200,50 400,150 T800,150 L800,600 L0,600 Z"
                    fill="url(#visitingAurora2)"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="d"
                      values="M0,150 Q200,50 400,150 T800,150 L800,600 L0,600 Z;
                              M0,200 Q200,100 400,200 T800,200 L800,600 L0,600 Z;
                              M0,150 Q200,50 400,150 T800,150 L800,600 L0,600 Z"
                      dur="10s"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Aurora Wave 3 - Top Layer */}
                  <path
                    d="M0,80 Q200,20 400,80 T800,80 L800,600 L0,600 Z"
                    fill="url(#visitingAurora3)"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="d"
                      values="M0,80 Q200,20 400,80 T800,80 L800,600 L0,600 Z;
                              M0,120 Q200,60 400,120 T800,120 L800,600 L0,600 Z;
                              M0,80 Q200,20 400,80 T800,80 L800,600 L0,600 Z"
                      dur="12s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>

                {/* Pulsing Aurora Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-cyan-400/30 to-teal-400/20 animate-pulse-slow" />
              </div>

              {/* Floating Particles Throughout Entire Card */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${1 + Math.random() * 3}px`,
                      height: `${1 + Math.random() * 3}px`,
                      animation: `float-particle ${10 + Math.random() * 10}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 5}s`,
                      opacity: 0.3 + Math.random() * 0.6,
                      boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
                    }}
                  />
                ))}
              </div>

              {/* Content Layer - On Top of Aurora */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10 z-10">
                {/* Large Bold Title */}
                <div>
                  <h3 className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-3 drop-shadow-[0_0_40px_rgba(16,185,129,1)] group-hover:scale-105 transition-transform duration-500 leading-none tracking-tight">
                    VISITING
                  </h3>
                  <p className="text-xl sm:text-2xl text-emerald-100 font-bold drop-shadow-lg">
                    Explore the North
                  </p>
                </div>

                {/* Subtle Icon Accent */}
                <div className="flex justify-end items-end">
                  <div className="opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                    <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-2xl">
                      <path d="M20 35 L40 20 L60 35 L40 25 Z" fill="rgba(255,255,255,0.6)" />
                      <rect x="38" y="25" width="4" height="20" fill="rgba(255,255,255,0.5)" />
                    </svg>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="flex items-center gap-3 text-white text-lg sm:text-xl font-bold opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-3xl animate-pulse">→</span>
                  <span className="drop-shadow-lg">Explore Now</span>
                </div>
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none" />
            </div>
          </Link>

          {/* LIVING Card - Full Warm Glow Background */}
          <Link href="/living" className="group block">
            <div
              ref={cardRefs.living}
              className="relative h-[420px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden border-2 border-blue-400/50 transition-all duration-700 hover:border-orange-300 hover:shadow-[0_0_80px_rgba(251,146,60,0.7)] transform-gpu perspective-1000 touch-manipulation cursor-pointer"
              style={{
                transform:
                  hoveredCard === 'living'
                    ? `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg) translateZ(10px) scale(1.03)`
                    : 'rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)',
                transition:
                  'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), border 0.7s ease, box-shadow 0.7s ease',
              }}
              onMouseEnter={() => setHoveredCard('living')}
              onMouseLeave={() => {
                setHoveredCard(null);
                handleMouseLeave();
              }}
              onMouseMove={e => handleMouseMove(e, 'living')}
              role="article"
              aria-label="Living pathway - Life in the Arctic"
            >
              {/* Full-Card Warm Sky Background - Fills Entire Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-orange-500/40 to-amber-600/50">
                {/* Animated Warm Sky Gradient Layers - Filling The Card */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="livingWarm1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                      <stop offset="50%" stopColor="#fb923c" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="livingWarm2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.5" />
                    </linearGradient>
                    <radialGradient id="livingGlow" cx="50%" cy="50%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#fb923c" stopOpacity="0.3" />
                    </radialGradient>
                  </defs>

                  {/* Warm Gradient Wave 1 */}
                  <path
                    d="M0,250 Q200,180 400,250 T800,250 L800,600 L0,600 Z"
                    fill="url(#livingWarm1)"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="d"
                      values="M0,250 Q200,180 400,250 T800,250 L800,600 L0,600 Z;
                              M0,280 Q200,210 400,280 T800,280 L800,600 L0,600 Z;
                              M0,250 Q200,180 400,250 T800,250 L800,600 L0,600 Z"
                      dur="9s"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Warm Gradient Wave 2 */}
                  <path
                    d="M0,120 Q200,60 400,120 T800,120 L800,600 L0,600 Z"
                    fill="url(#livingWarm2)"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="d"
                      values="M0,120 Q200,60 400,120 T800,120 L800,600 L0,600 Z;
                              M0,160 Q200,100 400,160 T800,160 L800,600 L0,600 Z;
                              M0,120 Q200,60 400,120 T800,120 L800,600 L0,600 Z"
                      dur="11s"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Central Glow */}
                  <circle cx="400" cy="300" r="200" fill="url(#livingGlow)" opacity="0.4">
                    <animate
                      attributeName="r"
                      values="200;250;200"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>

                {/* Pulsing Warm Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-orange-400/30 to-blue-400/20 animate-pulse-slow" />
              </div>

              {/* Floating Warm Particles Throughout Entire Card */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(35)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${1 + Math.random() * 2.5}px`,
                      height: `${1 + Math.random() * 2.5}px`,
                      background:
                        Math.random() > 0.5
                          ? 'rgba(251, 191, 36, 0.8)'
                          : 'rgba(255, 255, 255, 0.6)',
                      animation: `float-particle ${10 + Math.random() * 10}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 5}s`,
                      opacity: 0.4 + Math.random() * 0.5,
                      boxShadow: '0 0 12px rgba(251, 191, 36, 0.6)',
                    }}
                  />
                ))}
              </div>

              {/* Content Layer - On Top */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10 z-10">
                {/* Large Bold Title */}
                <div>
                  <h3 className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-3 drop-shadow-[0_0_40px_rgba(251,146,60,1)] group-hover:scale-105 transition-transform duration-500 leading-none tracking-tight">
                    LIVING
                  </h3>
                  <p className="text-xl sm:text-2xl text-orange-100 font-bold drop-shadow-lg">
                    Life in the Arctic
                  </p>
                </div>

                {/* Subtle Icon Accent */}
                <div className="flex justify-end items-end">
                  <div className="opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                    <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-2xl">
                      <path d="M20 50 L40 30 L60 50 Z" fill="rgba(255,255,255,0.5)" />
                      <rect x="30" y="50" width="20" height="20" fill="rgba(255,255,255,0.5)" />
                      <rect x="38" y="55" width="4" height="8" fill="rgba(251,191,36,0.8)" />
                    </svg>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="flex items-center gap-3 text-white text-lg sm:text-xl font-bold opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-3xl animate-pulse">→</span>
                  <span className="drop-shadow-lg">Discover More</span>
                </div>
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none" />
            </div>
          </Link>

          {/* MOVING Card - Full Purple/Pink Aurora Background */}
          <Link href="/moving" className="group block">
            <div
              ref={cardRefs.moving}
              className="relative h-[420px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden border-2 border-purple-400/50 transition-all duration-700 hover:border-pink-300 hover:shadow-[0_0_80px_rgba(168,85,247,0.7)] transform-gpu perspective-1000 touch-manipulation cursor-pointer"
              style={{
                transform:
                  hoveredCard === 'moving'
                    ? `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg) translateZ(10px) scale(1.03)`
                    : 'rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)',
                transition:
                  'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), border 0.7s ease, box-shadow 0.7s ease',
              }}
              onMouseEnter={() => setHoveredCard('moving')}
              onMouseLeave={() => {
                setHoveredCard(null);
                handleMouseLeave();
              }}
              onMouseMove={e => handleMouseMove(e, 'moving')}
              role="article"
              aria-label="Moving pathway - Journey Awaits"
            >
              {/* Full-Card Purple/Pink Aurora Background - Fills Entire Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-500/30 to-fuchsia-600/40">
                {/* Animated Aurora Waves - Multiple Layers Filling The Card */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="movingAurora1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#ec4899" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#d946ef" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="movingAurora2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#9333ea" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#f472b6" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#c026d3" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="movingAurora3" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  {/* Aurora Wave 1 - Bottom Layer */}
                  <path
                    d="M0,280 Q200,200 400,280 T800,280 L800,600 L0,600 Z"
                    fill="url(#movingAurora1)"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="d"
                      values="M0,280 Q200,200 400,280 T800,280 L800,600 L0,600 Z;
                              M0,320 Q200,240 400,320 T800,320 L800,600 L0,600 Z;
                              M0,280 Q200,200 400,280 T800,280 L800,600 L0,600 Z"
                      dur="9s"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Aurora Wave 2 - Middle Layer */}
                  <path
                    d="M0,140 Q200,70 400,140 T800,140 L800,600 L0,600 Z"
                    fill="url(#movingAurora2)"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="d"
                      values="M0,140 Q200,70 400,140 T800,140 L800,600 L0,600 Z;
                              M0,180 Q200,110 400,180 T800,180 L800,600 L0,600 Z;
                              M0,140 Q200,70 400,140 T800,140 L800,600 L0,600 Z"
                      dur="11s"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Aurora Wave 3 - Top Layer */}
                  <path
                    d="M0,70 Q200,20 400,70 T800,70 L800,600 L0,600 Z"
                    fill="url(#movingAurora3)"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="d"
                      values="M0,70 Q200,20 400,70 T800,70 L800,600 L0,600 Z;
                              M0,110 Q200,60 400,110 T800,110 L800,600 L0,600 Z;
                              M0,70 Q200,20 400,70 T800,70 L800,600 L0,600 Z"
                      dur="13s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>

                {/* Pulsing Aurora Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/30 to-fuchsia-400/20 animate-pulse-slow" />
              </div>

              {/* Floating Particles Throughout Entire Card */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(38)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${1 + Math.random() * 3}px`,
                      height: `${1 + Math.random() * 3}px`,
                      animation: `float-particle ${10 + Math.random() * 10}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 5}s`,
                      opacity: 0.3 + Math.random() * 0.6,
                      boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
                    }}
                  />
                ))}
              </div>

              {/* Content Layer - On Top of Aurora */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10 z-10">
                {/* Large Bold Title */}
                <div>
                  <h3 className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-3 drop-shadow-[0_0_40px_rgba(168,85,247,1)] group-hover:scale-105 transition-transform duration-500 leading-none tracking-tight">
                    MOVING
                  </h3>
                  <p className="text-xl sm:text-2xl text-purple-100 font-bold drop-shadow-lg">
                    Journey Awaits
                  </p>
                </div>

                {/* Subtle Icon Accent */}
                <div className="flex justify-end items-end">
                  <div className="opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                    <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-2xl">
                      <circle
                        cx="40"
                        cy="40"
                        r="25"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d="M40 20 L40 25 M40 55 L40 60 M20 40 L25 40 M55 40 L60 40"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="2"
                      />
                      <path d="M40 25 L35 40 L45 40 Z" fill="rgba(255,255,255,0.6)" />
                    </svg>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="flex items-center gap-3 text-white text-lg sm:text-xl font-bold opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-3xl animate-pulse">→</span>
                  <span className="drop-shadow-lg">Start Journey</span>
                </div>
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none" />
            </div>
          </Link>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes float-particle {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(10px, -20px) scale(1.2);
            opacity: 0.7;
          }
          50% {
            transform: translate(-15px, -40px) scale(0.9);
            opacity: 1;
          }
          75% {
            transform: translate(5px, -25px) scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
