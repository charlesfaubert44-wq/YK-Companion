/**
 * Swipe Gesture Hook for YK-Companion
 *
 * Provides comprehensive swipe gesture detection with configurable
 * thresholds, velocity detection, and direction filtering.
 *
 * @module hooks/useSwipe
 */

'use client';

import { useRef, useCallback } from 'react';
import type { TouchPoint, SwipeDirection, SwipeConfig } from '@/lib/gestures';
import { detectSwipe, getTouchPoint } from '@/lib/gestures';

/**
 * Swipe event handlers
 */
export interface SwipeHandlers {
  /** Called when any swipe is detected */
  onSwipe?: (direction: SwipeDirection, velocity: number) => void;
  /** Called when swiping left */
  onSwipeLeft?: () => void;
  /** Called when swiping right */
  onSwipeRight?: () => void;
  /** Called when swiping up */
  onSwipeUp?: () => void;
  /** Called when swiping down */
  onSwipeDown?: () => void;
  /** Called when swipe starts */
  onSwipeStart?: (point: TouchPoint) => void;
  /** Called during swipe (for progress tracking) */
  onSwipeMove?: (deltaX: number, deltaY: number) => void;
  /** Called when swipe ends (even if not a valid swipe) */
  onSwipeEnd?: (point: TouchPoint) => void;
}

/**
 * Swipe hook options
 */
export interface UseSwipeOptions extends SwipeConfig, SwipeHandlers {
  /** Whether to prevent default touch behavior (default: true) */
  preventDefault?: boolean;
  /** Whether to stop event propagation (default: false) */
  stopPropagation?: boolean;
  /** Enable hook (default: true) */
  enabled?: boolean;
}

/**
 * Swipe hook return value
 */
export interface UseSwipeReturn {
  /** Handlers to spread on the target element */
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchCancel: (e: React.TouchEvent) => void;
  };
  /** Whether a swipe is currently in progress */
  isSwiping: boolean;
}

/**
 * Hook for detecting swipe gestures on an element
 *
 * @param options - Swipe detection options and handlers
 * @returns Swipe handlers and state
 *
 * @example
 * function SwipeCard() {
 *   const swipe = useSwipe({
 *     onSwipeLeft: () => console.log('Swiped left'),
 *     onSwipeRight: () => console.log('Swiped right'),
 *     threshold: 100,
 *   });
 *
 *   return (
 *     <div {...swipe.handlers} className="swipeable-card">
 *       Swipe me!
 *     </div>
 *   );
 * }
 */
export function useSwipe(options: UseSwipeOptions = {}): UseSwipeReturn {
  const {
    onSwipe,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd,
    preventDefault = true,
    stopPropagation = false,
    enabled = true,
    ...swipeConfig
  } = options;

  const startPoint = useRef<TouchPoint | null>(null);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();

      const touch = e.touches[0];
      const point = getTouchPoint(touch);

      startPoint.current = point;
      isSwiping.current = true;

      onSwipeStart?.(point);
    },
    [enabled, preventDefault, stopPropagation, onSwipeStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !startPoint.current) return;

      const touch = e.touches[0];
      const currentPoint = getTouchPoint(touch);

      const deltaX = currentPoint.x - startPoint.current.x;
      const deltaY = currentPoint.y - startPoint.current.y;

      onSwipeMove?.(deltaX, deltaY);
    },
    [enabled, onSwipeMove]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !startPoint.current) return;

      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();

      const touch = e.changedTouches[0];
      const endPoint = getTouchPoint(touch);

      onSwipeEnd?.(endPoint);

      const gesture = detectSwipe(startPoint.current, endPoint, swipeConfig);

      if (gesture) {
        onSwipe?.(gesture.direction, gesture.velocity);

        switch (gesture.direction) {
          case 'left':
            onSwipeLeft?.();
            break;
          case 'right':
            onSwipeRight?.();
            break;
          case 'up':
            onSwipeUp?.();
            break;
          case 'down':
            onSwipeDown?.();
            break;
        }
      }

      startPoint.current = null;
      isSwiping.current = false;
    },
    [
      enabled,
      preventDefault,
      stopPropagation,
      onSwipeEnd,
      onSwipe,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      swipeConfig,
    ]
  );

  const handleTouchCancel = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      startPoint.current = null;
      isSwiping.current = false;

      const touch = e.changedTouches[0];
      const point = getTouchPoint(touch);
      onSwipeEnd?.(point);
    },
    [enabled, onSwipeEnd]
  );

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    },
    isSwiping: isSwiping.current,
  };
}

/**
 * Hook for horizontal-only swipes (common for carousels)
 *
 * @param onSwipeLeft - Callback when swiping left
 * @param onSwipeRight - Callback when swiping right
 * @param options - Additional swipe options
 * @returns Swipe handlers
 *
 * @example
 * function Carousel() {
 *   const swipe = useHorizontalSwipe(
 *     () => nextSlide(),
 *     () => prevSlide(),
 *     { threshold: 75 }
 *   );
 *
 *   return <div {...swipe.handlers}>Carousel content</div>;
 * }
 */
export function useHorizontalSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  options?: Omit<UseSwipeOptions, 'onSwipeLeft' | 'onSwipeRight' | 'onSwipeUp' | 'onSwipeDown'>
): UseSwipeReturn {
  return useSwipe({
    ...options,
    onSwipeLeft,
    onSwipeRight,
    // Ignore vertical swipes
    onSwipeUp: undefined,
    onSwipeDown: undefined,
  });
}

/**
 * Hook for vertical-only swipes (common for scroll interactions)
 *
 * @param onSwipeUp - Callback when swiping up
 * @param onSwipeDown - Callback when swiping down
 * @param options - Additional swipe options
 * @returns Swipe handlers
 *
 * @example
 * function VerticalScroller() {
 *   const swipe = useVerticalSwipe(
 *     () => console.log('Swiped up'),
 *     () => console.log('Swiped down')
 *   );
 *
 *   return <div {...swipe.handlers}>Swipeable content</div>;
 * }
 */
export function useVerticalSwipe(
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  options?: Omit<UseSwipeOptions, 'onSwipeLeft' | 'onSwipeRight' | 'onSwipeUp' | 'onSwipeDown'>
): UseSwipeReturn {
  return useSwipe({
    ...options,
    onSwipeUp,
    onSwipeDown,
    // Ignore horizontal swipes
    onSwipeLeft: undefined,
    onSwipeRight: undefined,
  });
}

/**
 * Hook for swipe-to-dismiss pattern (like iOS notifications)
 *
 * @param onDismiss - Callback when item is dismissed
 * @param options - Swipe options
 * @returns Swipe handlers and dismiss state
 *
 * @example
 * function DismissableCard() {
 *   const dismiss = useSwipeToDismiss(() => {
 *     console.log('Card dismissed');
 *   });
 *
 *   return (
 *     <div
 *       {...dismiss.handlers}
 *       style={{
 *         transform: `translateX(${dismiss.swipeProgress}px)`,
 *         opacity: 1 - Math.abs(dismiss.swipeProgress) / 300,
 *       }}
 *     >
 *       Swipe to dismiss
 *     </div>
 *   );
 * }
 */
export function useSwipeToDismiss(
  onDismiss: (direction: 'left' | 'right') => void,
  options?: UseSwipeOptions
): UseSwipeReturn & {
  swipeProgress: number;
  isDismissed: boolean;
} {
  const swipeProgress = useRef(0);
  const isDismissed = useRef(false);

  const swipe = useSwipe({
    ...options,
    onSwipeMove: (deltaX) => {
      swipeProgress.current = deltaX;
    },
    onSwipe: (direction) => {
      if (direction === 'left' || direction === 'right') {
        isDismissed.current = true;
        onDismiss(direction);
      }
    },
  });

  return {
    ...swipe,
    swipeProgress: swipeProgress.current,
    isDismissed: isDismissed.current,
  };
}

/**
 * Hook for pull-to-refresh gesture
 *
 * @param onRefresh - Callback when refresh is triggered
 * @param options - Pull-to-refresh options
 * @returns Pull handlers and state
 *
 * @example
 * function RefreshableList() {
 *   const refresh = usePullToRefresh(async () => {
 *     await fetchNewData();
 *   });
 *
 *   return (
 *     <div {...refresh.handlers}>
 *       {refresh.isRefreshing && <Spinner />}
 *       <div style={{ transform: `translateY(${refresh.pullDistance}px)` }}>
 *         Content
 *       </div>
 *     </div>
 *   );
 * }
 */
export function usePullToRefresh(
  onRefresh: () => void | Promise<void>,
  options?: {
    threshold?: number;
    maxPull?: number;
    enabled?: boolean;
  }
): {
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  pullDistance: number;
  isRefreshing: boolean;
} {
  const { threshold = 80, maxPull = 120, enabled = true } = options || {};

  const pullDistance = useRef(0);
  const isRefreshing = useRef(false);
  const startY = useRef(0);
  const scrollY = useRef(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      startY.current = e.touches[0].clientY;
      scrollY.current = window.scrollY;
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || scrollY.current > 0) return;

      const currentY = e.touches[0].clientY;
      const delta = currentY - startY.current;

      if (delta > 0) {
        pullDistance.current = Math.min(delta, maxPull);
      }
    },
    [enabled, maxPull]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!enabled) return;

    if (pullDistance.current >= threshold) {
      isRefreshing.current = true;
      await onRefresh();
      isRefreshing.current = false;
    }

    pullDistance.current = 0;
  }, [enabled, threshold, onRefresh]);

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    pullDistance: pullDistance.current,
    isRefreshing: isRefreshing.current,
  };
}
