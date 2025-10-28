"use strict";
/**
 * Date and Time utilities for YK Companion
 * Provides timezone-aware date handling, scheduling, and formatting for Yellowknife
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.YELLOWKNIFE_TIMEZONE = void 0;
exports.getYellowknifeTime = getYellowknifeTime;
exports.formatYellowknifeDate = formatYellowknifeDate;
exports.formatYellowknifeTime = formatYellowknifeTime;
exports.isBusinessHours = isBusinessHours;
exports.calculateDuration = calculateDuration;
exports.addMinutesToTime = addMinutesToTime;
exports.doTimeSlotsOverlap = doTimeSlotsOverlap;
exports.timeToMinutes = timeToMinutes;
exports.minutesToTime = minutesToTime;
exports.generateTimeSlots = generateTimeSlots;
exports.findAvailableSlots = findAvailableSlots;
exports.getDayOfYear = getDayOfYear;
exports.getWeekNumber = getWeekNumber;
exports.getDaylightHours = getDaylightHours;
exports.isAuroraSeason = isAuroraSeason;
exports.getDatesInMonth = getDatesInMonth;
exports.isSameDay = isSameDay;
exports.getRelativeDateDescription = getRelativeDateDescription;
exports.sortEventsByDateTime = sortEventsByDateTime;
/**
 * Yellowknife timezone (Mountain Time)
 */
exports.YELLOWKNIFE_TIMEZONE = 'America/Yellowknife';
/**
 * Get current time in Yellowknife timezone
 * @returns Date object in Yellowknife time
 * @example
 * const ykTime = getYellowknifeTime();
 * console.log(ykTime.toLocaleString('en-CA'));
 */
function getYellowknifeTime() {
    const now = new Date();
    const ykTimeString = now.toLocaleString('en-US', {
        timeZone: exports.YELLOWKNIFE_TIMEZONE,
    });
    return new Date(ykTimeString);
}
/**
 * Format date for Yellowknife timezone
 * @param date - Date to format
 * @param format - Format style
 * @returns Formatted date string
 * @example
 * formatYellowknifeDate(new Date(), 'long');
 * // "Monday, January 15, 2025"
 */
function formatYellowknifeDate(date, format = 'medium') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const options = {
        timeZone: exports.YELLOWKNIFE_TIMEZONE,
        ...(format === 'short' && { dateStyle: 'short' }),
        ...(format === 'medium' && { dateStyle: 'medium' }),
        ...(format === 'long' && { dateStyle: 'long' }),
        ...(format === 'full' && { dateStyle: 'full' }),
    };
    return dateObj.toLocaleDateString('en-CA', options);
}
/**
 * Format time for Yellowknife timezone
 * @param date - Date to format
 * @param format - 12hr or 24hr
 * @returns Formatted time string
 * @example
 * formatYellowknifeTime(new Date(), '12hr'); // "2:30 PM"
 * formatYellowknifeTime(new Date(), '24hr'); // "14:30"
 */
function formatYellowknifeTime(date, format = '12hr') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-CA', {
        timeZone: exports.YELLOWKNIFE_TIMEZONE,
        hour12: format === '12hr',
        hour: 'numeric',
        minute: '2-digit',
    });
}
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
function isBusinessHours(date, businessHours) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    const hours = businessHours[dayName];
    if (!hours)
        return false; // Closed on this day
    const currentTime = date.getHours() * 60 + date.getMinutes();
    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    return currentTime >= openTime && currentTime < closeTime;
}
/**
 * Calculate duration between two times
 * @param startTime - Start time (HH:MM)
 * @param endTime - End time (HH:MM)
 * @returns Duration in minutes
 * @example
 * const duration = calculateDuration('09:00', '17:30'); // 510 minutes (8.5 hours)
 */
function calculateDuration(startTime, endTime) {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes - startMinutes;
}
/**
 * Add minutes to a time string
 * @param time - Time in HH:MM format
 * @param minutes - Minutes to add
 * @returns New time in HH:MM format
 * @example
 * addMinutesToTime('09:00', 90); // "10:30"
 * addMinutesToTime('23:30', 45); // "00:15"
 */
function addMinutesToTime(time, minutes) {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}
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
function doTimeSlotsOverlap(slot1, slot2) {
    const start1 = timeToMinutes(slot1.start);
    const end1 = timeToMinutes(slot1.end);
    const start2 = timeToMinutes(slot2.start);
    const end2 = timeToMinutes(slot2.end);
    return start1 < end2 && start2 < end1;
}
/**
 * Convert time string to minutes since midnight
 * @param time - Time in HH:MM format
 * @returns Minutes since midnight
 * @example
 * timeToMinutes('14:30'); // 870
 */
function timeToMinutes(time) {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
}
/**
 * Convert minutes since midnight to time string
 * @param minutes - Minutes since midnight
 * @returns Time in HH:MM format
 * @example
 * minutesToTime(870); // "14:30"
 */
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}
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
function generateTimeSlots(startTime, endTime, intervalMinutes, slotDuration = intervalMinutes) {
    const slots = [];
    let currentMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    while (currentMinutes + slotDuration <= endMinutes) {
        const start = minutesToTime(currentMinutes);
        const end = minutesToTime(currentMinutes + slotDuration);
        slots.push({
            start,
            end,
            duration: slotDuration,
        });
        currentMinutes += intervalMinutes;
    }
    return slots;
}
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
function findAvailableSlots(_date, businessHours, bookedSlots, slotDuration) {
    const allSlots = generateTimeSlots(businessHours.open, businessHours.close, slotDuration, slotDuration);
    return allSlots.filter((slot) => {
        return !bookedSlots.some((booked) => doTimeSlotsOverlap(slot, booked));
    });
}
/**
 * Get the day of year for a date (1-366)
 * @param date - Date to check
 * @returns Day of year
 * @example
 * getDayOfYear(new Date('2025-01-15')); // 15
 * getDayOfYear(new Date('2025-12-31')); // 365
 */
function getDayOfYear(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const start = new Date(dateObj.getFullYear(), 0, 0);
    const diff = dateObj.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
/**
 * Get week number for a date (ISO week)
 * @param date - Date to check
 * @returns Week number (1-53)
 * @example
 * getWeekNumber(new Date('2025-01-15')); // 3
 */
function getWeekNumber(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const d = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
/**
 * Calculate daylight hours for a date in Yellowknife
 * Yellowknife has extreme variations (4.5 hours in winter, 20+ hours in summer)
 * @param date - Date to check
 * @returns Approximate daylight hours
 * @example
 * const hours = getDaylightHours(new Date('2025-06-21')); // ~20.5 hours (summer solstice)
 * const hours = getDaylightHours(new Date('2025-12-21')); // ~4.5 hours (winter solstice)
 */
function getDaylightHours(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const dayOfYear = getDayOfYear(dateObj);
    // Yellowknife latitude: 62.45°N
    // Simplified calculation - in production, use a proper solar library
    // Summer solstice (day ~172): ~20.5 hours
    // Winter solstice (day ~355): ~4.5 hours
    const summerSolstice = 172;
    const maxDaylight = 20.5;
    const minDaylight = 4.5;
    // Calculate based on distance from solstices
    let daysFromSummer = Math.abs(dayOfYear - summerSolstice);
    if (daysFromSummer > 182)
        daysFromSummer = 365 - daysFromSummer;
    const ratio = daysFromSummer / 182;
    return maxDaylight - ratio * (maxDaylight - minDaylight);
}
/**
 * Check if a date is during aurora season in Yellowknife
 * Best aurora viewing: Late August to April
 * @param date - Date to check
 * @returns True if during aurora season
 * @example
 * isAuroraSeason(new Date('2025-01-15')); // true (winter)
 * isAuroraSeason(new Date('2025-07-15')); // false (summer, too much daylight)
 */
function isAuroraSeason(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const month = dateObj.getMonth(); // 0-11
    // Aurora season: August (7) to April (3)
    // Exclude May, June, July (too much daylight)
    return month <= 3 || month >= 7;
}
/**
 * Get dates for all days in a month
 * @param year - Year
 * @param month - Month (0-11)
 * @returns Array of date strings
 * @example
 * const days = getDatesInMonth(2025, 0); // All days in January 2025
 */
function getDatesInMonth(year, month) {
    const dates = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}
/**
 * Check if two dates are on the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same day
 * @example
 * isSameDay(new Date('2025-01-15T10:00:00'), new Date('2025-01-15T16:00:00')); // true
 */
function isSameDay(date1, date2) {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    return (d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate());
}
/**
 * Get relative date description
 * @param date - Date to describe
 * @returns Human-readable description
 * @example
 * getRelativeDateDescription(new Date()); // "Today"
 * getRelativeDateDescription(tomorrow); // "Tomorrow"
 * getRelativeDateDescription(yesterday); // "Yesterday"
 */
function getRelativeDateDescription(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateObj);
    targetDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
        return 'Today';
    if (diffDays === 1)
        return 'Tomorrow';
    if (diffDays === -1)
        return 'Yesterday';
    if (diffDays > 1 && diffDays <= 7)
        return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7)
        return `${Math.abs(diffDays)} days ago`;
    return targetDate.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
}
/**
 * Sort events chronologically
 * @param events - Array of schedule events
 * @returns Sorted events
 * @example
 * const sorted = sortEventsByDateTime(garageSales);
 */
function sortEventsByDateTime(events) {
    return [...events].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0)
            return dateCompare;
        return a.startTime.localeCompare(b.startTime);
    });
}
//# sourceMappingURL=datetime.js.map