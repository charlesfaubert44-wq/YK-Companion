/**
 * LocalStorage utilities for YK Buddy
 * Provides type-safe localStorage operations with error handling and TTL support
 */

/**
 * Storage item with optional expiration
 */
interface StorageItem<T> {
  value: T;
  expiry?: number;
}

/**
 * Set an item in localStorage with optional expiration time
 * @param key - Storage key
 * @param value - Value to store (will be JSON serialized)
 * @param ttlMinutes - Time to live in minutes (optional)
 * @returns True if successful, false otherwise
 * @example
 * setLocalStorage('user-preferences', { theme: 'dark' }, 60); // Expires in 60 minutes
 * setLocalStorage('garage-sales-cache', salesData, 30);
 */
export function setLocalStorage<T>(key: string, value: T, ttlMinutes?: number): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const item: StorageItem<T> = {
      value,
      expiry: ttlMinutes ? Date.now() + ttlMinutes * 60 * 1000 : undefined,
    };
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Get an item from localStorage with expiration check
 * @param key - Storage key
 * @returns Stored value or null if not found/expired
 * @example
 * const preferences = getLocalStorage<UserPreferences>('user-preferences');
 * if (preferences) console.log(preferences.theme);
 */
export function getLocalStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item: StorageItem<T> = JSON.parse(itemStr);

    // Check if item has expired
    if (item.expiry && Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.error(`Error getting localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Remove an item from localStorage
 * @param key - Storage key to remove
 * @returns True if successful, false otherwise
 * @example
 * removeLocalStorage('temp-data');
 */
export function removeLocalStorage(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all localStorage items with a specific prefix
 * Useful for clearing app-specific data without affecting other apps
 * @param prefix - Key prefix to match (e.g., 'yk-buddy-')
 * @returns Number of items cleared
 * @example
 * clearLocalStorageByPrefix('yk-buddy-cache-'); // Clears all cache entries
 */
export function clearLocalStorageByPrefix(prefix: string): number {
  if (typeof window === 'undefined') return 0;

  try {
    let cleared = 0;
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
        cleared++;
      }
    });

    return cleared;
  } catch (error) {
    console.error(`Error clearing localStorage with prefix "${prefix}":`, error);
    return 0;
  }
}

/**
 * Get all localStorage items with a specific prefix
 * @param prefix - Key prefix to match
 * @returns Object with matching keys and values
 * @example
 * const cacheItems = getLocalStorageByPrefix<any>('yk-buddy-cache-');
 * console.log(cacheItems); // { 'yk-buddy-cache-sales': [...], ... }
 */
export function getLocalStorageByPrefix<T>(prefix: string): Record<string, T> {
  if (typeof window === 'undefined') return {};

  try {
    const result: Record<string, T> = {};
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        const value = getLocalStorage<T>(key);
        if (value !== null) {
          result[key] = value;
        }
      }
    });

    return result;
  } catch (error) {
    console.error(`Error getting localStorage items with prefix "${prefix}":`, error);
    return {};
  }
}

/**
 * Check if localStorage is available and working
 * @returns True if localStorage is available
 * @example
 * if (isLocalStorageAvailable()) {
 *   setLocalStorage('key', 'value');
 * }
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the size of localStorage in bytes
 * @returns Size in bytes
 * @example
 * const size = getLocalStorageSize();
 * console.log(`LocalStorage using ${size} bytes`);
 */
export function getLocalStorageSize(): number {
  if (typeof window === 'undefined') return 0;

  try {
    let total = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += key.length + (localStorage[key]?.length || 0);
      }
    }
    return total;
  } catch {
    return 0;
  }
}

/**
 * Update a specific property in a stored object without overwriting the entire object
 * @param key - Storage key
 * @param updates - Partial object with properties to update
 * @returns True if successful, false otherwise
 * @example
 * updateLocalStorage('user-preferences', { theme: 'light' }); // Only updates theme
 */
export function updateLocalStorage<T extends Record<string, unknown>>(
  key: string,
  updates: Partial<T>
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const existing = getLocalStorage<T>(key);
    if (!existing || typeof existing !== 'object') {
      return setLocalStorage(key, updates as T);
    }

    const merged = { ...existing, ...updates };
    return setLocalStorage(key, merged);
  } catch (error) {
    console.error(`Error updating localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Common storage keys used in YK Buddy
 * Helps maintain consistency and avoid typos
 */
export const STORAGE_KEYS = {
  LANGUAGE: 'yk-buddy-language',
  USER_PREFERENCES: 'yk-buddy-user-preferences',
  SAVED_ITEMS: 'yk-buddy-saved-items',
  ITINERARY: 'yk-buddy-itinerary',
  GARAGE_SALES_CACHE: 'yk-buddy-cache-garage-sales',
  WEATHER_CACHE: 'yk-buddy-cache-weather',
  AURORA_CACHE: 'yk-buddy-cache-aurora',
  MAP_SETTINGS: 'yk-buddy-map-settings',
  LAST_VISIT: 'yk-buddy-last-visit',
  ONBOARDING_COMPLETE: 'yk-buddy-onboarding-complete',
  SEARCH_HISTORY: 'yk-buddy-search-history',
  VIEWED_ITEMS: 'yk-buddy-viewed-items',
} as const;
