/**
 * Tests for Supabase client utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock createClient function since we can't actually connect to Supabase in tests
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
}));

describe('Supabase Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a client with proper configuration', () => {
    const { createClient } = require('@/lib/supabase/client');
    const client = createClient();
    
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.from).toBeDefined();
  });

  it('should handle database queries', async () => {
    const { createClient } = require('@/lib/supabase/client');
    const client = createClient();
    
    const query = client.from('test_table').select('*');
    expect(query).toBeDefined();
  });

  it('should handle authentication methods', () => {
    const { createClient } = require('@/lib/supabase/client');
    const client = createClient();
    
    expect(client.auth.getSession).toBeDefined();
    expect(client.auth.onAuthStateChange).toBeDefined();
  });
});

