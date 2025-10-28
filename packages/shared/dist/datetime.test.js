"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests for datetime utilities
 */
const vitest_1 = require("vitest");
const datetime_1 = require("./datetime");
(0, vitest_1.describe)('datetime utilities', () => {
    (0, vitest_1.describe)('YELLOWKNIFE_TIMEZONE', () => {
        (0, vitest_1.it)('should be Mountain Time timezone', () => {
            (0, vitest_1.expect)(datetime_1.YELLOWKNIFE_TIMEZONE).toBe('America/Yellowknife');
        });
    });
    (0, vitest_1.describe)('getYellowknifeTime', () => {
        (0, vitest_1.it)('should return a Date object', () => {
            const result = (0, datetime_1.getYellowknifeTime)();
            (0, vitest_1.expect)(result).toBeInstanceOf(Date);
        });
        (0, vitest_1.it)('should return current time', () => {
            const result = (0, datetime_1.getYellowknifeTime)();
            const now = new Date();
            // Should be within 1 second
            (0, vitest_1.expect)(Math.abs(result.getTime() - now.getTime())).toBeLessThan(1000);
        });
    });
    (0, vitest_1.describe)('formatYellowknifeDate', () => {
        (0, vitest_1.it)('should format date in short format', () => {
            const date = new Date('2025-01-15T12:00:00Z');
            const result = (0, datetime_1.formatYellowknifeDate)(date, 'short');
            (0, vitest_1.expect)(result).toContain('2025');
        });
        (0, vitest_1.it)('should format date in medium format', () => {
            const date = new Date('2025-01-15T12:00:00Z');
            const result = (0, datetime_1.formatYellowknifeDate)(date, 'medium');
            (0, vitest_1.expect)(result).toContain('Jan');
        });
        (0, vitest_1.it)('should accept string dates', () => {
            const result = (0, datetime_1.formatYellowknifeDate)('2025-01-15', 'short');
            (0, vitest_1.expect)(result).toBeTruthy();
        });
    });
    (0, vitest_1.describe)('formatYellowknifeTime', () => {
        (0, vitest_1.it)('should format time in 12hr format', () => {
            const date = new Date('2025-01-15T14:30:00Z');
            const result = (0, datetime_1.formatYellowknifeTime)(date, '12hr');
            // Should contain AM or PM (case insensitive, may include periods)
            (0, vitest_1.expect)(result.toLowerCase()).toMatch(/am|pm|a\.m\.|p\.m\./);
        });
        (0, vitest_1.it)('should format time in 24hr format', () => {
            const date = new Date('2025-01-15T14:30:00Z');
            const result = (0, datetime_1.formatYellowknifeTime)(date, '24hr');
            // Should not contain AM or PM
            (0, vitest_1.expect)(result).not.toMatch(/AM|PM/);
        });
        (0, vitest_1.it)('should accept string dates', () => {
            const result = (0, datetime_1.formatYellowknifeTime)('2025-01-15T14:30:00Z', '12hr');
            (0, vitest_1.expect)(result).toBeTruthy();
        });
    });
    (0, vitest_1.describe)('isBusinessHours', () => {
        (0, vitest_1.it)('should return true during business hours', () => {
            const monday10AM = new Date('2025-01-13T10:00:00');
            const result = (0, datetime_1.isBusinessHours)(monday10AM, {
                monday: { open: '09:00', close: '17:00' },
            });
            (0, vitest_1.expect)(result).toBe(true);
        });
        (0, vitest_1.it)('should return false outside business hours', () => {
            const monday8AM = new Date('2025-01-13T08:00:00');
            const result = (0, datetime_1.isBusinessHours)(monday8AM, {
                monday: { open: '09:00', close: '17:00' },
            });
            (0, vitest_1.expect)(result).toBe(false);
        });
        (0, vitest_1.it)('should return false for closed days', () => {
            const sunday10AM = new Date('2025-01-12T10:00:00');
            const result = (0, datetime_1.isBusinessHours)(sunday10AM, {
                monday: { open: '09:00', close: '17:00' },
                sunday: null,
            });
            (0, vitest_1.expect)(result).toBe(false);
        });
        (0, vitest_1.it)('should handle edge cases at opening time', () => {
            const monday9AM = new Date('2025-01-13T09:00:00');
            const result = (0, datetime_1.isBusinessHours)(monday9AM, {
                monday: { open: '09:00', close: '17:00' },
            });
            (0, vitest_1.expect)(result).toBe(true);
        });
        (0, vitest_1.it)('should handle edge cases at closing time', () => {
            const monday5PM = new Date('2025-01-13T17:00:00');
            const result = (0, datetime_1.isBusinessHours)(monday5PM, {
                monday: { open: '09:00', close: '17:00' },
            });
            (0, vitest_1.expect)(result).toBe(false); // At closing time, should be false
        });
    });
    (0, vitest_1.describe)('calculateDuration', () => {
        (0, vitest_1.it)('should calculate duration in minutes', () => {
            const result = (0, datetime_1.calculateDuration)('09:00', '17:30');
            (0, vitest_1.expect)(result).toBe(510); // 8.5 hours = 510 minutes
        });
        (0, vitest_1.it)('should handle same time', () => {
            const result = (0, datetime_1.calculateDuration)('12:00', '12:00');
            (0, vitest_1.expect)(result).toBe(0);
        });
        (0, vitest_1.it)('should handle different formats', () => {
            const result = (0, datetime_1.calculateDuration)('09:30', '10:45');
            (0, vitest_1.expect)(result).toBe(75);
        });
        (0, vitest_1.it)('should handle hour boundaries', () => {
            const result = (0, datetime_1.calculateDuration)('08:00', '09:00');
            (0, vitest_1.expect)(result).toBe(60);
        });
    });
    (0, vitest_1.describe)('addMinutesToTime', () => {
        (0, vitest_1.it)('should add minutes to time', () => {
            const result = (0, datetime_1.addMinutesToTime)('09:00', 90);
            (0, vitest_1.expect)(result).toBe('10:30');
        });
        (0, vitest_1.it)('should wrap around midnight', () => {
            const result = (0, datetime_1.addMinutesToTime)('23:30', 45);
            (0, vitest_1.expect)(result).toBe('00:15');
        });
        (0, vitest_1.it)('should handle negative minutes (go backwards)', () => {
            const result = (0, datetime_1.addMinutesToTime)('10:30', -90);
            (0, vitest_1.expect)(result).toBe('09:00');
        });
        (0, vitest_1.it)('should handle zero minutes', () => {
            const result = (0, datetime_1.addMinutesToTime)('14:30', 0);
            (0, vitest_1.expect)(result).toBe('14:30');
        });
        (0, vitest_1.it)('should maintain two-digit formatting', () => {
            const result = (0, datetime_1.addMinutesToTime)('09:05', 5);
            (0, vitest_1.expect)(result).toBe('09:10');
        });
    });
    (0, vitest_1.describe)('timeToMinutes / minutesToTime', () => {
        (0, vitest_1.it)('should convert time to minutes', () => {
            (0, vitest_1.expect)((0, datetime_1.timeToMinutes)('00:00')).toBe(0);
            (0, vitest_1.expect)((0, datetime_1.timeToMinutes)('01:00')).toBe(60);
            (0, vitest_1.expect)((0, datetime_1.timeToMinutes)('12:30')).toBe(750);
            (0, vitest_1.expect)((0, datetime_1.timeToMinutes)('23:59')).toBe(1439);
        });
        (0, vitest_1.it)('should convert minutes to time', () => {
            (0, vitest_1.expect)((0, datetime_1.minutesToTime)(0)).toBe('00:00');
            (0, vitest_1.expect)((0, datetime_1.minutesToTime)(60)).toBe('01:00');
            (0, vitest_1.expect)((0, datetime_1.minutesToTime)(750)).toBe('12:30');
            (0, vitest_1.expect)((0, datetime_1.minutesToTime)(1439)).toBe('23:59');
        });
        (0, vitest_1.it)('should be reversible', () => {
            const originalTime = '14:45';
            const minutes = (0, datetime_1.timeToMinutes)(originalTime);
            const backToTime = (0, datetime_1.minutesToTime)(minutes);
            (0, vitest_1.expect)(backToTime).toBe(originalTime);
        });
        (0, vitest_1.it)('should wrap around 24 hours', () => {
            (0, vitest_1.expect)((0, datetime_1.minutesToTime)(1440)).toBe('00:00'); // 24 hours = midnight next day
            (0, vitest_1.expect)((0, datetime_1.minutesToTime)(1500)).toBe('01:00'); // 25 hours
        });
    });
    (0, vitest_1.describe)('doTimeSlotsOverlap', () => {
        (0, vitest_1.it)('should detect overlapping slots', () => {
            const result = (0, datetime_1.doTimeSlotsOverlap)({ start: '09:00', end: '12:00' }, { start: '11:00', end: '14:00' });
            (0, vitest_1.expect)(result).toBe(true);
        });
        (0, vitest_1.it)('should detect non-overlapping slots', () => {
            const result = (0, datetime_1.doTimeSlotsOverlap)({ start: '09:00', end: '12:00' }, { start: '13:00', end: '15:00' });
            (0, vitest_1.expect)(result).toBe(false);
        });
        (0, vitest_1.it)('should handle adjacent slots', () => {
            const result = (0, datetime_1.doTimeSlotsOverlap)({ start: '09:00', end: '12:00' }, { start: '12:00', end: '14:00' });
            (0, vitest_1.expect)(result).toBe(false); // Touching but not overlapping
        });
        (0, vitest_1.it)('should detect contained slots', () => {
            const result = (0, datetime_1.doTimeSlotsOverlap)({ start: '09:00', end: '17:00' }, { start: '10:00', end: '11:00' });
            (0, vitest_1.expect)(result).toBe(true);
        });
    });
    (0, vitest_1.describe)('generateTimeSlots', () => {
        (0, vitest_1.it)('should generate hourly slots', () => {
            const result = (0, datetime_1.generateTimeSlots)('09:00', '12:00', 60);
            (0, vitest_1.expect)(result).toHaveLength(3);
            (0, vitest_1.expect)(result[0]).toEqual({ start: '09:00', end: '10:00', duration: 60 });
            (0, vitest_1.expect)(result[1]).toEqual({ start: '10:00', end: '11:00', duration: 60 });
            (0, vitest_1.expect)(result[2]).toEqual({ start: '11:00', end: '12:00', duration: 60 });
        });
        (0, vitest_1.it)('should generate 30-minute slots', () => {
            const result = (0, datetime_1.generateTimeSlots)('09:00', '11:00', 30);
            (0, vitest_1.expect)(result).toHaveLength(4);
            (0, vitest_1.expect)(result[0]).toEqual({ start: '09:00', end: '09:30', duration: 30 });
            (0, vitest_1.expect)(result[3]).toEqual({ start: '10:30', end: '11:00', duration: 30 });
        });
        (0, vitest_1.it)('should handle different interval and duration', () => {
            const result = (0, datetime_1.generateTimeSlots)('09:00', '17:00', 60, 30);
            // 30-minute slots every hour
            (0, vitest_1.expect)(result).toHaveLength(8);
            (0, vitest_1.expect)(result[0]).toEqual({ start: '09:00', end: '09:30', duration: 30 });
            (0, vitest_1.expect)(result[1]).toEqual({ start: '10:00', end: '10:30', duration: 30 });
        });
    });
    (0, vitest_1.describe)('findAvailableSlots', () => {
        (0, vitest_1.it)('should find available slots', () => {
            const result = (0, datetime_1.findAvailableSlots)('2025-01-15', { open: '09:00', close: '17:00' }, [
                { start: '10:00', end: '11:00' },
                { start: '14:00', end: '15:00' },
            ], 60);
            // Should exclude 10-11 and 14-15 slots
            (0, vitest_1.expect)(result.some(s => s.start === '10:00')).toBe(false);
            (0, vitest_1.expect)(result.some(s => s.start === '14:00')).toBe(false);
            // Should include 9-10, 11-12, 12-13, 13-14, 15-16, 16-17
            (0, vitest_1.expect)(result.some(s => s.start === '09:00')).toBe(true);
            (0, vitest_1.expect)(result.some(s => s.start === '11:00')).toBe(true);
        });
        (0, vitest_1.it)('should return all slots if none booked', () => {
            const result = (0, datetime_1.findAvailableSlots)('2025-01-15', { open: '09:00', close: '12:00' }, [], 60);
            (0, vitest_1.expect)(result).toHaveLength(3);
        });
        (0, vitest_1.it)('should return no slots if all booked', () => {
            const result = (0, datetime_1.findAvailableSlots)('2025-01-15', { open: '09:00', close: '12:00' }, [{ start: '09:00', end: '12:00' }], 60);
            (0, vitest_1.expect)(result).toHaveLength(0);
        });
    });
    (0, vitest_1.describe)('getDayOfYear', () => {
        (0, vitest_1.it)('should calculate day of year', () => {
            const jan1 = (0, datetime_1.getDayOfYear)(new Date('2025-01-01T12:00:00Z'));
            const dec31 = (0, datetime_1.getDayOfYear)(new Date('2025-12-31T12:00:00Z'));
            // Account for timezone differences
            (0, vitest_1.expect)(jan1).toBeGreaterThanOrEqual(1);
            (0, vitest_1.expect)(jan1).toBeLessThanOrEqual(2);
            (0, vitest_1.expect)(dec31).toBeGreaterThanOrEqual(364);
            (0, vitest_1.expect)(dec31).toBeLessThanOrEqual(366);
        });
        (0, vitest_1.it)('should handle leap years', () => {
            const dec31 = (0, datetime_1.getDayOfYear)(new Date('2024-12-31T12:00:00Z'));
            // 2024 is a leap year, should be 365 or 366 depending on timezone
            (0, vitest_1.expect)(dec31).toBeGreaterThanOrEqual(365);
            (0, vitest_1.expect)(dec31).toBeLessThanOrEqual(366);
        });
        (0, vitest_1.it)('should accept string dates', () => {
            const result = (0, datetime_1.getDayOfYear)('2025-06-15');
            (0, vitest_1.expect)(result).toBeGreaterThan(0);
            (0, vitest_1.expect)(result).toBeLessThanOrEqual(366);
        });
    });
    (0, vitest_1.describe)('getWeekNumber', () => {
        (0, vitest_1.it)('should calculate week number', () => {
            const result = (0, datetime_1.getWeekNumber)(new Date('2025-01-15'));
            (0, vitest_1.expect)(result).toBeGreaterThan(0);
            (0, vitest_1.expect)(result).toBeLessThanOrEqual(53);
        });
        (0, vitest_1.it)('should handle start of year', () => {
            const result = (0, datetime_1.getWeekNumber)(new Date('2025-01-01'));
            (0, vitest_1.expect)(result).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('should accept string dates', () => {
            const result = (0, datetime_1.getWeekNumber)('2025-06-01');
            (0, vitest_1.expect)(result).toBeGreaterThan(0);
        });
    });
    (0, vitest_1.describe)('getDaylightHours', () => {
        (0, vitest_1.it)('should return more daylight in summer', () => {
            const summer = (0, datetime_1.getDaylightHours)(new Date('2025-06-21')); // Summer solstice
            const winter = (0, datetime_1.getDaylightHours)(new Date('2025-12-21')); // Winter solstice
            (0, vitest_1.expect)(summer).toBeGreaterThan(winter);
        });
        (0, vitest_1.it)('should return approximately 20.5 hours in summer', () => {
            const summer = (0, datetime_1.getDaylightHours)(new Date('2025-06-21'));
            (0, vitest_1.expect)(summer).toBeGreaterThan(19);
            (0, vitest_1.expect)(summer).toBeLessThan(22);
        });
        (0, vitest_1.it)('should return approximately 4.5 hours in winter', () => {
            const winter = (0, datetime_1.getDaylightHours)(new Date('2025-12-21'));
            (0, vitest_1.expect)(winter).toBeGreaterThan(3);
            (0, vitest_1.expect)(winter).toBeLessThan(6);
        });
        (0, vitest_1.it)('should accept string dates', () => {
            const result = (0, datetime_1.getDaylightHours)('2025-06-21');
            (0, vitest_1.expect)(result).toBeGreaterThan(0);
        });
    });
    (0, vitest_1.describe)('isAuroraSeason', () => {
        (0, vitest_1.it)('should return true for winter months', () => {
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)(new Date('2025-01-15'))).toBe(true);
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)(new Date('2025-02-15'))).toBe(true);
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)(new Date('2025-03-15'))).toBe(true);
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)(new Date('2025-12-15'))).toBe(true);
        });
        (0, vitest_1.it)('should return true for late summer/fall', () => {
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)(new Date('2025-08-15'))).toBe(true);
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)(new Date('2025-09-15'))).toBe(true);
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)(new Date('2025-10-15'))).toBe(true);
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)(new Date('2025-11-15'))).toBe(true);
        });
        (0, vitest_1.it)('should return false for summer months', () => {
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)(new Date('2025-05-15'))).toBe(false);
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)(new Date('2025-06-15'))).toBe(false);
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)(new Date('2025-07-15'))).toBe(false);
        });
        (0, vitest_1.it)('should accept string dates', () => {
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)('2025-01-15')).toBe(true);
            (0, vitest_1.expect)((0, datetime_1.isAuroraSeason)('2025-06-15')).toBe(false);
        });
    });
    (0, vitest_1.describe)('getDatesInMonth', () => {
        (0, vitest_1.it)('should return all dates in January', () => {
            const result = (0, datetime_1.getDatesInMonth)(2025, 0); // January
            (0, vitest_1.expect)(result).toHaveLength(31);
            (0, vitest_1.expect)(result[0]).toBe('2025-01-01');
            (0, vitest_1.expect)(result[30]).toBe('2025-01-31');
        });
        (0, vitest_1.it)('should return all dates in February (non-leap year)', () => {
            const result = (0, datetime_1.getDatesInMonth)(2025, 1); // February
            (0, vitest_1.expect)(result).toHaveLength(28);
        });
        (0, vitest_1.it)('should return all dates in February (leap year)', () => {
            const result = (0, datetime_1.getDatesInMonth)(2024, 1); // February 2024 (leap year)
            (0, vitest_1.expect)(result).toHaveLength(29);
        });
        (0, vitest_1.it)('should return dates in YYYY-MM-DD format', () => {
            const result = (0, datetime_1.getDatesInMonth)(2025, 0);
            (0, vitest_1.expect)(result[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });
    (0, vitest_1.describe)('isSameDay', () => {
        (0, vitest_1.it)('should return true for same day', () => {
            const date1 = new Date('2025-01-15T10:00:00');
            const date2 = new Date('2025-01-15T16:00:00');
            (0, vitest_1.expect)((0, datetime_1.isSameDay)(date1, date2)).toBe(true);
        });
        (0, vitest_1.it)('should return false for different days', () => {
            const date1 = new Date('2025-01-15T23:59:59');
            const date2 = new Date('2025-01-16T00:00:00');
            (0, vitest_1.expect)((0, datetime_1.isSameDay)(date1, date2)).toBe(false);
        });
        (0, vitest_1.it)('should accept string dates', () => {
            (0, vitest_1.expect)((0, datetime_1.isSameDay)('2025-01-15T10:00:00', '2025-01-15T16:00:00')).toBe(true);
            (0, vitest_1.expect)((0, datetime_1.isSameDay)('2025-01-15', '2025-01-16')).toBe(false);
        });
    });
    (0, vitest_1.describe)('getRelativeDateDescription', () => {
        (0, vitest_1.beforeEach)(() => {
            // Mock current date to 2025-01-15
            vitest_1.vi.setSystemTime(new Date('2025-01-15T12:00:00'));
        });
        (0, vitest_1.it)('should return "Today" for today', () => {
            const result = (0, datetime_1.getRelativeDateDescription)(new Date('2025-01-15T15:00:00'));
            (0, vitest_1.expect)(result).toBe('Today');
        });
        (0, vitest_1.it)('should return "Tomorrow" for tomorrow', () => {
            const result = (0, datetime_1.getRelativeDateDescription)(new Date('2025-01-16T12:00:00'));
            (0, vitest_1.expect)(result).toBe('Tomorrow');
        });
        (0, vitest_1.it)('should return "Yesterday" for yesterday', () => {
            const result = (0, datetime_1.getRelativeDateDescription)(new Date('2025-01-14T12:00:00'));
            (0, vitest_1.expect)(result).toBe('Yesterday');
        });
        (0, vitest_1.it)('should return "In X days" for near future', () => {
            const result = (0, datetime_1.getRelativeDateDescription)(new Date('2025-01-18T12:00:00'));
            (0, vitest_1.expect)(result).toBe('In 3 days');
        });
        (0, vitest_1.it)('should return "X days ago" for recent past', () => {
            const result = (0, datetime_1.getRelativeDateDescription)(new Date('2025-01-12T12:00:00'));
            (0, vitest_1.expect)(result).toBe('3 days ago');
        });
        (0, vitest_1.it)('should return formatted date for distant dates', () => {
            const result = (0, datetime_1.getRelativeDateDescription)(new Date('2025-02-20T12:00:00'));
            (0, vitest_1.expect)(result).toContain('Feb');
            (0, vitest_1.expect)(result).toContain('20');
        });
        (0, vitest_1.it)('should accept string dates', () => {
            // Use the current mocked date
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const result = (0, datetime_1.getRelativeDateDescription)(todayStr);
            (0, vitest_1.expect)(result).toBe('Today');
        });
    });
    (0, vitest_1.describe)('sortEventsByDateTime', () => {
        (0, vitest_1.it)('should sort events by date and time', () => {
            const events = [
                { id: '1', title: 'Event 1', date: '2025-01-20', startTime: '14:00', endTime: '15:00' },
                { id: '2', title: 'Event 2', date: '2025-01-15', startTime: '10:00', endTime: '11:00' },
                { id: '3', title: 'Event 3', date: '2025-01-15', startTime: '09:00', endTime: '10:00' },
                { id: '4', title: 'Event 4', date: '2025-01-18', startTime: '12:00', endTime: '13:00' },
            ];
            const sorted = (0, datetime_1.sortEventsByDateTime)(events);
            (0, vitest_1.expect)(sorted[0].id).toBe('3'); // 2025-01-15 09:00
            (0, vitest_1.expect)(sorted[1].id).toBe('2'); // 2025-01-15 10:00
            (0, vitest_1.expect)(sorted[2].id).toBe('4'); // 2025-01-18 12:00
            (0, vitest_1.expect)(sorted[3].id).toBe('1'); // 2025-01-20 14:00
        });
        (0, vitest_1.it)('should not mutate original array', () => {
            const events = [
                { id: '1', title: 'Event 1', date: '2025-01-20', startTime: '14:00', endTime: '15:00' },
                { id: '2', title: 'Event 2', date: '2025-01-15', startTime: '10:00', endTime: '11:00' },
            ];
            const sorted = (0, datetime_1.sortEventsByDateTime)(events);
            (0, vitest_1.expect)(events[0].id).toBe('1'); // Original unchanged
            (0, vitest_1.expect)(sorted[0].id).toBe('2'); // Sorted version different
        });
    });
});
//# sourceMappingURL=datetime.test.js.map