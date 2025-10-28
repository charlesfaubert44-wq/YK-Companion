/**
 * YK Companion Shared Utilities
 * Core utilities and helpers shared across web, mobile, and API apps
 */
declare enum Season {
    WINTER = "winter",
    SPRING = "spring",
    SUMMER = "summer",
    FALL = "fall"
}
export { safeAsync, asyncPool, asyncSequential, withTimeout, debounceAsync, throttleAsync, sleep, pollUntil, asyncCache, asyncAllSettled, asyncBatch, AsyncResult, } from './async';
export * from './forms';
export * from './query-params';
export * from './datetime';
export { retryWithBackoff, withRetry, fetchWithRetry, RetryOptions, } from './retry';
export * from './validation';
/**
 * Get the current season based on the date
 */
export declare function getCurrentSeason(date?: Date): Season;
/**
 * Format currency in CAD
 */
export declare function formatCurrency(amount: number): string;
/**
 * Calculate the number of days between two dates
 */
export declare function daysBetween(start: Date, end: Date): number;
/**
 * Check if aurora viewing is favorable based on KP index
 */
export declare function isAuroraFavorable(kpIndex: number, cloudCover: number): boolean;
/**
 * Get aurora quality rating
 */
export declare function getAuroraQuality(kpIndex: number): 'poor' | 'fair' | 'good' | 'excellent';
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
export declare function estimateTripCost(numberOfDays: number, accommodationPerNight: number, activityCosts: number[], numberOfPeople?: number): TripCostEstimate;
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Generate a slug from a string
 */
export declare function slugify(text: string): string;
/**
 * Get distance between two coordinates (Haversine formula)
 */
export declare function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
//# sourceMappingURL=index.d.ts.map