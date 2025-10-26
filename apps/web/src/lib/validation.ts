/**
 * Validation utilities for YK Buddy
 * Provides reusable validation functions for forms, user input, and data integrity
 */

/**
 * Validate an email address
 * @param email - Email address to validate
 * @returns True if valid email format
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid-email') // false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate a Canadian phone number
 * Accepts formats: (780) 123-4567, 780-123-4567, 7801234567, +1-780-123-4567
 * @param phone - Phone number to validate
 * @returns True if valid Canadian phone format
 * @example
 * isValidPhoneNumber('(867) 873-4636') // true
 * isValidPhoneNumber('867-873-4636') // true
 * isValidPhoneNumber('12345') // false
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate a Canadian postal code
 * Format: A1A 1A1 or A1A1A1
 * @param postalCode - Postal code to validate
 * @returns True if valid Canadian postal code
 * @example
 * isValidPostalCode('X1A 2N4') // true (Yellowknife postal code)
 * isValidPostalCode('X1A2N4') // true
 * isValidPostalCode('12345') // false
 */
export function isValidPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * Validate coordinates (latitude and longitude)
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns True if valid coordinates
 * @example
 * isValidCoordinates(62.4540, -114.3718) // true (Yellowknife)
 * isValidCoordinates(100, 200) // false
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Validate a URL
 * @param url - URL to validate
 * @returns True if valid URL format
 * @example
 * isValidUrl('https://ykbuddy.com') // true
 * isValidUrl('not-a-url') // false
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate a date string is in ISO format (YYYY-MM-DD)
 * @param dateString - Date string to validate
 * @returns True if valid ISO date format
 * @example
 * isValidDateString('2025-01-15') // true
 * isValidDateString('01/15/2025') // false
 */
export function isValidDateString(dateString: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate a time string is in HH:MM format
 * @param timeString - Time string to validate
 * @returns True if valid time format
 * @example
 * isValidTimeString('14:30') // true
 * isValidTimeString('2:30 PM') // false
 */
export function isValidTimeString(timeString: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
}

/**
 * Validate password strength
 * Requirements: At least 8 characters, contains uppercase, lowercase, and number
 * @param password - Password to validate
 * @returns Object with validation result and message
 * @example
 * validatePassword('Weak123') // { valid: true, message: 'Password is strong' }
 * validatePassword('weak') // { valid: false, message: '...' }
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  return { valid: true, message: 'Password is strong' };
}

/**
 * Sanitize a string by removing HTML tags and trimming whitespace
 * @param input - String to sanitize
 * @returns Sanitized string
 * @example
 * sanitizeString('<script>alert("xss")</script>Hello') // 'Hello'
 * sanitizeString('  spaced  ') // 'spaced'
 */
export function sanitizeString(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Validate that a value is within a numeric range
 * @param value - Value to check
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if value is within range
 * @example
 * isInRange(5, 1, 10) // true
 * isInRange(0, 1, 10) // false
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate KP index value (0-9)
 * Used for Aurora KP index validation
 * @param kp - KP index value
 * @returns True if valid KP index
 * @example
 * isValidKPIndex(5) // true
 * isValidKPIndex(10) // false
 */
export function isValidKPIndex(kp: number): boolean {
  return isInRange(kp, 0, 9);
}

/**
 * Validate that an array is not empty
 * @param array - Array to check
 * @returns True if array has at least one element
 * @example
 * isNotEmptyArray([1, 2, 3]) // true
 * isNotEmptyArray([]) // false
 */
export function isNotEmptyArray<T>(array: T[]): boolean {
  return Array.isArray(array) && array.length > 0;
}

/**
 * Validate that a string is not empty or just whitespace
 * @param str - String to check
 * @returns True if string has content
 * @example
 * isNotEmptyString('hello') // true
 * isNotEmptyString('   ') // false
 */
export function isNotEmptyString(str: string): boolean {
  return typeof str === 'string' && str.trim().length > 0;
}

/**
 * Validate garage sale date (must be in the future)
 * @param dateString - Date to validate (YYYY-MM-DD format)
 * @returns Object with validation result and message
 * @example
 * validateGarageSaleDate('2025-12-01') // { valid: true, message: 'Date is valid' }
 * validateGarageSaleDate('2020-01-01') // { valid: false, message: 'Date must be in the future' }
 */
export function validateGarageSaleDate(dateString: string): { valid: boolean; message: string } {
  if (!isValidDateString(dateString)) {
    return { valid: false, message: 'Invalid date format. Use YYYY-MM-DD' };
  }

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    return { valid: false, message: 'Date must be in the future' };
  }

  return { valid: true, message: 'Date is valid' };
}

/**
 * Validate time range (end time must be after start time)
 * @param startTime - Start time (HH:MM format)
 * @param endTime - End time (HH:MM format)
 * @returns Object with validation result and message
 * @example
 * validateTimeRange('09:00', '17:00') // { valid: true, message: 'Time range is valid' }
 * validateTimeRange('17:00', '09:00') // { valid: false, message: 'End time must be after start time' }
 */
export function validateTimeRange(
  startTime: string,
  endTime: string
): { valid: boolean; message: string } {
  if (!isValidTimeString(startTime)) {
    return { valid: false, message: 'Invalid start time format. Use HH:MM' };
  }

  if (!isValidTimeString(endTime)) {
    return { valid: false, message: 'Invalid end time format. Use HH:MM' };
  }

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (endMinutes <= startMinutes) {
    return { valid: false, message: 'End time must be after start time' };
  }

  return { valid: true, message: 'Time range is valid' };
}

/**
 * Validate image file type
 * @param filename - Filename or MIME type to check
 * @returns True if valid image type
 * @example
 * isValidImageFile('photo.jpg') // true
 * isValidImageFile('image/png') // true
 * isValidImageFile('document.pdf') // false
 */
export function isValidImageFile(filename: string): boolean {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  const imageMimeTypes = /^image\/(jpeg|png|gif|webp|svg\+xml)$/i;

  return imageExtensions.test(filename) || imageMimeTypes.test(filename);
}

/**
 * Validate file size (in bytes)
 * @param sizeInBytes - File size in bytes
 * @param maxSizeMB - Maximum allowed size in MB
 * @returns Object with validation result and message
 * @example
 * validateFileSize(1048576, 5) // { valid: true, message: 'File size is valid' }
 * validateFileSize(10485760, 5) // { valid: false, message: 'File size exceeds 5 MB limit' }
 */
export function validateFileSize(
  sizeInBytes: number,
  maxSizeMB: number
): { valid: boolean; message: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (sizeInBytes > maxSizeBytes) {
    return { valid: false, message: `File size exceeds ${maxSizeMB} MB limit` };
  }

  return { valid: true, message: 'File size is valid' };
}
