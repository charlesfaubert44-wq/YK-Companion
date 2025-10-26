/**
 * TypeScript type guard utilities for YK Buddy
 * Provides runtime type checking and validation functions
 */

import type { UserType, BudgetRange, ItemType } from '@/types/database.types';

/**
 * Check if value is a valid UserType
 * @param value - Value to check
 * @returns True if value is a valid UserType
 * @example
 * if (isUserType(params.type)) {
 *   // TypeScript knows params.type is 'visiting' | 'living' | 'moving'
 * }
 */
export function isUserType(value: unknown): value is UserType {
  return value === 'visiting' || value === 'living' || value === 'moving';
}

/**
 * Check if value is a valid BudgetRange
 * @param value - Value to check
 * @returns True if value is a valid BudgetRange
 */
export function isBudgetRange(value: unknown): value is BudgetRange {
  return value === 'budget' || value === 'moderate' || value === 'luxury';
}

/**
 * Check if value is a valid ItemType
 * @param value - Value to check
 * @returns True if value is a valid ItemType
 */
export function isItemType(value: unknown): value is ItemType {
  return (
    value === 'activity' ||
    value === 'event' ||
    value === 'accommodation' ||
    value === 'job' ||
    value === 'housing'
  );
}

/**
 * Check if value is a non-empty string
 * @param value - Value to check
 * @returns True if value is a non-empty string
 * @example
 * if (isNonEmptyString(input)) {
 *   // TypeScript knows input is string and has length > 0
 *   console.log(input.toUpperCase());
 * }
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if value is a valid number (not NaN or Infinity)
 * @param value - Value to check
 * @returns True if value is a valid number
 * @example
 * if (isValidNumber(input)) {
 *   // Safe to use in calculations
 *   const result = input * 2;
 * }
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Check if value is a valid date object
 * @param value - Value to check
 * @returns True if value is a valid Date
 * @example
 * if (isValidDate(input)) {
 *   console.log(input.toISOString());
 * }
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Check if value is a non-empty array
 * @param value - Value to check
 * @returns True if value is a non-empty array
 * @example
 * if (isNonEmptyArray(items)) {
 *   // TypeScript knows items has at least one element
 *   const first = items[0];
 * }
 */
export function isNonEmptyArray<T>(value: unknown): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Check if value is an array of strings
 * @param value - Value to check
 * @returns True if value is an array of strings
 * @example
 * if (isStringArray(tags)) {
 *   tags.forEach(tag => console.log(tag.toUpperCase()));
 * }
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Check if value is an array of numbers
 * @param value - Value to check
 * @returns True if value is an array of numbers
 */
export function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number');
}

/**
 * Check if value is a plain object (not null, array, or other types)
 * @param value - Value to check
 * @returns True if value is a plain object
 * @example
 * if (isPlainObject(data)) {
 *   Object.keys(data).forEach(key => console.log(key));
 * }
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

/**
 * Check if value has a specific property
 * @param obj - Object to check
 * @param key - Property key
 * @returns True if object has the property
 * @example
 * if (hasProperty(data, 'email')) {
 *   // TypeScript knows data.email exists
 *   console.log(data.email);
 * }
 */
export function hasProperty<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return isPlainObject(obj) && key in obj;
}

/**
 * Check if value is a function
 * @param value - Value to check
 * @returns True if value is a function
 * @example
 * if (isFunction(callback)) {
 *   callback();
 * }
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Check if value is null or undefined
 * @param value - Value to check
 * @returns True if value is null or undefined
 * @example
 * if (isNullish(value)) {
 *   value = defaultValue;
 * }
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if value is defined (not null or undefined)
 * @param value - Value to check
 * @returns True if value is not null or undefined
 * @example
 * const items = data.filter(isDefined); // Remove null/undefined items
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if value is a boolean
 * @param value - Value to check
 * @returns True if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if value is a valid email format
 * @param value - Value to check
 * @returns True if value is a valid email string
 * @example
 * if (isEmail(input)) {
 *   sendEmail(input); // TypeScript knows it's a string
 * }
 */
export function isEmail(value: unknown): value is string {
  if (!isNonEmptyString(value)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Check if value is a valid URL
 * @param value - Value to check
 * @returns True if value is a valid URL string
 * @example
 * if (isUrl(link)) {
 *   window.open(link);
 * }
 */
export function isUrl(value: unknown): value is string {
  if (!isNonEmptyString(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if value is a valid ISO date string (YYYY-MM-DD)
 * @param value - Value to check
 * @returns True if value is a valid ISO date string
 * @example
 * if (isISODate(dateString)) {
 *   const date = new Date(dateString);
 * }
 */
export function isISODate(value: unknown): value is string {
  if (!isNonEmptyString(value)) return false;
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(value)) return false;

  const date = new Date(value);
  return isValidDate(date);
}

/**
 * Assert that a value is defined (throws if not)
 * Useful for narrowing types when you know a value should exist
 * @param value - Value to assert
 * @param message - Error message if assertion fails
 * @throws Error if value is null or undefined
 * @example
 * assertDefined(config.apiKey, 'API key is required');
 * // TypeScript now knows config.apiKey is defined
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message: string = 'Value is required'
): asserts value is T {
  if (!isDefined(value)) {
    throw new Error(message);
  }
}

/**
 * Assert that a value is a non-empty string (throws if not)
 * @param value - Value to assert
 * @param message - Error message if assertion fails
 * @throws Error if value is not a non-empty string
 * @example
 * assertNonEmptyString(userId, 'User ID is required');
 * // TypeScript now knows userId is a non-empty string
 */
export function assertNonEmptyString(
  value: unknown,
  message: string = 'Non-empty string is required'
): asserts value is string {
  if (!isNonEmptyString(value)) {
    throw new Error(message);
  }
}

/**
 * Type guard for garage sale status
 * @param value - Value to check
 * @returns True if value is a valid garage sale status
 */
export function isGarageSaleStatus(
  value: unknown
): value is 'active' | 'completed' | 'cancelled' {
  return value === 'active' || value === 'completed' || value === 'cancelled';
}

/**
 * Type guard for coordinates object
 * @param value - Value to check
 * @returns True if value is a valid coordinates object
 * @example
 * if (isCoordinates(location)) {
 *   const { latitude, longitude } = location;
 * }
 */
export function isCoordinates(
  value: unknown
): value is { latitude: number; longitude: number } {
  return (
    isPlainObject(value) &&
    hasProperty(value, 'latitude') &&
    hasProperty(value, 'longitude') &&
    isValidNumber(value.latitude) &&
    isValidNumber(value.longitude) &&
    value.latitude >= -90 &&
    value.latitude <= 90 &&
    value.longitude >= -180 &&
    value.longitude <= 180
  );
}

/**
 * Type guard for valid KP index (0-9)
 * @param value - Value to check
 * @returns True if value is a valid KP index
 */
export function isValidKPIndex(value: unknown): value is number {
  return isValidNumber(value) && value >= 0 && value <= 9 && Number.isInteger(value);
}
