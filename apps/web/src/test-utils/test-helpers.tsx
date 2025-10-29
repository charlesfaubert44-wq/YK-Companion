/**
 * Test Utilities and Helpers
 * 
 * Custom render functions and test utilities for React Testing Library
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock Supabase client for tests
export const createMockSupabaseClient = () => ({
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  })),
});

/**
 * Custom render that includes common providers
 */
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <LanguageProvider>
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
};

/**
 * Custom render with providers
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Render with just Auth Provider
 */
const AuthWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

export const renderWithAuth = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AuthWrapper, ...options });

/**
 * Render with just Language Provider
 */
const LanguageWrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

export const renderWithLanguage = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: LanguageWrapper, ...options });

/**
 * Wait for async updates
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Create mock user data
 */
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Create mock profile data
 */
export const createMockProfile = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  user_type: 'visiting' as const,
  is_admin: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Create mock sponsor data
 */
export const createMockSponsor = (overrides = {}) => ({
  id: 'test-sponsor-id',
  name: 'Test Sponsor',
  tagline: 'Test tagline',
  link: 'https://example.com',
  position: 'home_top' as const,
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  is_active: true,
  plan_type: 'premium',
  total_price: 450,
  payment_status: 'paid',
  ...overrides,
});

/**
 * Create mock garage sale data
 */
export const createMockGarageSale = (overrides = {}) => ({
  id: 'test-sale-id',
  title: 'Test Garage Sale',
  description: 'Test description',
  address: '123 Test St, Yellowknife, NT',
  latitude: 62.454,
  longitude: -114.375,
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
  contact_info: 'test@example.com',
  is_approved: true,
  created_by: 'test-user-id',
  ...overrides,
});

/**
 * Create mock knowledge article data
 */
export const createMockArticle = (overrides = {}) => ({
  id: 'test-article-id',
  title: 'Test Article',
  content: 'Test content',
  category: 'visiting' as const,
  language: 'en',
  author_id: 'test-user-id',
  status: 'published' as const,
  views: 0,
  helpful_count: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

