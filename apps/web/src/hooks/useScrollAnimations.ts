/**
 * Scroll Animation Hooks for YK-Companion
 *
 * Provides hooks for scroll-based animations including:
 * - Intersection Observer based animations
 * - Parallax scroll effects
 * - Scroll progress tracking
 * - Staggered list animations
 *
 * @module hooks/useScrollAnimations
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';
import { calculateParallax, getScrollProgress, mapRange } from '@/lib/animations';

/**
 * Configuration for scroll animations
 */
export interface ScrollAnimationConfig {
  /** Root element for intersection observer */
  root?: Element | null;
  /** Root margin (default: '0px') */
  rootMargin?: string;
  /** Threshold for intersection (default: 0.1) */
  threshold?: number;
  /** Whether to trigger animation only once (default: false) */
  triggerOnce?: boolean;
  /** Custom animation callback */
  onAnimate?: (progress: number) => void;
}

/**
 * Hook for scroll-triggered animations using Intersection Observer
 *
 * @param config - Configuration options
 * @returns Animation state and ref
 *
 * @example
 * function AnimatedSection() {
 *   const { ref, isVisible, progress } = useScrollAnimations({
 *     threshold: 0.2,
 *     triggerOnce: true,
 *   });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{
 *         opacity: isVisible ? 1 : 0,
 *         transform: `translateY(${(1 - progress) * 50}px)`,
 *         transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
 *       }}
 *     >
 *       Animated content
 *     </div>
 *   );
 * }
 */
export function useScrollAnimations(config: ScrollAnimationConfig = {}) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = false, onAnimate } = config;

  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const { ref, isIntersecting, intersectionRatio } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce,
    onEnter: entry => {
      setIsVisible(true);
      setProgress(entry.intersectionRatio);
      onAnimate?.(entry.intersectionRatio);
    },
    onChange: entry => {
      setProgress(entry.intersectionRatio);
      onAnimate?.(entry.intersectionRatio);
    },
    onLeave: () => {
      if (!triggerOnce) {
        setIsVisible(false);
        setProgress(0);
      }
    },
  });

  return {
    ref,
    isVisible,
    progress,
    isIntersecting,
  };
}

/**
 * Configuration for parallax effects
 */
export interface ParallaxConfig {
  /** Parallax speed multiplier (default: 0.5) */
  speed?: number;
  /** Minimum scroll position to start effect */
  startOffset?: number;
  /** Maximum scroll position for effect */
  endOffset?: number;
  /** Whether parallax is enabled */
  enabled?: boolean;
}

/**
 * Hook for parallax scroll effects
 *
 * @param config - Configuration options
 * @returns Parallax offset and ref
 *
 * @example
 * function ParallaxBackground() {
 *   const { ref, offset } = useParallax({ speed: 0.5 });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{
 *         transform: `translateY(${offset}px)`,
 *       }}
 *     >
 *       Parallax content
 *     </div>
 *   );
 * }
 */
export function useParallax(config: ParallaxConfig = {}) {
  const { speed = 0.5, startOffset = 0, endOffset = Infinity, enabled = true } = config;

  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      setOffset(0);
      return;
    }

    const handleScroll = () => {
      if (!elementRef.current) return;

      const scrollY = window.scrollY;

      // Check if we're in the valid scroll range
      const elementTop = elementRef.current.getBoundingClientRect().top + scrollY;

      if (scrollY < startOffset || scrollY > endOffset) {
        setOffset(0);
        return;
      }

      const parallaxOffset = calculateParallax(scrollY - elementTop, speed);
      setOffset(parallaxOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, startOffset, endOffset, enabled]);

  const ref = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  return {
    ref,
    offset,
  };
}

/**
 * Configuration for scroll progress tracking
 */
export interface ScrollProgressConfig {
  /** Target element to track (default: window) */
  target?: HTMLElement | Window;
  /** Offset from top to start tracking */
  startOffset?: number;
  /** Offset from bottom to end tracking */
  endOffset?: number;
}

/**
 * Hook to track scroll progress (0-1)
 *
 * @param config - Configuration options
 * @returns Scroll progress value (0 to 1)
 *
 * @example
 * function ScrollIndicator() {
 *   const progress = useScrollProgress();
 *
 *   return (
 *     <div
 *       style={{
 *         width: `${progress * 100}%`,
 *         height: '4px',
 *         background: 'linear-gradient(to right, #00ff88, #4d94ff)',
 *       }}
 *     />
 *   );
 * }
 */
export function useScrollProgress(config: ScrollProgressConfig = {}) {
  const {
    target = typeof window !== 'undefined' ? window : undefined,
    startOffset = 0,
    endOffset = 0,
  } = config;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!target || typeof window === 'undefined') return;

    const handleScroll = () => {
      let scrollTop: number;
      let scrollHeight: number;
      let clientHeight: number;

      if (target === window) {
        scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        scrollHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight,
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
        clientHeight = window.innerHeight;
      } else {
        const element = target as HTMLElement;
        scrollTop = element.scrollTop;
        scrollHeight = element.scrollHeight;
        clientHeight = element.clientHeight;
      }

      const maxScroll = scrollHeight - clientHeight - startOffset - endOffset;
      const currentScroll = Math.max(0, scrollTop - startOffset);
      const calculatedProgress =
        maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;

      setProgress(calculatedProgress);
    };

    // Throttle scroll events
    let rafId: number | null = null;
    const throttledScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    if (target === window) {
      window.addEventListener('scroll', throttledScroll, { passive: true });
    } else {
      (target as HTMLElement).addEventListener('scroll', throttledScroll, { passive: true });
    }

    handleScroll(); // Initial calculation

    return () => {
      if (target === window) {
        window.removeEventListener('scroll', throttledScroll);
      } else {
        (target as HTMLElement).removeEventListener('scroll', throttledScroll);
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [target, startOffset, endOffset]);

  return progress;
}

/**
 * Configuration for staggered animations
 */
export interface StaggerAnimationConfig {
  /** Delay between each item in milliseconds (default: 100) */
  staggerDelay?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection (default: 0.1) */
  threshold?: number;
  /** Total number of items to stagger */
  itemCount: number;
}

/**
 * Hook for staggered list animations
 *
 * @param config - Configuration options
 * @returns Array of refs and animation states for each item
 *
 * @example
 * function StaggeredList({ items }: { items: string[] }) {
 *   const { refs, states } = useStaggerAnimation({
 *     itemCount: items.length,
 *     staggerDelay: 100,
 *   });
 *
 *   return (
 *     <>
 *       {items.map((item, index) => (
 *         <div
 *           key={index}
 *           ref={refs[index]}
 *           style={{
 *             opacity: states[index] ? 1 : 0,
 *             transform: states[index] ? 'translateY(0)' : 'translateY(20px)',
 *             transition: `opacity 0.6s ease-out ${index * 100}ms, transform 0.6s ease-out ${index * 100}ms`,
 *           }}
 *         >
 *           {item}
 *         </div>
 *       ))}
 *     </>
 *   );
 * }
 */
export function useStaggerAnimation(config: StaggerAnimationConfig) {
  const { staggerDelay = 100, rootMargin = '0px', threshold = 0.1, itemCount } = config;

  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create a single observer for all items
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const index = refs.current.indexOf(entry.target as HTMLElement);
          if (index === -1) return;

          if (entry.isIntersecting) {
            // Stagger the visibility with delay
            setTimeout(() => {
              setVisibleItems(prev => new Set(prev).add(index));
            }, index * staggerDelay);
          } else {
            setVisibleItems(prev => {
              const next = new Set(prev);
              next.delete(index);
              return next;
            });
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    // Observe all items
    refs.current.forEach(ref => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [staggerDelay, rootMargin, threshold, itemCount]);

  // Create refs for each item
  const createRef = useCallback((index: number) => {
    return (node: HTMLElement | null) => {
      if (node) {
        refs.current[index] = node;
      }
    };
  }, []);

  const refsArray = Array.from({ length: itemCount }, (_, index) => createRef(index));

  return {
    refs: refsArray,
    states: Array.from({ length: itemCount }, (_, index) => visibleItems.has(index)),
  };
}
