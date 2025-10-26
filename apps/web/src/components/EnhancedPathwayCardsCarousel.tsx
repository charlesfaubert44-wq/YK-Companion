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
        // Aurora-inspired plane with flight trail and northern lights
        <div className="relative w-full h-full">
          {/* Northern Lights Background Waves */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.6 }}>
                  <animate attributeName="stop-color" values="#10b981;#06b6d4;#3b82f6;#10b981" dur="8s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 0.4 }}>
                  <animate attributeName="stop-color" values="#06b6d4;#3b82f6;#8b5cf6;#06b6d4" dur="8s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }}>
                  <animate attributeName="stop-color" values="#3b82f6;#8b5cf6;#10b981;#3b82f6" dur="8s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              <linearGradient id="aurora2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.2 }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Animated Aurora Waves */}
            <path d="M0,100 Q100,80 200,100 T400,100 L400,0 L0,0 Z" fill="url(#aurora1)">
              <animate attributeName="d"
                values="M0,100 Q100,80 200,100 T400,100 L400,0 L0,0 Z;
                        M0,120 Q100,100 200,120 T400,120 L400,0 L0,0 Z;
                        M0,100 Q100,80 200,100 T400,100 L400,0 L0,0 Z"
                dur="6s" repeatCount="indefinite" />
            </path>
            <path d="M0,150 Q100,130 200,150 T400,150 L400,0 L0,0 Z" fill="url(#aurora2)" opacity="0.6">
              <animate attributeName="d"
                values="M0,150 Q100,130 200,150 T400,150 L400,0 L0,0 Z;
                        M0,130 Q100,150 200,130 T400,130 L400,0 L0,0 Z;
                        M0,150 Q100,130 200,150 T400,150 L400,0 L0,0 Z"
                dur="8s" repeatCount="indefinite" />
            </path>
          </svg>

          {/* Star Field */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                opacity: 0.3 + Math.random() * 0.7,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}

          {/* Flight Trail Effect */}
          <svg className="absolute inset-0 w-full h-full opacity-30 group-hover:opacity-50 transition-opacity duration-700" viewBox="0 0 400 300">
            <path
              d="M50,150 Q150,100 300,80"
              stroke="url(#trailGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              opacity="0.6"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="100" dur="3s" repeatCount="indefinite" />
            </path>
            <defs>
              <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
                <stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
          </svg>

          {/* Main Plane Icon - Centered */}
          <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700">
            <svg width="120" height="100" viewBox="0 0 120 100" className="drop-shadow-[0_0_30px_rgba(16,185,129,0.8)] filter" style={{ filter: 'url(#glow)' }}>
              <defs>
                <linearGradient id="planeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#059669', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.6 }} />
                </linearGradient>
              </defs>

              {/* Plane Body - Sleek Design */}
              <path d="M 60 10 L 63 12 L 63 40 L 60 40 L 57 40 L 57 12 Z" fill="url(#planeGradient)" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <animate attributeName="opacity" values="1;0.9;1" dur="2s" repeatCount="indefinite" />
              </path>

              {/* Cockpit Window */}
              <ellipse cx="60" cy="18" rx="4" ry="5" fill="rgba(59, 130, 246, 0.7)" stroke="#3b82f6" strokeWidth="2" className="animate-pulse" />
              <ellipse cx="60" cy="18" rx="2" ry="3" fill="rgba(147, 197, 253, 0.9)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
              </ellipse>

              {/* Left Wing - Layered */}
              <path d="M 5 48 L 12 46 L 57 46 L 57 54 L 12 54 L 5 50 Z" fill="url(#wingGradient)" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
              <path d="M 8 48 L 14 47 L 57 47 L 57 53 L 14 53 L 8 50 Z" fill="rgba(16, 185, 129, 0.3)" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />

              {/* Right Wing - Layered */}
              <path d="M 115 48 L 108 46 L 63 46 L 63 54 L 108 54 L 115 50 Z" fill="url(#wingGradient)" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
              <path d="M 112 48 L 106 47 L 63 47 L 63 53 L 106 53 L 112 50 Z" fill="rgba(16, 185, 129, 0.3)" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />

              {/* Wing Tips Glow */}
              <circle cx="5" cy="49" r="3.5" fill="#10b981" opacity="0.8">
                <animate attributeName="r" values="3.5;5;3.5" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="115" cy="49" r="3.5" fill="#10b981" opacity="0.8">
                <animate attributeName="r" values="3.5;5;3.5" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Main Fuselage */}
              <rect x="56" y="40" width="8" height="36" rx="2" fill="url(#planeGradient)" stroke="#10b981" strokeWidth="2.5" />

              {/* Engines - Left */}
              <ellipse cx="44" cy="78" rx="16" ry="4" fill="rgba(6, 182, 212, 0.5)" stroke="#06b6d4" strokeWidth="2.5" />
              <ellipse cx="44" cy="78" rx="12" ry="3" fill="rgba(59, 130, 246, 0.6)">
                <animate attributeName="ry" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
              </ellipse>

              {/* Engines - Right */}
              <ellipse cx="76" cy="78" rx="16" ry="4" fill="rgba(6, 182, 212, 0.5)" stroke="#06b6d4" strokeWidth="2.5" />
              <ellipse cx="76" cy="78" rx="12" ry="3" fill="rgba(59, 130, 246, 0.6)">
                <animate attributeName="ry" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
              </ellipse>

              {/* Engine Struts */}
              <line x1="48" y1="74" x2="57" y2="62" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              <line x1="72" y1="74" x2="63" y2="62" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

              {/* Landing Gear */}
              <path d="M 48 84 L 60 84 L 60 88 L 48 88 Z" fill="rgba(6, 182, 212, 0.5)" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <path d="M 72 84 L 60 84 L 60 88 L 72 88 Z" fill="rgba(6, 182, 212, 0.5)" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />

              {/* Tail */}
              <path d="M 57 88 L 60 94 L 63 88 Z" fill="url(#planeGradient)" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

              {/* Propeller Blur Effect */}
              <ellipse cx="60" cy="8" rx="8" ry="2" fill="rgba(203, 213, 225, 0.5)" opacity="0.7">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="0.2s" repeatCount="indefinite" />
                <animate attributeName="rx" values="8;10;8" dur="0.2s" repeatCount="indefinite" />
              </ellipse>
            </svg>
          </div>
        </div>
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
        // Cozy cabin in snowy landscape with warm glow
        <div className="relative w-full h-full">
          {/* Mountain Silhouettes Background */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#0c4a6e', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>
            <path d="M0,200 L80,120 L160,180 L240,100 L320,160 L400,120 L400,300 L0,300 Z" fill="url(#mountainGrad)" />
            <path d="M0,220 L60,150 L140,200 L220,140 L300,190 L400,150 L400,300 L0,300 Z" fill="url(#mountainGrad)" opacity="0.6" />
          </svg>

          {/* Snowfall */}
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                animation: `gentleSnowfall ${8 + Math.random() * 8}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.4 + Math.random() * 0.6,
              }}
            />
          ))}

          {/* Ground/Snow Layer */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-100/20 via-blue-200/10 to-transparent" />

          {/* Main House Icon - Centered */}
          <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-105 transition-all duration-700">
            <svg width="140" height="140" viewBox="0 0 200 200" className="drop-shadow-[0_0_40px_rgba(251,146,60,0.6)]">
              <defs>
                <linearGradient id="roofGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#991b1b', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#fed7aa', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#fdba74', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="warmGlow">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <radialGradient id="lightBeam">
                  <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 0 }} />
                </radialGradient>
              </defs>

              {/* Snow Ground */}
              <ellipse cx="100" cy="170" rx="90" ry="15" fill="rgba(219, 234, 254, 0.3)" />
              <ellipse cx="100" cy="170" rx="80" ry="12" fill="rgba(191, 219, 254, 0.2)" />

              {/* House Shadow */}
              <ellipse cx="100" cy="155" rx="45" ry="8" fill="rgba(30, 58, 138, 0.15)" />

              {/* Main House Structure - Cabin Style */}
              {/* Back Wall */}
              <rect x="55" y="100" width="90" height="60" rx="3" fill="url(#wallGradient)" stroke="#92400e" strokeWidth="2.5" />

              {/* Wood Planks Detail */}
              <line x1="55" y1="115" x2="145" y2="115" stroke="#92400e" strokeWidth="1" opacity="0.3" />
              <line x1="55" y1="130" x2="145" y2="130" stroke="#92400e" strokeWidth="1" opacity="0.3" />
              <line x1="55" y1="145" x2="145" y2="145" stroke="#92400e" strokeWidth="1" opacity="0.3" />

              {/* Roof - Peaked */}
              <path d="M 45 100 L 100 60 L 155 100 Z" fill="url(#roofGradient)" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 48 100 L 100 65 L 152 100 Z" fill="rgba(220, 38, 38, 0.6)" opacity="0.5" />

              {/* Roof Snow Cap */}
              <path d="M 45 100 L 50 96 L 100 60 L 150 96 L 155 100 L 100 65 Z" fill="rgba(255, 255, 255, 0.8)" opacity="0.9" />

              {/* Chimney */}
              <rect x="120" y="70" width="15" height="35" rx="1" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
              <rect x="118" y="68" width="19" height="6" rx="1" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />

              {/* Smoke from Chimney */}
              <circle cx="127" cy="60" r="4" fill="rgba(203, 213, 225, 0.6)">
                <animate attributeName="cy" values="60;50;40" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.3;0" dur="3s" repeatCount="indefinite" />
                <animate attributeName="r" values="4;6;8" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="132" cy="55" r="5" fill="rgba(203, 213, 225, 0.5)">
                <animate attributeName="cy" values="55;45;35" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.3;0" dur="4s" repeatCount="indefinite" />
                <animate attributeName="r" values="5;7;9" dur="4s" repeatCount="indefinite" />
              </circle>

              {/* Windows - Left with Warm Glow */}
              <g filter="url(#warmGlow)">
                <rect x="68" y="115" width="20" height="25" rx="2" fill="url(#windowGlow)" stroke="#d97706" strokeWidth="2.5" />
                <line x1="78" y1="115" x2="78" y2="140" stroke="#d97706" strokeWidth="2" />
                <line x1="68" y1="127.5" x2="88" y2="127.5" stroke="#d97706" strokeWidth="2" />
                <rect x="68" y="115" width="20" height="25" rx="2" fill="rgba(251, 191, 36, 0.4)">
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite" />
                </rect>
              </g>

              {/* Window - Right with Warm Glow */}
              <g filter="url(#warmGlow)">
                <rect x="112" y="115" width="20" height="25" rx="2" fill="url(#windowGlow)" stroke="#d97706" strokeWidth="2.5" />
                <line x1="122" y1="115" x2="122" y2="140" stroke="#d97706" strokeWidth="2" />
                <line x1="112" y1="127.5" x2="132" y2="127.5" stroke="#d97706" strokeWidth="2" />
                <rect x="112" y="115" width="20" height="25" rx="2" fill="rgba(251, 191, 36, 0.4)">
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
                </rect>
              </g>

              {/* Light Beams from Windows */}
              <polygon points="68,127 50,160 50,170 68,140" fill="url(#lightBeam)" opacity="0.3" className="group-hover:opacity-50 transition-opacity duration-700" />
              <polygon points="132,127 150,160 150,170 132,140" fill="url(#lightBeam)" opacity="0.3" className="group-hover:opacity-50 transition-opacity duration-700" />

              {/* Door */}
              <rect x="88" y="132" width="24" height="28" rx="2" fill="#92400e" stroke="#78350f" strokeWidth="2.5" />
              <circle cx="105" cy="146" r="1.5" fill="#fbbf24" />

              {/* Door Window */}
              <rect x="94" y="138" width="12" height="10" rx="1" fill="rgba(251, 191, 36, 0.6)" stroke="#d97706" strokeWidth="1">
                <animate attributeName="opacity" values="0.6;0.9;0.6" dur="5s" repeatCount="indefinite" />
              </rect>

              {/* Small Roof Icicles */}
              <g opacity="0.7">
                <path d="M 60 100 L 58 105 L 60 100" fill="rgba(191, 219, 254, 0.8)" stroke="rgba(147, 197, 253, 0.6)" strokeWidth="0.5" />
                <path d="M 80 95 L 78 102 L 80 95" fill="rgba(191, 219, 254, 0.8)" stroke="rgba(147, 197, 253, 0.6)" strokeWidth="0.5" />
                <path d="M 120 95 L 118 102 L 120 95" fill="rgba(191, 219, 254, 0.8)" stroke="rgba(147, 197, 253, 0.6)" strokeWidth="0.5" />
                <path d="M 140 100 L 138 105 L 140 100" fill="rgba(191, 219, 254, 0.8)" stroke="rgba(147, 197, 253, 0.6)" strokeWidth="0.5" />
              </g>

              {/* Pine Trees - Left Side */}
              <g opacity="0.5">
                <path d="M 25 140 L 30 120 L 35 140 Z" fill="#065f46" />
                <path d="M 25 150 L 30 130 L 35 150 Z" fill="#064e3b" />
                <rect x="28" y="150" width="4" height="10" fill="#78350f" />
              </g>

              {/* Pine Trees - Right Side */}
              <g opacity="0.5">
                <path d="M 165 145 L 170 125 L 175 145 Z" fill="#065f46" />
                <path d="M 165 155 L 170 135 L 175 155 Z" fill="#064e3b" />
                <rect x="168" y="155" width="4" height="10" fill="#78350f" />
              </g>

              {/* Warm Glow Around House */}
              <ellipse cx="100" cy="130" rx="60" ry="40" fill="url(#lightBeam)" opacity="0.15" className="group-hover:opacity-25 transition-opacity duration-700" />
            </svg>
          </div>
        </div>
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
        // Journey-themed compass with map texture and path elements
        <div className="relative w-full h-full">
          {/* Vintage Map Background Texture */}
          <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="mapPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="40" y2="0" stroke="#a855f7" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="0" x2="0" y2="40" stroke="#a855f7" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="400" height="300" fill="url(#mapPattern)" />

            {/* Map Contour Lines */}
            <path d="M50,100 Q150,80 250,120 T400,100" stroke="#a855f7" strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="5,5" />
            <path d="M0,150 Q100,130 200,160 T400,150" stroke="#c084fc" strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="5,5" />
            <path d="M50,200 Q150,180 300,210" stroke="#a855f7" strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="5,5" />
          </svg>

          {/* Dotted Path/Route */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 300">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.6 }} />
                <stop offset="50%" style={{ stopColor: '#ec4899', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 0.6 }} />
              </linearGradient>
            </defs>
            <path
              d="M50,250 Q100,200 150,220 T250,180 T350,150"
              stroke="url(#pathGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="8,12"
              strokeLinecap="round"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="80" dur="4s" repeatCount="indefinite" />
            </path>
          </svg>

          {/* Floating Location Pins */}
          {[
            { x: 20, y: 30, delay: 0 },
            { x: 70, y: 50, delay: 1 },
            { x: 30, y: 70, delay: 2 }
          ].map((pin, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-pink-400 rounded-full"
              style={{
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                animation: `float ${3 + i}s ease-in-out infinite`,
                animationDelay: `${pin.delay}s`,
                boxShadow: '0 0 10px rgba(236, 72, 153, 0.6)',
              }}
            />
          ))}

          {/* Mountain Peaks Silhouette */}
          <svg className="absolute bottom-0 left-0 right-0 h-24 opacity-20" viewBox="0 0 400 100" preserveAspectRatio="none">
            <path d="M0,100 L0,60 L50,30 L100,50 L150,20 L200,45 L250,25 L300,50 L350,35 L400,55 L400,100 Z" fill="rgba(168, 85, 247, 0.4)" />
          </svg>

          {/* Main Compass Icon - Centered */}
          <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
            <svg width="160" height="160" viewBox="0 0 200 200" className="drop-shadow-[0_0_40px_rgba(168,85,247,0.8)]">
              <defs>
                <radialGradient id="compassGlow">
                  <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: '#581c87', stopOpacity: 0 }} />
                </radialGradient>
                <linearGradient id="compassRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="needleNorth" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="needleSouth" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#e0e7ff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#c7d2fe', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="compassGlowFilter">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Outer Glow */}
              <circle cx="100" cy="100" r="80" fill="url(#compassGlow)" opacity="0.4" className="group-hover:opacity-60 transition-opacity duration-700" />

              {/* Outer Ring - Ornate */}
              <circle cx="100" cy="100" r="70" fill="none" stroke="url(#compassRing)" strokeWidth="4" filter="url(#compassGlowFilter)">
                <animate attributeName="stroke-dasharray" values="0,440;440,440" dur="2s" fill="freeze" />
              </circle>
              <circle cx="100" cy="100" r="65" fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="2" strokeDasharray="4,4">
                <animateTransform attributeName="transform" type="rotate" values="0 100 100;360 100 100" dur="20s" repeatCount="indefinite" />
              </circle>

              {/* Compass Tick Marks */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x1 = 100 + 60 * Math.cos(angle);
                const y1 = 100 + 60 * Math.sin(angle);
                const x2 = 100 + 55 * Math.cos(angle);
                const y2 = 100 + 55 * Math.sin(angle);
                const isMajor = i % 3 === 0;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isMajor ? '#ec4899' : '#c084fc'}
                    strokeWidth={isMajor ? 3 : 1.5}
                    strokeLinecap="round"
                    opacity={isMajor ? 1 : 0.6}
                  />
                );
              })}

              {/* Middle Decorative Ring */}
              <circle cx="100" cy="100" r="55" fill="rgba(88, 28, 135, 0.4)" stroke="#c084fc" strokeWidth="3" opacity="0.8" />
              <circle cx="100" cy="100" r="48" fill="rgba(88, 28, 135, 0.2)" stroke="#a855f7" strokeWidth="2" opacity="0.6" />

              {/* Cardinal Direction Labels - Enhanced */}
              <g fontSize="18" fontWeight="bold" fontFamily="serif">
                {/* North - Gold */}
                <circle cx="100" cy="32" r="12" fill="rgba(251, 191, 36, 0.3)" stroke="#fbbf24" strokeWidth="2" />
                <text x="100" y="38" textAnchor="middle" fill="#fbbf24" filter="url(#compassGlowFilter)">N</text>

                {/* East */}
                <circle cx="168" cy="100" r="10" fill="rgba(192, 132, 252, 0.2)" stroke="#c084fc" strokeWidth="1.5" />
                <text x="168" y="105" textAnchor="middle" fill="#e0e7ff" fontSize="14">E</text>

                {/* South */}
                <circle cx="100" cy="168" r="10" fill="rgba(192, 132, 252, 0.2)" stroke="#c084fc" strokeWidth="1.5" />
                <text x="100" y="173" textAnchor="middle" fill="#e0e7ff" fontSize="14">S</text>

                {/* West */}
                <circle cx="32" cy="100" r="10" fill="rgba(192, 132, 252, 0.2)" stroke="#c084fc" strokeWidth="1.5" />
                <text x="32" y="105" textAnchor="middle" fill="#e0e7ff" fontSize="14">W</text>
              </g>

              {/* Compass Needle - 3D Effect */}
              <g filter="url(#compassGlowFilter)">
                {/* North Needle - Gold */}
                <path d="M100,100 L95,40 L100,35 L105,40 Z" fill="url(#needleNorth)" opacity="0.9">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 100 100;3 100 100;-3 100 100;0 100 100"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </path>
                <path d="M100,100 L97,40 L100,36 L103,40 Z" fill="rgba(251, 191, 36, 0.6)">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 100 100;3 100 100;-3 100 100;0 100 100"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* South Needle - Silver */}
                <path d="M100,100 L95,160 L100,165 L105,160 Z" fill="url(#needleSouth)" opacity="0.8">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 100 100;3 100 100;-3 100 100;0 100 100"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>

              {/* Center Pivot - Ornate */}
              <circle cx="100" cy="100" r="8" fill="rgba(168, 85, 247, 0.4)" stroke="#a855f7" strokeWidth="2.5" />
              <circle cx="100" cy="100" r="5" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2">
                <animate attributeName="r" values="5;6;5" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="100" r="2.5" fill="rgba(251, 191, 36, 0.8)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Decorative Stars at Cardinal Points */}
              {[0, 90, 180, 270].map((angle, i) => {
                const rad = (angle - 90) * (Math.PI / 180);
                const x = 100 + 42 * Math.cos(rad);
                const y = 100 + 42 * Math.sin(rad);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="2" fill="#ec4899" opacity="0.6">
                      <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                    </circle>
                  </g>
                );
              })}

              {/* Outer Decorative Arrows */}
              <g opacity="0.4">
                <path d="M100,15 L95,25 L100,23 L105,25 Z" fill="#fbbf24" />
                <path d="M185,100 L175,95 L177,100 L175,105 Z" fill="#c084fc" />
                <path d="M100,185 L95,175 L100,177 L105,175 Z" fill="#c084fc" />
                <path d="M15,100 L25,95 L23,100 L25,105 Z" fill="#c084fc" />
              </g>
            </svg>
          </div>

          {/* Traveling Light Particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`,
                animation: `travel ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
                opacity: 0.6,
                boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)',
              }}
            />
          ))}
        </div>
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
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @keyframes gentleSnowfall {
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
            transform: translateY(100vh) translateX(20px) rotate(180deg);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-10px) scale(1.2); opacity: 1; }
        }

        @keyframes travel {
          0% { transform: translateX(0) translateY(0); opacity: 0; }
          25% { opacity: 0.8; }
          50% { transform: translateX(50px) translateY(-20px); opacity: 1; }
          75% { opacity: 0.8; }
          100% { transform: translateX(100px) translateY(0); opacity: 0; }
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
  const isHovered = hoveredCard === card.id;

  return (
    <Link href={card.href} className="group block">
      <div
        className={`relative h-[300px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border transition-all duration-700 hover:shadow-2xl ${
          isHovered
            ? `border-${card.borderColor}/80 bg-white/10 shadow-[0_0_60px_rgba(168,85,247,0.5)] scale-[1.02]`
            : `border-${card.borderColor}/30`
        }`}
        onMouseEnter={() => setHoveredCard(card.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Layered Background Gradients */}
        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60 group-hover:opacity-90 transition-all duration-700`} />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

        {/* Radial Gradient Overlay */}
        <div className={`absolute inset-0 bg-radial-gradient from-${card.borderColor}/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

        {/* Content Container - Bottom Aligned */}
        <div className="absolute inset-0 flex flex-col justify-end pb-6 px-6 z-10">
          {/* Title - Fixed Position from Bottom with Enhanced Effects */}
          <div className={`absolute bottom-[140px] left-6 right-6 transition-all duration-500 ${
            isHovered ? 'transform -translate-y-2' : ''
          }`}>
            <h3 className={`text-3xl font-bold text-white mb-2 bg-gradient-to-r ${card.titleGradient} bg-clip-text text-transparent transition-all duration-500 ${
              isHovered ? 'scale-110 tracking-wider' : ''
            }`}>
              {card.title}
            </h3>
            <p className={`text-xs text-gray-300/90 transition-all duration-500 ${
              isHovered ? 'text-gray-100 tracking-wide' : ''
            }`}>
              {card.subtitle}
            </p>
          </div>

          {/* Icon Container with Parallax Effect */}
          <div className={`flex justify-center mb-2 transition-all duration-700 ${
            isHovered ? 'transform translate-y-[-8px]' : ''
          }`}>
            {card.icon}
          </div>
        </div>

        {/* Animated Glow Effect on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${card.borderColor}/0 to-${card.borderColor}/0 group-hover:from-${card.borderColor}/20 group-hover:to-transparent transition-all duration-700 pointer-events-none`} />

        {/* Edge Glow */}
        <div className={`absolute inset-0 rounded-2xl shadow-inner opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
             style={{
               boxShadow: `inset 0 0 60px rgba(168, 85, 247, 0.3)`
             }}
        />

        {/* Shimmer Effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
        </div>
      </div>
    </Link>
  );
}
