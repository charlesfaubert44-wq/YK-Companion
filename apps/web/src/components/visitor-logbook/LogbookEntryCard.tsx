'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  VisitorLogbookEntry,
  EXPERIENCE_TYPE_CONFIG,
  RATING_LABELS,
} from '@/types/visitor-logbook.types';

interface LogbookEntryCardProps {
  entry: VisitorLogbookEntry;
  onLike?: (entryId: string) => Promise<void>;
  compact?: boolean;
}

export default function LogbookEntryCard({
  entry,
  onLike,
  compact = false,
}: LogbookEntryCardProps) {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [localLiked, setLocalLiked] = useState(entry.user_liked || false);
  const [localLikesCount, setLocalLikesCount] = useState(entry.likes_count || 0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle like
  const handleLike = async () => {
    if (!user) {
      alert('Please sign in to like entries');
      return;
    }

    if (isLiking || !onLike) return;

    setIsLiking(true);

    try {
      // Optimistic update
      setLocalLiked(!localLiked);
      setLocalLikesCount(localLiked ? localLikesCount - 1 : localLikesCount + 1);

      await onLike(entry.id);
    } catch (error) {
      // Revert on error
      setLocalLiked(localLiked);
      setLocalLikesCount(entry.likes_count);
      console.error('Error liking entry:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const displayPhotos = showAllPhotos ? entry.photos : entry.photos.slice(0, 3);
  const hasMorePhotos = entry.photos.length > 3;

  if (compact) {
    return (
      <div className="bg-dark-800 border border-gray-700 rounded-lg overflow-hidden hover:border-aurora-green transition-all duration-300 group">
        <div className="flex gap-4">
          {/* Featured Photo */}
          {entry.featured_photo && (
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image src={entry.featured_photo} alt={entry.title} fill className="object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-bold text-white group-hover:text-aurora-green transition-colors line-clamp-1">
                {entry.title}
              </h3>
              {entry.is_featured && (
                <span className="bg-gradient-to-r from-aurora-green to-aurora-blue text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  ⭐ Featured
                </span>
              )}
            </div>

            <p className="text-gray-300 text-sm line-clamp-2 mb-2">{entry.message}</p>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{entry.visitor_name}</span>
              <span>•</span>
              <span>{entry.visitor_location}</span>
              <span>•</span>
              <span>{formatDate(entry.visit_date)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-800 border border-gray-700 rounded-xl overflow-hidden hover:border-aurora-green transition-all duration-300 shadow-lg hover:shadow-aurora-green/20">
      {/* Photo Gallery */}
      {entry.photos.length > 0 && (
        <div className="relative">
          <div
            className={`grid gap-1 ${
              displayPhotos.length === 1
                ? 'grid-cols-1'
                : displayPhotos.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
            }`}
          >
            {displayPhotos.map((photo, index) => (
              <div key={index} className="relative aspect-[4/3] overflow-hidden bg-dark-900">
                <Image
                  src={photo}
                  alt={`${entry.title} - Photo ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {hasMorePhotos && !showAllPhotos && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
            >
              +{entry.photos.length - 3} more
            </button>
          )}

          {/* Featured Badge */}
          {entry.is_featured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
              ⭐ Featured
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{entry.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="font-medium text-aurora-green">{entry.visitor_name}</span>
              {entry.visitor_location && (
                <>
                  <span>from</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {entry.visitor_location}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Rating */}
          {entry.rating && (
            <div className="flex items-center gap-1 bg-dark-700 px-3 py-1.5 rounded-lg">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-white font-bold">{entry.rating}</span>
              <span className="text-gray-400 text-xs">/5</span>
            </div>
          )}
        </div>

        {/* Message */}
        <p className="text-gray-300 mb-4 leading-relaxed">{entry.message}</p>

        {/* Experience Types */}
        {entry.experience_type && entry.experience_type.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.experience_type.map(type => {
              const config = EXPERIENCE_TYPE_CONFIG[type];
              return (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 bg-dark-700 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-600"
                >
                  <span>{config.icon}</span>
                  {config.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Visit Info */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Visited {formatDate(entry.visit_date)}</span>
          </div>

          {entry.visit_duration && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{entry.visit_duration}</span>
            </div>
          )}
        </div>

        {/* Footer - Engagement */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{entry.views_count || 0} views</span>
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={isLiking || !user}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              localLiked
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-red-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={!user ? 'Sign in to like' : localLiked ? 'Unlike' : 'Like'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${localLiked ? 'scale-110' : ''}`}
              fill={localLiked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{localLikesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
