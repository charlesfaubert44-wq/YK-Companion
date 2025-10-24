'use client';

import { GarageSaleFilters as Filters, GARAGE_SALE_TAGS } from '@/types/garage-sales.types';
import { useState } from 'react';

interface Props {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  resultsCount: number;
}

export default function GarageSaleFilters({ filters, onFiltersChange, resultsCount }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateFilter('tags', newTags.length > 0 ? newTags : undefined);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search garage sales..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value || undefined)}
          className="w-full px-4 py-3 bg-dark-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => updateFilter('cash_only', !filters.cash_only)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filters.cash_only
              ? 'bg-aurora-green text-white'
              : 'bg-dark-900 text-gray-400 hover:text-white'
          }`}
        >
          💵 Cash Only
        </button>
        <button
          onClick={() => updateFilter('early_birds_only', !filters.early_birds_only)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filters.early_birds_only
              ? 'bg-aurora-blue text-white'
              : 'bg-dark-900 text-gray-400 hover:text-white'
          }`}
        >
          🐦 Early Birds Welcome
        </button>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-dark-900 text-gray-400 hover:text-white transition-colors"
        >
          {showAdvanced ? '▼' : '▶'} Advanced
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            ✕ Clear All
          </button>
        )}
        <div className="ml-auto text-gray-400 py-2">
          {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-700 space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">From Date</label>
              <input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => updateFilter('date_from', e.target.value || undefined)}
                className="w-full px-4 py-2 bg-dark-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-green transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">To Date</label>
              <input
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => updateFilter('date_to', e.target.value || undefined)}
                className="w-full px-4 py-2 bg-dark-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-green transition-colors"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {GARAGE_SALE_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    filters.tags?.includes(tag)
                      ? 'bg-aurora-purple text-white'
                      : 'bg-dark-900 text-gray-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
