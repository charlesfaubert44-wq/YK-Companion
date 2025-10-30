'use client';

import { useVisitorLogbook } from '@/hooks/useVisitorLogbook';
import LogbookEntryCard from './LogbookEntryCard';
import { ExperienceType } from '@/types/visitor-logbook.types';

interface LogbookGridProps {
  featured?: boolean;
  experienceType?: ExperienceType;
  rating?: number;
  limit?: number;
  compact?: boolean;
}

export default function LogbookGrid({
  featured,
  experienceType,
  rating,
  limit = 20,
  compact = false,
}: LogbookGridProps) {
  const { entries, loading, error, hasMore, loadMore, toggleLike } = useVisitorLogbook({
    autoFetch: true,
    featured,
    experienceType,
    rating,
    limit,
  });

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
        <svg
          className="w-12 h-12 mx-auto mb-3 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-400 font-medium mb-2">Failed to load visitor entries</p>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  if (loading && entries.length === 0) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-dark-800 border border-gray-700 rounded-xl overflow-hidden animate-pulse"
          >
            <div className="aspect-[16/9] bg-dark-700" />
            <div className="p-5 space-y-3">
              <div className="h-6 bg-dark-700 rounded w-3/4" />
              <div className="h-4 bg-dark-700 rounded w-1/2" />
              <div className="h-20 bg-dark-700 rounded" />
              <div className="flex gap-2">
                <div className="h-6 bg-dark-700 rounded w-20" />
                <div className="h-6 bg-dark-700 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-dark-800 border border-gray-700 rounded-xl p-12 text-center">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="text-xl font-bold text-white mb-2">No Entries Yet</h3>
        <p className="text-gray-400">Be the first to share your Yellowknife experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Entries Grid */}
      <div className={compact ? 'space-y-3' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}>
        {entries.map(entry => (
          <LogbookEntryCard key={entry.id} entry={entry} onLike={toggleLike} compact={compact} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white rounded-lg font-medium hover:shadow-lg hover:shadow-aurora-green/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              'Load More Stories'
            )}
          </button>
        </div>
      )}

      {/* Total Count */}
      {!hasMore && entries.length > 0 && (
        <p className="text-center text-gray-400 text-sm pt-4">
          Showing all {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </p>
      )}
    </div>
  );
}
