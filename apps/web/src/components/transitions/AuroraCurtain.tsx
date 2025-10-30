/**
 * Aurora Curtain Component
 * 
 * Provides an aurora-themed page transition overlay with:
 * - Beautiful curtain effect
 * - Seasonal color theming
 * - Smooth animations
 * 
 * @module components/transitions/AuroraCurtain
 */

'use client';

import { useEffect, useState } from 'react';
import { useSeasonalTransition } from '@/hooks/useAuroraAnimation';
import { getCurrentSeason } from '@/lib/aurora';

/**
 * Props for AuroraCurtain component
 */
export interface AuroraCurtainProps {
  /** Duration of the curtain animation in milliseconds */
  duration?: number;
  /** Whether to show the curtain */
  show?: boolean;
  /** Custom season */
  season?: 'winter' | 'spring' | 'summer' | 'fall';
}

/**
 * AuroraCurtain component
 * 
 * Creates an aurora-themed overlay that transitions across the screen
 * 
 * @param props - Component props
 * @returns Aurora curtain overlay
 * 
 * @example
 * <AuroraCurtain duration={600} show={isTransitioning} />
 */
export default function AuroraCurtain({
  duration = 500,
  show = true,
  season,
}: AuroraCurtainProps) {
  const [isVisible, setIsVisible] = useState(show);
  const { colors } = useSeasonalTransition({
    season: season || undefined,
    autoDetect: !season,
  });

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  if (!isVisible) return null;

  // Check for reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return null;
  }

  // Create aurora gradient using seasonal colors
  const auroraGradient = `linear-gradient(135deg, 
    ${colors.primary}40 0%, 
    ${colors.secondary}40 30%, 
    ${colors.accent}40 60%, 
    ${colors.primary}40 100%
  )`;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{
        clipPath: isVisible
          ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
        transition: `clip-path ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      {/* Main aurora layer */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: auroraGradient,
          filter: 'blur(60px)',
          animation: 'auroraWave 8s ease-in-out infinite',
        }}
      />

      {/* Secondary aurora layer */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${colors.primary}60 0%, transparent 70%)`,
          filter: 'blur(40px)',
          animation: 'auroraWave 6s ease-in-out infinite reverse',
        }}
      />

      {/* Tertiary aurora layer */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `linear-gradient(45deg, ${colors.accent}40, ${colors.secondary}40, ${colors.primary}40)`,
          filter: 'blur(30px)',
          animation: 'auroraWave 10s ease-in-out infinite',
        }}
      />

      {/* Animated wave effect overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            transparent 0%,
            ${colors.primary}20 20%,
            ${colors.secondary}30 50%,
            ${colors.accent}20 80%,
            transparent 100%
          )`,
          animation: 'curtainWave 3s ease-in-out infinite',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        }}
      />

      <style jsx>{`
        @keyframes auroraWave {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-20px) scale(1.05);
            opacity: 0.9;
          }
          50% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          75% {
            transform: translateY(20px) scale(0.95);
            opacity: 0.7;
          }
        }

        @keyframes curtainWave {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5%);
          }
        }
      `}</style>
    </div>
  );
}

