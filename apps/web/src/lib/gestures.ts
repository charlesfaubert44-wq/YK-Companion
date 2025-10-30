/**
 * Touch and Gesture Utilities for YK-Companion
 *
 * This module provides low-level gesture detection utilities for touch interactions.
 * These utilities are framework-agnostic and can be used with React hooks or vanilla JS.
 *
 * @module lib/gestures
 */

/**
 * Direction of a swipe gesture
 */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Touch point coordinates
 */
export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

/**
 * Swipe gesture details
 */
export interface SwipeGesture {
  direction: SwipeDirection;
  distance: number;
  velocity: number;
  duration: number;
  startPoint: TouchPoint;
  endPoint: TouchPoint;
}

/**
 * Pinch gesture details
 */
export interface PinchGesture {
  scale: number;
  center: { x: number; y: number };
  distance: number;
  initialDistance: number;
}

/**
 * Configuration options for swipe detection
 */
export interface SwipeConfig {
  /** Minimum distance in pixels to register as a swipe (default: 50) */
  threshold?: number;
  /** Minimum velocity in pixels/ms to register as a swipe (default: 0.3) */
  velocityThreshold?: number;
  /** Maximum time in ms for a swipe (default: 300) */
  timeThreshold?: number;
  /** Ratio of primary axis movement to secondary axis (default: 2) */
  directionalThreshold?: number;
}

/**
 * Default swipe configuration
 */
const DEFAULT_SWIPE_CONFIG: Required<SwipeConfig> = {
  threshold: 50,
  velocityThreshold: 0.3,
  timeThreshold: 300,
  directionalThreshold: 2,
};

/**
 * Detects swipe direction and velocity from touch events
 *
 * @param startPoint - Touch start coordinates
 * @param endPoint - Touch end coordinates
 * @param config - Swipe detection configuration
 * @returns SwipeGesture object or null if not a valid swipe
 *
 * @example
 * const startPoint = { x: 100, y: 200, timestamp: Date.now() };
 * const endPoint = { x: 300, y: 210, timestamp: Date.now() };
 * const gesture = detectSwipe(startPoint, endPoint);
 * if (gesture) {
 *   console.log(`Swiped ${gesture.direction} at ${gesture.velocity}px/ms`);
 * }
 */
export function detectSwipe(
  startPoint: TouchPoint,
  endPoint: TouchPoint,
  config: SwipeConfig = {}
): SwipeGesture | null {
  const cfg = { ...DEFAULT_SWIPE_CONFIG, ...config };

  const deltaX = endPoint.x - startPoint.x;
  const deltaY = endPoint.y - startPoint.y;
  const duration = endPoint.timestamp - startPoint.timestamp;

  // Check if duration is within threshold
  if (duration > cfg.timeThreshold || duration <= 0) {
    return null;
  }

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Check if distance exceeds threshold
  if (distance < cfg.threshold) {
    return null;
  }

  const velocity = distance / duration;

  // Check if velocity exceeds threshold
  if (velocity < cfg.velocityThreshold) {
    return null;
  }

  // Determine primary direction
  let direction: SwipeDirection;

  if (absX > absY) {
    // Horizontal swipe
    if (absX < cfg.directionalThreshold * absY) {
      return null; // Not directional enough
    }
    direction = deltaX > 0 ? 'right' : 'left';
  } else {
    // Vertical swipe
    if (absY < cfg.directionalThreshold * absX) {
      return null; // Not directional enough
    }
    direction = deltaY > 0 ? 'down' : 'up';
  }

  return {
    direction,
    distance,
    velocity,
    duration,
    startPoint,
    endPoint,
  };
}

/**
 * Extracts touch point from a Touch or TouchEvent
 *
 * @param touch - Touch object or TouchEvent
 * @returns TouchPoint with coordinates and timestamp
 *
 * @example
 * const handleTouchStart = (e: TouchEvent) => {
 *   const point = getTouchPoint(e.touches[0]);
 *   console.log(`Touch at (${point.x}, ${point.y})`);
 * };
 */
export function getTouchPoint(touch: Touch | React.Touch): TouchPoint {
  return {
    x: touch.clientX,
    y: touch.clientY,
    timestamp: Date.now(),
  };
}

/**
 * Calculate distance between two touch points (for pinch gestures)
 *
 * @param touch1 - First touch point
 * @param touch2 - Second touch point
 * @returns Distance in pixels
 *
 * @example
 * const distance = getTouchDistance(touch1, touch2);
 * console.log(`Fingers are ${distance}px apart`);
 */
export function getTouchDistance(touch1: Touch | React.Touch, touch2: Touch | React.Touch): number {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate center point between two touches
 *
 * @param touch1 - First touch point
 * @param touch2 - Second touch point
 * @returns Center coordinates
 *
 * @example
 * const center = getTouchCenter(touch1, touch2);
 * console.log(`Pinch center: (${center.x}, ${center.y})`);
 */
export function getTouchCenter(
  touch1: Touch | React.Touch,
  touch2: Touch | React.Touch
): { x: number; y: number } {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
}

/**
 * Detects pinch zoom gesture from touch events
 *
 * @param currentTouches - Current TouchList with 2 touches
 * @param initialDistance - Initial distance between touches
 * @returns PinchGesture object
 *
 * @example
 * let initialDistance = 0;
 *
 * const handleTouchStart = (e: TouchEvent) => {
 *   if (e.touches.length === 2) {
 *     initialDistance = getTouchDistance(e.touches[0], e.touches[1]);
 *   }
 * };
 *
 * const handleTouchMove = (e: TouchEvent) => {
 *   if (e.touches.length === 2) {
 *     const pinch = detectPinch(e.touches, initialDistance);
 *     console.log(`Scale: ${pinch.scale}`);
 *   }
 * };
 */
export function detectPinch(
  currentTouches: TouchList | React.TouchList,
  initialDistance: number
): PinchGesture {
  if (currentTouches.length !== 2) {
    throw new Error('Pinch detection requires exactly 2 touches');
  }

  const touch1 = currentTouches[0];
  const touch2 = currentTouches[1];

  const distance = getTouchDistance(touch1!, touch2!);
  const center = getTouchCenter(touch1!, touch2!);
  const scale = distance / initialDistance;

  return {
    scale,
    center,
    distance,
    initialDistance,
  };
}

/**
 * Check if a touch event is a multi-touch gesture
 *
 * @param event - TouchEvent to check
 * @returns True if multiple touches are detected
 *
 * @example
 * const handleTouch = (e: TouchEvent) => {
 *   if (isMultiTouch(e)) {
 *     console.log('Multi-touch gesture detected');
 *   }
 * };
 */
export function isMultiTouch(event: TouchEvent): boolean {
  return event.touches.length > 1;
}

/**
 * Normalizes touch or mouse event to a consistent format
 * Useful for components that need to support both touch and mouse
 *
 * @param event - Touch or mouse event
 * @returns TouchPoint or null if no valid point
 *
 * @example
 * const handlePointerStart = (e: TouchEvent | MouseEvent) => {
 *   const point = normalizePointerEvent(e);
 *   if (point) {
 *     console.log(`Pointer at (${point.x}, ${point.y})`);
 *   }
 * };
 */
export function normalizePointerEvent(event: TouchEvent | MouseEvent): TouchPoint | null {
  if ('touches' in event) {
    // Touch event
    if (event.touches.length === 0) return null;
    return getTouchPoint(event.touches[0]);
  } else {
    // Mouse event
    return {
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
    };
  }
}

/**
 * Calculate velocity between two touch points
 *
 * @param start - Starting touch point
 * @param end - Ending touch point
 * @returns Velocity in pixels per millisecond
 *
 * @example
 * const velocity = calculateVelocity(startPoint, endPoint);
 * if (velocity > 1) {
 *   console.log('Fast swipe!');
 * }
 */
export function calculateVelocity(start: TouchPoint, end: TouchPoint): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const duration = end.timestamp - start.timestamp;

  if (duration === 0) return 0;

  return distance / duration;
}

/**
 * Get angle of swipe in degrees (0-360)
 * 0 degrees is right, 90 is down, 180 is left, 270 is up
 *
 * @param start - Starting touch point
 * @param end - Ending touch point
 * @returns Angle in degrees
 *
 * @example
 * const angle = getSwipeAngle(startPoint, endPoint);
 * console.log(`Swiped at ${angle}° angle`);
 */
export function getSwipeAngle(start: TouchPoint, end: TouchPoint): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const radians = Math.atan2(dy, dx);
  const degrees = radians * (180 / Math.PI);

  // Normalize to 0-360
  return (degrees + 360) % 360;
}

/**
 * Check if swipe is horizontal (within tolerance)
 *
 * @param start - Starting touch point
 * @param end - Ending touch point
 * @param tolerance - Angle tolerance in degrees (default: 30)
 * @returns True if swipe is horizontal
 *
 * @example
 * if (isHorizontalSwipe(startPoint, endPoint)) {
 *   console.log('Horizontal swipe detected');
 * }
 */
export function isHorizontalSwipe(
  start: TouchPoint,
  end: TouchPoint,
  tolerance: number = 30
): boolean {
  const angle = getSwipeAngle(start, end);
  return (
    (angle >= 0 && angle <= tolerance) ||
    (angle >= 180 - tolerance && angle <= 180 + tolerance) ||
    angle >= 360 - tolerance
  );
}

/**
 * Check if swipe is vertical (within tolerance)
 *
 * @param start - Starting touch point
 * @param end - Ending touch point
 * @param tolerance - Angle tolerance in degrees (default: 30)
 * @returns True if swipe is vertical
 *
 * @example
 * if (isVerticalSwipe(startPoint, endPoint)) {
 *   console.log('Vertical swipe detected');
 * }
 */
export function isVerticalSwipe(
  start: TouchPoint,
  end: TouchPoint,
  tolerance: number = 30
): boolean {
  const angle = getSwipeAngle(start, end);
  return (
    (angle >= 90 - tolerance && angle <= 90 + tolerance) ||
    (angle >= 270 - tolerance && angle <= 270 + tolerance)
  );
}

/**
 * Clamp a value between min and max
 * Useful for constraining gesture-based movements
 *
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 *
 * @example
 * const position = clamp(dragX, 0, containerWidth);
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * Useful for smooth gesture animations
 *
 * @param start - Start value
 * @param end - End value
 * @param progress - Progress from 0 to 1
 * @returns Interpolated value
 *
 * @example
 * const x = lerp(0, 100, 0.5); // 50
 * const opacity = lerp(0, 1, progress);
 */
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}
