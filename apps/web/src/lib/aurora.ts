/**
 * Aurora and Northern-specific utilities for YK Buddy
 * Provides functions for aurora forecasting, KP index interpretation, and Yellowknife-specific data
 */

/**
 * Aurora viewing quality levels
 */
export type AuroraQuality = 'poor' | 'fair' | 'good' | 'excellent' | 'outstanding';

/**
 * Seasons in Yellowknife
 */
export type YellowknifeSeason = 'winter' | 'spring' | 'summer' | 'fall';

/**
 * Get aurora viewing quality based on KP index
 * @param kpIndex - KP index value (0-9)
 * @returns Aurora viewing quality descriptor
 * @example
 * getAuroraQuality(3) // 'fair'
 * getAuroraQuality(7) // 'excellent'
 */
export function getAuroraQuality(kpIndex: number): AuroraQuality {
  if (kpIndex >= 7) return 'outstanding';
  if (kpIndex >= 5) return 'excellent';
  if (kpIndex >= 3) return 'good';
  if (kpIndex >= 1) return 'fair';
  return 'poor';
}

/**
 * Get human-readable description of aurora viewing conditions
 * @param kpIndex - KP index value (0-9)
 * @returns Detailed description of expected aurora conditions
 * @example
 * getAuroraDescription(5)
 * // "Strong aurora activity! Visible across Yellowknife with bright colors and movement."
 */
export function getAuroraDescription(kpIndex: number): string {
  if (kpIndex >= 7) {
    return 'Exceptional aurora storm! Brilliant displays with rapid movement, multiple colors, and corona formations. Visible across entire sky.';
  }
  if (kpIndex >= 5) {
    return 'Strong aurora activity! Visible across Yellowknife with bright colors, dancing movements, and occasional corona.';
  }
  if (kpIndex >= 3) {
    return 'Moderate aurora activity. Good chance of seeing green bands and arcs in northern sky. Some movement and color variation.';
  }
  if (kpIndex >= 1) {
    return 'Low aurora activity. Faint green glow visible in northern sky. Best viewed away from city lights.';
  }
  return 'Minimal aurora activity. Very faint glow possible, but conditions not ideal for viewing.';
}

/**
 * Get the best viewing hours for aurora in Yellowknife
 * Peak activity is typically between 10 PM and 2 AM
 * @param date - Optional date (defaults to today)
 * @returns Array of best viewing hours (24-hour format)
 * @example
 * getBestAuroraViewingHours() // [22, 23, 0, 1, 2]
 */
export function getBestAuroraViewingHours(date?: Date): number[] {
  // In Yellowknife, best viewing is typically 10 PM to 2 AM
  return [22, 23, 0, 1, 2];
}

/**
 * Check if it's currently a good time to view aurora
 * @param kpIndex - Current KP index
 * @param currentHour - Current hour (0-23), defaults to current time
 * @returns True if conditions are favorable for aurora viewing
 * @example
 * isGoodAuroraViewingTime(4, 23) // true (11 PM with KP 4)
 * isGoodAuroraViewingTime(1, 14) // false (2 PM with low KP)
 */
export function isGoodAuroraViewingTime(kpIndex: number, currentHour?: number): boolean {
  const hour = currentHour ?? new Date().getHours();
  const bestHours = getBestAuroraViewingHours();

  // KP must be at least 2 for decent viewing
  const kpGood = kpIndex >= 2;

  // Hour must be in best viewing window
  const timeGood = bestHours.includes(hour);

  return kpGood && timeGood;
}

/**
 * Get the current season in Yellowknife based on date
 * @param date - Date to check (defaults to today)
 * @returns Current season
 * @example
 * getCurrentSeason(new Date('2025-01-15')) // 'winter'
 * getCurrentSeason(new Date('2025-07-15')) // 'summer'
 */
export function getCurrentSeason(date: Date = new Date()): YellowknifeSeason {
  const month = date.getMonth() + 1; // 1-12

  // Yellowknife seasons (approximate)
  if (month >= 11 || month <= 3) return 'winter'; // Nov - Mar
  if (month >= 4 && month <= 5) return 'spring'; // Apr - May
  if (month >= 6 && month <= 8) return 'summer'; // Jun - Aug
  return 'fall'; // Sep - Oct
}

/**
 * Get temperature range for current season in Yellowknife
 * @param season - Season to get temperature for
 * @returns Object with min and max temperatures in Celsius
 * @example
 * getSeasonalTemperature('winter') // { min: -30, max: -15 }
 * getSeasonalTemperature('summer') // { min: 10, max: 25 }
 */
export function getSeasonalTemperature(season: YellowknifeSeason): { min: number; max: number } {
  const temps = {
    winter: { min: -30, max: -15 },
    spring: { min: -5, max: 10 },
    summer: { min: 10, max: 25 },
    fall: { min: -5, max: 10 },
  };
  return temps[season];
}

/**
 * Get daylight hours for current season in Yellowknife
 * @param season - Season to get daylight for
 * @returns Approximate daylight hours per day
 * @example
 * getDaylightHours('winter') // 4.5 (very short days)
 * getDaylightHours('summer') // 20 (midnight sun)
 */
export function getDaylightHours(season: YellowknifeSeason): number {
  const hours = {
    winter: 4.5, // Very short days (mid-winter)
    spring: 15, // Rapidly increasing daylight
    summer: 20, // Midnight sun
    fall: 12, // Equinox
  };
  return hours[season];
}

/**
 * Check if it's aurora season (darker months with better viewing)
 * Aurora viewing is best from late August to mid-April
 * @param date - Date to check (defaults to today)
 * @returns True if it's prime aurora season
 * @example
 * isAuroraSeason(new Date('2025-01-15')) // true
 * isAuroraSeason(new Date('2025-07-15')) // false (too bright)
 */
export function isAuroraSeason(date: Date = new Date()): boolean {
  const month = date.getMonth() + 1; // 1-12
  // Aurora season: September through April (when nights are dark enough)
  return month >= 9 || month <= 4;
}

/**
 * Calculate approximate sunset time for Yellowknife
 * Note: This is a simplified approximation. For precise times, use a proper astronomy library.
 * @param date - Date to calculate sunset for
 * @returns Approximate sunset hour (24-hour format)
 * @example
 * getApproximateSunset(new Date('2025-01-15')) // ~16 (4 PM in winter)
 * getApproximateSunset(new Date('2025-07-15')) // ~23 (11 PM in summer)
 */
export function getApproximateSunset(date: Date = new Date()): number {
  const season = getCurrentSeason(date);
  const sunsetHours = {
    winter: 16, // 4 PM
    spring: 21, // 9 PM
    summer: 23, // 11 PM (midnight sun period)
    fall: 18, // 6 PM
  };
  return sunsetHours[season];
}

/**
 * Get aurora color palette based on KP index intensity
 * @param kpIndex - KP index value (0-9)
 * @returns Array of hex color codes for aurora visualization
 * @example
 * getAuroraColors(3) // ['#10B981', '#34D399'] (green aurora)
 * getAuroraColors(7) // ['#10B981', '#8B5CF6', '#F472B6'] (multi-color storm)
 */
export function getAuroraColors(kpIndex: number): string[] {
  if (kpIndex >= 7) {
    // Outstanding - full spectrum
    return ['#10B981', '#3B82F6', '#8B5CF6', '#F472B6'];
  }
  if (kpIndex >= 5) {
    // Excellent - green, blue, purple
    return ['#10B981', '#3B82F6', '#8B5CF6'];
  }
  if (kpIndex >= 3) {
    // Good - green and blue
    return ['#10B981', '#3B82F6'];
  }
  // Fair/Poor - mostly green
  return ['#10B981', '#34D399'];
}

/**
 * Get recommended clothing based on Yellowknife temperature
 * @param tempCelsius - Temperature in Celsius
 * @returns Array of recommended clothing items
 * @example
 * getRecommendedClothing(-30)
 * // ['Extreme cold parka', 'Insulated boots', 'Face mask', 'Heavy mittens']
 */
export function getRecommendedClothing(tempCelsius: number): string[] {
  if (tempCelsius <= -30) {
    return [
      'Extreme cold parka (-40°C rated)',
      'Insulated boots',
      'Face mask or balaclava',
      'Heavy mittens (not gloves)',
      'Thermal base layers',
      'Winter pants or snow pants',
    ];
  }
  if (tempCelsius <= -20) {
    return [
      'Heavy winter parka',
      'Winter boots',
      'Toque/winter hat',
      'Insulated gloves',
      'Scarf',
      'Warm base layers',
    ];
  }
  if (tempCelsius <= -10) {
    return ['Winter jacket', 'Winter boots', 'Hat', 'Gloves', 'Long pants'];
  }
  if (tempCelsius <= 0) {
    return ['Warm jacket', 'Closed shoes', 'Light gloves (optional)', 'Long pants'];
  }
  if (tempCelsius <= 10) {
    return ['Light jacket or sweater', 'Comfortable shoes', 'Long pants or jeans'];
  }
  return ['T-shirt or light shirt', 'Comfortable shoes', 'Shorts or light pants'];
}

/**
 * Yellowknife coordinates (for distance calculations, maps, etc.)
 */
export const YELLOWKNIFE_COORDS = {
  latitude: 62.454,
  longitude: -114.3718,
  name: 'Yellowknife, NT',
} as const;

/**
 * Get distance warning message for aurora viewing locations
 * @param distanceKm - Distance from city center in kilometers
 * @returns Warning or recommendation message
 * @example
 * getAuroraLocationAdvice(5) // "Good location! Reduced light pollution."
 * getAuroraLocationAdvice(30) // "Remote location - bring emergency supplies and tell someone your plans."
 */
export function getAuroraLocationAdvice(distanceKm: number): string {
  if (distanceKm === 0) {
    return 'City center - some light pollution but still viewable with good KP index.';
  }
  if (distanceKm <= 5) {
    return 'Good location! Reduced light pollution for better viewing.';
  }
  if (distanceKm <= 15) {
    return 'Excellent location! Minimal light pollution for optimal aurora viewing.';
  }
  if (distanceKm <= 30) {
    return 'Remote location - pristine viewing but ensure you have proper cold weather gear and transportation.';
  }
  return 'Very remote location - bring emergency supplies, tell someone your plans, and check weather conditions.';
}
