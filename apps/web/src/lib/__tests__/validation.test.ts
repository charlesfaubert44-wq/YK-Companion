/**
 * Tests for validation utilities and schemas
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Example validation schemas to test
const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);
const urlSchema = z.string().url();

describe('Validation', () => {
  describe('Email validation', () => {
    it('should validate correct email addresses', () => {
      expect(() => emailSchema.parse('test@example.com')).not.toThrow();
      expect(() => emailSchema.parse('user.name+tag@example.co.uk')).not.toThrow();
    });

    it('should reject invalid email addresses', () => {
      expect(() => emailSchema.parse('invalid')).toThrow();
      expect(() => emailSchema.parse('invalid@')).toThrow();
      expect(() => emailSchema.parse('@example.com')).toThrow();
      expect(() => emailSchema.parse('test @example.com')).toThrow();
    });
  });

  describe('Password validation', () => {
    it('should validate passwords with minimum length', () => {
      expect(() => passwordSchema.parse('12345678')).not.toThrow();
      expect(() => passwordSchema.parse('verylongpassword123')).not.toThrow();
    });

    it('should reject passwords that are too short', () => {
      expect(() => passwordSchema.parse('short')).toThrow();
      expect(() => passwordSchema.parse('1234567')).toThrow();
      expect(() => passwordSchema.parse('')).toThrow();
    });
  });

  describe('URL validation', () => {
    it('should validate correct URLs', () => {
      expect(() => urlSchema.parse('https://example.com')).not.toThrow();
      expect(() => urlSchema.parse('http://example.com/path')).not.toThrow();
      expect(() => urlSchema.parse('https://sub.example.com/path?query=1')).not.toThrow();
    });

    it('should reject invalid URLs', () => {
      expect(() => urlSchema.parse('not a url')).toThrow();
      expect(() => urlSchema.parse('example.com')).toThrow(); // missing protocol
      expect(() => urlSchema.parse('htp://wrong-protocol.com')).toThrow();
    });
  });
});

