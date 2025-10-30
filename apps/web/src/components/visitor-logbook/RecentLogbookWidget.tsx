'use client';

import Link from 'next/link';
import { useVisitorLogbook } from '@/hooks/useVisitorLogbook';
import LogbookEntryCard from './LogbookEntryCard';

interface RecentLogbookWidgetProps {
  limit?: number;
  featured?: boolean;
  compact?: boolean;
  showViewAll?: boolean;
}

export default function RecentLogbookWidget({
  limit = 3,
  featured = false,
  compact = true,
  showViewAll = true,
}: RecentLogbookWidgetProps) {
  const { entries, loading, error, toggleLike } = useVisitorLogbook({
    autoFetch: true,
    featured,
    limit,
  });

  if (error) {
    return null; // Fail silently for widgets
  }

  if (loading && entries.length === 0) {
    return (
      <div className="bg-dark-800 border border-gray-700 rounded-xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-dark-700 rounded w-1/3" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-24 h-24 bg-dark-700 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-dark-700 rounded w-3/4" />
                  <div className="h-4 bg-dark-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return null; // Don't show widget if no entries
  }

  return (
    <div className="bg-dark-800 border border-gray-700 rounded-xl overflow-hidden hover:border-aurora-green/50 transition-all">
      {/* Header */}
      <div className="bg-gradient-to-r from-aurora-green/10 to-aurora-blue/10 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              ✨ Visitor Stories
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {featured
                ? 'Featured experiences from our visitors'
                : 'Recent experiences from our visitors'}
            </p>
          </div>
          {showViewAll && (
            <Link
              href="/visiting/logbook"
              className="text-aurora-green hover:text-aurora-blue font-medium text-sm transition-colors flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Entries */}
      <div className="p-6 space-y-4">
        {entries.map(entry => (
          <LogbookEntryCard key={entry.id} entry={entry} onLike={toggleLike} compact={compact} />
        ))}
      </div>

      {/* Footer CTA */}
      {showViewAll && (
        <div className="bg-dark-900/50 border-t border-gray-700 px-6 py-4">
          <Link
            href="/visiting/logbook"
            className="block w-full text-center px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-medium rounded-lg hover:shadow-lg hover:shadow-aurora-green/30 transition-all"
          >
            See All Visitor Stories
          </Link>
        </div>
      )}
    </div>
  );
}
