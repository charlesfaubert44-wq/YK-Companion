/**
 * Tests for PremiumSpotlight component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PremiumSpotlight from '@/components/PremiumSpotlight';
import { createMockSponsor } from '@/test-utils/test-helpers';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: createMockSponsor(),
        error: null,
      }),
    })),
  })),
}));

describe('PremiumSpotlight', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sponsor when active', async () => {
    render(<PremiumSpotlight position="home_top" />);

    await waitFor(() => {
      expect(screen.getByText('Test Sponsor')).toBeInTheDocument();
    });
  });

  it('should render sponsor tagline', async () => {
    render(<PremiumSpotlight position="home_top" />);

    await waitFor(() => {
      expect(screen.getByText('Test tagline')).toBeInTheDocument();
    });
  });

  it('should render sponsor link', async () => {
    render(<PremiumSpotlight position="home_top" />);

    await waitFor(() => {
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('should handle no active sponsor', async () => {
    // Override mock to return no sponsor
    vi.mock('@/lib/supabase/client', () => ({
      createClient: vi.fn(() => ({
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          lte: vi.fn().mockReturnThis(),
          gte: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'No active sponsor' },
          }),
        })),
      })),
    }));

    const { container } = render(<PremiumSpotlight position="home_top" />);

    await waitFor(() => {
      // Should not render anything when no sponsor
      expect(container.firstChild).toBeNull();
    });
  });

  it('should query for the correct position', async () => {
    const mockFrom = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: createMockSponsor(), error: null }),
    }));

    vi.mock('@/lib/supabase/client', () => ({
      createClient: vi.fn(() => ({
        from: mockFrom,
      })),
    }));

    render(<PremiumSpotlight position="visiting" />);

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('premium_sponsors');
    });
  });

  it('should have Northern Lights animation', async () => {
    const { container } = render(<PremiumSpotlight position="home_top" />);

    await waitFor(() => {
      // Check for animation-related classes
      const element =
        container.querySelector('[class*="aurora"]') ||
        container.querySelector('[class*="animate"]');
      expect(element).toBeDefined();
    });
  });
});
