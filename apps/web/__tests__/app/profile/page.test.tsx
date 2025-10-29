/**
 * Unit Tests for Profile Page
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProfilePage from '@/app/profile/page';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/profile/ProfileForm', () => {
  return function MockProfileForm() {
    return <div data-testid="profile-form">Profile Form</div>;
  };
});

jest.mock('@/components/profile/AvatarUpload', () => {
  return function MockAvatarUpload() {
    return <div data-testid="avatar-upload">Avatar Upload</div>;
  };
});

const mockRouter = {
  push: jest.fn(),
};

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
};

const mockProfile = {
  id: 'user-123',
  full_name: 'Test User',
  user_type: 'visiting',
  email: 'test@example.com',
  address: '123 Main St',
  avatar_url: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should redirect to home if not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      loading: false,
      signOut: jest.fn(),
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('should show loading state while checking auth', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      loading: true,
      signOut: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('should display profile page for authenticated user', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      loading: false,
      signOut: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByTestId('profile-form')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-upload')).toBeInTheDocument();
  });

  it('should display user information correctly', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      loading: false,
      signOut: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('visiting')).toBeInTheDocument();
  });

  it('should show delete account button', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      loading: false,
      signOut: jest.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('should show confirmation dialog when deleting account', async () => {
    global.confirm = jest.fn(() => false);
    global.fetch = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      loading: false,
      signOut: jest.fn(),
    });

    render(<ProfilePage />);

    const deleteButton = screen.getByText('Delete Account');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Are you absolutely sure/)).toBeInTheDocument();
    });
  });

  it('should handle delete account flow', async () => {
    const mockSignOut = jest.fn();
    global.confirm = jest.fn(() => true);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }) as any
    );

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      loading: false,
      signOut: mockSignOut,
    });

    render(<ProfilePage />);

    // Click delete account
    const deleteButton = screen.getByText('Delete Account');
    fireEvent.click(deleteButton);

    // Confirm in confirmation dialog
    await waitFor(() => {
      expect(screen.getByText(/Yes, Delete My Account/)).toBeInTheDocument();
    });

    const confirmButton = screen.getByText(/Yes, Delete My Account/);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/profile/delete',
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });
});

