// Utility functions for YK Buddy

/**
 * Format a date string or Date object into a human-readable format
 * @param dateString - ISO date string or Date object
 * @param locale - Locale to use for formatting (defaults to 'en-US')
 * @returns Formatted date string (e.g., "Mon, Jan 15, 2025")
 * @example
 * formatDate('2025-01-15') // "Mon, Jan 15, 2025"
 * formatDate(new Date(), 'fr') // "lun., 15 janv. 2025"
 */
export function formatDate(dateString: string | Date, locale: string = 'en-US'): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a time string (HH:MM) to 12-hour format with AM/PM
 * @param timeString - Time in HH:MM format (e.g., "14:30")
 * @returns Formatted time (e.g., "2:30 PM")
 * @example
 * formatTime('14:30') // "2:30 PM"
 * formatTime('09:15') // "9:15 AM"
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers, rounded to 2 decimal places
 * @example
 * calculateDistance(62.4540, -114.3718, 62.4580, -114.3800) // 0.68
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula for calculating distance between two coordinates
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
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Combine CSS class names conditionally (className utility)
 * @param classes - Array of class names, booleans, or undefined values
 * @returns Combined class string with falsy values filtered out
 * @example
 * cn('base-class', isActive && 'active', undefined) // "base-class active"
 * cn('text-white', false, 'bg-blue') // "text-white bg-blue"
 */
export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - Date string or Date object
 * @returns Human-readable relative time
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 * formatRelativeTime('2025-01-20') // "in 5 days" (if today is Jan 15)
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(Math.abs(diffInSeconds) / seconds);

    if (interval >= 1) {
      const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
      return rtf.format(diffInSeconds > 0 ? -interval : interval, unit as Intl.RelativeTimeFormatUnit);
    }
  }

  return 'just now';
}

/**
 * Format a date range into a readable string
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range (e.g., "Jan 15 - Jan 20, 2025")
 * @example
 * formatDateRange('2025-01-15', '2025-01-20') // "Jan 15 - Jan 20, 2025"
 * formatDateRange('2025-01-15', '2025-02-20') // "Jan 15 - Feb 20, 2025"
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
  } else if (sameYear) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  } else {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
}

/**
 * Format a duration in minutes to human-readable format
 * @param minutes - Duration in minutes
 * @returns Formatted duration (e.g., "2h 30m", "45m")
 * @example
 * formatDuration(150) // "2h 30m"
 * formatDuration(45) // "45m"
 * formatDuration(0) // "0m"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 * @example
 * truncateText('This is a long text', 10) // "This is a..."
 * truncateText('Short', 10) // "Short"
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Debounce a function to prevent excessive calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 * @example
 * const debouncedSearch = debounce((query) => search(query), 300);
 * debouncedSearch('yellowknife'); // Only calls after 300ms of no activity
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

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format a number with thousands separators
 * @param num - Number to format
 * @param locale - Locale to use for formatting (defaults to 'en-US')
 * @returns Formatted number string
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234567.89) // "1,234,567.89"
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format a currency amount
 * @param amount - Amount to format
 * @param currency - Currency code (defaults to 'CAD' for Canadian dollars)
 * @param locale - Locale to use for formatting (defaults to 'en-CA')
 * @returns Formatted currency string
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(99.99, 'USD', 'en-US') // "$99.99"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CAD',
  locale: string = 'en-CA'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns True if the date is in the past
 * @example
 * isPastDate('2024-01-01') // true (if today is after Jan 1, 2024)
 * isPastDate(new Date(Date.now() + 86400000)) // false (tomorrow)
 */
export function isPastDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if the date is today
 * @example
 * isToday(new Date()) // true
 * isToday('2024-01-01') // false
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Generate a random ID (useful for temporary IDs)
 * @param prefix - Optional prefix for the ID
 * @returns Random ID string
 * @example
 * generateId() // "a1b2c3d4"
 * generateId('sale') // "sale_e5f6g7h8"
 */
export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2, 10);
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Sleep/delay execution for a specified time
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the delay
 * @example
 * await sleep(1000); // Wait 1 second
 * await sleep(500); // Wait 500ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Group an array of items by a key
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Object with grouped items
 * @example
 * groupBy([{type: 'A', val: 1}, {type: 'B', val: 2}, {type: 'A', val: 3}], 'type')
 * // { A: [{type: 'A', val: 1}, {type: 'A', val: 3}], B: [{type: 'B', val: 2}] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}
