'use client';

import { useState, useEffect } from 'react';
import { GarageSaleFilters, GARAGE_SALE_TAGS, Coordinates } from '@/types/garage-sales.types';

interface SaleFiltersProps {
  filters: GarageSaleFilters;
  onFiltersChange: (filters: GarageSaleFilters) => void;
  userLocation?: Coordinates;
  onRequestLocation?: () => void;
}

/**
 * SaleFilters Component
 * 
 * Provides comprehensive filtering options for garage sales:
 * - Text search
 * - Date range (from/to)
 * - Tag selection
 * - Distance radius
 * - Cash only filter
 * - Early birds filter
 * 
 * @example
 * ```tsx
 * <SaleFilters
 *   filters={filters}
 *   onFiltersChange={setFilters}
 *   userLocation={userLocation}
 *   onRequestLocation={handleLocationRequest}
 * />
 * ```
 */
export default function SaleFilters({
  filters,
  onFiltersChange,
  userLocation,
  onRequestLocation,
}: SaleFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState<GarageSaleFilters>(filters);

  // Update local filters when prop changes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (updates: Partial<GarageSaleFilters>) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = localFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    handleChange({ tags: newTags.length > 0 ? newTags : undefined });
  };

  const handleClearFilters = () => {
    const clearedFilters: GarageSaleFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = 
    localFilters.search ||
    localFilters.date_from ||
    localFilters.date_to ||
    (localFilters.tags && localFilters.tags.length > 0) ||
    localFilters.max_distance_km !== undefined ||
    localFilters.cash_only !== undefined ||
    localFilters.early_birds_only !== undefined;

  const today = new Date().toISOString().split('T')[0];
  const oneMonthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by title, description, items, or location..."
          value={localFilters.search || ''}
          onChange={(e) => handleChange({ search: e.target.value || undefined })}
          className="w-full px-4 py-3 pl-10 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-aurora-green focus:outline-none"
        />
        <svg 
          className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        {localFilters.search && (
          <button
            onClick={() => handleChange({ search: undefined })}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Filters Row */}
      <div className="flex flex-wrap gap-2">
        {/* Date Quick Filters */}
        <button
          onClick={() => handleChange({ 
            date_from: today, 
            date_to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
          })}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            localFilters.date_from === today && 
            localFilters.date_to === new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              ? 'bg-aurora-green text-white'
              : 'bg-dark-800 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          This Week
        </button>

        <button
          onClick={() => handleChange({ date_from: today, date_to: oneMonthFromNow })}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            localFilters.date_from === today && localFilters.date_to === oneMonthFromNow
              ? 'bg-aurora-green text-white'
              : 'bg-dark-800 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          This Month
        </button>

        {/* Cash Only */}
        <button
          onClick={() => handleChange({ 
            cash_only: localFilters.cash_only === true ? undefined : true 
          })}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            localFilters.cash_only === true
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-dark-800 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          💵 Cash Only
        </button>

        {/* Early Birds */}
        <button
          onClick={() => handleChange({ 
            early_birds_only: localFilters.early_birds_only === true ? undefined : true 
          })}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            localFilters.early_birds_only === true
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-dark-800 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          🐦 Early Birds
        </button>

        {/* Advanced Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            showAdvanced
              ? 'bg-aurora-blue/20 text-aurora-blue border border-aurora-blue/30'
              : 'bg-dark-800 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          {showAdvanced ? '▼' : '▶'} Advanced
        </button>

        {/* Clear All */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-dark-800 rounded-xl p-4 border border-gray-700 space-y-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">From</label>
                <input
                  type="date"
                  value={localFilters.date_from || ''}
                  onChange={(e) => handleChange({ date_from: e.target.value || undefined })}
                  className="w-full px-3 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white text-sm focus:border-aurora-green focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">To</label>
                <input
                  type="date"
                  value={localFilters.date_to || ''}
                  onChange={(e) => handleChange({ date_to: e.target.value || undefined })}
                  className="w-full px-3 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white text-sm focus:border-aurora-green focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Maximum Distance
              </label>
              {!userLocation && onRequestLocation && (
                <button
                  onClick={onRequestLocation}
                  className="text-xs text-aurora-blue hover:underline"
                >
                  📍 Enable Location
                </button>
              )}
            </div>
            {userLocation ? (
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={localFilters.max_distance_km || 50}
                  onChange={(e) => handleChange({ max_distance_km: Number(e.target.value) })}
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-aurora-green"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Within {localFilters.max_distance_km || 50} km
                  </span>
                  <button
                    onClick={() => handleChange({ max_distance_km: undefined })}
                    className="text-xs text-gray-500 hover:text-gray-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Enable location to filter by distance
              </p>
            )}
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Item Categories
            </label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {GARAGE_SALE_TAGS.map(tag => {
                const isSelected = localFilters.tags?.includes(tag) || false;
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                      isSelected
                        ? 'bg-aurora-purple text-white'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            {localFilters.tags && localFilters.tags.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {localFilters.tags.length} category selected
              </p>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {localFilters.search && (
              <span className="px-2 py-1 bg-aurora-green/20 text-aurora-green rounded text-xs">
                Search: "{localFilters.search}"
              </span>
            )}
            {localFilters.date_from && (
              <span className="px-2 py-1 bg-aurora-blue/20 text-aurora-blue rounded text-xs">
                From: {new Date(localFilters.date_from).toLocaleDateString()}
              </span>
            )}
            {localFilters.date_to && (
              <span className="px-2 py-1 bg-aurora-blue/20 text-aurora-blue rounded text-xs">
                To: {new Date(localFilters.date_to).toLocaleDateString()}
              </span>
            )}
            {localFilters.tags && localFilters.tags.length > 0 && (
              <span className="px-2 py-1 bg-aurora-purple/20 text-aurora-purple rounded text-xs">
                {localFilters.tags.length} categories
              </span>
            )}
            {localFilters.max_distance_km && (
              <span className="px-2 py-1 bg-aurora-purple/20 text-aurora-purple rounded text-xs">
                Within {localFilters.max_distance_km}km
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

