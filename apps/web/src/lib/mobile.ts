/**
 * Mobile-Specific Utilities for YK-Companion
 *
 * This module provides utilities for mobile device detection,
 * orientation handling, vibration, and other mobile-specific features.
 *
 * @module lib/mobile
 */

/**
 * Device type enumeration
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Mobile operating system
 */
export type MobileOS = 'iOS' | 'Android' | 'Windows Phone' | 'unknown';

/**
 * Screen orientation
 */
export type Orientation = 'portrait' | 'landscape';

/**
 * Device capabilities
 */
export interface DeviceCapabilities {
  hasTouch: boolean;
  hasHover: boolean;
  hasVibration: boolean;
  hasOrientationAPI: boolean;
  hasIntersectionObserver: boolean;
  hasWebGL: boolean;
  maxTouchPoints: number;
}

/**
 * Safe area insets (for notched devices)
 */
export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// =============================================================================
// Device Detection
// =============================================================================

/**
 * Check if the current device is mobile (phone or small tablet)
 * Uses both user agent and screen size
 *
 * @returns True if device is mobile
 *
 * @example
 * if (isMobile()) {
 *   console.log('Mobile device detected');
 * }
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;

  // Check user agent
  const userAgent = window.navigator.userAgent.toLowerCase();
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobileUA = mobileRegex.test(userAgent);

  // Check screen size (phones are typically < 768px)
  const isSmallScreen = window.innerWidth < 768;

  // Check for touch support
  const hasTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0;

  return isMobileUA || (isSmallScreen && hasTouch);
}

/**
 * Check if the current device is a tablet
 *
 * @returns True if device is a tablet
 *
 * @example
 * if (isTablet()) {
 *   console.log('Tablet device detected');
 * }
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIPad = /ipad/i.test(userAgent);
  const isAndroidTablet = /android/i.test(userAgent) && !/mobile/i.test(userAgent);
  const isMediumScreen = window.innerWidth >= 768 && window.innerWidth < 1024;

  return isIPad || isAndroidTablet || isMediumScreen;
}

/**
 * Detect device type (mobile, tablet, or desktop)
 *
 * @returns DeviceType
 *
 * @example
 * const device = getDeviceType();
 * console.log(`Current device: ${device}`);
 */
export function getDeviceType(): DeviceType {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
}

/**
 * Detect mobile operating system
 *
 * @returns MobileOS
 *
 * @example
 * const os = getMobileOS();
 * if (os === 'iOS') {
 *   console.log('Running on iOS');
 * }
 */
export function getMobileOS(): MobileOS {
  if (typeof window === 'undefined') return 'unknown';

  const userAgent = window.navigator.userAgent;

  if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
  if (/Android/.test(userAgent)) return 'Android';
  if (/Windows Phone/.test(userAgent)) return 'Windows Phone';

  return 'unknown';
}

/**
 * Check if device is iOS
 *
 * @returns True if iOS device
 *
 * @example
 * if (isIOS()) {
 *   // Apply iOS-specific styles
 * }
 */
export function isIOS(): boolean {
  return getMobileOS() === 'iOS';
}

/**
 * Check if device is Android
 *
 * @returns True if Android device
 *
 * @example
 * if (isAndroid()) {
 *   // Apply Android-specific styles
 * }
 */
export function isAndroid(): boolean {
  return getMobileOS() === 'Android';
}

/**
 * Check if running in standalone PWA mode (installed as app)
 *
 * @returns True if in standalone mode
 *
 * @example
 * if (isPWA()) {
 *   console.log('Running as installed PWA');
 * }
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

// =============================================================================
// Device Capabilities
// =============================================================================

/**
 * Get device capabilities
 *
 * @returns DeviceCapabilities object
 *
 * @example
 * const caps = getDeviceCapabilities();
 * if (caps.hasVibration) {
 *   vibrate(100);
 * }
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      hasTouch: false,
      hasHover: false,
      hasVibration: false,
      hasOrientationAPI: false,
      hasIntersectionObserver: false,
      hasWebGL: false,
      maxTouchPoints: 0,
    };
  }

  return {
    hasTouch:
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0,
    hasHover: window.matchMedia('(hover: hover)').matches,
    hasVibration: 'vibrate' in navigator,
    hasOrientationAPI: 'orientation' in window || 'onorientationchange' in window,
    hasIntersectionObserver: 'IntersectionObserver' in window,
    hasWebGL: !!document.createElement('canvas').getContext('webgl'),
    maxTouchPoints: navigator.maxTouchPoints || 0,
  };
}

/**
 * Check if device supports touch
 *
 * @returns True if device has touch support
 *
 * @example
 * if (hasTouchSupport()) {
 *   console.log('Touch events available');
 * }
 */
export function hasTouchSupport(): boolean {
  return getDeviceCapabilities().hasTouch;
}

// =============================================================================
// Orientation
// =============================================================================

/**
 * Get current screen orientation
 *
 * @returns 'portrait' or 'landscape'
 *
 * @example
 * const orientation = getOrientation();
 * console.log(`Current orientation: ${orientation}`);
 */
export function getOrientation(): Orientation {
  if (typeof window === 'undefined') return 'portrait';

  // Use Screen Orientation API if available
  if (window.screen?.orientation) {
    return window.screen.orientation.type.includes('portrait')
      ? 'portrait'
      : 'landscape';
  }

  // Fallback to window dimensions
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

/**
 * Check if device is in portrait orientation
 *
 * @returns True if in portrait mode
 *
 * @example
 * if (isPortrait()) {
 *   console.log('Device is in portrait mode');
 * }
 */
export function isPortrait(): boolean {
  return getOrientation() === 'portrait';
}

/**
 * Check if device is in landscape orientation
 *
 * @returns True if in landscape mode
 *
 * @example
 * if (isLandscape()) {
 *   console.log('Device is in landscape mode');
 * }
 */
export function isLandscape(): boolean {
  return getOrientation() === 'landscape';
}

/**
 * Listen for orientation changes
 *
 * @param callback - Function to call when orientation changes
 * @returns Cleanup function to remove listener
 *
 * @example
 * const cleanup = onOrientationChange((orientation) => {
 *   console.log(`Orientation changed to ${orientation}`);
 * });
 *
 * // Later, cleanup
 * cleanup();
 */
export function onOrientationChange(
  callback: (orientation: Orientation) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => {
    callback(getOrientation());
  };

  // Use Screen Orientation API if available
  if (window.screen?.orientation) {
    try {
      const orientation = window.screen.orientation as any;
      orientation.addEventListener('change', handler);
      return () => orientation.removeEventListener('change', handler);
    } catch (e) {
      // Fallback to other methods
    }
  }

  // Fallback to orientationchange event
  if ('onorientationchange' in window) {
    window.addEventListener('orientationchange', handler);
    return () => window.removeEventListener('orientationchange', handler);
  }

  // Fallback to resize event
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}

// =============================================================================
// Vibration
// =============================================================================

/**
 * Trigger device vibration
 * Provides haptic feedback on supported devices
 *
 * @param pattern - Vibration pattern (number or array of numbers)
 * @returns True if vibration was triggered
 *
 * @example
 * // Single vibration (100ms)
 * vibrate(100);
 *
 * // Pattern: vibrate 100ms, pause 50ms, vibrate 100ms
 * vibrate([100, 50, 100]);
 */
export function vibrate(pattern: number | number[]): boolean {
  if (typeof window === 'undefined' || !navigator.vibrate) {
    return false;
  }

  try {
    return navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Vibration failed:', error);
    return false;
  }
}

/**
 * Cancel ongoing vibration
 *
 * @example
 * vibrate(1000); // Start long vibration
 * setTimeout(() => cancelVibration(), 500); // Cancel after 500ms
 */
export function cancelVibration(): void {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(0);
  }
}

/**
 * Provide light haptic feedback (for buttons, switches)
 *
 * @example
 * <button onClick={() => hapticFeedback()}>
 *   Click me
 * </button>
 */
export function hapticFeedback(): void {
  vibrate(10);
}

/**
 * Provide success haptic feedback
 *
 * @example
 * if (formSubmitted) {
 *   hapticSuccess();
 * }
 */
export function hapticSuccess(): void {
  vibrate([30, 30, 30]);
}

/**
 * Provide error haptic feedback
 *
 * @example
 * if (error) {
 *   hapticError();
 * }
 */
export function hapticError(): void {
  vibrate([50, 50, 50, 50, 50]);
}

// =============================================================================
// Scroll Management
// =============================================================================

/**
 * Prevent scroll chaining (iOS overscroll bounce)
 * Useful for modals and carousels
 *
 * @param element - Element to prevent scroll chaining on
 * @param enabled - Whether to enable prevention (default: true)
 *
 * @example
 * const modal = document.getElementById('modal');
 * preventScrollChaining(modal);
 */
export function preventScrollChaining(
  element: HTMLElement,
  enabled: boolean = true
): void {
  if (enabled) {
    element.style.overscrollBehavior = 'contain';
    (element.style as any).WebkitOverflowScrolling = 'touch';
  } else {
    element.style.overscrollBehavior = 'auto';
    (element.style as any).WebkitOverflowScrolling = 'auto';
  }
}

/**
 * Lock body scroll (prevent background scrolling)
 *
 * @example
 * // When opening modal
 * lockBodyScroll();
 *
 * // When closing modal
 * unlockBodyScroll();
 */
export function lockBodyScroll(): void {
  if (typeof document === 'undefined') return;

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;

  // iOS Safari fix
  if (isIOS()) {
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;
  }
}

/**
 * Unlock body scroll
 *
 * @example
 * unlockBodyScroll();
 */
export function unlockBodyScroll(): void {
  if (typeof document === 'undefined') return;

  const scrollY = document.body.style.top;

  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  // iOS Safari fix
  if (isIOS()) {
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';

    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }
}

// =============================================================================
// Safe Area Insets
// =============================================================================

/**
 * Get safe area insets (for devices with notches)
 *
 * @returns SafeAreaInsets object
 *
 * @example
 * const insets = getSafeAreaInsets();
 * console.log(`Top inset: ${insets.top}px`);
 */
export function getSafeAreaInsets(): SafeAreaInsets {
  if (typeof window === 'undefined' || typeof getComputedStyle === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const style = getComputedStyle(document.documentElement);

  return {
    top: parseInt(style.getPropertyValue('--sat') || '0', 10),
    right: parseInt(style.getPropertyValue('--sar') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
    left: parseInt(style.getPropertyValue('--sal') || '0', 10),
  };
}

/**
 * Apply safe area insets to CSS variables
 * Call this in your app initialization
 *
 * @example
 * // In your app setup
 * applySafeAreaInsets();
 */
export function applySafeAreaInsets(): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Set CSS variables for safe area insets
  root.style.setProperty('--sat', 'env(safe-area-inset-top, 0px)');
  root.style.setProperty('--sar', 'env(safe-area-inset-right, 0px)');
  root.style.setProperty('--sab', 'env(safe-area-inset-bottom, 0px)');
  root.style.setProperty('--sal', 'env(safe-area-inset-left, 0px)');
}

// =============================================================================
// Viewport
// =============================================================================

/**
 * Get viewport dimensions
 *
 * @returns Object with width and height
 *
 * @example
 * const { width, height } = getViewportSize();
 * console.log(`Viewport: ${width}x${height}`);
 */
export function getViewportSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Check if viewport is in a specific size range
 *
 * @param minWidth - Minimum width
 * @param maxWidth - Maximum width (optional)
 * @returns True if viewport is in range
 *
 * @example
 * if (isViewportInRange(768, 1024)) {
 *   console.log('Tablet size');
 * }
 */
export function isViewportInRange(minWidth: number, maxWidth?: number): boolean {
  const { width } = getViewportSize();

  if (maxWidth !== undefined) {
    return width >= minWidth && width <= maxWidth;
  }

  return width >= minWidth;
}

/**
 * Disable user zoom/pinch (for app-like experiences)
 * Use carefully - this affects accessibility
 *
 * @example
 * // Disable zoom for carousel
 * disableUserZoom();
 */
export function disableUserZoom(): void {
  if (typeof document === 'undefined') return;

  let viewport = document.querySelector('meta[name="viewport"]');

  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    document.head.appendChild(viewport);
  }

  viewport.setAttribute(
    'content',
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
  );
}

/**
 * Enable user zoom
 *
 * @example
 * enableUserZoom();
 */
export function enableUserZoom(): void {
  if (typeof document === 'undefined') return;

  const viewport = document.querySelector('meta[name="viewport"]');

  if (viewport) {
    viewport.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0'
    );
  }
}
