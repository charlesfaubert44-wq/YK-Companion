/**
 * Performance Optimization Utilities
 *
 * Tools for improving application performance
 */

/**
 * Dynamically import a component (code splitting)
 * @param importFn - The import function
 * @returns Promise that resolves to the component
 */
export async function lazyLoad<T>(importFn: () => Promise<T>): Promise<T> {
  return importFn();
}

/**
 * Preload a route or resource
 * @param href - The URL to preload
 */
export function preloadRoute(href: string): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Preconnect to external domains
 * @param urls - Array of URLs to preconnect
 */
export function preconnect(urls: string[]): void {
  if (typeof window === 'undefined') return;

  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Debounce a function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Measure function execution time
 * @param fn - Function to measure
 * @param label - Label for the measurement
 * @returns Result of the function
 */
export async function measurePerformance<T>(fn: () => Promise<T> | T, label: string): Promise<T> {
  const start = performance.now();

  try {
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    // Send to analytics in production
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name: label,
        value: Math.round(duration),
        event_category: 'Performance',
      });
    }

    return result;
  } catch (error) {
    const end = performance.now();
    const duration = end - start;

    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${label} failed after ${duration.toFixed(2)}ms`, error);
    }

    throw error;
  }
}

/**
 * Request idle callback wrapper with fallback
 * @param callback - Function to run when idle
 * @param options - Idle callback options
 */
export function runWhenIdle(callback: () => void, options?: IdleRequestOptions): void {
  if (typeof window === 'undefined') {
    callback();
    return;
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 1);
  }
}

/**
 * Check if user has reduced motion preference
 * @returns Boolean indicating if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check connection quality
 * @returns Connection info
 */
export function getConnectionQuality(): {
  effectiveType: string;
  downlink?: number;
  rtt?: number;
  saveData: boolean;
} {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return {
      effectiveType: 'unknown',
      saveData: false,
    };
  }

  const connection = (navigator as any).connection;

  return {
    effectiveType: connection.effectiveType || 'unknown',
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData || false,
  };
}

/**
 * Optimize image loading based on viewport
 * @param imageUrl - URL of the image
 * @param options - Optimization options
 * @returns Optimized image URL or configuration
 */
export function optimizeImage(
  imageUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  }
): string {
  // This would integrate with Next.js Image or a CDN
  // For now, return the original URL
  return imageUrl;
}

/**
 * Batch multiple state updates
 * @param updates - Array of update functions
 */
export function batchUpdates(updates: Array<() => void>): void {
  if (typeof window === 'undefined') {
    updates.forEach(update => update());
    return;
  }

  // Use requestAnimationFrame to batch updates
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

/**
 * Monitor Web Vitals
 */
export function reportWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  label: string;
}): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', metric);
  }

  // Send to analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}
