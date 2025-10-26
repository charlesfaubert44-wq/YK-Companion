/**
 * Animation Utilities for YK-Companion
 *
 * This module provides animation utilities including easing functions,
 * CSS transform helpers, and animation frame management.
 *
 * @module lib/animations
 */

/**
 * Easing function type
 */
export type EasingFunction = (t: number) => number;

/**
 * Animation frame callback
 */
export type AnimationCallback = (progress: number) => void;

/**
 * CSS Transform properties
 */
export interface Transform {
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  skewX?: number;
  skewY?: number;
}

/**
 * Spring animation configuration
 */
export interface SpringConfig {
  /** Spring stiffness (default: 170) */
  stiffness?: number;
  /** Damping ratio (default: 26) */
  damping?: number;
  /** Mass (default: 1) */
  mass?: number;
  /** Velocity (default: 0) */
  velocity?: number;
}

// =============================================================================
// Easing Functions
// =============================================================================

/**
 * Linear easing (no acceleration)
 * @param t - Progress from 0 to 1
 * @returns Eased value
 */
export const linear: EasingFunction = (t: number) => t;

/**
 * Ease in (slow start)
 * @param t - Progress from 0 to 1
 * @returns Eased value
 */
export const easeIn: EasingFunction = (t: number) => t * t;

/**
 * Ease out (slow end)
 * @param t - Progress from 0 to 1
 * @returns Eased value
 */
export const easeOut: EasingFunction = (t: number) => t * (2 - t);

/**
 * Ease in-out (slow start and end)
 * @param t - Progress from 0 to 1
 * @returns Eased value
 */
export const easeInOut: EasingFunction = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

/**
 * Cubic ease in
 * @param t - Progress from 0 to 1
 * @returns Eased value
 */
export const easeInCubic: EasingFunction = (t: number) => t * t * t;

/**
 * Cubic ease out
 * @param t - Progress from 0 to 1
 * @returns Eased value
 */
export const easeOutCubic: EasingFunction = (t: number) => --t * t * t + 1;

/**
 * Cubic ease in-out
 * @param t - Progress from 0 to 1
 * @returns Eased value
 */
export const easeInOutCubic: EasingFunction = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

/**
 * Elastic ease out (bounces at the end)
 * @param t - Progress from 0 to 1
 * @returns Eased value
 */
export const easeOutElastic: EasingFunction = (t: number) => {
  const p = 0.3;
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
};

/**
 * Bounce ease out
 * @param t - Progress from 0 to 1
 * @returns Eased value
 */
export const easeOutBounce: EasingFunction = (t: number) => {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  } else {
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
};

/**
 * Back ease in (overshoots slightly at start)
 * @param t - Progress from 0 to 1
 * @returns Eased value
 */
export const easeInBack: EasingFunction = (t: number) => {
  const s = 1.70158;
  return t * t * ((s + 1) * t - s);
};

/**
 * Back ease out (overshoots slightly at end)
 * @param t - Progress from 0 to 1
 * @returns Eased value
 */
export const easeOutBack: EasingFunction = (t: number) => {
  const s = 1.70158;
  return --t * t * ((s + 1) * t + s) + 1;
};

/**
 * Spring physics-based easing
 * Creates natural spring motion with configurable physics
 *
 * @param config - Spring configuration
 * @returns Easing function
 *
 * @example
 * const bouncy = spring({ stiffness: 300, damping: 20 });
 * const value = bouncy(progress);
 */
export function spring(config: SpringConfig = {}): EasingFunction {
  const { stiffness = 170, damping = 26, mass = 1, velocity = 0 } = config;

  return (t: number) => {
    const w0 = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));

    if (zeta < 1) {
      // Underdamped
      const wd = w0 * Math.sqrt(1 - zeta * zeta);
      const A = 1;
      const B = (zeta * w0 + velocity) / wd;
      return (
        1 -
        Math.exp(-zeta * w0 * t) * (A * Math.cos(wd * t) + B * Math.sin(wd * t))
      );
    } else if (zeta === 1) {
      // Critically damped
      return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
    } else {
      // Overdamped
      const r1 = -w0 * (zeta - Math.sqrt(zeta * zeta - 1));
      const r2 = -w0 * (zeta + Math.sqrt(zeta * zeta - 1));
      const A = (velocity - r2) / (r1 - r2);
      const B = 1 - A;
      return 1 - (A * Math.exp(r1 * t) + B * Math.exp(r2 * t));
    }
  };
}

// =============================================================================
// CSS Transform Helpers
// =============================================================================

/**
 * Generate CSS transform string from transform properties
 *
 * @param transform - Transform properties
 * @returns CSS transform string
 *
 * @example
 * const transform = createTransform({ x: 100, y: 50, scale: 1.2, rotate: 45 });
 * element.style.transform = transform;
 * // Result: "translateX(100px) translateY(50px) scale(1.2) rotate(45deg)"
 */
export function createTransform(transform: Transform): string {
  const parts: string[] = [];

  if (transform.x !== undefined) parts.push(`translateX(${transform.x}px)`);
  if (transform.y !== undefined) parts.push(`translateY(${transform.y}px)`);
  if (transform.z !== undefined) parts.push(`translateZ(${transform.z}px)`);

  if (transform.scaleX !== undefined) parts.push(`scaleX(${transform.scaleX})`);
  if (transform.scaleY !== undefined) parts.push(`scaleY(${transform.scaleY})`);
  if (transform.scale !== undefined) parts.push(`scale(${transform.scale})`);

  if (transform.rotate !== undefined) parts.push(`rotate(${transform.rotate}deg)`);
  if (transform.rotateX !== undefined)
    parts.push(`rotateX(${transform.rotateX}deg)`);
  if (transform.rotateY !== undefined)
    parts.push(`rotateY(${transform.rotateY}deg)`);
  if (transform.rotateZ !== undefined)
    parts.push(`rotateZ(${transform.rotateZ}deg)`);

  if (transform.skewX !== undefined) parts.push(`skewX(${transform.skewX}deg)`);
  if (transform.skewY !== undefined) parts.push(`skewY(${transform.skewY}deg)`);

  return parts.join(' ');
}

/**
 * Apply transform to an element
 *
 * @param element - HTML element to transform
 * @param transform - Transform properties
 *
 * @example
 * applyTransform(element, { x: 100, scale: 1.2 });
 */
export function applyTransform(
  element: HTMLElement,
  transform: Transform
): void {
  element.style.transform = createTransform(transform);
}

/**
 * Interpolate between two transform states
 *
 * @param from - Starting transform
 * @param to - Ending transform
 * @param progress - Progress from 0 to 1
 * @returns Interpolated transform
 *
 * @example
 * const current = interpolateTransform(
 *   { x: 0, scale: 1 },
 *   { x: 100, scale: 1.5 },
 *   0.5
 * );
 * // Result: { x: 50, scale: 1.25 }
 */
export function interpolateTransform(
  from: Transform,
  to: Transform,
  progress: number
): Transform {
  const result: Transform = {};

  const keys = new Set([...Object.keys(from), ...Object.keys(to)]) as Set<
    keyof Transform
  >;

  keys.forEach((key) => {
    const fromValue = from[key] ?? (key.includes('scale') ? 1 : 0);
    const toValue = to[key] ?? (key.includes('scale') ? 1 : 0);
    result[key] = fromValue + (toValue - fromValue) * progress;
  });

  return result;
}

// =============================================================================
// Animation Frame Utilities
// =============================================================================

/**
 * Animate a value over time using requestAnimationFrame
 *
 * @param duration - Duration in milliseconds
 * @param callback - Function called on each frame with progress (0-1)
 * @param easing - Easing function (default: easeInOut)
 * @returns Cancel function to stop the animation
 *
 * @example
 * const cancel = animate(1000, (progress) => {
 *   element.style.opacity = String(progress);
 * }, easeOutCubic);
 *
 * // Cancel animation if needed
 * cancel();
 */
export function animate(
  duration: number,
  callback: AnimationCallback,
  easing: EasingFunction = easeInOut
): () => void {
  let startTime: number | null = null;
  let rafId: number | null = null;
  let cancelled = false;

  const step = (timestamp: number) => {
    if (cancelled) return;

    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(rawProgress);

    callback(easedProgress);

    if (rawProgress < 1) {
      rafId = requestAnimationFrame(step);
    }
  };

  rafId = requestAnimationFrame(step);

  return () => {
    cancelled = true;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  };
}

/**
 * Throttle function using requestAnimationFrame
 * Ensures function is called at most once per frame
 *
 * @param fn - Function to throttle
 * @returns Throttled function
 *
 * @example
 * const handleScroll = rafThrottle(() => {
 *   console.log('Scroll position:', window.scrollY);
 * });
 *
 * window.addEventListener('scroll', handleScroll);
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function throttled(...args: Parameters<T>) {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = null;
    });
  };
}

// =============================================================================
// Scroll Animation Utilities
// =============================================================================

/**
 * Smooth scroll to a position
 *
 * @param target - Target scroll position or element
 * @param duration - Duration in milliseconds (default: 500)
 * @param easing - Easing function (default: easeInOutCubic)
 * @returns Promise that resolves when scroll is complete
 *
 * @example
 * // Scroll to position
 * await smoothScrollTo(1000, 500);
 *
 * // Scroll to element
 * await smoothScrollTo(document.getElementById('section'));
 */
export function smoothScrollTo(
  target: number | HTMLElement,
  duration: number = 500,
  easing: EasingFunction = easeInOutCubic
): Promise<void> {
  return new Promise((resolve) => {
    const startY = window.scrollY;
    const targetY =
      typeof target === 'number' ? target : target.getBoundingClientRect().top + startY;

    const distance = targetY - startY;

    animate(
      duration,
      (progress) => {
        window.scrollTo(0, startY + distance * progress);
        if (progress === 1) resolve();
      },
      easing
    );
  });
}

/**
 * Get scroll progress of an element (0-1)
 *
 * @param element - Element to check scroll progress
 * @returns Scroll progress from 0 (top) to 1 (bottom)
 *
 * @example
 * const progress = getScrollProgress(document.documentElement);
 * console.log(`Page is ${progress * 100}% scrolled`);
 */
export function getScrollProgress(element: HTMLElement = document.documentElement): number {
  const scrollTop = element.scrollTop;
  const scrollHeight = element.scrollHeight - element.clientHeight;

  if (scrollHeight === 0) return 0;

  return Math.max(0, Math.min(1, scrollTop / scrollHeight));
}

// =============================================================================
// Intersection-Based Animation Utilities
// =============================================================================

/**
 * Configuration for intersection animations
 */
export interface IntersectionAnimationConfig {
  /** Root element for intersection observer (default: null) */
  root?: Element | null;
  /** Root margin (default: '0px') */
  rootMargin?: string;
  /** Intersection threshold (default: 0.1) */
  threshold?: number;
  /** Animation class to add when visible (default: 'animate-in') */
  animateClass?: string;
  /** Whether to animate only once (default: true) */
  once?: boolean;
}

/**
 * Create an intersection observer for animations
 * This is a helper for the useIntersectionObserver hook
 *
 * @param callback - Callback when intersection changes
 * @param config - Configuration options
 * @returns IntersectionObserver instance
 *
 * @example
 * const observer = createIntersectionAnimationObserver(
 *   (entry) => {
 *     if (entry.isIntersecting) {
 *       entry.target.classList.add('fade-in');
 *     }
 *   },
 *   { threshold: 0.5 }
 * );
 *
 * observer.observe(element);
 */
export function createIntersectionAnimationObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  config: IntersectionAnimationConfig = {}
): IntersectionObserver {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0.1,
  } = config;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      root,
      rootMargin,
      threshold,
    }
  );
}

/**
 * Calculate parallax offset based on scroll position
 *
 * @param scrollY - Current scroll Y position
 * @param speed - Parallax speed multiplier (default: 0.5)
 * @returns Parallax offset in pixels
 *
 * @example
 * const offset = calculateParallax(window.scrollY, 0.5);
 * element.style.transform = `translateY(${offset}px)`;
 */
export function calculateParallax(scrollY: number, speed: number = 0.5): number {
  return scrollY * speed;
}

/**
 * Map a value from one range to another
 * Useful for animation calculations
 *
 * @param value - Input value
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns Mapped value
 *
 * @example
 * const opacity = mapRange(scrollY, 0, 500, 1, 0);
 * element.style.opacity = String(opacity);
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const clampedValue = Math.max(inMin, Math.min(inMax, value));
  return ((clampedValue - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
