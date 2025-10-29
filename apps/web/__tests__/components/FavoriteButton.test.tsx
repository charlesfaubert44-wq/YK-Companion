/**
 * Unit Tests for FavoriteButton Component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FavoriteButton from '@/components/FavoriteButton';
import { useAuth } from '@/contexts/AuthContext';

// Mock dependencies
jest.mock('@/contexts/AuthContext');

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
};

describe('FavoriteButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    global.alert = jest.fn();
  });

  it('should not render when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
    });

    const { container } = render(
      <FavoriteButton itemType="garage-sales" itemId="sale-123" />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render empty heart when not saved', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ favorites: [] }),
    });

    render(<FavoriteButton itemType="garage-sales" itemId="sale-123" />);

    await waitFor(() => {
      expect(screen.getByText('🤍')).toBeInTheDocument();
    });
  });

  it('should render filled heart when saved', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        favorites: [{ item_id: 'sale-123', item_type: 'garage-sales' }] 
      }),
    });

    render(<FavoriteButton itemType="garage-sales" itemId="sale-123" />);

    await waitFor(() => {
      expect(screen.getByText('❤️')).toBeInTheDocument();
    });
  });

  it('should add to favorites when clicked (not saved)', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
    });

    // First fetch - check if saved (not saved)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ favorites: [] }),
    });

    render(<FavoriteButton itemType="garage-sales" itemId="sale-123" showText={true} />);

    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    // Second fetch - add to favorites
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/favorites',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            itemType: 'garage-sales',
            itemId: 'sale-123',
          }),
        })
      );
    });
  });

  it('should remove from favorites when clicked (already saved)', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
    });

    const mockFavorite = {
      id: 'fav-123',
      item_id: 'sale-123',
      item_type: 'garage-sales',
    };

    // First fetch - check if saved (is saved)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ favorites: [mockFavorite] }),
    });

    render(<FavoriteButton itemType="garage-sales" itemId="sale-123" showText={true} />);

    await waitFor(() => {
      expect(screen.getByText('Saved')).toBeInTheDocument();
    });

    // Second fetch - get favorites again to find ID
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ favorites: [mockFavorite] }),
    });

    // Third fetch - delete
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/favorites?id=fav-123'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  it('should show alert when unauthenticated user clicks', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
    });

    const { rerender } = render(
      <FavoriteButton itemType="garage-sales" itemId="sale-123" />
    );

    // Re-render with user (simulating click before check)
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
    });

    rerender(<FavoriteButton itemType="garage-sales" itemId="sale-123" />);

    // Mock the initial fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ favorites: [] }),
    });

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});

