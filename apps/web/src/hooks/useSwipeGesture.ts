import { useEffect, useRef, useState, RefObject } from 'react';
import { hapticFeedback, hapticSuccess } from '@/lib/mobile';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  velocityThreshold?: number;
  enableHaptics?: boolean;
}

interface SwipeState {
  isSwiping: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  deltaX: number;
  deltaY: number;
  velocity: number;
}

export function useSwipeGesture(elementRef: RefObject<HTMLElement>, options: SwipeGestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocityThreshold = 0.3,
    enableHaptics = true,
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    deltaX: 0,
    deltaY: 0,
    velocity: 0,
  });

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Calculate velocity
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / deltaTime;

      // Determine primary direction
      let direction: 'left' | 'right' | 'up' | 'down' | null = null;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      setSwipeState({
        isSwiping: true,
        direction,
        deltaX,
        deltaY,
        velocity,
      });

      // Haptic feedback when swipe starts
      if (enableHaptics && distance > 20 && !swipeState.isSwiping) {
        hapticFeedback();
      }
    };

    const handleTouchEnd = () => {
      if (!touchStartRef.current || !swipeState.isSwiping) {
        touchStartRef.current = null;
        setSwipeState({
          isSwiping: false,
          direction: null,
          deltaX: 0,
          deltaY: 0,
          velocity: 0,
        });
        return;
      }

      const { deltaX, deltaY, velocity, direction } = swipeState;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Check if swipe meets threshold requirements
      if (velocity > velocityThreshold) {
        if (direction === 'left' && absX > threshold && onSwipeLeft) {
          if (enableHaptics) hapticSuccess();
          onSwipeLeft();
        } else if (direction === 'right' && absX > threshold && onSwipeRight) {
          if (enableHaptics) hapticSuccess();
          onSwipeRight();
        } else if (direction === 'up' && absY > threshold && onSwipeUp) {
          if (enableHaptics) hapticSuccess();
          onSwipeUp();
        } else if (direction === 'down' && absY > threshold && onSwipeDown) {
          if (enableHaptics) hapticSuccess();
          onSwipeDown();
        }
      }

      touchStartRef.current = null;
      setSwipeState({
        isSwiping: false,
        direction: null,
        deltaX: 0,
        deltaY: 0,
        velocity: 0,
      });
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    elementRef,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold,
    velocityThreshold,
    enableHaptics,
    swipeState.isSwiping,
  ]);

  return swipeState;
}

// Hook for long press gesture
interface LongPressOptions {
  onLongPress: () => void;
  delay?: number;
  enableHaptics?: boolean;
}

export function useLongPress(elementRef: RefObject<HTMLElement>, options: LongPressOptions) {
  const { onLongPress, delay = 500, enableHaptics = true } = options;
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleStart = () => {
      timeoutRef.current = setTimeout(() => {
        if (enableHaptics) hapticSuccess();
        setIsLongPressing(true);
        onLongPress();
      }, delay);
    };

    const handleEnd = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsLongPressing(false);
    };

    element.addEventListener('touchstart', handleStart);
    element.addEventListener('touchend', handleEnd);
    element.addEventListener('touchcancel', handleEnd);
    element.addEventListener('mousedown', handleStart);
    element.addEventListener('mouseup', handleEnd);
    element.addEventListener('mouseleave', handleEnd);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('touchend', handleEnd);
      element.removeEventListener('touchcancel', handleEnd);
      element.removeEventListener('mousedown', handleStart);
      element.removeEventListener('mouseup', handleEnd);
      element.removeEventListener('mouseleave', handleEnd);
    };
  }, [elementRef, onLongPress, delay, enableHaptics]);

  return isLongPressing;
}

// Hook for pull-to-refresh gesture
interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  enableHaptics?: boolean;
}

export function usePullToRefresh(
  elementRef: RefObject<HTMLElement>,
  options: PullToRefreshOptions
) {
  const { onRefresh, threshold = 80, enableHaptics = true } = options;
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const scrollTopRef = useRef<number>(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      scrollTopRef.current = element.scrollTop;
      if (scrollTopRef.current === 0) {
        touchStartRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current || scrollTopRef.current > 0) return;

      const currentTouch = e.touches[0].clientY;
      const distance = currentTouch - touchStartRef.current;

      if (distance > 0) {
        setPullDistance(distance);
        setIsPulling(true);

        // Haptic feedback when reaching threshold
        if (enableHaptics && distance >= threshold && pullDistance < threshold) {
          hapticFeedback();
        }

        // Prevent default scroll when pulling
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        if (enableHaptics) hapticSuccess();

        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
      touchStartRef.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onRefresh, threshold, enableHaptics, isPulling, isRefreshing, pullDistance]);

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    progress: Math.min(pullDistance / threshold, 1),
  };
}
