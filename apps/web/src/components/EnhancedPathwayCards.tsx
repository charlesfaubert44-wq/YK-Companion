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
            className="relative h-[300px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-emerald-500/30 transition-all duration-500 hover:border-emerald-400/60 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
            onMouseEnter={() => setHoveredCard('visiting')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Background Aurora Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

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

            {/* Northern Lights Waves - Top */}
            <div className="absolute top-0 left-0 right-0 h-24 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
              <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
                <path
                  d="M0,50 Q100,20 200,50 T400,50 L400,0 L0,0 Z"
                  fill="url(#visitingGradient)"
                  opacity="0.6"
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
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Content Container - Bottom Aligned */}
            <div className="absolute inset-0 flex flex-col justify-end pb-6 px-6">
              {/* Title - Fixed Position from Bottom */}
              <div className="absolute bottom-[140px] left-6 right-6">
                <h3 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  VISITING
                </h3>
                <p className="text-xs text-gray-300/90">Explore the North</p>
              </div>

              {/* Detailed Plane Outline */}
              <div className="flex justify-center mb-2">
                <svg width="90" height="70" viewBox="0 0 100 80" className="drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] transform transition-all duration-700 group-hover:scale-110">
                  {/* Fuselage */}
                  <path
                    d="M 50 8 L 52 10 L 52 32 L 50 32 L 48 32 L 48 10 Z"
                    fill="rgba(16, 185, 129, 0.3)"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Cockpit */}
                  <ellipse cx="50" cy="14" rx="3" ry="4" fill="rgba(59, 130, 246, 0.5)" stroke="#3b82f6" strokeWidth="1.5" />

                  {/* Main Wings */}
                  <path
                    d="M 10 38 L 15 36 L 48 36 L 48 42 L 15 42 L 10 40 Z"
                    fill="rgba(16, 185, 129, 0.4)"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 90 38 L 85 36 L 52 36 L 52 42 L 85 42 L 90 40 Z"
                    fill="rgba(16, 185, 129, 0.4)"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Wing tips */}
                  <circle cx="10" cy="39" r="2.5" fill="#10b981" />
                  <circle cx="90" cy="39" r="2.5" fill="#10b981" />

                  {/* Fuselage body (middle) */}
                  <rect x="47" y="32" width="6" height="28" rx="1" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />

                  {/* Pontoon Floats */}
                  <ellipse cx="38" cy="62" rx="12" ry="3" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="2" />
                  <ellipse cx="62" cy="62" rx="12" ry="3" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="2" />

                  {/* Float Struts */}
                  <line x1="42" y1="59" x2="48" y2="50" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="58" y1="59" x2="52" y2="50" stroke="#10b981" strokeWidth="1.5" />

                  {/* Tail Wing */}
                  <path
                    d="M 42 66 L 50 66 L 50 70 L 42 70 Z"
                    fill="rgba(6, 182, 212, 0.4)"
                    stroke="#06b6d4"
                    strokeWidth="2"
                  />
                  <path
                    d="M 58 66 L 50 66 L 50 70 L 58 70 Z"
                    fill="rgba(6, 182, 212, 0.4)"
                    stroke="#06b6d4"
                    strokeWidth="2"
                  />

                  {/* Vertical Stabilizer */}
                  <path
                    d="M 48 68 L 50 72 L 52 68 Z"
                    fill="rgba(16, 185, 129, 0.4)"
                    stroke="#10b981"
                    strokeWidth="2"
                  />

                  {/* Propeller blur */}
                  <ellipse cx="50" cy="7" rx="6" ry="1.5" fill="rgba(203, 213, 225, 0.4)" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.3s" repeatCount="indefinite" />
                  </ellipse>
                </svg>
              </div>
            </div>

            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
          </div>
        </Link>

        {/* LIVING Card - House with Smoke, Snow & Car */}
        <Link href="/living" className="group">
          <div
            className="relative h-[300px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-blue-500/30 transition-all duration-500 hover:border-blue-400/60 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
            onMouseEnter={() => setHoveredCard('living')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-orange-500/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Falling Snow */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(25)].map((_, i) => (
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

            {/* Content Container - Bottom Aligned */}
            <div className="absolute inset-0 flex flex-col justify-end pb-6 px-6">
              {/* Title - Fixed Position from Bottom */}
              <div className="absolute bottom-[140px] left-6 right-6">
                <h3 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  LIVING
                </h3>
                <p className="text-xs text-gray-300/90">Life in the Arctic</p>
              </div>

              {/* House Illustration - Compact Bottom Version */}
              <div className="flex justify-center items-end">
                <svg width="100%" height="140" viewBox="0 0 300 140" preserveAspectRatio="xMidYMax meet" className="transform transition-all duration-700 group-hover:scale-105">
                  {/* Snow Piles - Left */}
                  <ellipse cx="60" cy="125" rx="30" ry="12" fill="rgba(255, 255, 255, 0.4)" />
                  <ellipse cx="50" cy="122" rx="22" ry="9" fill="rgba(255, 255, 255, 0.5)" />

                  {/* Snow Piles - Right */}
                  <ellipse cx="240" cy="125" rx="30" ry="12" fill="rgba(255, 255, 255, 0.4)" />
                  <ellipse cx="250" cy="122" rx="22" ry="9" fill="rgba(255, 255, 255, 0.5)" />

                  {/* House Body */}
                  <rect x="110" y="70" width="80" height="60" rx="3" fill="rgba(71, 85, 105, 0.7)" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1.5" />

                  {/* Roof */}
                  <path d="M100 70 L150 35 L200 70 Z" fill="rgba(51, 65, 85, 0.8)" stroke="rgba(100, 116, 139, 0.6)" strokeWidth="1.5" />
                  <path d="M100 70 L150 40 L200 70 L195 72 L150 45 L105 72 Z" fill="rgba(255, 255, 255, 0.5)" />

                  {/* Chimney */}
                  <rect x="165" y="45" width="14" height="28" rx="1.5" fill="rgba(127, 29, 29, 0.8)" stroke="rgba(185, 28, 28, 0.5)" strokeWidth="1.5" />
                  <rect x="163" y="43" width="18" height="3" rx="1" fill="rgba(153, 27, 27, 0.9)" />
                  <ellipse cx="172" cy="43" rx="10" ry="3" fill="rgba(255, 255, 255, 0.6)" />

                  {/* Animated Smoke - More Compact */}
                  <g opacity="0.7">
                    <ellipse cx="172" cy="32" rx="6" ry="6" fill="rgba(203, 213, 225, 0.6)">
                      <animate attributeName="cy" values="32;22;12;2" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="rx" values="6;8;11;14" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0.4;0.2;0" dur="3s" repeatCount="indefinite" />
                    </ellipse>
                    <ellipse cx="176" cy="32" rx="5" ry="5" fill="rgba(226, 232, 240, 0.5)">
                      <animate attributeName="cy" values="32;22;12;2" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                      <animate attributeName="rx" values="5;7;10;13" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                      <animate attributeName="opacity" values="0.5;0.3;0.15;0" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                    </ellipse>
                  </g>

                  {/* Windows with Warm Glow */}
                  <rect x="125" y="85" width="16" height="20" rx="2" fill="rgba(251, 191, 36, 0.6)" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="1.5">
                    <animate attributeName="fill" values="rgba(251, 191, 36, 0.6);rgba(251, 191, 36, 0.8);rgba(251, 191, 36, 0.6)" dur="4s" repeatCount="indefinite" />
                  </rect>
                  <rect x="159" y="85" width="16" height="20" rx="2" fill="rgba(251, 191, 36, 0.6)" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="1.5">
                    <animate attributeName="fill" values="rgba(251, 191, 36, 0.6);rgba(251, 191, 36, 0.8);rgba(251, 191, 36, 0.6)" dur="4s" repeatCount="indefinite" begin="0.5s" />
                  </rect>

                  {/* Window Panes */}
                  <line x1="133" y1="85" x2="133" y2="105" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="1" />
                  <line x1="125" y1="95" x2="141" y2="95" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="1" />
                  <line x1="167" y1="85" x2="167" y2="105" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="1" />
                  <line x1="159" y1="95" x2="175" y2="95" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="1" />

                  {/* Door */}
                  <rect x="144" y="105" width="12" height="25" rx="1.5" fill="rgba(120, 53, 15, 0.8)" stroke="rgba(146, 64, 14, 0.5)" strokeWidth="1.5" />
                  <circle cx="153" cy="117" r="1" fill="rgba(251, 191, 36, 0.7)" />

                  {/* Running Car - Compact */}
                  <g transform="translate(20, 110)">
                    <rect x="0" y="8" width="40" height="15" rx="2" fill="rgba(30, 58, 138, 0.7)" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1.5" />
                    <path d="M6 8 L10 2 L28 2 L32 8 Z" fill="rgba(30, 58, 138, 0.6)" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1.5" />

                    {/* Windows */}
                    <rect x="11" y="4" width="6" height="4" rx="0.5" fill="rgba(96, 165, 250, 0.4)" />
                    <rect x="20" y="4" width="6" height="4" rx="0.5" fill="rgba(96, 165, 250, 0.4)" />

                    {/* Wheels */}
                    <circle cx="10" cy="23" r="3.5" fill="rgba(31, 41, 55, 0.8)" stroke="rgba(75, 85, 99, 0.6)" strokeWidth="1.5" />
                    <circle cx="30" cy="23" r="3.5" fill="rgba(31, 41, 55, 0.8)" stroke="rgba(75, 85, 99, 0.6)" strokeWidth="1.5" />

                    {/* Headlight */}
                    <circle cx="37" cy="13" r="1" fill="rgba(253, 224, 71, 0.8)">
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                    </circle>

                    {/* Exhaust */}
                    <ellipse cx="-2" cy="18" rx="4" ry="3" fill="rgba(203, 213, 225, 0.5)">
                      <animate attributeName="cx" values="-2;-10;-18" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="rx" values="4;6;8" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0.3;0" dur="2s" repeatCount="indefinite" />
                    </ellipse>
                  </g>
                </svg>
              </div>
            </div>

            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
          </div>
        </Link>

        {/* MOVING Card - Journey with Compass & Northern Path */}
        <Link href="/moving" className="group">
          <div
            className="relative h-[300px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-purple-500/30 transition-all duration-500 hover:border-purple-400/60 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
            onMouseEnter={() => setHoveredCard('moving')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Falling Snow */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
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

            {/* Northern Lights Accent - Top */}
            <div className="absolute top-0 left-0 right-0 h-28 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
              <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none">
                <path
                  d="M0,70 Q100,30 200,70 T400,70 L400,0 L0,0 Z"
                  fill="url(#movingGradient)"
                  opacity="0.5"
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
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Content Container - Bottom Aligned */}
            <div className="absolute inset-0 flex flex-col justify-end pb-6 px-6">
              {/* Title - Fixed Position from Bottom */}
              <div className="absolute bottom-[140px] left-6 right-6">
                <h3 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  MOVING
                </h3>
                <p className="text-xs text-gray-300/90">Journey Awaits</p>
              </div>

              {/* Bottom Elements - Compass and Journey Path */}
              <div className="relative flex justify-center items-end">
                {/* Journey Road Path */}
                <div className="absolute bottom-0 left-0 right-0 h-20 opacity-40">
                  <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="xMidYMax meet">
                    <path
                      d="M-20,80 Q100,50 150,40 T320,20"
                      fill="none"
                      stroke="rgba(168, 85, 247, 0.4)"
                      strokeWidth="30"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-20,80 Q100,50 150,40 T320,20"
                      fill="none"
                      stroke="rgba(236, 72, 153, 0.6)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="10 8"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;18;0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>
                </div>

                {/* Compass Icon */}
                <div className="relative z-10 mb-2">
                  <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-[0_0_20px_rgba(168,85,247,0.6)] transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
                    {/* Compass Rings */}
                    <circle cx="50" cy="50" r="35" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="2.5" />
                    <circle cx="50" cy="50" r="28" fill="rgba(88, 28, 135, 0.3)" stroke="#c084fc" strokeWidth="2" />

                    {/* Cardinal Directions */}
                    <text x="50" y="25" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">N</text>
                    <text x="75" y="54" textAnchor="middle" fill="#e0e7ff" fontSize="9">E</text>
                    <text x="50" y="80" textAnchor="middle" fill="#e0e7ff" fontSize="9">S</text>
                    <text x="25" y="54" textAnchor="middle" fill="#e0e7ff" fontSize="9">W</text>

                    {/* Compass Needle */}
                    <g>
                      <path d="M50,50 L50,30 L47,50 Z" fill="#ef4444" opacity="0.8">
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          values="0 50 50;5 50 50;-5 50 50;0 50 50"
                          dur="4s"
                          repeatCount="indefinite"
                        />
                      </path>
                      <path d="M50,50 L50,70 L53,50 Z" fill="#e0e7ff" opacity="0.7">
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
                    <circle cx="50" cy="50" r="3.5" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5">
                      <animate attributeName="r" values="3.5;4.5;3.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>

                {/* Moving Truck - Left Side */}
                <div className="absolute left-4 bottom-6 opacity-50 group-hover:opacity-70 transition-all duration-700 group-hover:translate-x-1">
                  <svg width="50" height="35" viewBox="0 0 60 40">
                    <rect x="5" y="12" width="32" height="18" rx="2" fill="rgba(168, 85, 247, 0.5)" stroke="#a855f7" strokeWidth="1.5" />
                    <rect x="37" y="16" width="15" height="14" rx="1.5" fill="rgba(168, 85, 247, 0.4)" stroke="#a855f7" strokeWidth="1.5" />

                    <rect x="39" y="18" width="5" height="6" rx="0.5" fill="rgba(192, 132, 252, 0.3)" />
                    <rect x="45" y="18" width="5" height="6" rx="0.5" fill="rgba(192, 132, 252, 0.3)" />

                    <circle cx="16" cy="30" r="4" fill="rgba(88, 28, 135, 0.6)" stroke="#c084fc" strokeWidth="1.5" />
                    <circle cx="44" cy="30" r="4" fill="rgba(88, 28, 135, 0.6)" stroke="#c084fc" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
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
