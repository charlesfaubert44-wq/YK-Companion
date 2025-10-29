/**
 * Tests for useTranslation hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { renderWithLanguage } from '@/test-utils/test-helpers';

// Import LanguageProvider for wrapper
import { LanguageProvider } from '@/contexts/LanguageContext';

// Test wrapper component
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('useTranslation', () => {
  it('should return translation function', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: Wrapper,
    });

    expect(result.current.t).toBeDefined();
    expect(typeof result.current.t).toBe('function');
  });

  it('should translate common keys', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: Wrapper,
    });

    expect(result.current.t('home')).toBe('Home');
    expect(result.current.t('about')).toBe('About');
    expect(result.current.t('contact')).toBe('Contact');
  });

  it('should return key if translation is missing', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: Wrapper,
    });

    const missingKey = 'nonexistent.translation.key';
    expect(result.current.t(missingKey)).toBe(missingKey);
  });

  it('should change language', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: Wrapper,
    });

    expect(result.current.language).toBe('en');
    
    // Change to French
    result.current.setLanguage('fr');
    expect(result.current.language).toBe('fr');
    expect(result.current.t('home')).toBe('Accueil');
  });

  it('should support all 9 languages', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: Wrapper,
    });

    const languages: Array<'en' | 'fr' | 'zh' | 'ja' | 'ko' | 'es' | 'de' | 'vi' | 'tl'> = [
      'en', 'fr', 'zh', 'ja', 'ko', 'es', 'de', 'vi', 'tl'
    ];

    languages.forEach((lang) => {
      result.current.setLanguage(lang);
      expect(result.current.language).toBe(lang);
      expect(result.current.t('home')).toBeTruthy(); // Should have a translation
    });
  });
});

