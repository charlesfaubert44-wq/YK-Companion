'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SwipeNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  enabled?: boolean;
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  enabled = true,
}: SwipeNavigationOptions = {}) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.changedTouches[0].screenX;
      touchStartY.current = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].screenX;
      touchEndY.current = e.changedTouches[0].screenY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const diffX = touchStartX.current - touchEndX.current;
      const diffY = touchStartY.current - touchEndY.current;

      // Check if horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            // Swiped left
            onSwipeLeft?.();
          } else {
            // Swiped right
            onSwipeRight?.();
          }
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold, enabled]);
}

// Hook for page navigation with swipe gestures
export function useSwipePageNavigation(pages: { left?: string; right?: string }) {
  const router = useRouter();

  useSwipeNavigation({
    onSwipeLeft: () => {
      if (pages.left) {
        router.push(pages.left);
      }
    },
    onSwipeRight: () => {
      if (pages.right) {
        router.push(pages.right);
      }
    },
  });
}

// Hook for pull-to-refresh gesture
export function usePullToRefresh(onRefresh: () => void | Promise<void>) {
  const touchStartY = useRef<number>(0);
  const scrollY = useRef<number>(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].screenY;
      scrollY.current = window.scrollY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].screenY;
      const diff = touchY - touchStartY.current;

      // Only trigger if at top of page and pulling down
      if (scrollY.current <= 0 && diff > 100) {
        onRefresh();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onRefresh]);
}

// Hook for long-press gesture
export function useLongPress(
  callback: () => void,
  options: { delay?: number; enabled?: boolean } = {}
) {
  const { delay = 500, enabled = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  const start = (e: TouchEvent | MouseEvent) => {
    if (!enabled) return;

    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  };

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
  };
}

// Hook for double-tap gesture
export function useDoubleTap(callback: () => void, delay = 300) {
  const lastTap = useRef<number>(0);

  const handleTap = () => {
    const now = Date.now();
    const timeSince = now - lastTap.current;

    if (timeSince < delay && timeSince > 0) {
      callback();
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  return {
    onClick: handleTap,
    onTouchEnd: handleTap,
  };
}
