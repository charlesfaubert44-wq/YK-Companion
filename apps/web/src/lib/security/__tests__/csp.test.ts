/**
 * Tests for CSP (Content Security Policy) utilities
 */

import { describe, it, expect } from 'vitest';
import { 
  buildCSPHeader, 
  generateNonce, 
  getCSPHeader,
  cspDirectives 
} from '../csp';

describe('CSP Utilities', () => {
  describe('generateNonce', () => {
    it('should generate a nonce string', () => {
      const nonce = generateNonce();
      expect(nonce).toBeDefined();
      expect(typeof nonce).toBe('string');
      expect(nonce.length).toBeGreaterThan(10);
    });

    it('should generate unique nonces', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();
      expect(nonce1).not.toBe(nonce2);
    });
  });

  describe('buildCSPHeader', () => {
    it('should build valid CSP header string', () => {
      const header = buildCSPHeader(cspDirectives);
      
      expect(header).toContain("default-src 'self'");
      expect(header).toContain("object-src 'none'");
      expect(header).toContain('upgrade-insecure-requests');
    });

    it('should include nonce in script-src when provided', () => {
      const nonce = 'test-nonce-123';
      const header = buildCSPHeader(cspDirectives, nonce);
      
      expect(header).toContain(`'nonce-${nonce}'`);
    });

    it('should not include nonce if not provided', () => {
      const header = buildCSPHeader(cspDirectives);
      
      expect(header).not.toContain("'nonce-");
    });

    it('should include all directive types', () => {
      const header = buildCSPHeader(cspDirectives);
      
      expect(header).toContain('default-src');
      expect(header).toContain('script-src');
      expect(header).toContain('style-src');
      expect(header).toContain('img-src');
      expect(header).toContain('font-src');
      expect(header).toContain('connect-src');
    });

    it('should include Supabase in connect-src', () => {
      const header = buildCSPHeader(cspDirectives);
      
      expect(header).toContain('supabase');
    });

    it('should include Mapbox in img-src and connect-src', () => {
      const header = buildCSPHeader(cspDirectives);
      
      expect(header).toContain('mapbox');
    });

    it('should prevent framing with frame-ancestors', () => {
      const header = buildCSPHeader(cspDirectives);
      
      expect(header).toContain("frame-ancestors 'none'");
    });

    it('should only allow self for base-uri', () => {
      const header = buildCSPHeader(cspDirectives);
      
      expect(header).toContain("base-uri 'self'");
    });
  });

  describe('getCSPHeader', () => {
    it('should return a CSP header string', () => {
      const header = getCSPHeader();
      
      expect(typeof header).toBe('string');
      expect(header.length).toBeGreaterThan(50);
    });

    it('should include nonce when provided', () => {
      const nonce = 'abc123';
      const header = getCSPHeader(nonce);
      
      expect(header).toContain(`'nonce-${nonce}'`);
    });
  });

  describe('CSP Directives', () => {
    it('should have secure default-src', () => {
      expect(cspDirectives['default-src']).toContain("'self'");
      expect(cspDirectives['default-src'].length).toBe(1);
    });

    it('should block object embeds', () => {
      expect(cspDirectives['object-src']).toContain("'none'");
    });

    it('should upgrade insecure requests', () => {
      expect(cspDirectives['upgrade-insecure-requests']).toBe(true);
    });

    it('should allow necessary third-party scripts', () => {
      const scriptSrc = cspDirectives['script-src'];
      
      // Should allow Stripe for payments
      expect(scriptSrc.some(src => src.includes('stripe'))).toBe(true);
      
      // Should allow Google Analytics
      expect(scriptSrc.some(src => src.includes('google'))).toBe(true);
    });

    it('should allow Google Fonts', () => {
      const fontSrc = cspDirectives['font-src'];
      const styleSrc = cspDirectives['style-src'];
      
      expect(styleSrc.some(src => src.includes('fonts.googleapis'))).toBe(true);
      expect(fontSrc.some(src => src.includes('fonts.gstatic'))).toBe(true);
    });

    it('should allow WebSocket connections to Supabase', () => {
      const connectSrc = cspDirectives['connect-src'];
      
      expect(connectSrc.some(src => src.includes('wss://') && src.includes('supabase'))).toBe(true);
    });
  });
});

