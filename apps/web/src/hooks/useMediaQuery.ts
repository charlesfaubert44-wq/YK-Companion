/**
 * Custom React hook for responsive media queries
 * Provides mobile-first breakpoint utilities
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if a media query matches
 * @param query - Media query string
 * @returns True if media query matches
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (modern browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

/**
 * Convenience hooks for common breakpoints
 */

/**
 * Check if viewport is mobile size (< 640px)
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) return <MobileView />;
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

/**
 * Check if viewport is tablet size (640px - 1023px)
 * @example
 * const isTablet = useIsTablet();
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

/**
 * Check if viewport is desktop size (>= 1024px)
 * @example
 * const isDesktop = useIsDesktop();
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/**
 * Check if user prefers dark mode
 * @example
 * const prefersDark = usePrefersDarkMode();
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Check if user prefers reduced motion (accessibility)
 * @example
 * const prefersReducedMotion = usePrefersReducedMotion();
 * if (!prefersReducedMotion) {
 *   // Only show animations if user hasn't requested reduced motion
 * }
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
