/**
 * Long Press Hook for YK-Companion
 *
 * Provides long press gesture detection with support for
 * progress tracking, cancellation, and haptic feedback.
 *
 * @module hooks/useLongPress
 */

'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { hapticFeedback } from '@/lib/mobile';

/**
 * Long press options
 */
export interface UseLongPressOptions {
  /** Duration in ms to trigger long press (default: 500) */
  delay?: number;
  /** Called when long press is triggered */
  onLongPress?: (e: React.TouchEvent | React.MouseEvent) => void;
  /** Called when long press starts */
  onStart?: (e: React.TouchEvent | React.MouseEvent) => void;
  /** Called when long press is cancelled */
  onCancel?: (e: React.TouchEvent | React.MouseEvent) => void;
  /** Called on each progress update (0-1) */
  onProgress?: (progress: number) => void;
  /** Whether to prevent default behavior (default: true) */
  preventDefault?: boolean;
  /** Whether to stop propagation (default: false) */
  stopPropagation?: boolean;
  /** Whether to trigger haptic feedback (default: true) */
  haptic?: boolean;
  /** Enable hook (default: true) */
  enabled?: boolean;
  /** Movement threshold in pixels before cancelling (default: 10) */
  moveThreshold?: number;
}

/**
 * Long press hook return value
 */
export interface UseLongPressReturn {
  /** Handlers to spread on the target element */
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchCancel: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
  };
  /** Whether long press is currently active */
  isLongPressing: boolean;
  /** Progress from 0 to 1 */
  progress: number;
  /** Manually reset the long press state */
  reset: () => void;
}

/**
 * Hook for detecting long press gestures
 *
 * @param options - Long press options
 * @returns Long press handlers and state
 *
 * @example
 * function LongPressButton() {
 *   const longPress = useLongPress({
 *     onLongPress: () => console.log('Long pressed!'),
 *     delay: 800,
 *   });
 *
 *   return (
 *     <button {...longPress.handlers}>
 *       Hold me
 *       {longPress.isLongPressing && (
 *         <div style={{ width: `${longPress.progress * 100}%` }} />
 *       )}
 *     </button>
 *   );
 * }
 */
export function useLongPress(options: UseLongPressOptions = {}): UseLongPressReturn {
  const {
    delay = 500,
    onLongPress,
    onStart,
    onCancel,
    onProgress,
    preventDefault = true,
    stopPropagation = false,
    haptic = true,
    enabled = true,
    moveThreshold = 10,
  } = options;

  const [isLongPressing, setIsLongPressing] = useState(false);
  const [progress, setProgress] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const eventRef = useRef<React.TouchEvent | React.MouseEvent | null>(null);

  /**
   * Clear all timers and reset state
   */
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsLongPressing(false);
    setProgress(0);
    startTimeRef.current = 0;
    startPosRef.current = null;
    eventRef.current = null;
  }, []);

  /**
   * Start long press
   */
  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!enabled) return;

      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();

      eventRef.current = e;

      // Store starting position
      if ('touches' in e) {
        startPosRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else {
        startPosRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }

      setIsLongPressing(true);
      startTimeRef.current = Date.now();

      onStart?.(e);

      // Start progress tracking
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const currentProgress = Math.min(elapsed / delay, 1);
        setProgress(currentProgress);
        onProgress?.(currentProgress);
      }, 16); // ~60fps

      // Set timeout for long press trigger
      timeoutRef.current = setTimeout(() => {
        if (haptic) {
          hapticFeedback();
        }
        onLongPress?.(e);
        reset();
      }, delay);
    },
    [
      enabled,
      preventDefault,
      stopPropagation,
      delay,
      haptic,
      onStart,
      onLongPress,
      onProgress,
      reset,
    ]
  );

  /**
   * Cancel long press
   */
  const cancel = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isLongPressing) return;

      onCancel?.(e);
      reset();
    },
    [isLongPressing, onCancel, reset]
  );

  /**
   * Handle movement (cancel if moved too far)
   */
  const handleMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isLongPressing || !startPosRef.current) return;

      let currentX: number;
      let currentY: number;

      if ('touches' in e) {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
      } else {
        currentX = e.clientX;
        currentY = e.clientY;
      }

      const deltaX = Math.abs(currentX - startPosRef.current.x);
      const deltaY = Math.abs(currentY - startPosRef.current.y);

      // Cancel if moved beyond threshold
      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        cancel(e);
      }
    },
    [isLongPressing, moveThreshold, cancel]
  );

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return {
    handlers: {
      onMouseDown: start,
      onMouseUp: cancel,
      onMouseLeave: cancel,
      onMouseMove: handleMove,
      onTouchStart: start,
      onTouchEnd: cancel,
      onTouchCancel: cancel,
      onTouchMove: handleMove,
    },
    isLongPressing,
    progress,
    reset,
  };
}

/**
 * Hook for long press with visual feedback
 * Includes scale animation during press
 *
 * @param options - Long press options
 * @returns Long press handlers, state, and scale value
 *
 * @example
 * function AnimatedButton() {
 *   const longPress = useLongPressWithAnimation({
 *     onLongPress: () => console.log('Activated!'),
 *   });
 *
 *   return (
 *     <button
 *       {...longPress.handlers}
 *       style={{
 *         transform: `scale(${longPress.scale})`,
 *         transition: 'transform 0.1s',
 *       }}
 *     >
 *       Hold me
 *     </button>
 *   );
 * }
 */
export function useLongPressWithAnimation(
  options: UseLongPressOptions & {
    scaleFrom?: number;
    scaleTo?: number;
  } = {}
): UseLongPressReturn & { scale: number } {
  const { scaleFrom = 1, scaleTo = 0.95, ...longPressOptions } = options;

  const [scale, setScale] = useState(scaleFrom);

  const longPress = useLongPress({
    ...longPressOptions,
    onStart: e => {
      setScale(scaleTo);
      longPressOptions.onStart?.(e);
    },
    onCancel: e => {
      setScale(scaleFrom);
      longPressOptions.onCancel?.(e);
    },
    onLongPress: e => {
      setScale(scaleFrom);
      longPressOptions.onLongPress?.(e);
    },
  });

  return {
    ...longPress,
    scale,
  };
}

/**
 * Hook for context menu long press (like iOS)
 * Shows context menu after long press
 *
 * @param onContextMenu - Callback to show context menu
 * @param options - Long press options
 * @returns Long press handlers
 *
 * @example
 * function ContextMenuCard() {
 *   const [menuVisible, setMenuVisible] = useState(false);
 *
 *   const longPress = useLongPressContextMenu(
 *     () => setMenuVisible(true),
 *     { delay: 600 }
 *   );
 *
 *   return (
 *     <>
 *       <div {...longPress.handlers}>Long press for menu</div>
 *       {menuVisible && <ContextMenu onClose={() => setMenuVisible(false)} />}
 *     </>
 *   );
 * }
 */
export function useLongPressContextMenu(
  onContextMenu: (position: { x: number; y: number }) => void,
  options?: Omit<UseLongPressOptions, 'onLongPress'>
): UseLongPressReturn {
  return useLongPress({
    ...options,
    onLongPress: e => {
      const position = {
        x: 'touches' in e ? e.changedTouches[0].clientX : e.clientX,
        y: 'touches' in e ? e.changedTouches[0].clientY : e.clientY,
      };
      onContextMenu(position);
    },
  });
}

/**
 * Hook for long press to delete (with confirmation)
 *
 * @param onDelete - Callback when deletion is confirmed
 * @param options - Long press options
 * @returns Long press handlers and state
 *
 * @example
 * function DeletableItem() {
 *   const deleteAction = useLongPressToDelete(
 *     () => console.log('Item deleted'),
 *     { delay: 1000 }
 *   );
 *
 *   return (
 *     <div {...deleteAction.handlers}>
 *       Hold to delete
 *       {deleteAction.isLongPressing && (
 *         <div className="progress-bar" style={{ width: `${deleteAction.progress * 100}%` }} />
 *       )}
 *     </div>
 *   );
 * }
 */
export function useLongPressToDelete(
  onDelete: () => void,
  options?: Omit<UseLongPressOptions, 'onLongPress' | 'haptic'>
): UseLongPressReturn {
  return useLongPress({
    ...options,
    delay: options?.delay || 1000,
    haptic: true,
    onLongPress: onDelete,
  });
}
