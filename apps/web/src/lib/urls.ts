/**
 * URL and navigation utilities for YK Buddy
 * Provides helper functions for building URLs, generating links, and handling navigation
 */

import { YELLOWKNIFE_COORDS } from './aurora';

/**
 * Generate Google Maps directions URL
 * @param lat - Destination latitude
 * @param lng - Destination longitude
 * @param origin - Optional origin (defaults to "current location")
 * @returns Google Maps directions URL
 * @example
 * getDirectionsUrl(62.454, -114.372) // From current location
 * getDirectionsUrl(62.454, -114.372, { lat: 62.45, lng: -114.37 }) // From specific point
 */
export function getDirectionsUrl(
  lat: number,
  lng: number,
  origin?: { lat: number; lng: number }
): string {
  const destination = `${lat},${lng}`;
  const originParam = origin ? `&origin=${origin.lat},${origin.lng}` : '';
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}${originParam}`;
}

/**
 * Generate Google Maps search URL for an address
 * @param address - Address to search for
 * @returns Google Maps search URL
 * @example
 * getMapSearchUrl('50 Street, Yellowknife, NT')
 * // https://www.google.com/maps/search/?api=1&query=50+Street%2C+Yellowknife...
 */
export function getMapSearchUrl(address: string): string {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}

/**
 * Generate Mapbox static map image URL
 * @param lat - Center latitude
 * @param lng - Center longitude
 * @param zoom - Zoom level (0-22)
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param mapboxToken - Mapbox access token
 * @returns Mapbox static image URL
 * @example
 * getMapboxStaticImageUrl(62.454, -114.372, 12, 400, 300, token)
 */
export function getMapboxStaticImageUrl(
  lat: number,
  lng: number,
  zoom: number,
  width: number,
  height: number,
  mapboxToken: string
): string {
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/${lng},${lat},${zoom}/${width}x${height}?access_token=${mapboxToken}`;
}

/**
 * Generate a share URL for social media
 * @param platform - Social media platform
 * @param url - URL to share
 * @param text - Optional text/caption
 * @returns Social media share URL
 * @example
 * getSocialShareUrl('facebook', 'https://ykbuddy.com', 'Check out YK Buddy!')
 * getSocialShareUrl('twitter', window.location.href, 'Just found this amazing garage sale!')
 */
export function getSocialShareUrl(
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email',
  url: string,
  text?: string
): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = text ? encodeURIComponent(text) : '';

  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
  };

  return urls[platform];
}

/**
 * Generate a phone call URL
 * @param phoneNumber - Phone number (will be cleaned of formatting)
 * @returns tel: URL for phone calls
 * @example
 * getPhoneUrl('(867) 873-4636') // 'tel:8678734636'
 * getPhoneUrl('867-873-4636') // 'tel:8678734636'
 */
export function getPhoneUrl(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return `tel:${cleaned}`;
}

/**
 * Generate an email URL with optional subject and body
 * @param email - Email address
 * @param subject - Optional email subject
 * @param body - Optional email body
 * @returns mailto: URL
 * @example
 * getEmailUrl('hello@ykbuddy.ca', 'Question about garage sale', 'Hi, I have a question...')
 */
export function getEmailUrl(email: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);

  const queryString = params.toString();
  return `mailto:${email}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Get weather forecast URL for Yellowknife
 * @param source - Weather data source
 * @returns Weather forecast URL
 * @example
 * getWeatherUrl('weather-canada') // Environment Canada weather
 * getWeatherUrl('weather-network') // The Weather Network
 */
export function getWeatherUrl(
  source: 'weather-canada' | 'weather-network' | 'accuweather' = 'weather-canada'
): string {
  const urls = {
    'weather-canada': 'https://weather.gc.ca/city/pages/nt-24_metric_e.html',
    'weather-network': 'https://www.theweathernetwork.com/ca/weather/northwest-territories/yellowknife',
    accuweather: 'https://www.accuweather.com/en/ca/yellowknife/x0e/weather-forecast/2873',
  };
  return urls[source];
}

/**
 * Get aurora forecast URL
 * @param source - Aurora forecast source
 * @returns Aurora forecast URL
 * @example
 * getAuroraForecastUrl('aurora-watch') // AuroraWatch Canada
 * getAuroraForecastUrl('space-weather') // NOAA Space Weather
 */
export function getAuroraForecastUrl(
  source: 'aurora-watch' | 'space-weather' | 'aurora-service' = 'aurora-watch'
): string {
  const urls = {
    'aurora-watch': 'https://www.aurorawatch.ca/',
    'space-weather': 'https://www.swpc.noaa.gov/products/aurora-30-minute-forecast',
    'aurora-service': 'https://www.gi.alaska.edu/monitors/aurora-forecast',
  };
  return urls[source];
}

/**
 * Build an internal app route with query parameters
 * @param path - Base path (e.g., '/living/garage-sales')
 * @param params - Query parameters object
 * @returns Complete URL path with query string
 * @example
 * buildRoute('/living/garage-sales', { search: 'furniture', date: '2025-01-15' })
 * // '/living/garage-sales?search=furniture&date=2025-01-15'
 */
export function buildRoute(path: string, params?: Record<string, string | number | boolean>): string {
  if (!params || Object.keys(params).length === 0) return path;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });

  return `${path}?${searchParams.toString()}`;
}

/**
 * Parse query string into object
 * @param queryString - Query string (with or without leading ?)
 * @returns Object with query parameters
 * @example
 * parseQueryString('?search=furniture&date=2025-01-15')
 * // { search: 'furniture', date: '2025-01-15' }
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString.replace(/^\?/, ''));
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

/**
 * Get the current URL without query parameters
 * @returns Clean URL path
 * @example
 * // Current URL: https://ykbuddy.com/garage-sales?search=tools
 * getCleanUrl() // 'https://ykbuddy.com/garage-sales'
 */
export function getCleanUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin + window.location.pathname;
}

/**
 * Generate a shareable URL for an item with optional UTM parameters
 * @param path - Item path
 * @param utmParams - UTM tracking parameters
 * @returns Full shareable URL with UTM parameters
 * @example
 * getShareableUrl('/living/garage-sales/123', {
 *   source: 'facebook',
 *   medium: 'social',
 *   campaign: 'garage-sale-promotion'
 * })
 */
export function getShareableUrl(
  path: string,
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  }
): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ykbuddy.com';
  let url = `${baseUrl}${path}`;

  if (utmParams) {
    const params = new URLSearchParams();
    if (utmParams.source) params.append('utm_source', utmParams.source);
    if (utmParams.medium) params.append('utm_medium', utmParams.medium);
    if (utmParams.campaign) params.append('utm_campaign', utmParams.campaign);
    if (utmParams.content) params.append('utm_content', utmParams.content);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  }

  return url;
}

/**
 * Check if a URL is external (different domain)
 * @param url - URL to check
 * @returns True if external URL
 * @example
 * isExternalUrl('https://google.com') // true
 * isExternalUrl('/about') // false
 * isExternalUrl('https://ykbuddy.com/contact') // false (same domain)
 */
export function isExternalUrl(url: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Get YouTube embed URL from various YouTube URL formats
 * @param url - YouTube video URL
 * @returns YouTube embed URL or null if invalid
 * @example
 * getYouTubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
 * // 'https://www.youtube.com/embed/dQw4w9WgXcQ'
 * getYouTubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ')
 * // 'https://www.youtube.com/embed/dQw4w9WgXcQ'
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return null;
}

/**
 * Generate a calendar event URL (Google Calendar)
 * @param event - Event details
 * @returns Google Calendar add event URL
 * @example
 * getCalendarEventUrl({
 *   title: 'Garage Sale',
 *   start: '2025-01-15T09:00:00',
 *   end: '2025-01-15T17:00:00',
 *   description: 'Moving sale with furniture',
 *   location: '50 Street, Yellowknife'
 * })
 */
export function getCalendarEventUrl(event: {
  title: string;
  start: string; // ISO format
  end: string; // ISO format
  description?: string;
  location?: string;
}): string {
  const params = new URLSearchParams();
  params.append('action', 'TEMPLATE');
  params.append('text', event.title);

  // Convert ISO dates to Google Calendar format (YYYYMMDDTHHmmss)
  const formatDate = (isoDate: string) => {
    return isoDate.replace(/[-:]/g, '').split('.')[0];
  };

  params.append('dates', `${formatDate(event.start)}/${formatDate(event.end)}`);

  if (event.description) params.append('details', event.description);
  if (event.location) params.append('location', event.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Get coordinates from Google Maps URL or place ID
 * Note: This is a simplified parser. For production, use Google Maps API.
 * @param mapsUrl - Google Maps URL
 * @returns Coordinates or null if not found
 * @example
 * getCoordsFromMapsUrl('https://www.google.com/maps/@62.4540,-114.3718,15z')
 * // { lat: 62.4540, lng: -114.3718 }
 */
export function getCoordsFromMapsUrl(mapsUrl: string): { lat: number; lng: number } | null {
  const coordPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = mapsUrl.match(coordPattern);

  if (match) {
    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[2]),
    };
  }

  return null;
}
