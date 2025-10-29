/**
 * Server-Side Caching Utility
 * 
 * Provides caching for server-side operations including:
 * - Database query results
 * - API responses
 * - Computed values
 * 
 * Uses Next.js unstable_cache and revalidation tags for optimal performance.
 * 
 * @module server-cache
 */

import { unstable_cache } from 'next/cache';

/**
 * Cache tags for invalidation
 */
export const CacheTags = {
  GARAGE_SALES: 'garage-sales',
  PROFILES: 'profiles',
  KNOWLEDGE: 'knowledge',
  SPONSORS: 'sponsors',
  AURORA: 'aurora',
  WEATHER: 'weather',
} as const;

/**
 * Cache TTL (in seconds)
 */
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 1800, // 30 minutes
  VERY_LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

/**
 * Cached database query wrapper
 * 
 * @example
 * ```ts
 * const garageSales = await cachedQuery(
 *   'garage-sales-active',
 *   async () => {
 *     const supabase = await createClient();
 *     return supabase.from('garage_sales').select('*');
 *   },
 *   {
 *     revalidate: CacheTTL.MEDIUM,
 *     tags: [CacheTags.GARAGE_SALES],
 *   }
 * );
 * ```
 */
export function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options: {
    revalidate?: number;
    tags?: string[];
  } = {}
): Promise<T> {
  return unstable_cache(
    queryFn,
    [key],
    {
      revalidate: options.revalidate || CacheTTL.MEDIUM,
      tags: options.tags,
    }
  )();
}

/**
 * Cached API fetch wrapper
 * 
 * @example
 * ```ts
 * const weather = await cachedFetch(
 *   'weather-yellowknife',
 *   'https://api.weather.com/...',
 *   {
 *     revalidate: CacheTTL.SHORT,
 *     tags: [CacheTags.WEATHER],
 *   }
 * );
 * ```
 */
export async function cachedFetch<T>(
  key: string,
  url: string,
  options: {
    revalidate?: number;
    tags?: string[];
    init?: RequestInit;
  } = {}
): Promise<T> {
  return unstable_cache(
    async () => {
      const response = await fetch(url, options.init);
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`);
      }
      return response.json();
    },
    [key],
    {
      revalidate: options.revalidate || CacheTTL.MEDIUM,
      tags: options.tags,
    }
  )();
}

/**
 * In-memory cache for server-side (for data that doesn't change often)
 * Note: This is per-instance, not shared across serverless functions
 */
class ServerMemoryCache {
  private store: Map<string, { data: any; expiresAt: number }> = new Map();

  set(key: string, data: any, ttlSeconds: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export const serverMemoryCache = new ServerMemoryCache();

/**
 * Memoization decorator for expensive computations
 * 
 * @example
 * ```ts
 * const expensiveCalc = memoize((a: number, b: number) => {
 *   // Heavy computation
 *   return a * b;
 * }, 300); // Cache for 5 minutes
 * ```
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  ttlSeconds: number = 300
): T {
  const cache = new Map<string, { result: any; expiresAt: number }>();

  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() < cached.expiresAt) {
      return cached.result;
    }

    const result = fn(...args);
    cache.set(key, {
      result,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });

    return result;
  }) as T;
}

