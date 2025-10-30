/**
 * Performance Monitoring Utility
 *
 * Tracks and reports performance metrics for the application.
 * Integrates with Web Vitals and provides custom metric tracking.
 *
 * @module performance-monitor
 */

import { logInfo, logWarn } from './logger';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

/**
 * Web Vitals thresholds
 * Based on Google's Core Web Vitals recommendations
 */
const VITALS_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: {
    good: 2500,
    poor: 4000,
  },
  // First Input Delay (FID)
  FID: {
    good: 100,
    poor: 300,
  },
  // Cumulative Layout Shift (CLS)
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  // First Contentful Paint (FCP)
  FCP: {
    good: 1800,
    poor: 3000,
  },
  // Time to First Byte (TTFB)
  TTFB: {
    good: 800,
    poor: 1800,
  },
  // Interaction to Next Paint (INP)
  INP: {
    good: 200,
    poor: 500,
  },
};

/**
 * Get rating for a metric value
 */
function getRating(
  metricName: keyof typeof VITALS_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = VITALS_THRESHOLDS[metricName];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Performance Monitor Class
 */
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 100;

  /**
   * Record a performance metric
   *
   * @param {string} name - Metric name
   * @param {number} value - Metric value
   * @param {string} [rating] - Optional rating override
   */
  recordMetric(name: string, value: number, rating?: 'good' | 'needs-improvement' | 'poor'): void {
    const metric: PerformanceMetric = {
      name,
      value,
      rating: rating || this.inferRating(name, value),
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log poor performance
    if (metric.rating === 'poor') {
      logWarn(`Poor performance detected: ${name}`, {
        value,
        rating: metric.rating,
      });
    }

    // Send to analytics in production
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric);
    }
  }

  /**
   * Infer rating based on metric name and value
   * @private
   */
  private inferRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const metricKey = name.toUpperCase() as keyof typeof VITALS_THRESHOLDS;

    if (VITALS_THRESHOLDS[metricKey]) {
      return getRating(metricKey, value);
    }

    // Default thresholds for custom metrics
    if (value < 1000) return 'good';
    if (value < 3000) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Send metric to analytics service
   * @private
   */
  private sendToAnalytics(metric: PerformanceMetric): void {
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        non_interaction: true,
        metric_rating: metric.rating,
      });
    }

    // Send to custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
        keepalive: true,
      }).catch(() => {
        // Silently fail - don't block user experience
      });
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name);
  }

  /**
   * Get average value for a metric
   */
  getAverageMetric(name: string): number | null {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return null;

    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }
}

// Export singleton
export const performanceMonitor = new PerformanceMonitor();

/**
 * Measure execution time of a function
 *
 * @example
 * ```ts
 * const result = await measurePerformance('fetchData', async () => {
 *   return await fetch('/api/data');
 * });
 * ```
 */
export async function measurePerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - start;

    performanceMonitor.recordMetric(name, duration);
    logInfo(`${name} completed`, { duration: Math.round(duration) });

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    performanceMonitor.recordMetric(`${name}_error`, duration, 'poor');
    throw error;
  }
}

/**
 * Measure synchronous function performance
 *
 * @example
 * ```ts
 * const result = measureSync('computation', () => {
 *   return complexCalculation();
 * });
 * ```
 */
export function measureSync<T>(name: string, fn: () => T): T {
  const start = performance.now();

  try {
    const result = fn();
    const duration = performance.now() - start;

    performanceMonitor.recordMetric(name, duration);

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    performanceMonitor.recordMetric(`${name}_error`, duration, 'poor');
    throw error;
  }
}

/**
 * Report Web Vitals to analytics
 * Use in _app.tsx or layout.tsx
 *
 * @example
 * ```ts
 * import { reportWebVitals } from '@/lib/performance-monitor';
 *
 * export function reportWebVitals(metric: any) {
 *   performanceMonitor.recordMetric(metric.name, metric.value);
 * }
 * ```
 */
export function reportWebVitals(metric: any): void {
  performanceMonitor.recordMetric(metric.name, metric.value, metric.rating);
}

/**
 * Get performance summary for debugging
 */
export function getPerformanceSummary(): {
  metrics: PerformanceMetric[];
  averages: Record<string, number>;
  poorMetrics: PerformanceMetric[];
} {
  const metrics = performanceMonitor.getMetrics();
  const metricNames = [...new Set(metrics.map(m => m.name))];

  const averages: Record<string, number> = {};
  for (const name of metricNames) {
    const avg = performanceMonitor.getAverageMetric(name);
    if (avg !== null) {
      averages[name] = Math.round(avg);
    }
  }

  const poorMetrics = metrics.filter(m => m.rating === 'poor');

  return {
    metrics,
    averages,
    poorMetrics,
  };
}
