'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FavoriteButtonProps {
  itemType: 'garage-sales' | 'articles';
  itemId: string;
  className?: string;
  showText?: boolean;
}

/**
 * FavoriteButton Component
 * 
 * Reusable button for adding/removing items from favorites.
 * Handles authentication checks and provides visual feedback.
 * 
 * @example
 * ```tsx
 * <FavoriteButton itemType="garage-sales" itemId="sale-123" />
 * ```
 */
export default function FavoriteButton({ 
  itemType, 
  itemId, 
  className = '',
  showText = false 
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfSaved();
    }
  }, [user, itemId]);

  const checkIfSaved = async () => {
    try {
      const response = await fetch(`/api/favorites?type=${itemType}`);
      if (response.ok) {
        const { favorites } = await response.json();
        const saved = favorites.some((fav: any) => fav.item_id === itemId);
        setIsSaved(saved);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Please sign in to save items');
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        // Remove from favorites - need to find the favorite ID first
        const response = await fetch(`/api/favorites?type=${itemType}`);
        if (response.ok) {
          const { favorites } = await response.json();
          const favorite = favorites.find((fav: any) => fav.item_id === itemId);
          
          if (favorite) {
            const deleteResponse = await fetch(`/api/favorites?id=${favorite.id}`, {
              method: 'DELETE',
            });

            if (deleteResponse.ok) {
              setIsSaved(false);
            }
          }
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemType, itemId }),
        });

        if (response.ok) {
          setIsSaved(true);
        } else if (response.status === 409) {
          setIsSaved(true); // Already saved
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Hide button if not logged in
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isSaved
          ? 'bg-aurora-green/20 text-aurora-green hover:bg-aurora-green/30 border-2 border-aurora-green/40'
          : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 border-2 border-gray-700 hover:border-gray-600'
      } ${className}`}
      title={isSaved ? 'Remove from saved' : 'Save for later'}
    >
      <span className="text-xl">{loading ? '⏳' : isSaved ? '❤️' : '🤍'}</span>
      {showText && <span>{isSaved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}

