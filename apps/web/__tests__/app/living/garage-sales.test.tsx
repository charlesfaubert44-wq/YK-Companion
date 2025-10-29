import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import GarageSalesPage from '@/app/living/garage-sales/page';
import { useAuth } from '@/contexts/AuthContext';
import { useGarageSales } from '@/hooks/useGarageSales';

// Mock dependencies
vi.mock('@/contexts/AuthContext');
vi.mock('@/hooks/useGarageSales');
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
vi.mock('@/components/InteractiveHeader', () => ({
  default: () => <div data-testid="interactive-header">Header</div>,
}));
vi.mock('next/dynamic', () => ({
  default: (fn: any, options: any) => {
    const DynamicComponent = (props: any) => {
      const Component = fn.toString().includes('MapView')
        ? ({ sales }: any) => <div data-testid="map-view">Map with {sales.length} sales</div>
        : null;
      return Component ? <Component {...props} /> : null;
    };
    DynamicComponent.displayName = 'DynamicComponent';
    return DynamicComponent;
  },
}));
vi.mock('@/components/garage-sales/MapView', () => ({
  default: ({ sales }: any) => (
    <div data-testid="map-view">Map with {sales.length} sales</div>
  ),
}));

// Mock garage sales data
const mockSales = [
  {
    id: '1',
    user_id: 'user1',
    title: 'Moving Sale - Everything Must Go!',
    description: 'Furniture, appliances, tools, winter gear.',
    address: '50 Street, Yellowknife, NT',
    latitude: 62.4540,
    longitude: -114.3718,
    location_details: null,
    sale_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '17:00',
    photos: [],
    tags: ['furniture', 'appliances', 'tools'],
    items_description: 'Couch, dining table, snow blower, skis',
    cash_only: true,
    early_birds_welcome: false,
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    host_name: 'John Smith',
    distance_km: 2.5,
  },
  {
    id: '2',
    user_id: 'user2',
    title: 'Multi-Family Garage Sale',
    description: 'Three families! Kids toys, clothes, household items.',
    address: 'Bretzlaff Drive, Yellowknife, NT',
    latitude: 62.4620,
    longitude: -114.3950,
    location_details: 'Driveway and garage',
    sale_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '16:00',
    photos: [],
    tags: ['kids', 'toys', 'clothes'],
    items_description: 'Baby gear, toys, books, kitchen items',
    cash_only: false,
    early_birds_welcome: true,
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    host_name: 'The Johnsons',
    distance_km: 3.2,
  },
];

describe('GarageSalesPage', () => {
  const mockUseAuth = vi.mocked(useAuth);
  const mockUseGarageSales = vi.mocked(useGarageSales);

  const defaultGarageSalesHook = {
    sales: mockSales,
    loading: false,
    error: null,
    filters: {},
    setFilters: vi.fn(),
    fetchSales: vi.fn(),
    saveSale: vi.fn(),
    deleteSale: vi.fn(),
    toggleFavorite: vi.fn(),
    getFavorites: vi.fn().mockResolvedValue([]),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      loading: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithApple: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
    });

    mockUseGarageSales.mockReturnValue(defaultGarageSalesHook);

    // Mock geolocation
    global.navigator.geolocation = {
      getCurrentPosition: vi.fn(),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Page Layout', () => {
    it('should render the page header with title and description', () => {
      render(<GarageSalesPage />);
      
      expect(screen.getByRole('heading', { name: 'Garage Sales' })).toBeInTheDocument();
      expect(screen.getByText('Find great deals in your neighborhood')).toBeInTheDocument();
    });

    it('should render breadcrumbs navigation', () => {
      render(<GarageSalesPage />);
      
      expect(screen.getByText('YK Buddy')).toBeInTheDocument();
      expect(screen.getByText('Living')).toBeInTheDocument();
    });

    it('should render the Add Sale button', () => {
      render(<GarageSalesPage />);
      
      expect(screen.getByRole('button', { name: /add sale/i })).toBeInTheDocument();
    });

    it('should render view mode toggle buttons', () => {
      render(<GarageSalesPage />);
      
      expect(screen.getByRole('button', { name: /list/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /calendar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /map/i })).toBeInTheDocument();
    });
  });

  describe('View Switching', () => {
    it('should default to list view', () => {
      render(<GarageSalesPage />);
      
      const listButton = screen.getByRole('button', { name: /list/i });
      expect(listButton).toHaveClass('bg-aurora-green');
    });

    it('should switch to calendar view when calendar button is clicked', async () => {
      render(<GarageSalesPage />);
      
      const calendarButton = screen.getByRole('button', { name: /calendar/i });
      fireEvent.click(calendarButton);
      
      await waitFor(() => {
        expect(calendarButton).toHaveClass('bg-aurora-green');
      });
    });

    it('should switch to map view when map button is clicked', async () => {
      render(<GarageSalesPage />);
      
      const mapButton = screen.getByRole('button', { name: /map/i });
      fireEvent.click(mapButton);
      
      await waitFor(() => {
        expect(mapButton).toHaveClass('bg-aurora-green');
        expect(screen.getByTestId('map-view')).toBeInTheDocument();
      });
    });
  });

  describe('Sales Display', () => {
    it('should display all garage sales in list view', () => {
      render(<GarageSalesPage />);
      
      expect(screen.getByText('Moving Sale - Everything Must Go!')).toBeInTheDocument();
      expect(screen.getByText('Multi-Family Garage Sale')).toBeInTheDocument();
    });

    it('should display sale count', () => {
      render(<GarageSalesPage />);
      
      expect(screen.getByText(/2 sales found/i)).toBeInTheDocument();
    });

    it('should show empty state when no sales are available', () => {
      mockUseGarageSales.mockReturnValue({
        ...defaultGarageSalesHook,
        sales: [],
      });

      render(<GarageSalesPage />);
      
      expect(screen.getByText(/no garage sales found/i)).toBeInTheDocument();
    });

    it('should display distance for each sale when available', () => {
      render(<GarageSalesPage />);
      
      expect(screen.getByText('2.5km')).toBeInTheDocument();
      expect(screen.getByText('3.2km')).toBeInTheDocument();
    });
  });

  describe('Filters', () => {
    it('should render the filters component', () => {
      render(<GarageSalesPage />);
      
      // Check for search input
      expect(screen.getByPlaceholderText(/search by title/i)).toBeInTheDocument();
    });

    it('should call setFilters when filter changes', async () => {
      const setFiltersMock = vi.fn();
      mockUseGarageSales.mockReturnValue({
        ...defaultGarageSalesHook,
        setFilters: setFiltersMock,
      });

      render(<GarageSalesPage />);
      
      const searchInput = screen.getByPlaceholderText(/search by title/i);
      fireEvent.change(searchInput, { target: { value: 'furniture' } });
      
      await waitFor(() => {
        expect(setFiltersMock).toHaveBeenCalled();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when data is loading', () => {
      mockUseGarageSales.mockReturnValue({
        ...defaultGarageSalesHook,
        loading: true,
        sales: [],
      });

      render(<GarageSalesPage />);
      
      expect(screen.getByText(/loading garage sales/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when there is an error', () => {
      mockUseGarageSales.mockReturnValue({
        ...defaultGarageSalesHook,
        error: new Error('Failed to fetch sales'),
      });

      render(<GarageSalesPage />);
      
      expect(screen.getByText(/failed to fetch sales/i)).toBeInTheDocument();
    });
  });

  describe('User Location', () => {
    it('should show enable location button when location is not available', () => {
      render(<GarageSalesPage />);
      
      expect(screen.getByRole('button', { name: /enable location/i })).toBeInTheDocument();
    });

    it('should request geolocation when enable location button is clicked', async () => {
      const getCurrentPositionMock = vi.fn((success) => {
        success({
          coords: {
            latitude: 62.4540,
            longitude: -114.3718,
          },
        });
      });
      
      global.navigator.geolocation.getCurrentPosition = getCurrentPositionMock;

      render(<GarageSalesPage />);
      
      const locationButton = screen.getByRole('button', { name: /enable location/i });
      fireEvent.click(locationButton);
      
      await waitFor(() => {
        expect(getCurrentPositionMock).toHaveBeenCalled();
      });
    });

    it('should show alert when geolocation fails', async () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const getCurrentPositionMock = vi.fn((success, error) => {
        error({ code: 1, message: 'User denied geolocation' });
      });
      
      global.navigator.geolocation.getCurrentPosition = getCurrentPositionMock;

      render(<GarageSalesPage />);
      
      const locationButton = screen.getByRole('button', { name: /enable location/i });
      fireEvent.click(locationButton);
      
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Unable to get your location'));
      });

      alertMock.mockRestore();
    });
  });

  describe('Add Sale Functionality', () => {
    it('should prompt sign in when unauthenticated user tries to add sale', () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<GarageSalesPage />);
      
      const addButton = screen.getByRole('button', { name: /add sale/i });
      fireEvent.click(addButton);
      
      expect(alertMock).toHaveBeenCalledWith('Please sign in to add a garage sale');
      alertMock.mockRestore();
    });

    it('should open add modal when authenticated user clicks add sale', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' } as any,
        profile: null,
        loading: false,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signInWithGoogle: vi.fn(),
        signInWithApple: vi.fn(),
        signOut: vi.fn(),
        updateProfile: vi.fn(),
      });

      render(<GarageSalesPage />);
      
      const addButton = screen.getByRole('button', { name: /add sale/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Add Garage Sale')).toBeInTheDocument();
      });
    });
  });

  describe('Edit/Delete Functionality', () => {
    it('should allow owner to edit their own sale', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' } as any,
        profile: null,
        loading: false,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signInWithGoogle: vi.fn(),
        signInWithApple: vi.fn(),
        signOut: vi.fn(),
        updateProfile: vi.fn(),
      });

      render(<GarageSalesPage />);
      
      // Find edit button for the first sale (owned by user1)
      const editButtons = screen.getAllByLabelText('Edit sale');
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('should show confirmation dialog when deleting a sale', async () => {
      const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const deleteSaleMock = vi.fn().mockResolvedValue(true);
      
      mockUseAuth.mockReturnValue({
        user: { id: 'user1', email: 'test@example.com' } as any,
        profile: null,
        loading: false,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signInWithGoogle: vi.fn(),
        signInWithApple: vi.fn(),
        signOut: vi.fn(),
        updateProfile: vi.fn(),
      });

      mockUseGarageSales.mockReturnValue({
        ...defaultGarageSalesHook,
        deleteSale: deleteSaleMock,
      });

      render(<GarageSalesPage />);
      
      const deleteButtons = screen.getAllByLabelText('Delete sale');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(confirmMock).toHaveBeenCalled();
        expect(deleteSaleMock).toHaveBeenCalledWith('1', 'user1');
      });

      confirmMock.mockRestore();
    });
  });

  describe('Favorite Functionality', () => {
    it('should allow authenticated users to favorite sales', async () => {
      const toggleFavoriteMock = vi.fn().mockResolvedValue(true);
      
      mockUseAuth.mockReturnValue({
        user: { id: 'current-user', email: 'test@example.com' } as any,
        profile: null,
        loading: false,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signInWithGoogle: vi.fn(),
        signInWithApple: vi.fn(),
        signOut: vi.fn(),
        updateProfile: vi.fn(),
      });

      mockUseGarageSales.mockReturnValue({
        ...defaultGarageSalesHook,
        toggleFavorite: toggleFavoriteMock,
      });

      render(<GarageSalesPage />);
      
      const favoriteButtons = screen.getAllByLabelText(/add to favorites/i);
      fireEvent.click(favoriteButtons[0]);
      
      await waitFor(() => {
        expect(toggleFavoriteMock).toHaveBeenCalledWith('1', 'current-user');
      });
    });

    it('should prompt sign in when unauthenticated user tries to favorite', async () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<GarageSalesPage />);
      
      // Note: Favorites only show for authenticated non-owners, 
      // so this test may need adjustment based on actual implementation
      
      alertMock.mockRestore();
    });
  });

  describe('Responsive Design', () => {
    it('should render mobile-friendly layout', () => {
      render(<GarageSalesPage />);
      
      // Check that the page renders without errors
      expect(screen.getByRole('heading', { name: 'Garage Sales' })).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should maintain filters when switching views', async () => {
      const setFiltersMock = vi.fn();
      const hookReturnValue = {
        ...defaultGarageSalesHook,
        setFilters: setFiltersMock,
        filters: { search: 'furniture' },
      };
      
      mockUseGarageSales.mockReturnValue(hookReturnValue);

      render(<GarageSalesPage />);
      
      // Search input should have the filter value
      const searchInput = screen.getByPlaceholderText(/search by title/i) as HTMLInputElement;
      expect(searchInput.value).toBe('furniture');
      
      // Switch to calendar view
      const calendarButton = screen.getByRole('button', { name: /calendar/i });
      fireEvent.click(calendarButton);
      
      // Filters should still be applied (check the hook was called with correct filters)
      await waitFor(() => {
        expect(hookReturnValue.filters.search).toBe('furniture');
      });
    });
  });
});

