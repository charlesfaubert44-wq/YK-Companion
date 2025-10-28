/**
 * Custom React hook to detect when an element is visible on screen
 * Useful for lazy loading, animations, and analytics
 */

'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

/**
 * Hook to detect if an element is visible on screen using Intersection Observer
 * @param options - Intersection Observer options
 * @returns [ref, isVisible] tuple
 * @example
 * const [ref, isVisible] = useOnScreen({ threshold: 0.5 });
 *
 * return (
 *   <div ref={ref}>
 *     {isVisible && <AnimatedContent />}
 *   </div>
 * );
 */
export function useOnScreen<T extends Element = Element>(
  options?: IntersectionObserverInit
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, isVisible];
}

/**
 * Hook to detect if element was visible at least once (doesn't toggle back to false)
 * Perfect for triggering animations that should only play once
 * @param options - Intersection Observer options
 * @returns [ref, wasVisible] tuple
 * @example
 * const [ref, wasVisible] = useOnScreenOnce();
 *
 * return (
 *   <div ref={ref} className={wasVisible ? 'animate-fade-in' : ''}>
 *     Content that animates once
 *   </div>
 * );
 */
export function useOnScreenOnce<T extends Element = Element>(
  options?: IntersectionObserverInit
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [wasVisible, setWasVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || wasVisible) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setWasVisible(true);
        observer.disconnect(); // Stop observing once visible
      }
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [options, wasVisible]);

  return [ref, wasVisible];
}
