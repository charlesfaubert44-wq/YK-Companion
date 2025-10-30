/**
 * Aurora Animation Hooks for YK-Companion
 * 
 * Provides hooks for aurora-style animations including:
 * - Aurora motion values with spring animations
 * - Seasonal color transitions
 * - Mouse tracking integration
 * - Smooth spring animations
 * 
 * @module hooks/useAuroraAnimation
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { spring, SpringConfig } from '@/lib/animations';
import { getCurrentSeason, YellowknifeSeason } from '@/lib/aurora';

/**
 * Aurora motion values interface
 */
export interface AuroraMotionValues {
  /** X position offset */
  x: number;
  /** Y position offset */
  y: number;
  /** Scale factor */
  scale: number;
  /** Rotation in degrees */
  rotation: number;
  /** Opacity (0-1) */
  opacity: number;
}

/**
 * Configuration for aurora animation
 */
export interface AuroraAnimationConfig {
  /** Spring configuration */
  springConfig?: SpringConfig;
  /** Intensity of the animation (0-1, default: 0.5) */
  intensity?: number;
  /** Enable mouse tracking */
  mouseTracking?: boolean;
  /** Sensitivity for mouse tracking (default: 0.3) */
  mouseSensitivity?: number;
  /** Whether animation is enabled */
  enabled?: boolean;
}

/**
 * Hook for aurora-style motion values
 * 
 * @param config - Configuration options
 * @returns Aurora motion values
 * 
 * @example
 * function AuroraElement() {
 *   const { x, y, scale, rotation, opacity } = useAuroraAnimation({
 *     intensity: 0.7,
 *     mouseTracking: true,
 *   });
 * 
 *   return (
 *     <div
 *       style={{
 *         transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`,
 *         opacity,
 *         transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
 *       }}
 *     >
 *       Aurora content
 *     </div>
 *   );
 * }
 */
export function useAuroraAnimation(config: AuroraAnimationConfig = {}) {
  const {
    springConfig = { stiffness: 170, damping: 26, mass: 1 },
    intensity = 0.5,
    mouseTracking = false,
    mouseSensitivity = 0.3,
    enabled = true,
  } = config;

  const [motionValues, setMotionValues] = useState<AuroraMotionValues>({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: 1,
  });

  const mousePositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  // Mouse tracking effect
  useEffect(() => {
    if (!mouseTracking || !enabled || typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      mousePositionRef.current = {
        x: (e.clientX - centerX) * mouseSensitivity,
        y: (e.clientY - centerY) * mouseSensitivity,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseTracking, mouseSensitivity, enabled]);

  // Animation loop
  useEffect(() => {
    if (!enabled) {
      setMotionValues({
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
      });
      return;
    }

    const springFn = spring(springConfig);
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      timeRef.current += deltaTime * 0.5; // Slow down time factor

      // Calculate base motion with sine waves for organic movement
      const baseX = Math.sin(timeRef.current) * 10 * intensity;
      const baseY = Math.cos(timeRef.current * 0.8) * 10 * intensity;
      const baseRotation = Math.sin(timeRef.current * 0.6) * 5 * intensity;
      const baseScale = 1 + Math.sin(timeRef.current * 0.4) * 0.05 * intensity;

      // Apply mouse tracking offset
      const mouseX = mouseTracking ? mousePositionRef.current.x * intensity : 0;
      const mouseY = mouseTracking ? mousePositionRef.current.y * intensity : 0;

      // Calculate final values with spring easing
      const targetX = baseX + mouseX;
      const targetY = baseY + mouseY;
      const targetRotation = baseRotation;
      const targetScale = baseScale;

      // Use spring function for smooth transitions (simplified for motion values)
      const progress = springFn(Math.min(timeRef.current / 10, 1)); // Normalize time

      setMotionValues({
        x: targetX * progress,
        y: targetY * progress,
        scale: 1 + (targetScale - 1) * progress,
        rotation: targetRotation * progress,
        opacity: 1,
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [springConfig, intensity, mouseTracking, enabled]);

  return motionValues;
}

/**
 * Seasonal color palette
 */
export interface SeasonalColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

/**
 * Seasonal color palettes based on Yellowknife seasons
 */
const SEASONAL_COLORS: Record<YellowknifeSeason, SeasonalColors> = {
  winter: {
    primary: '#00ff88', // Aurora green
    secondary: '#4d94ff', // Aurora blue
    accent: '#a366ff', // Aurora purple
    background: '#0a1128', // Northern midnight
  },
  spring: {
    primary: '#34d399', // Emerald
    secondary: '#60a5fa', // Sky blue
    accent: '#a78bfa', // Violet
    background: '#1a3d2e', // Forest green
  },
  summer: {
    primary: '#fbbf24', // Amber
    secondary: '#fb923c', // Orange
    accent: '#f472b6', // Pink
    background: '#1e293b', // Slate
  },
  fall: {
    primary: '#f97316', // Orange
    secondary: '#ef4444', // Red
    accent: '#dc2626', // Red-600
    background: '#1c1917', // Stone
  },
};

/**
 * Configuration for seasonal transition
 */
export interface SeasonalTransitionConfig {
  /** Duration of transition in milliseconds (default: 1000) */
  duration?: number;
  /** Easing function progress (0-1) */
  easing?: (t: number) => number;
  /** Specific season to use (auto-detects if not provided) */
  season?: YellowknifeSeason;
  /** Whether to auto-detect season */
  autoDetect?: boolean;
}

/**
 * Hook for seasonal color transitions
 * 
 * @param config - Configuration options
 * @returns Current seasonal colors and transition progress
 * 
 * @example
 * function SeasonalCard() {
 *   const { colors, transitionProgress } = useSeasonalTransition({
 *     duration: 2000,
 *   });
 * 
 *   return (
 *     <div
 *       style={{
 *         background: colors.background,
 *         color: colors.primary,
 *         transition: 'all 1s ease-in-out',
 *       }}
 *     >
 *       Seasonal content
 *     </div>
 *   );
 * }
 */
export function useSeasonalTransition(config: SeasonalTransitionConfig = {}) {
  const {
    duration = 1000,
    easing = (t) => t * (2 - t), // easeOut
    season: specifiedSeason,
    autoDetect = true,
  } = config;

  const [currentSeason, setCurrentSeason] = useState<YellowknifeSeason>(
    specifiedSeason || getCurrentSeason()
  );
  const [transitionProgress, setTransitionProgress] = useState(1);
  const [colors, setColors] = useState<SeasonalColors>(SEASONAL_COLORS[currentSeason]);

  // Auto-detect season changes
  useEffect(() => {
    if (!autoDetect || specifiedSeason) return;

    const interval = setInterval(() => {
      const detectedSeason = getCurrentSeason();
      if (detectedSeason !== currentSeason) {
        setTransitionProgress(0);
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easing(progress);

          setTransitionProgress(easedProgress);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCurrentSeason(detectedSeason);
            setColors(SEASONAL_COLORS[detectedSeason]);
            setTransitionProgress(1);
          }
        };

        requestAnimationFrame(animate);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [autoDetect, specifiedSeason, currentSeason, duration, easing]);

  // Update colors when season changes
  useEffect(() => {
    if (specifiedSeason && specifiedSeason !== currentSeason) {
      setCurrentSeason(specifiedSeason);
      setColors(SEASONAL_COLORS[specifiedSeason]);
    }
  }, [specifiedSeason, currentSeason]);

  return {
    colors,
    season: currentSeason,
    transitionProgress,
  };
}

