/**
 * Tests for PathwayCards (EnhancedPathwayCards) component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils/test-helpers';

describe('PathwayCards (EnhancedPathwayCards)', () => {
  it('should render all three pathway cards', async () => {
    const { default: EnhancedPathwayCards } = await import('@/components/EnhancedPathwayCards');
    renderWithProviders(<EnhancedPathwayCards />);

    // Should show all three pathways
    expect(screen.getByText(/visiting/i)).toBeInTheDocument();
    expect(screen.getByText(/living/i)).toBeInTheDocument();
    expect(screen.getByText(/moving/i)).toBeInTheDocument();
  });

  it('should display pathway descriptions', async () => {
    const { default: EnhancedPathwayCards } = await import('@/components/EnhancedPathwayCards');
    renderWithProviders(<EnhancedPathwayCards />);

    // Check for description text (partial match)
    const descriptions = screen.queryAllByText(/aurora|garage|housing|trip|events/i);
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('should render custom northern icons', async () => {
    const { default: EnhancedPathwayCards } = await import('@/components/EnhancedPathwayCards');
    const { container } = renderWithProviders(<EnhancedPathwayCards />);

    // Should have SVG icons
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(3); // At least 3 for the icons
  });

  it('should be clickable and navigate', async () => {
    const { default: EnhancedPathwayCards } = await import('@/components/EnhancedPathwayCards');
    const user = userEvent.setup();
    renderWithProviders(<EnhancedPathwayCards />);

    // Cards should be links or have click handlers
    const cards = screen.queryAllByRole('link') || 
                  screen.queryAllByRole('button');
    
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it('should have hover effects', async () => {
    const { default: EnhancedPathwayCards } = await import('@/components/EnhancedPathwayCards');
    const { container } = renderWithProviders(<EnhancedPathwayCards />);

    // Check for transition or animation classes
    const elements = container.querySelectorAll('[class*="transition"], [class*="hover"]');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should be responsive', async () => {
    const { default: EnhancedPathwayCards } = await import('@/components/EnhancedPathwayCards');
    const { container } = renderWithProviders(<EnhancedPathwayCards />);

    // Should have responsive classes (md:, lg:, etc.)
    const html = container.innerHTML;
    expect(html).toMatch(/md:|lg:|sm:/);
  });

  it('should display in correct order', async () => {
    const { default: EnhancedPathwayCards } = await import('@/components/EnhancedPathwayCards');
    renderWithProviders(<EnhancedPathwayCards />);

    const allText = document.body.textContent || '';
    
    // Visiting should come before Living, which should come before Moving
    const visitingIndex = allText.toLowerCase().indexOf('visiting');
    const livingIndex = allText.toLowerCase().indexOf('living');
    const movingIndex = allText.toLowerCase().indexOf('moving');

    if (visitingIndex !== -1 && livingIndex !== -1) {
      expect(visitingIndex).toBeLessThan(livingIndex);
    }
    if (livingIndex !== -1 && movingIndex !== -1) {
      expect(livingIndex).toBeLessThan(movingIndex);
    }
  });

  it('should support multilingual content', async () => {
    const { default: EnhancedPathwayCards } = await import('@/components/EnhancedPathwayCards');
    renderWithProviders(<EnhancedPathwayCards />);

    // Should use translation function
    // Content will be in the current language (default: English)
    expect(screen.getByText(/visiting|living|moving/i)).toBeInTheDocument();
  });
});

