'use client';

import { AuroraPhoto } from '@/types/aurora.types';
import { useState } from 'react';

interface Props {
  photos: AuroraPhoto[];
  eventId: string;
}

export default function LivePhotoFeed({ photos, eventId }: Props) {
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());

  const toggleLike = async (photoId: string) => {
    // TODO: Implement actual like/unlike with Supabase
    setLikedPhotos(prev => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map(photo => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          isLiked={likedPhotos.has(photo.id)}
          onToggleLike={() => toggleLike(photo.id)}
        />
      ))}

      {photos.length === 0 && (
        <div className="col-span-full text-center py-20">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Photos Yet</h3>
          <p className="text-gray-400">
            Be the first to upload a photo from tonight's aurora display!
          </p>
        </div>
      )}
    </div>
  );
}

function PhotoCard({
  photo,
  isLiked,
  onToggleLike,
}: {
  photo: AuroraPhoto;
  isLiked: boolean;
  onToggleLike: () => void;
}) {
  const [showFullCaption, setShowFullCaption] = useState(false);

  const timeAgo = getTimeAgo(photo.uploaded_at);

  return (
    <div className="bg-dark-800 rounded-xl overflow-hidden border border-gray-700 hover:border-aurora-green/50 transition-all group">
      {/* Photo */}
      <div className="relative aspect-square bg-gradient-to-br from-aurora-green/20 to-aurora-purple/20 flex items-center justify-center">
        <span className="text-6xl">🌌</span>

        {/* Featured Badge */}
        {photo.featured && (
          <div className="absolute top-2 left-2 px-3 py-1 bg-yellow-500 text-black rounded-full text-xs font-bold flex items-center gap-1">
            ⭐ Featured
          </div>
        )}

        {/* Quality Score */}
        {photo.quality_score && photo.quality_score >= 8 && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-aurora-green/90 text-white rounded-lg text-xs font-bold">
            {photo.quality_score}/10
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors">
            View Full Size
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="font-bold text-white">{photo.photographer_name}</div>
            <div className="text-xs text-gray-500">{timeAgo}</div>
          </div>
          <button
            onClick={onToggleLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
              isLiked
                ? 'bg-red-500/20 text-red-400'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {isLiked ? '❤️' : '🤍'}
            <span className="text-sm font-medium">{photo.likes_count + (isLiked ? 1 : 0)}</span>
          </button>
        </div>

        {/* Caption */}
        {photo.caption && (
          <p className={`text-sm text-gray-300 mb-2 ${!showFullCaption && 'line-clamp-2'}`}>
            {photo.caption}
          </p>
        )}

        {/* Location */}
        {photo.location_name && (
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            📍 {photo.location_name}
          </div>
        )}

        {/* Camera Settings */}
        {(photo.iso || photo.shutter_speed || photo.aperture) && (
          <div className="flex gap-2 text-xs text-gray-500 bg-dark-900 rounded p-2">
            {photo.iso && <span>ISO {photo.iso}</span>}
            {photo.shutter_speed && <span>{photo.shutter_speed}</span>}
            {photo.aperture && <span>{photo.aperture}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
