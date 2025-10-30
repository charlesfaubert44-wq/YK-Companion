'use client';

import { useState, useEffect } from 'react';

export default function YKBuddyBanner() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <>
      {/* Desktop Version - Full Width Banner */}
      <div
        className="hidden md:block relative w-full h-48 overflow-hidden cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Lake Layer - Bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/30 to-blue-900/50" />

        {/* Mountain/Terrain Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a3a52" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0f2438" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d="M0,200 L0,120 Q100,80 200,90 T400,70 T600,85 T800,75 T1000,95 T1200,80 L1200,200 Z"
              fill="url(#terrainGradient)"
            />
            <path
              d="M0,200 L0,140 Q150,100 300,110 T600,95 T900,115 T1200,100 L1200,200 Z"
              fill="#0a1929"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Aurora Layers - Multiple for depth */}
        <div
          className="absolute inset-0 opacity-60 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse ${mousePosition.x}% ${mousePosition.y}% at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(52, 211, 153, 0.4) 0%,
              rgba(96, 165, 250, 0.3) 25%,
              rgba(167, 139, 250, 0.2) 50%,
              transparent 70%)`,
            opacity: isHovered ? 0.8 : 0.6,
          }}
        />

        {/* Animated Aurora Waves */}
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: 'linear-gradient(180deg, rgba(52, 211, 153, 0.3) 0%, transparent 60%)',
              animation: 'aurora-wave-1 15s ease-in-out infinite',
            }}
          />
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: 'linear-gradient(180deg, rgba(96, 165, 250, 0.25) 0%, transparent 50%)',
              animation: 'aurora-wave-2 12s ease-in-out infinite',
              animationDelay: '2s',
            }}
          />
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: 'linear-gradient(180deg, rgba(167, 139, 250, 0.2) 0%, transparent 55%)',
              animation: 'aurora-wave-3 18s ease-in-out infinite',
              animationDelay: '4s',
            }}
          />
        </div>

        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
        </div>

        {/* Lake Reflection Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-950/40 to-transparent opacity-60" />

        {/* YK Buddy Text - Main Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1
            className="text-7xl lg:text-8xl font-bold tracking-wider relative z-10 transition-all duration-500"
            style={{
              textShadow: isHovered
                ? '0 0 40px rgba(52, 211, 153, 0.6), 0 0 80px rgba(96, 165, 250, 0.4)'
                : '0 0 20px rgba(52, 211, 153, 0.4), 0 0 40px rgba(96, 165, 250, 0.2)',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <span
              className="bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent"
              style={{
                backgroundSize: '200% auto',
                animation: 'aurora-text 8s ease-in-out infinite',
              }}
            >
              YK BUDDY
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-sm text-gray-300 tracking-widest opacity-70">
            YOUR YELLOWKNIFE COMPANION
          </p>
        </div>

        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-northern-midnight/30 via-transparent to-northern-midnight/50 pointer-events-none" />
      </div>

      {/* Mobile Version - Compact Logo */}
      <div className="md:hidden relative w-full py-12 overflow-hidden">
        {/* Simplified Aurora Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-northern-midnight via-blue-950/20 to-northern-midnight" />

        {/* Mobile Aurora Effect */}
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(52, 211, 153, 0.3) 0%, transparent 60%)',
              animation: 'aurora-wave-1 10s ease-in-out infinite',
            }}
          />
        </div>

        {/* Stars - Fewer for mobile */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.4,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Mobile Logo Text */}
        <div className="relative z-10 text-center">
          <h1
            className="text-5xl font-bold tracking-wide"
            style={{
              textShadow: '0 0 20px rgba(52, 211, 153, 0.4), 0 0 40px rgba(96, 165, 250, 0.2)',
            }}
          >
            <span
              className="bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent"
              style={{
                backgroundSize: '200% auto',
                animation: 'aurora-text 8s ease-in-out infinite',
              }}
            >
              YK BUDDY
            </span>
          </h1>
          <p className="text-xs text-gray-400 tracking-widest mt-3 opacity-80">
            YOUR YELLOWKNIFE COMPANION
          </p>
        </div>
      </div>

      {/* Add Custom Animations */}
      <style jsx>{`
        @keyframes aurora-wave-1 {
          0%,
          100% {
            transform: translateY(0) scaleY(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-10px) scaleY(1.1);
            opacity: 0.6;
          }
        }

        @keyframes aurora-wave-2 {
          0%,
          100% {
            transform: translateY(0) scaleY(1);
            opacity: 0.35;
          }
          50% {
            transform: translateY(-15px) scaleY(1.15);
            opacity: 0.5;
          }
        }

        @keyframes aurora-wave-3 {
          0%,
          100% {
            transform: translateY(0) scaleY(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-8px) scaleY(1.08);
            opacity: 0.45;
          }
        }

        @keyframes aurora-text {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </>
  );
}
