/**
 * Carousel Hook for YK-Companion
 *
 * A comprehensive hook for managing carousel state with support for:
 * - Auto-advance with pause on interaction
 * - Swipe navigation
 * - Preloading adjacent slides
 * - Infinite looping
 * - Keyboard navigation
 *
 * @module hooks/useCarousel
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Carousel configuration options
 */
export interface CarouselOptions {
  /** Total number of items in the carousel */
  itemCount: number;
  /** Initial active index (default: 0) */
  initialIndex?: number;
  /** Auto-advance interval in milliseconds (0 to disable, default: 0) */
  autoAdvanceInterval?: number;
  /** Whether to loop back to start when reaching the end (default: true) */
  loop?: boolean;
  /** Whether to pause auto-advance on hover (default: true) */
  pauseOnHover?: boolean;
  /** Whether to pause auto-advance on interaction (default: true) */
  pauseOnInteraction?: boolean;
  /** Duration to pause after interaction in ms (default: 5000) */
  pauseDuration?: number;
  /** Callback when slide changes */
  onChange?: (index: number) => void;
  /** Preload strategy: 'adjacent' | 'all' | 'none' (default: 'adjacent') */
  preloadStrategy?: 'adjacent' | 'all' | 'none';
}

/**
 * Carousel state and controls
 */
export interface CarouselControls {
  /** Current active index */
  currentIndex: number;
  /** Go to next item */
  next: () => void;
  /** Go to previous item */
  prev: () => void;
  /** Go to specific index */
  goTo: (index: number) => void;
  /** Whether carousel is currently auto-advancing */
  isAutoPlaying: boolean;
  /** Pause auto-advance */
  pause: () => void;
  /** Resume auto-advance */
  resume: () => void;
  /** Manually trigger interaction pause */
  onInteraction: () => void;
  /** Get indices to preload based on strategy */
  getPreloadIndices: () => number[];
  /** Check if an index should be preloaded */
  shouldPreload: (index: number) => boolean;
  /** Props for the carousel container */
  containerProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onTouchStart: () => void;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
}

/**
 * Hook for managing carousel state and interactions
 *
 * @param options - Carousel configuration options
 * @returns Carousel controls and state
 *
 * @example
 * function ImageCarousel({ images }: { images: string[] }) {
 *   const carousel = useCarousel({
 *     itemCount: images.length,
 *     autoAdvanceInterval: 3000,
 *     loop: true,
 *   });
 *
 *   return (
 *     <div {...carousel.containerProps}>
 *       <img src={images[carousel.currentIndex]} alt="" />
 *       <button onClick={carousel.prev}>Previous</button>
 *       <button onClick={carousel.next}>Next</button>
 *       {images.map((_, idx) => (
 *         <button
 *           key={idx}
 *           onClick={() => carousel.goTo(idx)}
 *           aria-current={idx === carousel.currentIndex}
 *         >
 *           {idx + 1}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 */
export function useCarousel(options: CarouselOptions): CarouselControls {
  const {
    itemCount,
    initialIndex = 0,
    autoAdvanceInterval = 0,
    loop = true,
    pauseOnHover = true,
    pauseOnInteraction = true,
    pauseDuration = 5000,
    onChange,
    preloadStrategy = 'adjacent',
  } = options;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoAdvanceInterval > 0);
  const [isPaused, setIsPaused] = useState(false);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Navigate to a specific index
   */
  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= itemCount) {
        if (!loop) return;
        // Handle looping
        if (index < 0) {
          index = itemCount - 1;
        } else {
          index = 0;
        }
      }

      setCurrentIndex(index);
      onChange?.(index);
    },
    [itemCount, loop, onChange]
  );

  /**
   * Navigate to next item
   */
  const next = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  /**
   * Navigate to previous item
   */
  const prev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  /**
   * Pause auto-advance
   */
  const pause = useCallback(() => {
    setIsPaused(true);
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  /**
   * Resume auto-advance
   */
  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  /**
   * Handle user interaction (pauses auto-advance temporarily)
   */
  const onInteraction = useCallback(() => {
    if (!pauseOnInteraction) return;

    pause();

    // Clear existing pause timer
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    // Resume after pause duration
    pauseTimerRef.current = setTimeout(() => {
      resume();
    }, pauseDuration);
  }, [pause, resume, pauseDuration, pauseOnInteraction]);

  /**
   * Get indices to preload based on strategy
   */
  const getPreloadIndices = useCallback((): number[] => {
    if (preloadStrategy === 'none') return [];
    if (preloadStrategy === 'all') {
      return Array.from({ length: itemCount }, (_, i) => i);
    }

    // Adjacent strategy: preload prev and next
    const indices: number[] = [];

    const prevIndex = currentIndex - 1;
    const nextIndex = currentIndex + 1;

    if (loop) {
      indices.push((prevIndex + itemCount) % itemCount);
      indices.push(nextIndex % itemCount);
    } else {
      if (prevIndex >= 0) indices.push(prevIndex);
      if (nextIndex < itemCount) indices.push(nextIndex);
    }

    return indices;
  }, [currentIndex, itemCount, loop, preloadStrategy]);

  /**
   * Check if an index should be preloaded
   */
  const shouldPreload = useCallback(
    (index: number): boolean => {
      return getPreloadIndices().includes(index);
    },
    [getPreloadIndices]
  );

  /**
   * Auto-advance effect
   */
  useEffect(() => {
    if (!isAutoPlaying || isPaused || autoAdvanceInterval <= 0) {
      return;
    }

    autoPlayTimerRef.current = setTimeout(() => {
      next();
    }, autoAdvanceInterval);

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, isPaused, autoAdvanceInterval, next]);

  /**
   * Cleanup effect
   */
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          onInteraction();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          onInteraction();
          break;
        case 'Home':
          e.preventDefault();
          goTo(0);
          onInteraction();
          break;
        case 'End':
          e.preventDefault();
          goTo(itemCount - 1);
          onInteraction();
          break;
      }
    },
    [prev, next, goTo, itemCount, onInteraction]
  );

  /**
   * Container props for automatic event handling
   */
  const containerProps = {
    onMouseEnter: pauseOnHover ? pause : () => {},
    onMouseLeave: pauseOnHover ? resume : () => {},
    onTouchStart: onInteraction,
    tabIndex: 0,
    onKeyDown: handleKeyDown,
  };

  return {
    currentIndex,
    next,
    prev,
    goTo,
    isAutoPlaying,
    pause,
    resume,
    onInteraction,
    getPreloadIndices,
    shouldPreload,
    containerProps,
  };
}

/**
 * Hook for carousel with swipe navigation
 * Combines useCarousel with swipe detection
 *
 * @param options - Carousel configuration options
 * @returns Carousel controls with swipe handlers
 *
 * @example
 * function SwipeCarousel({ items }: { items: any[] }) {
 *   const carousel = useCarouselWithSwipe({
 *     itemCount: items.length,
 *     autoAdvanceInterval: 3000,
 *   });
 *
 *   return (
 *     <div {...carousel.containerProps} {...carousel.swipeHandlers}>
 *       {items[carousel.currentIndex]}
 *     </div>
 *   );
 * }
 */
export function useCarouselWithSwipe(
  options: CarouselOptions
): CarouselControls & {
  swipeHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
} {
  const carousel = useCarousel(options);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    carousel.onInteraction();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;

    const minSwipeDistance = 50;

    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swiped left (next)
          carousel.next();
        } else {
          // Swiped right (prev)
          carousel.prev();
        }
      }
    }
  };

  return {
    ...carousel,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

/**
 * Hook for tracking carousel visibility for analytics
 *
 * @param currentIndex - Current carousel index
 * @param itemCount - Total number of items
 * @param onSlideView - Callback when a slide is viewed
 *
 * @example
 * function TrackedCarousel({ items }: { items: any[] }) {
 *   const carousel = useCarousel({ itemCount: items.length });
 *
 *   useCarouselTracking(carousel.currentIndex, items.length, (index) => {
 *     console.log(`Viewed slide ${index}`);
 *   });
 *
 *   return <div>{items[carousel.currentIndex]}</div>;
 * }
 */
export function useCarouselTracking(
  currentIndex: number,
  itemCount: number,
  onSlideView?: (index: number, viewDuration: number) => void
): void {
  const viewStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const startTime = Date.now();
    viewStartTime.current = startTime;

    return () => {
      const duration = Date.now() - startTime;
      onSlideView?.(currentIndex, duration);
    };
  }, [currentIndex, onSlideView]);
}
