/**
 * Low-Level Touch Hook for YK-Companion
 *
 * Provides low-level touch event handling with support for:
 * - Multi-touch tracking
 * - Touch point history
 * - Velocity calculation
 * - Custom gesture detection
 *
 * @module hooks/useTouch
 */

'use client';

import { useRef, useCallback, useState } from 'react';
import type { TouchPoint } from '@/lib/gestures';
import { getTouchPoint, getTouchDistance, getTouchCenter, calculateVelocity } from '@/lib/gestures';

/**
 * Touch event handlers
 */
export interface TouchHandlers {
  /** Called when touch starts */
  onTouchStart?: (touches: React.Touch[], event: React.TouchEvent) => void;
  /** Called when touch moves */
  onTouchMove?: (touches: React.Touch[], event: React.TouchEvent) => void;
  /** Called when touch ends */
  onTouchEnd?: (touches: React.Touch[], event: React.TouchEvent) => void;
  /** Called when touch is cancelled */
  onTouchCancel?: (touches: React.Touch[], event: React.TouchEvent) => void;
}

/**
 * Touch state
 */
export interface TouchState {
  /** Currently active touch points */
  activeTouches: TouchPoint[];
  /** Number of active touches */
  touchCount: number;
  /** Whether user is currently touching */
  isTouching: boolean;
  /** First touch point (primary touch) */
  primaryTouch: TouchPoint | null;
  /** Touch point history for gesture analysis */
  history: TouchPoint[][];
  /** Current velocity (pixels per millisecond) */
  velocity: number;
}

/**
 * Touch hook options
 */
export interface UseTouchOptions extends TouchHandlers {
  /** Maximum history length (default: 10) */
  historyLength?: number;
  /** Whether to prevent default touch behavior (default: false) */
  preventDefault?: boolean;
  /** Whether to stop propagation (default: false) */
  stopPropagation?: boolean;
  /** Enable hook (default: true) */
  enabled?: boolean;
}

/**
 * Touch hook return value
 */
export interface UseTouchReturn extends TouchState {
  /** Handlers to spread on the target element */
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchCancel: (e: React.TouchEvent) => void;
  };
  /** Reset touch state */
  reset: () => void;
}

/**
 * Low-level hook for touch event handling
 *
 * @param options - Touch handling options
 * @returns Touch state and handlers
 *
 * @example
 * function CustomGestureComponent() {
 *   const touch = useTouch({
 *     onTouchStart: (touches) => {
 *       console.log(`${touches.length} touch(es) started`);
 *     },
 *     onTouchMove: (touches) => {
 *       console.log('Touch moving', touches);
 *     },
 *   });
 *
 *   return (
 *     <div {...touch.handlers}>
 *       {touch.isTouching && <p>{touch.touchCount} finger(s)</p>}
 *     </div>
 *   );
 * }
 */
export function useTouch(options: UseTouchOptions = {}): UseTouchReturn {
  const {
    historyLength = 10,
    preventDefault = false,
    stopPropagation = false,
    enabled = true,
    onTouchStart: onTouchStartCallback,
    onTouchMove: onTouchMoveCallback,
    onTouchEnd: onTouchEndCallback,
    onTouchCancel: onTouchCancelCallback,
  } = options;

  const [touchState, setTouchState] = useState<TouchState>({
    activeTouches: [],
    touchCount: 0,
    isTouching: false,
    primaryTouch: null,
    history: [],
    velocity: 0,
  });

  const historyRef = useRef<TouchPoint[][]>([]);

  /**
   * Convert TouchList to TouchPoint array
   */
  const touchListToPoints = useCallback((touches: React.TouchList): TouchPoint[] => {
    return Array.from(touches).map(getTouchPoint);
  }, []);

  /**
   * Add to history
   */
  const addToHistory = useCallback(
    (points: TouchPoint[]) => {
      historyRef.current = [...historyRef.current, points].slice(-historyLength);
    },
    [historyLength]
  );

  /**
   * Calculate current velocity
   */
  const calculateCurrentVelocity = useCallback((): number => {
    if (historyRef.current.length < 2) return 0;

    const recent = historyRef.current.slice(-2);
    const [prev, curr] = recent;

    if (!prev[0] || !curr[0]) return 0;

    return calculateVelocity(prev[0], curr[0]);
  }, []);

  /**
   * Reset touch state
   */
  const reset = useCallback(() => {
    setTouchState({
      activeTouches: [],
      touchCount: 0,
      isTouching: false,
      primaryTouch: null,
      history: [],
      velocity: 0,
    });
    historyRef.current = [];
  }, []);

  /**
   * Handle touch start
   */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();

      const touches = Array.from(e.touches);
      const points = touchListToPoints(e.touches);

      addToHistory(points);

      setTouchState({
        activeTouches: points,
        touchCount: touches.length,
        isTouching: true,
        primaryTouch: points[0] || null,
        history: historyRef.current,
        velocity: 0,
      });

      onTouchStartCallback?.(touches, e);
    },
    [
      enabled,
      preventDefault,
      stopPropagation,
      touchListToPoints,
      addToHistory,
      onTouchStartCallback,
    ]
  );

  /**
   * Handle touch move
   */
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      const touches = Array.from(e.touches);
      const points = touchListToPoints(e.touches);

      addToHistory(points);

      const velocity = calculateCurrentVelocity();

      setTouchState({
        activeTouches: points,
        touchCount: touches.length,
        isTouching: true,
        primaryTouch: points[0] || null,
        history: historyRef.current,
        velocity,
      });

      onTouchMoveCallback?.(touches, e);
    },
    [enabled, touchListToPoints, addToHistory, calculateCurrentVelocity, onTouchMoveCallback]
  );

  /**
   * Handle touch end
   */
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();

      const touches = Array.from(e.changedTouches);
      const remainingTouches = Array.from(e.touches);
      const points = touchListToPoints(e.touches);

      setTouchState({
        activeTouches: points,
        touchCount: remainingTouches.length,
        isTouching: remainingTouches.length > 0,
        primaryTouch: points[0] || null,
        history: historyRef.current,
        velocity: calculateCurrentVelocity(),
      });

      onTouchEndCallback?.(touches, e);

      // Clear history if all touches ended
      if (remainingTouches.length === 0) {
        setTimeout(reset, 100);
      }
    },
    [
      enabled,
      preventDefault,
      stopPropagation,
      touchListToPoints,
      calculateCurrentVelocity,
      reset,
      onTouchEndCallback,
    ]
  );

  /**
   * Handle touch cancel
   */
  const handleTouchCancel = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      const touches = Array.from(e.changedTouches);

      onTouchCancelCallback?.(touches, e);
      reset();
    },
    [enabled, reset, onTouchCancelCallback]
  );

  return {
    ...touchState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    },
    reset,
  };
}

/**
 * Hook for tracking multi-touch gestures (pinch, rotate)
 *
 * @param options - Multi-touch options
 * @returns Multi-touch state and handlers
 *
 * @example
 * function PinchZoomImage() {
 *   const pinch = useMultiTouch({
 *     onPinch: (scale, center) => {
 *       console.log(`Pinch scale: ${scale}`);
 *     },
 *   });
 *
 *   return (
 *     <div {...pinch.handlers}>
 *       <div style={{ transform: `scale(${pinch.scale})` }}>
 *         Pinchable content
 *       </div>
 *     </div>
 *   );
 * }
 */
export function useMultiTouch(
  options: {
    onPinch?: (scale: number, center: { x: number; y: number }) => void;
    onRotate?: (angle: number) => void;
    enabled?: boolean;
  } = {}
): UseTouchReturn & {
  scale: number;
  rotation: number;
  center: { x: number; y: number } | null;
} {
  const { onPinch, onRotate, enabled = true } = options;

  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [center, setCenter] = useState<{ x: number; y: number } | null>(null);

  const initialDistance = useRef<number>(0);
  const initialAngle = useRef<number>(0);

  const touch = useTouch({
    enabled,
    onTouchStart: touches => {
      if (touches.length === 2) {
        initialDistance.current = getTouchDistance(touches[0], touches[1]);
        initialAngle.current = Math.atan2(
          touches[1].clientY - touches[0].clientY,
          touches[1].clientX - touches[0].clientX
        );

        const currentCenter = getTouchCenter(touches[0], touches[1]);
        setCenter(currentCenter);
      }
    },
    onTouchMove: touches => {
      if (touches.length === 2) {
        const currentDistance = getTouchDistance(touches[0], touches[1]);
        const currentAngle = Math.atan2(
          touches[1].clientY - touches[0].clientY,
          touches[1].clientX - touches[0].clientX
        );

        const currentCenter = getTouchCenter(touches[0], touches[1]);

        if (initialDistance.current > 0) {
          const newScale = currentDistance / initialDistance.current;
          setScale(newScale);
          setCenter(currentCenter);
          onPinch?.(newScale, currentCenter);
        }

        const newRotation = ((currentAngle - initialAngle.current) * 180) / Math.PI;
        setRotation(newRotation);
        onRotate?.(newRotation);
      }
    },
    onTouchEnd: () => {
      setScale(1);
      setRotation(0);
      setCenter(null);
      initialDistance.current = 0;
      initialAngle.current = 0;
    },
  });

  return {
    ...touch,
    scale,
    rotation,
    center,
  };
}

/**
 * Hook for drag gesture with touch support
 *
 * @param options - Drag options
 * @returns Drag state and handlers
 *
 * @example
 * function DraggableCard() {
 *   const drag = useDrag({
 *     onDrag: (x, y) => {
 *       console.log(`Dragged to (${x}, ${y})`);
 *     },
 *   });
 *
 *   return (
 *     <div
 *       {...drag.handlers}
 *       style={{
 *         transform: `translate(${drag.position.x}px, ${drag.position.y}px)`,
 *       }}
 *     >
 *       Drag me
 *     </div>
 *   );
 * }
 */
export function useDrag(
  options: {
    onDrag?: (x: number, y: number) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    bounds?: { minX?: number; maxX?: number; minY?: number; maxY?: number };
    enabled?: boolean;
  } = {}
): UseTouchReturn & {
  position: { x: number; y: number };
  isDragging: boolean;
} {
  const { onDrag, onDragStart, onDragEnd, bounds, enabled = true } = options;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const startPos = useRef({ x: 0, y: 0 });
  const initialTouchPos = useRef({ x: 0, y: 0 });

  const clampPosition = useCallback(
    (x: number, y: number) => {
      let clampedX = x;
      let clampedY = y;

      if (bounds) {
        if (bounds.minX !== undefined) clampedX = Math.max(clampedX, bounds.minX);
        if (bounds.maxX !== undefined) clampedX = Math.min(clampedX, bounds.maxX);
        if (bounds.minY !== undefined) clampedY = Math.max(clampedY, bounds.minY);
        if (bounds.maxY !== undefined) clampedY = Math.min(clampedY, bounds.maxY);
      }

      return { x: clampedX, y: clampedY };
    },
    [bounds]
  );

  const touch = useTouch({
    enabled,
    onTouchStart: touches => {
      if (touches.length === 1) {
        setIsDragging(true);
        startPos.current = { ...position };
        initialTouchPos.current = {
          x: touches[0].clientX,
          y: touches[0].clientY,
        };
        onDragStart?.();
      }
    },
    onTouchMove: touches => {
      if (touches.length === 1 && isDragging) {
        const deltaX = touches[0].clientX - initialTouchPos.current.x;
        const deltaY = touches[0].clientY - initialTouchPos.current.y;

        const newX = startPos.current.x + deltaX;
        const newY = startPos.current.y + deltaY;

        const clampedPos = clampPosition(newX, newY);
        setPosition(clampedPos);
        onDrag?.(clampedPos.x, clampedPos.y);
      }
    },
    onTouchEnd: () => {
      setIsDragging(false);
      onDragEnd?.();
    },
  });

  return {
    ...touch,
    position,
    isDragging,
  };
}

/**
 * Hook for tracking touch pressure (if supported)
 *
 * @param options - Pressure tracking options
 * @returns Touch state with pressure information
 *
 * @example
 * function PressureSensitiveButton() {
 *   const touch = useTouchPressure({
 *     onPressureChange: (pressure) => {
 *       console.log(`Pressure: ${pressure}`);
 *     },
 *   });
 *
 *   return (
 *     <button
 *       {...touch.handlers}
 *       style={{ opacity: touch.pressure }}
 *     >
 *       Press harder
 *     </button>
 *   );
 * }
 */
export function useTouchPressure(
  options: {
    onPressureChange?: (pressure: number) => void;
    enabled?: boolean;
  } = {}
): UseTouchReturn & {
  pressure: number;
  hasPressureSupport: boolean;
} {
  const { onPressureChange, enabled = true } = options;

  const [pressure, setPressure] = useState(0);
  const [hasPressureSupport, setHasPressureSupport] = useState(false);

  const touch = useTouch({
    enabled,
    onTouchStart: touches => {
      if (touches.length === 1) {
        const force = (touches[0] as any).force;
        setHasPressureSupport(force !== undefined);
        if (force !== undefined) {
          setPressure(force);
          onPressureChange?.(force);
        }
      }
    },
    onTouchMove: touches => {
      if (touches.length === 1) {
        const force = (touches[0] as any).force;
        if (force !== undefined) {
          setPressure(force);
          onPressureChange?.(force);
        }
      }
    },
    onTouchEnd: () => {
      setPressure(0);
      onPressureChange?.(0);
    },
  });

  return {
    ...touch,
    pressure,
    hasPressureSupport,
  };
}
