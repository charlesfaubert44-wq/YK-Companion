/**
 * Date and Time utilities for YK Companion
 * Provides timezone-aware date handling, scheduling, and formatting for Yellowknife
 */
/**
 * Yellowknife timezone (Mountain Time)
 */
export declare const YELLOWKNIFE_TIMEZONE = "America/Yellowknife";
/**
 * Time slot representation
 */
export interface TimeSlot {
    start: string;
    end: string;
    duration: number;
}
/**
 * Schedule event representation
 */
export interface ScheduleEvent {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location?: string;
}
/**
 * Get current time in Yellowknife timezone
 * @returns Date object in Yellowknife time
 * @example
 * const ykTime = getYellowknifeTime();
 * console.log(ykTime.toLocaleString('en-CA'));
 */
export declare function getYellowknifeTime(): Date;
/**
 * Format date for Yellowknife timezone
 * @param date - Date to format
 * @param format - Format style
 * @returns Formatted date string
 * @example
 * formatYellowknifeDate(new Date(), 'long');
 * // "Monday, January 15, 2025"
 */
export declare function formatYellowknifeDate(date: Date | string, format?: 'short' | 'medium' | 'long' | 'full'): string;
/**
 * Format time for Yellowknife timezone
 * @param date - Date to format
 * @param format - 12hr or 24hr
 * @returns Formatted time string
 * @example
 * formatYellowknifeTime(new Date(), '12hr'); // "2:30 PM"
 * formatYellowknifeTime(new Date(), '24hr'); // "14:30"
 */
export declare function formatYellowknifeTime(date: Date | string, format?: '12hr' | '24hr'): string;
/**
 * Check if a date/time is during business hours
 * @param date - Date to check
 * @param businessHours - Business hours configuration
 * @returns True if during business hours
 * @example
 * const isOpen = isBusinessHours(new Date(), {
 *   monday: { open: '09:00', close: '17:00' },
 *   tuesday: { open: '09:00', close: '17:00' }
 * });
 */
export declare function isBusinessHours(date: Date, businessHours: Partial<Record<'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday', {
    open: string;
    close: string;
} | null>>): boolean;
/**
 * Calculate duration between two times
 * @param startTime - Start time (HH:MM)
 * @param endTime - End time (HH:MM)
 * @returns Duration in minutes
 * @example
 * const duration = calculateDuration('09:00', '17:30'); // 510 minutes (8.5 hours)
 */
export declare function calculateDuration(startTime: string, endTime: string): number;
/**
 * Add minutes to a time string
 * @param time - Time in HH:MM format
 * @param minutes - Minutes to add
 * @returns New time in HH:MM format
 * @example
 * addMinutesToTime('09:00', 90); // "10:30"
 * addMinutesToTime('23:30', 45); // "00:15"
 */
export declare function addMinutesToTime(time: string, minutes: number): string;
/**
 * Check if two time ranges overlap
 * @param slot1 - First time slot
 * @param slot2 - Second time slot
 * @returns True if time slots overlap
 * @example
 * const overlap = doTimeSlotsOverlap(
 *   { start: '09:00', end: '12:00' },
 *   { start: '11:00', end: '14:00' }
 * ); // true
 */
export declare function doTimeSlotsOverlap(slot1: {
    start: string;
    end: string;
}, slot2: {
    start: string;
    end: string;
}): boolean;
/**
 * Convert time string to minutes since midnight
 * @param time - Time in HH:MM format
 * @returns Minutes since midnight
 * @example
 * timeToMinutes('14:30'); // 870
 */
export declare function timeToMinutes(time: string): number;
/**
 * Convert minutes since midnight to time string
 * @param minutes - Minutes since midnight
 * @returns Time in HH:MM format
 * @example
 * minutesToTime(870); // "14:30"
 */
export declare function minutesToTime(minutes: number): string;
/**
 * Generate time slots between start and end time
 * @param startTime - Start time (HH:MM)
 * @param endTime - End time (HH:MM)
 * @param intervalMinutes - Interval in minutes
 * @param slotDuration - Duration of each slot in minutes
 * @returns Array of time slots
 * @example
 * const slots = generateTimeSlots('09:00', '17:00', 60, 30);
 * // Generates 30-minute slots every hour from 9 AM to 5 PM
 */
export declare function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number, slotDuration?: number): TimeSlot[];
/**
 * Find available time slots in a schedule
 * @param date - Date to check
 * @param businessHours - Business hours for the day
 * @param bookedSlots - Already booked time slots
 * @param slotDuration - Desired slot duration in minutes
 * @returns Available time slots
 * @example
 * const available = findAvailableSlots(
 *   '2025-01-15',
 *   { open: '09:00', close: '17:00' },
 *   [{ start: '10:00', end: '11:00' }],
 *   60
 * );
 */
export declare function findAvailableSlots(_date: string, businessHours: {
    open: string;
    close: string;
}, bookedSlots: {
    start: string;
    end: string;
}[], slotDuration: number): TimeSlot[];
/**
 * Get the day of year for a date (1-366)
 * @param date - Date to check
 * @returns Day of year
 * @example
 * getDayOfYear(new Date('2025-01-15')); // 15
 * getDayOfYear(new Date('2025-12-31')); // 365
 */
export declare function getDayOfYear(date: Date | string): number;
/**
 * Get week number for a date (ISO week)
 * @param date - Date to check
 * @returns Week number (1-53)
 * @example
 * getWeekNumber(new Date('2025-01-15')); // 3
 */
export declare function getWeekNumber(date: Date | string): number;
/**
 * Calculate daylight hours for a date in Yellowknife
 * Yellowknife has extreme variations (4.5 hours in winter, 20+ hours in summer)
 * @param date - Date to check
 * @returns Approximate daylight hours
 * @example
 * const hours = getDaylightHours(new Date('2025-06-21')); // ~20.5 hours (summer solstice)
 * const hours = getDaylightHours(new Date('2025-12-21')); // ~4.5 hours (winter solstice)
 */
export declare function getDaylightHours(date: Date | string): number;
/**
 * Check if a date is during aurora season in Yellowknife
 * Best aurora viewing: Late August to April
 * @param date - Date to check
 * @returns True if during aurora season
 * @example
 * isAuroraSeason(new Date('2025-01-15')); // true (winter)
 * isAuroraSeason(new Date('2025-07-15')); // false (summer, too much daylight)
 */
export declare function isAuroraSeason(date: Date | string): boolean;
/**
 * Get dates for all days in a month
 * @param year - Year
 * @param month - Month (0-11)
 * @returns Array of date strings
 * @example
 * const days = getDatesInMonth(2025, 0); // All days in January 2025
 */
export declare function getDatesInMonth(year: number, month: number): string[];
/**
 * Check if two dates are on the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same day
 * @example
 * isSameDay(new Date('2025-01-15T10:00:00'), new Date('2025-01-15T16:00:00')); // true
 */
export declare function isSameDay(date1: Date | string, date2: Date | string): boolean;
/**
 * Get relative date description
 * @param date - Date to describe
 * @returns Human-readable description
 * @example
 * getRelativeDateDescription(new Date()); // "Today"
 * getRelativeDateDescription(tomorrow); // "Tomorrow"
 * getRelativeDateDescription(yesterday); // "Yesterday"
 */
export declare function getRelativeDateDescription(date: Date | string): string;
/**
 * Sort events chronologically
 * @param events - Array of schedule events
 * @returns Sorted events
 * @example
 * const sorted = sortEventsByDateTime(garageSales);
 */
export declare function sortEventsByDateTime(events: ScheduleEvent[]): ScheduleEvent[];
//# sourceMappingURL=datetime.d.ts.map