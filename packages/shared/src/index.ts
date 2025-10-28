/**
 * YK Companion Shared Utilities
 * Core utilities and helpers shared across web, mobile, and API apps
 */

// Define Season enum locally (was imported from types package)
enum Season {
  WINTER = 'winter',
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
}

// ============================================================
// EXPORTS - New Utility Modules
// ============================================================

// Async and Promise utilities (excluding retryWithBackoff to avoid conflict)
export {
  debounce,
  throttle,
  asyncMap,
  asyncFilter,
  asyncForEach,
  sleep,
  timeout,
  pollUntil,
  asyncPool,
} from './async';

// Form validation and management utilities
export * from './forms';

// Query parameter and URL utilities
export * from './query-params';

// Date and time utilities (Yellowknife-specific)
export * from './datetime';

// API retry logic with exponential backoff (Architecture: Reliability Strategy)
// This is the improved version, replacing the one from async.ts
export {
  retryWithBackoff,
  withRetry,
  fetchWithRetry,
  RetryOptions,
} from './retry';

// Input validation with Zod schemas (Architecture: Security Strategy)
// Note: Exports ZodValidationResult (renamed to avoid conflict with forms ValidationResult)
export * from './validation';

// ============================================================
// LEGACY UTILITIES (backward compatibility)
// Keeping these for existing code that imports them
// ============================================================

/**
 * Get the current season based on the date
 */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth();

  if (month >= 11 || month <= 2) {
    return Season.WINTER;
  } else if (month >= 3 && month <= 4) {
    return Season.SPRING;
  } else if (month >= 5 && month <= 7) {
    return Season.SUMMER;
  } else {
    return Season.FALL;
  }
}

/**
 * Format currency in CAD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

/**
 * Calculate the number of days between two dates
 */
export function daysBetween(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if aurora viewing is favorable based on KP index
 */
export function isAuroraFavorable(kpIndex: number, cloudCover: number): boolean {
  return kpIndex >= 3 && cloudCover < 50;
}

/**
 * Get aurora quality rating
 */
export function getAuroraQuality(kpIndex: number): 'poor' | 'fair' | 'good' | 'excellent' {
  if (kpIndex >= 7) return 'excellent';
  if (kpIndex >= 5) return 'good';
  if (kpIndex >= 3) return 'fair';
  return 'poor';
}

/**
 * Calculate estimated trip cost
 */
export interface TripCostEstimate {
  accommodation: number;
  activities: number;
  food: number;
  transportation: number;
  total: number;
}

export function estimateTripCost(
  numberOfDays: number,
  accommodationPerNight: number,
  activityCosts: number[],
  numberOfPeople: number = 1
): TripCostEstimate {
  const accommodation = numberOfDays * accommodationPerNight * numberOfPeople;
  const activities = activityCosts.reduce((sum, cost) => sum + cost, 0) * numberOfPeople;
  const food = numberOfDays * 75 * numberOfPeople; // Estimate $75/day per person for food
  const transportation = 50 * numberOfPeople; // Estimate for local transportation

  return {
    accommodation,
    activities,
    food,
    transportation,
    total: accommodation + activities + food + transportation,
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Get distance between two coordinates (Haversine formula)
 */
export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
