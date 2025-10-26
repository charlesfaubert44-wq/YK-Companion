'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function EnhancedPathwayCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Three Pathway Cards with Glassmorphic Design */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* VISITING Card - Explorer with Northern Lights */}
        <Link href="/visiting" className="group">
          <div
            className="relative h-[420px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-emerald-500/30 transition-all duration-500 hover:border-emerald-400/60 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
            onMouseEnter={() => setHoveredCard('visiting')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Background Aurora Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Falling Snow Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(30)].map((_, i) => (
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

            {/* Camera/Binoculars Icon */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 transform transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2">
              <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                {/* Camera Body */}
                <rect x="20" y="35" width="60" height="40" rx="6" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2.5" />
                <rect x="25" y="40" width="50" height="30" rx="4" fill="rgba(6, 78, 59, 0.4)" />

                {/* Lens */}
                <circle cx="50" cy="55" r="15" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="2.5" />
                <circle cx="50" cy="55" r="10" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />
                <circle cx="50" cy="55" r="5" fill="#10b981" opacity="0.6">
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Flash */}
                <rect x="65" y="38" width="8" height="6" rx="2" fill="#fbbf24" opacity="0.7">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
                </rect>

                {/* Viewfinder */}
                <rect x="62" y="30" width="10" height="4" rx="1" fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Northern Lights Waves */}
            <div className="absolute top-0 left-0 right-0 h-32 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
              <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none">
                <path
                  d="M0,60 Q100,20 200,60 T400,60 L400,0 L0,0 Z"
                  fill="url(#visitingGradient)"
                  opacity="0.6"
                >
                  <animate
                    attributeName="d"
                    values="M0,60 Q100,20 200,60 T400,60 L400,0 L0,0 Z;
                            M0,60 Q100,80 200,60 T400,60 L400,0 L0,0 Z;
                            M0,60 Q100,20 200,60 T400,60 L400,0 L0,0 Z"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </path>
                <defs>
                  <linearGradient id="visitingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                VISITING
              </h3>
              <p className="text-sm text-gray-300/90">Explore the North</p>
            </div>

            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
          </div>
        </Link>

        {/* LIVING Card - House with Smoke, Snow & Car */}
        <Link href="/living" className="group">
          <div
            className="relative h-[420px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-blue-500/30 transition-all duration-500 hover:border-blue-400/60 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
            onMouseEnter={() => setHoveredCard('living')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-orange-500/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Falling Snow */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-${Math.random() * 20}%`,
                    width: `${1 + Math.random() * 4}px`,
                    height: `${1 + Math.random() * 4}px`,
                    animation: `snow-fall ${6 + Math.random() * 8}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: 0.4 + Math.random() * 0.6,
                  }}
                />
              ))}
            </div>

            {/* House Illustration */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full transform transition-all duration-700 group-hover:scale-105">
              <svg width="100%" height="280" viewBox="0 0 300 280" preserveAspectRatio="xMidYMax meet">
                {/* Ground Snow */}
                <ellipse cx="150" cy="260" rx="140" ry="20" fill="rgba(255, 255, 255, 0.3)" />

                {/* Snow Piles - Left Side */}
                <ellipse cx="80" cy="220" rx="35" ry="18" fill="rgba(255, 255, 255, 0.4)" />
                <ellipse cx="70" cy="215" rx="28" ry="14" fill="rgba(255, 255, 255, 0.5)" />
                <ellipse cx="85" cy="217" rx="20" ry="10" fill="rgba(226, 232, 240, 0.6)" />

                {/* Snow Piles - Right Side */}
                <ellipse cx="220" cy="220" rx="35" ry="18" fill="rgba(255, 255, 255, 0.4)" />
                <ellipse cx="230" cy="215" rx="28" ry="14" fill="rgba(255, 255, 255, 0.5)" />
                <ellipse cx="215" cy="217" rx="20" ry="10" fill="rgba(226, 232, 240, 0.6)" />

                {/* House Body */}
                <rect x="105" y="160" width="90" height="70" rx="4" fill="rgba(71, 85, 105, 0.7)" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="2" />

                {/* Roof */}
                <path d="M95 160 L150 120 L205 160 Z" fill="rgba(51, 65, 85, 0.8)" stroke="rgba(100, 116, 139, 0.6)" strokeWidth="2" />

                {/* Roof Snow */}
                <path d="M95 160 L150 125 L205 160 L200 162 L150 130 L100 162 Z" fill="rgba(255, 255, 255, 0.5)" />

                {/* Chimney */}
                <rect x="165" y="130" width="18" height="35" rx="2" fill="rgba(127, 29, 29, 0.8)" stroke="rgba(185, 28, 28, 0.5)" strokeWidth="1.5" />
                <rect x="163" y="128" width="22" height="4" rx="1" fill="rgba(153, 27, 27, 0.9)" />

                {/* Chimney Snow Cap */}
                <ellipse cx="174" cy="128" rx="12" ry="4" fill="rgba(255, 255, 255, 0.6)" />

                {/* Animated Smoke */}
                <g opacity="0.7">
                  <ellipse cx="174" cy="115" rx="8" ry="8" fill="rgba(203, 213, 225, 0.6)">
                    <animate attributeName="cy" values="115;105;95;85" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="rx" values="8;10;13;16" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="8;10;12;14" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.4;0.2;0" dur="3s" repeatCount="indefinite" />
                  </ellipse>
                  <ellipse cx="178" cy="115" rx="7" ry="7" fill="rgba(226, 232, 240, 0.5)">
                    <animate attributeName="cy" values="115;105;95;85" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                    <animate attributeName="rx" values="7;9;12;15" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                    <animate attributeName="ry" values="7;9;11;13" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                    <animate attributeName="opacity" values="0.5;0.3;0.15;0" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                  </ellipse>
                  <ellipse cx="170" cy="115" rx="6" ry="6" fill="rgba(241, 245, 249, 0.4)">
                    <animate attributeName="cy" values="115;105;95;85" dur="4s" repeatCount="indefinite" begin="1s" />
                    <animate attributeName="rx" values="6;8;11;14" dur="4s" repeatCount="indefinite" begin="1s" />
                    <animate attributeName="ry" values="6;8;10;12" dur="4s" repeatCount="indefinite" begin="1s" />
                    <animate attributeName="opacity" values="0.4;0.25;0.1;0" dur="4s" repeatCount="indefinite" begin="1s" />
                  </ellipse>
                </g>

                {/* Windows with Warm Glow */}
                <rect x="120" y="180" width="20" height="24" rx="2" fill="rgba(251, 191, 36, 0.6)" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="1.5">
                  <animate attributeName="fill" values="rgba(251, 191, 36, 0.6);rgba(251, 191, 36, 0.8);rgba(251, 191, 36, 0.6)" dur="4s" repeatCount="indefinite" />
                </rect>
                <rect x="160" y="180" width="20" height="24" rx="2" fill="rgba(251, 191, 36, 0.6)" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="1.5">
                  <animate attributeName="fill" values="rgba(251, 191, 36, 0.6);rgba(251, 191, 36, 0.8);rgba(251, 191, 36, 0.6)" dur="4s" repeatCount="indefinite" begin="0.5s" />
                </rect>

                {/* Window Panes */}
                <line x1="130" y1="180" x2="130" y2="204" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="1" />
                <line x1="120" y1="192" x2="140" y2="192" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="1" />
                <line x1="170" y1="180" x2="170" y2="204" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="1" />
                <line x1="160" y1="192" x2="180" y2="192" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="1" />

                {/* Door */}
                <rect x="142" y="195" width="16" height="35" rx="2" fill="rgba(120, 53, 15, 0.8)" stroke="rgba(146, 64, 14, 0.5)" strokeWidth="1.5" />
                <circle cx="154" cy="212" r="1.5" fill="rgba(251, 191, 36, 0.7)" />

                {/* Running Car */}
                <g transform="translate(30, 210)">
                  {/* Car Body */}
                  <rect x="0" y="10" width="45" height="18" rx="3" fill="rgba(30, 58, 138, 0.7)" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1.5" />
                  {/* Car Roof */}
                  <path d="M8 10 L12 2 L33 2 L37 10 Z" fill="rgba(30, 58, 138, 0.6)" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1.5" />

                  {/* Windows */}
                  <rect x="13" y="4" width="8" height="5" rx="1" fill="rgba(96, 165, 250, 0.4)" />
                  <rect x="24" y="4" width="8" height="5" rx="1" fill="rgba(96, 165, 250, 0.4)" />

                  {/* Wheels */}
                  <circle cx="12" cy="28" r="4" fill="rgba(31, 41, 55, 0.8)" stroke="rgba(75, 85, 99, 0.6)" strokeWidth="1.5" />
                  <circle cx="33" cy="28" r="4" fill="rgba(31, 41, 55, 0.8)" stroke="rgba(75, 85, 99, 0.6)" strokeWidth="1.5" />
                  <circle cx="12" cy="28" r="2" fill="rgba(107, 114, 128, 0.5)" />
                  <circle cx="33" cy="28" r="2" fill="rgba(107, 114, 128, 0.5)" />

                  {/* Headlights */}
                  <circle cx="42" cy="16" r="1.5" fill="rgba(253, 224, 71, 0.8)">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>

                  {/* Exhaust Smoke */}
                  <ellipse cx="-3" cy="22" rx="5" ry="4" fill="rgba(203, 213, 225, 0.5)">
                    <animate attributeName="cx" values="-3;-13;-23" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="rx" values="5;7;9" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.3;0" dur="2s" repeatCount="indefinite" />
                  </ellipse>
                  <ellipse cx="-3" cy="22" rx="4" ry="3" fill="rgba(226, 232, 240, 0.4)">
                    <animate attributeName="cx" values="-3;-13;-23" dur="2.5s" repeatCount="indefinite" begin="0.3s" />
                    <animate attributeName="rx" values="4;6;8" dur="2.5s" repeatCount="indefinite" begin="0.3s" />
                    <animate attributeName="opacity" values="0.4;0.2;0" dur="2.5s" repeatCount="indefinite" begin="0.3s" />
                  </ellipse>
                </g>
              </svg>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                LIVING
              </h3>
              <p className="text-sm text-gray-300/90">Life in the Arctic</p>
            </div>

            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
          </div>
        </Link>

        {/* MOVING Card - Journey with Compass & Northern Path */}
        <Link href="/moving" className="group">
          <div
            className="relative h-[420px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-purple-500/30 transition-all duration-500 hover:border-purple-400/60 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
            onMouseEnter={() => setHoveredCard('moving')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Falling Snow */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/50"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-${Math.random() * 20}%`,
                    width: `${1.5 + Math.random() * 3}px`,
                    height: `${1.5 + Math.random() * 3}px`,
                    animation: `snow-fall ${7 + Math.random() * 7}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: 0.3 + Math.random() * 0.5,
                  }}
                />
              ))}
            </div>

            {/* Animated Path/Road */}
            <div className="absolute bottom-0 left-0 right-0 h-48 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
              <svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="xMidYMax meet">
                <path
                  d="M-50,180 Q80,140 150,100 T350,60"
                  fill="none"
                  stroke="rgba(168, 85, 247, 0.4)"
                  strokeWidth="40"
                  strokeLinecap="round"
                />
                {/* Dashed Center Line */}
                <path
                  d="M-50,180 Q80,140 150,100 T350,60"
                  fill="none"
                  stroke="rgba(236, 72, 153, 0.6)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="15 10"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;25;0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>

            {/* Compass/Navigation Icon */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
              <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                {/* Compass Outer Ring */}
                <circle cx="50" cy="50" r="38" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="32" fill="rgba(88, 28, 135, 0.3)" stroke="#c084fc" strokeWidth="2" />

                {/* Cardinal Directions */}
                <text x="50" y="22" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">N</text>
                <text x="78" y="54" textAnchor="middle" fill="#e0e7ff" fontSize="10">E</text>
                <text x="50" y="82" textAnchor="middle" fill="#e0e7ff" fontSize="10">S</text>
                <text x="22" y="54" textAnchor="middle" fill="#e0e7ff" fontSize="10">W</text>

                {/* Compass Needle */}
                <g className="origin-center">
                  <path d="M50,50 L50,28 L46,50 Z" fill="#ef4444" opacity="0.8">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0 50 50;5 50 50;-5 50 50;0 50 50"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <path d="M50,50 L50,72 L54,50 Z" fill="#e0e7ff" opacity="0.7">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0 50 50;5 50 50;-5 50 50;0 50 50"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>

                {/* Center Pin */}
                <circle cx="50" cy="50" r="4" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5">
                  <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Decorative Tick Marks */}
                <g stroke="#c084fc" strokeWidth="1.5" opacity="0.6">
                  <line x1="50" y1="16" x2="50" y2="20" />
                  <line x1="84" y1="50" x2="80" y2="50" />
                  <line x1="50" y1="84" x2="50" y2="80" />
                  <line x1="16" y1="50" x2="20" y2="50" />
                </g>
              </svg>
            </div>

            {/* Moving Truck Silhouette */}
            <div className="absolute bottom-24 left-8 opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:translate-x-2">
              <svg width="70" height="50" viewBox="0 0 70 50">
                {/* Truck Body */}
                <rect x="5" y="15" width="40" height="22" rx="2" fill="rgba(168, 85, 247, 0.5)" stroke="#a855f7" strokeWidth="1.5" />
                <rect x="45" y="20" width="18" height="17" rx="2" fill="rgba(168, 85, 247, 0.4)" stroke="#a855f7" strokeWidth="1.5" />

                {/* Windows */}
                <rect x="47" y="22" width="7" height="8" rx="1" fill="rgba(192, 132, 252, 0.3)" />
                <rect x="55" y="22" width="6" height="8" rx="1" fill="rgba(192, 132, 252, 0.3)" />

                {/* Wheels */}
                <circle cx="18" cy="37" r="5" fill="rgba(88, 28, 135, 0.6)" stroke="#c084fc" strokeWidth="1.5" />
                <circle cx="52" cy="37" r="5" fill="rgba(88, 28, 135, 0.6)" stroke="#c084fc" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Northern Lights Accent */}
            <div className="absolute top-0 left-0 right-0 h-40 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
              <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
                <path
                  d="M0,80 Q100,40 200,80 T400,80 L400,0 L0,0 Z"
                  fill="url(#movingGradient)"
                  opacity="0.5"
                >
                  <animate
                    attributeName="d"
                    values="M0,80 Q100,40 200,80 T400,80 L400,0 L0,0 Z;
                            M0,80 Q100,100 200,80 T400,80 L400,0 L0,0 Z;
                            M0,80 Q100,40 200,80 T400,80 L400,0 L0,0 Z"
                    dur="7s"
                    repeatCount="indefinite"
                  />
                </path>
                <defs>
                  <linearGradient id="movingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                MOVING
              </h3>
              <p className="text-sm text-gray-300/90">Journey Awaits</p>
            </div>

            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
          </div>
        </Link>
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
