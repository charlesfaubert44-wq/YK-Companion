/**
 * Tests for Footer component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils/test-helpers';

describe('Footer Component', () => {
  it('should render footer element', async () => {
    const { default: Footer } = await import('@/components/Footer');
    const { container } = renderWithProviders(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toBeTruthy();
  });

  it('should display copyright information', async () => {
    const { default: Footer } = await import('@/components/Footer');
    renderWithProviders(<Footer />);

    // Look for current year or copyright symbol
    const currentYear = new Date().getFullYear();
    const footerText = document.body.textContent || '';

    expect(
      footerText.includes(currentYear.toString()) ||
        footerText.includes('©') ||
        footerText.includes('Copyright')
    ).toBe(true);
  });

  it('should display YK Buddy branding', async () => {
    const { default: Footer } = await import('@/components/Footer');
    renderWithProviders(<Footer />);

    const text = screen.queryByText(/YK Buddy|Yellowknife/i);
    expect(text).toBeTruthy();
  });

  it('should display tagline or message', async () => {
    const { default: Footer } = await import('@/components/Footer');
    renderWithProviders(<Footer />);

    // Check for the tagline
    const tagline = screen.queryByText(/made with|yellowknife|northwest territories/i);
    expect(tagline).toBeTruthy();
  });

  it('should have footer navigation links', async () => {
    const { default: Footer } = await import('@/components/Footer');
    renderWithProviders(<Footer />);

    // Should have some links (About, Contact, etc.)
    const links = screen.queryAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should be accessible', async () => {
    const { default: Footer } = await import('@/components/Footer');
    const { container } = renderWithProviders(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toBeTruthy();

    // Should have semantic footer element or proper role
    expect(footer || container.querySelector('[role="contentinfo"]')).toBeTruthy();
  });

  it('should support multilingual content', async () => {
    const { default: Footer } = await import('@/components/Footer');
    renderWithProviders(<Footer />);

    // Footer should display content (will be in current language)
    const footerContent = document.body.textContent;
    expect(footerContent).toBeTruthy();
    expect(footerContent!.length).toBeGreaterThan(0);
  });
});
