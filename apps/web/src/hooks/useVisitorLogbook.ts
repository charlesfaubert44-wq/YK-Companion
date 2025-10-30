import { useState, useEffect, useCallback } from 'react';
import { VisitorLogbookEntry, LogbookFilters, ExperienceType } from '@/types/visitor-logbook.types';

interface UseVisitorLogbookOptions {
  autoFetch?: boolean;
  featured?: boolean;
  experienceType?: ExperienceType;
  rating?: number;
  limit?: number;
}

export function useVisitorLogbook(options: UseVisitorLogbookOptions = {}) {
  const { autoFetch = true, featured, experienceType, rating, limit = 20 } = options;

  const [entries, setEntries] = useState<VisitorLogbookEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  // Fetch entries
  const fetchEntries = useCallback(
    async (customOffset = 0) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (featured) params.append('featured', 'true');
        if (experienceType) params.append('experience_type', experienceType);
        if (rating) params.append('rating', rating.toString());
        params.append('limit', limit.toString());
        params.append('offset', customOffset.toString());

        const response = await fetch(`/api/visitor-logbook?${params.toString()}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to fetch entries');
        }

        setEntries(customOffset === 0 ? result.data : [...entries, ...result.data]);
        setTotal(result.total || 0);
        setOffset(customOffset);
      } catch (err) {
        console.error('Error fetching logbook entries:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch entries');
      } finally {
        setLoading(false);
      }
    },
    [featured, experienceType, rating, limit]
  );

  // Load more entries
  const loadMore = useCallback(() => {
    const newOffset = offset + limit;
    fetchEntries(newOffset);
  }, [offset, limit, fetchEntries]);

  // Refresh entries
  const refresh = useCallback(() => {
    fetchEntries(0);
  }, [fetchEntries]);

  // Like/unlike an entry
  const toggleLike = useCallback(async (entryId: string) => {
    try {
      const response = await fetch(`/api/visitor-logbook/${entryId}/like`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to toggle like');
      }

      // Update local state
      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === entryId
            ? {
                ...entry,
                user_liked: result.liked,
                likes_count: result.likes_count,
              }
            : entry
        )
      );

      return result;
    } catch (err) {
      console.error('Error toggling like:', err);
      throw err;
    }
  }, []);

  // Create new entry
  const createEntry = useCallback(
    async (entryData: any) => {
      try {
        const response = await fetch('/api/visitor-logbook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entryData),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to create entry');
        }

        // Refresh entries to show new entry (if approved)
        refresh();

        return result;
      } catch (err) {
        console.error('Error creating entry:', err);
        throw err;
      }
    },
    [refresh]
  );

  // Delete entry
  const deleteEntry = useCallback(async (entryId: string) => {
    try {
      const response = await fetch(`/api/visitor-logbook/${entryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete entry');
      }

      // Remove from local state
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));

      return result;
    } catch (err) {
      console.error('Error deleting entry:', err);
      throw err;
    }
  }, []);

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    if (autoFetch) {
      fetchEntries(0);
    }
  }, [autoFetch, featured, experienceType, rating]);

  return {
    entries,
    loading,
    error,
    total,
    hasMore: entries.length < total,
    fetchEntries,
    loadMore,
    refresh,
    toggleLike,
    createEntry,
    deleteEntry,
  };
}

// Hook for fetching a single entry
export function useLogbookEntry(entryId: string | null) {
  const [entry, setEntry] = useState<VisitorLogbookEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntry = useCallback(async () => {
    if (!entryId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/visitor-logbook/${entryId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch entry');
      }

      setEntry(result.data);
    } catch (err) {
      console.error('Error fetching logbook entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entry');
    } finally {
      setLoading(false);
    }
  }, [entryId]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  return {
    entry,
    loading,
    error,
    refresh: fetchEntry,
  };
}
