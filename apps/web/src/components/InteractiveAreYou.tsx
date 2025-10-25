'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function InteractiveAreYou() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [floatingStars, setFloatingStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Animate in on mount
    setIsVisible(true);

    // Generate floating stars
    const stars = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setFloatingStars(stars);
  }, []);

  return (
    <div className="mb-12 relative">
      {/* Floating Stars Background */}
      {floatingStars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            background:
              star.id % 3 === 0
                ? 'rgba(16, 185, 129, 0.4)'
                : star.id % 3 === 1
                ? 'rgba(34, 211, 238, 0.4)'
                : 'rgba(139, 92, 246, 0.4)',
            boxShadow: `0 0 10px ${
              star.id % 3 === 0
                ? 'rgba(16, 185, 129, 0.6)'
                : star.id % 3 === 1
                ? 'rgba(34, 211, 238, 0.6)'
                : 'rgba(139, 92, 246, 0.6)'
            }`,
            animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Main Content */}
      <div
        className={`relative z-10 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
      >
        {/* Aurora Glow Effect */}
        <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(16, 185, 129, 0.4) 0%, rgba(34, 211, 238, 0.3) 40%, rgba(139, 92, 246, 0.3) 70%, transparent 100%)',
            }}
          />
        </div>

        {/* Decorative Top Elements */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <div
            className="w-20 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"
            style={{
              animation: 'expandWidth 1.5s ease-out forwards',
            }}
          />
          <span
            className="text-3xl animate-bounce"
            style={{
              animationDuration: '2s',
              filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.8))',
            }}
          >
            🌌
          </span>
          <div
            className="w-20 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"
            style={{
              animation: 'expandWidth 1.5s ease-out forwards',
            }}
          />
        </div>

        {/* Main Question */}
        <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
          <span
            className="inline-block bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient"
            style={{
              backgroundSize: '200% auto',
            }}
          >
            {t('are_you')}
          </span>
        </h2>

        {/* Subtitle with Typing Effect */}
        <p className="text-center text-gray-400 text-sm md:text-base mb-8 px-4">
          <span className="inline-block">
            Choose your path and discover Yellowknife your way
          </span>
        </p>

        {/* Animated Arrow Down */}
        <div className="flex justify-center">
          <div
            className="text-emerald-400 text-2xl animate-bounce"
            style={{
              animationDuration: '1.5s',
              filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))',
            }}
          >
            ↓
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 5rem;
          }
        }

        @keyframes animate-gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        .animate-gradient {
          animation: animate-gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
