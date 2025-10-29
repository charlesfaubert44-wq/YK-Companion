/**
 * Unit Tests for Weather Utilities
 * 
 * Example tests for weather-related helper functions
 */

import { getWeatherEmoji, getTempColor } from '@/hooks/useWeather';

describe('Weather Utilities', () => {
  describe('getWeatherEmoji', () => {
    it('should return sun emoji for clear day', () => {
      const emoji = getWeatherEmoji('Clear', '01d');
      expect(emoji).toBe('☀️');
    });

    it('should return moon emoji for clear night', () => {
      const emoji = getWeatherEmoji('Clear', '01n');
      expect(emoji).toBe('🌙');
    });

    it('should return rain emoji for rainy weather', () => {
      const emoji = getWeatherEmoji('Rain', '10d');
      expect(emoji).toBe('🌧️');
    });

    it('should return snow emoji for snowy weather', () => {
      const emoji = getWeatherEmoji('Snow', '13d');
      expect(emoji).toBe('❄️');
    });

    it('should handle case-insensitive conditions', () => {
      const emoji1 = getWeatherEmoji('CLEAR', '01d');
      const emoji2 = getWeatherEmoji('clear', '01d');
      const emoji3 = getWeatherEmoji('Clear', '01d');
      
      expect(emoji1).toBe('☀️');
      expect(emoji2).toBe('☀️');
      expect(emoji3).toBe('☀️');
    });

    it('should return default emoji for unknown condition', () => {
      const emoji = getWeatherEmoji('Unknown', '99x');
      expect(emoji).toBe('🌡️');
    });
  });

  describe('getTempColor', () => {
    it('should return correct color for extreme cold', () => {
      expect(getTempColor(-35)).toBe('text-blue-400');
      expect(getTempColor(-30)).toBe('text-blue-400');
    });

    it('should return correct color for cold weather', () => {
      expect(getTempColor(-25)).toBe('text-blue-300');
      expect(getTempColor(-15)).toBe('text-cyan-300');
      expect(getTempColor(-5)).toBe('text-cyan-200');
    });

    it('should return correct color for mild weather', () => {
      expect(getTempColor(5)).toBe('text-green-300');
      expect(getTempColor(15)).toBe('text-yellow-300');
    });

    it('should return correct color for warm weather', () => {
      expect(getTempColor(25)).toBe('text-orange-300');
    });

    it('should return correct color for hot weather', () => {
      expect(getTempColor(35)).toBe('text-red-400');
    });

    it('should handle boundary temperatures correctly', () => {
      expect(getTempColor(0)).toBe('text-cyan-200');
      expect(getTempColor(10)).toBe('text-green-300');
      expect(getTempColor(20)).toBe('text-yellow-300');
      expect(getTempColor(30)).toBe('text-orange-300');
    });
  });
});

