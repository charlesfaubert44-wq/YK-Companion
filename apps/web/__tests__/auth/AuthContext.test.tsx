/**
 * Unit Tests for AuthContext
 * 
 * These are example tests demonstrating how to test authentication flows.
 * To run: npm install --save-dev @testing-library/react @testing-library/jest-dom jest-environment-jsdom
 * Then: npm test
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
  logDebug: jest.fn(),
  logError: jest.fn(),
  logWarn: jest.fn(),
}));

const mockSupabase = {
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signInWithOAuth: jest.fn(),
    signOut: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    update: jest.fn().mockReturnThis(),
  })),
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
      
      consoleSpy.mockRestore();
    });

    it('should provide auth context when used within AuthProvider', () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      
      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('profile');
      expect(result.current).toHaveProperty('signIn');
      expect(result.current).toHaveProperty('signUp');
      expect(result.current).toHaveProperty('signOut');
    });
  });

  describe('Authentication flows', () => {
    it('should sign up a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      });

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.signUp(
        'test@example.com',
        'password123',
        'Test User'
      );

      expect(response.error).toBeNull();
      expect(response.data.user).toEqual(mockUser);
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test User',
            address: null,
          },
        },
      });
    });

    it('should sign in an existing user successfully', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
        access_token: 'mock-token',
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      });

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.signIn(
        'test@example.com',
        'password123'
      );

      expect(response.error).toBeNull();
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle sign in errors', async () => {
      const mockError = new Error('Invalid credentials');

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      });

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.signIn(
        'wrong@example.com',
        'wrongpassword'
      );

      expect(response.error).toEqual(mockError);
      expect(response.data).toBeNull();
    });

    it('should sign out user successfully', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      });

      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.signOut();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.profile).toBeNull();
    });

    it('should update user profile', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      const mockProfile = {
        id: 'user-123',
        full_name: 'Test User',
        user_type: 'visiting',
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { 
          session: { 
            user: mockUser,
            access_token: 'token'
          } 
        },
        error: null,
      });

      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      });

      const fromMock = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProfile,
          error: null,
        }),
        update: jest.fn().mockReturnThis(),
      }));

      mockSupabase.from = fromMock;

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updates = { user_type: 'living' };
      await result.current.updateProfile(updates);

      expect(fromMock).toHaveBeenCalledWith('profiles');
    });
  });

  describe('Error handling', () => {
    it('should handle missing Supabase configuration', async () => {
      (createClient as jest.Mock).mockImplementation(() => {
        throw new Error('Supabase credentials not configured');
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.signIn(
        'test@example.com',
        'password'
      );

      expect(response.error).toBeTruthy();
      expect(response.error.message).toContain('not configured');
    });
  });
});

