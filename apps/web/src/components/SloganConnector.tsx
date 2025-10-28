'use client';

import { useSlogan } from '@/contexts/SloganContext';
import { useState } from 'react';

export default function SloganConnector() {
  const { currentSlogan } = useSlogan();
  const [isHovered, setIsHovered] = useState(false);

  if (!currentSlogan) return null;

  return (
    <div className="relative z-10">
      {/* Connector glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="mx-auto max-w-4xl h-full transition-all duration-700"
          style={{
            background: isHovered
              ? 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* Slogan container */}
      <div
        className="relative flex justify-center px-4 py-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative group cursor-default transition-all duration-500"
          style={{
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          {/* Aurora glow background */}
          <div
            className="absolute inset-0 rounded-2xl transition-all duration-700 blur-xl"
            style={{
              background: isHovered
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(52, 211, 153, 0.2), rgba(139, 92, 246, 0.2))'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.1), rgba(139, 92, 246, 0.1))',
              opacity: isHovered ? 0.8 : 0.5,
            }}
          />

          {/* Slogan text */}
          <div
            className="relative px-8 py-3 md:px-12 md:py-4 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-lg border-l border-r border-b transition-all duration-500"
            style={{
              borderColor: isHovered ? 'rgba(16, 185, 129, 0.4)' : 'rgba(100, 116, 139, 0.3)',
              borderBottomLeftRadius: '0',
              borderBottomRightRadius: '0',
              borderTopLeftRadius: '0',
              borderTopRightRadius: '0',
              boxShadow: isHovered
                ? '0 0 40px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 0 20px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Top shimmer line */}
            <div
              className="absolute top-0 left-1/4 right-1/4 h-px transition-all duration-700"
              style={{
                background: isHovered
                  ? 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.6), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent)',
              }}
            />

            {/* Slogan text with gradient */}
            <p
              className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-center transition-all duration-500"
              style={{
                background: isHovered
                  ? 'linear-gradient(135deg, #d1fae5, #6ee7b7, #5eead4)'
                  : 'linear-gradient(135deg, #a7f3d0, #6ee7b7, #86efac)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: isHovered
                  ? '0 0 20px rgba(16, 185, 129, 0.4)'
                  : '0 0 10px rgba(16, 185, 129, 0.2)',
                filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
              }}
            >
              {currentSlogan}
            </p>

            {/* Bottom connecting line */}
            <div
              className="absolute bottom-0 left-1/4 right-1/4 h-px transition-all duration-700"
              style={{
                background: isHovered
                  ? 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.6), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent)',
              }}
            />

            {/* Floating particles */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none transition-opacity duration-1000"
                style={{
                  width: `${2 + Math.random() * 2}px`,
                  height: `${2 + Math.random() * 2}px`,
                  left: `${20 + i * 30}%`,
                  top: `${30 + Math.random() * 40}%`,
                  background: 'rgba(16, 185, 129, 0.6)',
                  boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)',
                  opacity: isHovered ? 0.8 : 0.3,
                  animation: `float-particle ${3 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-8px) translateX(4px);
          }
          50% {
            transform: translateY(-4px) translateX(-4px);
          }
          75% {
            transform: translateY(-12px) translateX(2px);
          }
        }
      `}</style>
    </div>
  );
}
