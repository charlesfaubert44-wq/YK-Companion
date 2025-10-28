/**
 * Tests for datetime utilities
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  YELLOWKNIFE_TIMEZONE,
  getYellowknifeTime,
  formatYellowknifeDate,
  formatYellowknifeTime,
  isBusinessHours,
  calculateDuration,
  addMinutesToTime,
  doTimeSlotsOverlap,
  timeToMinutes,
  minutesToTime,
  generateTimeSlots,
  findAvailableSlots,
  getDayOfYear,
  getWeekNumber,
  getDaylightHours,
  isAuroraSeason,
  getDatesInMonth,
  isSameDay,
  getRelativeDateDescription,
  sortEventsByDateTime,
} from './datetime';

describe('datetime utilities', () => {
  describe('YELLOWKNIFE_TIMEZONE', () => {
    it('should be Mountain Time timezone', () => {
      expect(YELLOWKNIFE_TIMEZONE).toBe('America/Yellowknife');
    });
  });

  describe('getYellowknifeTime', () => {
    it('should return a Date object', () => {
      const result = getYellowknifeTime();
      expect(result).toBeInstanceOf(Date);
    });

    it('should return current time', () => {
      const result = getYellowknifeTime();
      const now = new Date();
      // Should be within 1 second
      expect(Math.abs(result.getTime() - now.getTime())).toBeLessThan(1000);
    });
  });

  describe('formatYellowknifeDate', () => {
    it('should format date in short format', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const result = formatYellowknifeDate(date, 'short');
      expect(result).toContain('2025');
    });

    it('should format date in medium format', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const result = formatYellowknifeDate(date, 'medium');
      expect(result).toContain('Jan');
    });

    it('should accept string dates', () => {
      const result = formatYellowknifeDate('2025-01-15', 'short');
      expect(result).toBeTruthy();
    });
  });

  describe('formatYellowknifeTime', () => {
    it('should format time in 12hr format', () => {
      const date = new Date('2025-01-15T14:30:00Z');
      const result = formatYellowknifeTime(date, '12hr');
      // Should contain AM or PM (case insensitive, may include periods)
      expect(result.toLowerCase()).toMatch(/am|pm|a\.m\.|p\.m\./);
    });

    it('should format time in 24hr format', () => {
      const date = new Date('2025-01-15T14:30:00Z');
      const result = formatYellowknifeTime(date, '24hr');
      // Should not contain AM or PM
      expect(result).not.toMatch(/AM|PM/);
    });

    it('should accept string dates', () => {
      const result = formatYellowknifeTime('2025-01-15T14:30:00Z', '12hr');
      expect(result).toBeTruthy();
    });
  });

  describe('isBusinessHours', () => {
    it('should return true during business hours', () => {
      const monday10AM = new Date('2025-01-13T10:00:00');
      const result = isBusinessHours(monday10AM, {
        monday: { open: '09:00', close: '17:00' },
      });
      expect(result).toBe(true);
    });

    it('should return false outside business hours', () => {
      const monday8AM = new Date('2025-01-13T08:00:00');
      const result = isBusinessHours(monday8AM, {
        monday: { open: '09:00', close: '17:00' },
      });
      expect(result).toBe(false);
    });

    it('should return false for closed days', () => {
      const sunday10AM = new Date('2025-01-12T10:00:00');
      const result = isBusinessHours(sunday10AM, {
        monday: { open: '09:00', close: '17:00' },
        sunday: null,
      });
      expect(result).toBe(false);
    });

    it('should handle edge cases at opening time', () => {
      const monday9AM = new Date('2025-01-13T09:00:00');
      const result = isBusinessHours(monday9AM, {
        monday: { open: '09:00', close: '17:00' },
      });
      expect(result).toBe(true);
    });

    it('should handle edge cases at closing time', () => {
      const monday5PM = new Date('2025-01-13T17:00:00');
      const result = isBusinessHours(monday5PM, {
        monday: { open: '09:00', close: '17:00' },
      });
      expect(result).toBe(false); // At closing time, should be false
    });
  });

  describe('calculateDuration', () => {
    it('should calculate duration in minutes', () => {
      const result = calculateDuration('09:00', '17:30');
      expect(result).toBe(510); // 8.5 hours = 510 minutes
    });

    it('should handle same time', () => {
      const result = calculateDuration('12:00', '12:00');
      expect(result).toBe(0);
    });

    it('should handle different formats', () => {
      const result = calculateDuration('09:30', '10:45');
      expect(result).toBe(75);
    });

    it('should handle hour boundaries', () => {
      const result = calculateDuration('08:00', '09:00');
      expect(result).toBe(60);
    });
  });

  describe('addMinutesToTime', () => {
    it('should add minutes to time', () => {
      const result = addMinutesToTime('09:00', 90);
      expect(result).toBe('10:30');
    });

    it('should wrap around midnight', () => {
      const result = addMinutesToTime('23:30', 45);
      expect(result).toBe('00:15');
    });

    it('should handle negative minutes (go backwards)', () => {
      const result = addMinutesToTime('10:30', -90);
      expect(result).toBe('09:00');
    });

    it('should handle zero minutes', () => {
      const result = addMinutesToTime('14:30', 0);
      expect(result).toBe('14:30');
    });

    it('should maintain two-digit formatting', () => {
      const result = addMinutesToTime('09:05', 5);
      expect(result).toBe('09:10');
    });
  });

  describe('timeToMinutes / minutesToTime', () => {
    it('should convert time to minutes', () => {
      expect(timeToMinutes('00:00')).toBe(0);
      expect(timeToMinutes('01:00')).toBe(60);
      expect(timeToMinutes('12:30')).toBe(750);
      expect(timeToMinutes('23:59')).toBe(1439);
    });

    it('should convert minutes to time', () => {
      expect(minutesToTime(0)).toBe('00:00');
      expect(minutesToTime(60)).toBe('01:00');
      expect(minutesToTime(750)).toBe('12:30');
      expect(minutesToTime(1439)).toBe('23:59');
    });

    it('should be reversible', () => {
      const originalTime = '14:45';
      const minutes = timeToMinutes(originalTime);
      const backToTime = minutesToTime(minutes);
      expect(backToTime).toBe(originalTime);
    });

    it('should wrap around 24 hours', () => {
      expect(minutesToTime(1440)).toBe('00:00'); // 24 hours = midnight next day
      expect(minutesToTime(1500)).toBe('01:00'); // 25 hours
    });
  });

  describe('doTimeSlotsOverlap', () => {
    it('should detect overlapping slots', () => {
      const result = doTimeSlotsOverlap(
        { start: '09:00', end: '12:00' },
        { start: '11:00', end: '14:00' }
      );
      expect(result).toBe(true);
    });

    it('should detect non-overlapping slots', () => {
      const result = doTimeSlotsOverlap(
        { start: '09:00', end: '12:00' },
        { start: '13:00', end: '15:00' }
      );
      expect(result).toBe(false);
    });

    it('should handle adjacent slots', () => {
      const result = doTimeSlotsOverlap(
        { start: '09:00', end: '12:00' },
        { start: '12:00', end: '14:00' }
      );
      expect(result).toBe(false); // Touching but not overlapping
    });

    it('should detect contained slots', () => {
      const result = doTimeSlotsOverlap(
        { start: '09:00', end: '17:00' },
        { start: '10:00', end: '11:00' }
      );
      expect(result).toBe(true);
    });
  });

  describe('generateTimeSlots', () => {
    it('should generate hourly slots', () => {
      const result = generateTimeSlots('09:00', '12:00', 60);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ start: '09:00', end: '10:00', duration: 60 });
      expect(result[1]).toEqual({ start: '10:00', end: '11:00', duration: 60 });
      expect(result[2]).toEqual({ start: '11:00', end: '12:00', duration: 60 });
    });

    it('should generate 30-minute slots', () => {
      const result = generateTimeSlots('09:00', '11:00', 30);
      
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({ start: '09:00', end: '09:30', duration: 30 });
      expect(result[3]).toEqual({ start: '10:30', end: '11:00', duration: 30 });
    });

    it('should handle different interval and duration', () => {
      const result = generateTimeSlots('09:00', '17:00', 60, 30);
      
      // 30-minute slots every hour
      expect(result).toHaveLength(8);
      expect(result[0]).toEqual({ start: '09:00', end: '09:30', duration: 30 });
      expect(result[1]).toEqual({ start: '10:00', end: '10:30', duration: 30 });
    });
  });

  describe('findAvailableSlots', () => {
    it('should find available slots', () => {
      const result = findAvailableSlots(
        '2025-01-15',
        { open: '09:00', close: '17:00' },
        [
          { start: '10:00', end: '11:00' },
          { start: '14:00', end: '15:00' },
        ],
        60
      );
      
      // Should exclude 10-11 and 14-15 slots
      expect(result.some(s => s.start === '10:00')).toBe(false);
      expect(result.some(s => s.start === '14:00')).toBe(false);
      
      // Should include 9-10, 11-12, 12-13, 13-14, 15-16, 16-17
      expect(result.some(s => s.start === '09:00')).toBe(true);
      expect(result.some(s => s.start === '11:00')).toBe(true);
    });

    it('should return all slots if none booked', () => {
      const result = findAvailableSlots(
        '2025-01-15',
        { open: '09:00', close: '12:00' },
        [],
        60
      );
      
      expect(result).toHaveLength(3);
    });

    it('should return no slots if all booked', () => {
      const result = findAvailableSlots(
        '2025-01-15',
        { open: '09:00', close: '12:00' },
        [{ start: '09:00', end: '12:00' }],
        60
      );
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getDayOfYear', () => {
    it('should calculate day of year', () => {
      const jan1 = getDayOfYear(new Date('2025-01-01T12:00:00Z'));
      const dec31 = getDayOfYear(new Date('2025-12-31T12:00:00Z'));
      
      // Account for timezone differences
      expect(jan1).toBeGreaterThanOrEqual(1);
      expect(jan1).toBeLessThanOrEqual(2);
      expect(dec31).toBeGreaterThanOrEqual(364);
      expect(dec31).toBeLessThanOrEqual(366);
    });

    it('should handle leap years', () => {
      const dec31 = getDayOfYear(new Date('2024-12-31T12:00:00Z'));
      
      // 2024 is a leap year, should be 365 or 366 depending on timezone
      expect(dec31).toBeGreaterThanOrEqual(365);
      expect(dec31).toBeLessThanOrEqual(366);
    });

    it('should accept string dates', () => {
      const result = getDayOfYear('2025-06-15');
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(366);
    });
  });

  describe('getWeekNumber', () => {
    it('should calculate week number', () => {
      const result = getWeekNumber(new Date('2025-01-15'));
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(53);
    });

    it('should handle start of year', () => {
      const result = getWeekNumber(new Date('2025-01-01'));
      expect(result).toBeGreaterThan(0);
    });

    it('should accept string dates', () => {
      const result = getWeekNumber('2025-06-01');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('getDaylightHours', () => {
    it('should return more daylight in summer', () => {
      const summer = getDaylightHours(new Date('2025-06-21')); // Summer solstice
      const winter = getDaylightHours(new Date('2025-12-21')); // Winter solstice
      
      expect(summer).toBeGreaterThan(winter);
    });

    it('should return approximately 20.5 hours in summer', () => {
      const summer = getDaylightHours(new Date('2025-06-21'));
      expect(summer).toBeGreaterThan(19);
      expect(summer).toBeLessThan(22);
    });

    it('should return approximately 4.5 hours in winter', () => {
      const winter = getDaylightHours(new Date('2025-12-21'));
      expect(winter).toBeGreaterThan(3);
      expect(winter).toBeLessThan(6);
    });

    it('should accept string dates', () => {
      const result = getDaylightHours('2025-06-21');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('isAuroraSeason', () => {
    it('should return true for winter months', () => {
      expect(isAuroraSeason(new Date('2025-01-15'))).toBe(true);
      expect(isAuroraSeason(new Date('2025-02-15'))).toBe(true);
      expect(isAuroraSeason(new Date('2025-03-15'))).toBe(true);
      expect(isAuroraSeason(new Date('2025-12-15'))).toBe(true);
    });

    it('should return true for late summer/fall', () => {
      expect(isAuroraSeason(new Date('2025-08-15'))).toBe(true);
      expect(isAuroraSeason(new Date('2025-09-15'))).toBe(true);
      expect(isAuroraSeason(new Date('2025-10-15'))).toBe(true);
      expect(isAuroraSeason(new Date('2025-11-15'))).toBe(true);
    });

    it('should return false for summer months', () => {
      expect(isAuroraSeason(new Date('2025-05-15'))).toBe(false);
      expect(isAuroraSeason(new Date('2025-06-15'))).toBe(false);
      expect(isAuroraSeason(new Date('2025-07-15'))).toBe(false);
    });

    it('should accept string dates', () => {
      expect(isAuroraSeason('2025-01-15')).toBe(true);
      expect(isAuroraSeason('2025-06-15')).toBe(false);
    });
  });

  describe('getDatesInMonth', () => {
    it('should return all dates in January', () => {
      const result = getDatesInMonth(2025, 0); // January
      expect(result).toHaveLength(31);
      expect(result[0]).toBe('2025-01-01');
      expect(result[30]).toBe('2025-01-31');
    });

    it('should return all dates in February (non-leap year)', () => {
      const result = getDatesInMonth(2025, 1); // February
      expect(result).toHaveLength(28);
    });

    it('should return all dates in February (leap year)', () => {
      const result = getDatesInMonth(2024, 1); // February 2024 (leap year)
      expect(result).toHaveLength(29);
    });

    it('should return dates in YYYY-MM-DD format', () => {
      const result = getDatesInMonth(2025, 0);
      expect(result[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2025-01-15T10:00:00');
      const date2 = new Date('2025-01-15T16:00:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2025-01-15T23:59:59');
      const date2 = new Date('2025-01-16T00:00:00');
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should accept string dates', () => {
      expect(isSameDay('2025-01-15T10:00:00', '2025-01-15T16:00:00')).toBe(true);
      expect(isSameDay('2025-01-15', '2025-01-16')).toBe(false);
    });
  });

  describe('getRelativeDateDescription', () => {
    beforeEach(() => {
      // Mock current date to 2025-01-15
      vi.setSystemTime(new Date('2025-01-15T12:00:00'));
    });

    it('should return "Today" for today', () => {
      const result = getRelativeDateDescription(new Date('2025-01-15T15:00:00'));
      expect(result).toBe('Today');
    });

    it('should return "Tomorrow" for tomorrow', () => {
      const result = getRelativeDateDescription(new Date('2025-01-16T12:00:00'));
      expect(result).toBe('Tomorrow');
    });

    it('should return "Yesterday" for yesterday', () => {
      const result = getRelativeDateDescription(new Date('2025-01-14T12:00:00'));
      expect(result).toBe('Yesterday');
    });

    it('should return "In X days" for near future', () => {
      const result = getRelativeDateDescription(new Date('2025-01-18T12:00:00'));
      expect(result).toBe('In 3 days');
    });

    it('should return "X days ago" for recent past', () => {
      const result = getRelativeDateDescription(new Date('2025-01-12T12:00:00'));
      expect(result).toBe('3 days ago');
    });

    it('should return formatted date for distant dates', () => {
      const result = getRelativeDateDescription(new Date('2025-02-20T12:00:00'));
      expect(result).toContain('Feb');
      expect(result).toContain('20');
    });

    it('should accept string dates', () => {
      // Use the current mocked date
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const result = getRelativeDateDescription(todayStr);
      expect(result).toBe('Today');
    });
  });

  describe('sortEventsByDateTime', () => {
    it('should sort events by date and time', () => {
      const events = [
        { id: '1', title: 'Event 1', date: '2025-01-20', startTime: '14:00', endTime: '15:00' },
        { id: '2', title: 'Event 2', date: '2025-01-15', startTime: '10:00', endTime: '11:00' },
        { id: '3', title: 'Event 3', date: '2025-01-15', startTime: '09:00', endTime: '10:00' },
        { id: '4', title: 'Event 4', date: '2025-01-18', startTime: '12:00', endTime: '13:00' },
      ];

      const sorted = sortEventsByDateTime(events);

      expect(sorted[0].id).toBe('3'); // 2025-01-15 09:00
      expect(sorted[1].id).toBe('2'); // 2025-01-15 10:00
      expect(sorted[2].id).toBe('4'); // 2025-01-18 12:00
      expect(sorted[3].id).toBe('1'); // 2025-01-20 14:00
    });

    it('should not mutate original array', () => {
      const events = [
        { id: '1', title: 'Event 1', date: '2025-01-20', startTime: '14:00', endTime: '15:00' },
        { id: '2', title: 'Event 2', date: '2025-01-15', startTime: '10:00', endTime: '11:00' },
      ];

      const sorted = sortEventsByDateTime(events);

      expect(events[0].id).toBe('1'); // Original unchanged
      expect(sorted[0].id).toBe('2'); // Sorted version different
    });
  });
});

