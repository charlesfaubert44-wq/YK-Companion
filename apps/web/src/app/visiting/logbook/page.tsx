'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AddLogbookEntryModal from '@/components/visitor-logbook/AddLogbookEntryModal';
import LogbookGrid from '@/components/visitor-logbook/LogbookGrid';
import {
  EXPERIENCE_TYPES,
  EXPERIENCE_TYPE_CONFIG,
  ExperienceType,
} from '@/types/visitor-logbook.types';

export default function VisitorLogbookPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<{
    featured: boolean;
    experienceType?: ExperienceType;
    rating?: number;
  }>({
    featured: false,
  });

  const handleOpenModal = () => {
    if (!user) {
      alert('Please sign in to share your experience');
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Grid will auto-refresh on close
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-aurora-green rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-aurora-blue rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Visitor Logbook
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-aurora-green to-aurora-blue mt-2">
                Share Your Story
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of visitors who have experienced the magic of Yellowknife.
              Share your photos, stories, and memories from the true North!
            </p>

            {/* CTA Button */}
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white text-lg font-bold rounded-xl hover:shadow-2xl hover:shadow-aurora-green/30 transition-all transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Share Your Experience
            </button>
          </div>

          {/* Featured Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-aurora-green mb-2">✨</div>
              <div className="text-2xl font-bold text-white mb-1">Real Stories</div>
              <p className="text-gray-400">From real visitors</p>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-aurora-blue mb-2">📸</div>
              <div className="text-2xl font-bold text-white mb-1">Beautiful Photos</div>
              <p className="text-gray-400">Captured memories</p>
            </div>
            <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-aurora-purple mb-2">🌍</div>
              <div className="text-2xl font-bold text-white mb-1">Global Community</div>
              <p className="text-gray-400">Visitors from everywhere</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filters */}
        <div className="mb-8">
          <div className="bg-dark-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Filter Stories</h3>

            {/* Featured Toggle */}
            <div className="mb-4">
              <button
                onClick={() =>
                  setSelectedFilter({
                    ...selectedFilter,
                    featured: !selectedFilter.featured,
                  })
                }
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter.featured
                    ? 'bg-gradient-to-r from-aurora-green to-aurora-blue text-white shadow-lg'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                ⭐ Featured Stories Only
              </button>
            </div>

            {/* Experience Type Filters */}
            <div>
              <p className="text-sm font-medium text-gray-400 mb-3">Filter by Experience:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setSelectedFilter({
                      ...selectedFilter,
                      experienceType: undefined,
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    !selectedFilter.experienceType
                      ? 'bg-aurora-green text-white shadow-lg'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  All Experiences
                </button>
                {EXPERIENCE_TYPES.slice(0, 8).map((type) => {
                  const config = EXPERIENCE_TYPE_CONFIG[type];
                  const isSelected = selectedFilter.experienceType === type;

                  return (
                    <button
                      key={type}
                      onClick={() =>
                        setSelectedFilter({
                          ...selectedFilter,
                          experienceType: isSelected ? undefined : type,
                        })
                      }
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-aurora-green text-white shadow-lg'
                          : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                      }`}
                    >
                      <span className="mr-1">{config.icon}</span>
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-400 mb-3">Minimum Rating:</p>
              <div className="flex gap-2">
                {[5, 4, 3].map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      setSelectedFilter({
                        ...selectedFilter,
                        rating: selectedFilter.rating === rating ? undefined : rating,
                      })
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      selectedFilter.rating === rating
                        ? 'bg-aurora-green text-white shadow-lg'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                    }`}
                  >
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {rating}+ Stars
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedFilter.featured ||
              selectedFilter.experienceType ||
              selectedFilter.rating) && (
              <button
                onClick={() =>
                  setSelectedFilter({
                    featured: false,
                    experienceType: undefined,
                    rating: undefined,
                  })
                }
                className="mt-4 text-sm text-aurora-green hover:text-aurora-blue transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Entries Grid */}
        <LogbookGrid
          featured={selectedFilter.featured || undefined}
          experienceType={selectedFilter.experienceType}
          rating={selectedFilter.rating}
          limit={12}
        />
      </div>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-6 right-6 md:hidden w-16 h-16 bg-gradient-to-r from-aurora-green to-aurora-blue text-white rounded-full shadow-2xl hover:shadow-aurora-green/50 transition-all transform hover:scale-110 flex items-center justify-center z-40"
        aria-label="Share your experience"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modal */}
      <AddLogbookEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
