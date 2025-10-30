'use client';

import { useState } from 'react';
import { GarageSale } from '@/types/garage-sales.types';

interface SaleCardProps {
  sale: GarageSale;
  currentUserId?: string;
  isFavorited?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onFavorite?: () => void;
  onClick?: () => void;
  showDistance?: boolean;
}

/**
 * SaleCard Component
 *
 * Displays a garage sale in a card format with:
 * - Title, description, and host info
 * - Date, time, and location
 * - Tags and item descriptions
 * - Edit/delete actions for owner
 * - Favorite button
 * - Distance display (if available)
 * - Directions link
 *
 * @example
 * ```tsx
 * <SaleCard
 *   sale={garageSale}
 *   currentUserId={user?.id}
 *   isFavorited={false}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onFavorite={handleFavorite}
 * />
 * ```
 */
export default function SaleCard({
  sale,
  currentUserId,
  isFavorited = false,
  onEdit,
  onDelete,
  onFavorite,
  onClick,
  showDistance = true,
}: SaleCardProps) {
  const [localFavorited, setLocalFavorited] = useState(isFavorited);
  const isOwner = currentUserId === sale.user_id;
  const saleDate = new Date(sale.sale_date);
  const today = new Date();
  const daysUntil = Math.ceil((saleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalFavorited(!localFavorited);
    if (onFavorite) {
      onFavorite();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit();
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this garage sale?')) return;
    if (onDelete) onDelete();
  };

  return (
    <div
      id={`sale-${sale.id}`}
      className={`bg-dark-800 rounded-xl p-4 border border-gray-700 hover:border-aurora-green/30 transition-all ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <h3 className="text-lg font-bold text-white mb-1 flex-1">{sale.title}</h3>
            {showDistance && sale.distance_km !== undefined && (
              <span className="px-2 py-1 bg-aurora-purple/20 text-aurora-purple text-xs font-medium rounded-lg whitespace-nowrap">
                {sale.distance_km < 1
                  ? `${Math.round(sale.distance_km * 1000)}m`
                  : `${sale.distance_km.toFixed(1)}km`}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{sale.host_name}</p>
        </div>

        <div className="flex gap-2 ml-2">
          {/* Favorite Button */}
          {currentUserId && !isOwner && (
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-lg transition-all ${
                localFavorited
                  ? 'text-red-400 hover:bg-red-400/10'
                  : 'text-gray-400 hover:bg-dark-700 hover:text-red-400'
              }`}
              aria-label={localFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {localFavorited ? '❤️' : '🤍'}
            </button>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <>
              <button
                onClick={handleEditClick}
                className="p-2 text-aurora-blue hover:bg-dark-700 rounded-lg transition-all"
                aria-label="Edit sale"
              >
                ✏️
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-2 text-red-400 hover:bg-dark-700 rounded-lg transition-all"
                aria-label="Delete sale"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {sale.description && <p className="text-sm text-gray-300 mb-3">{sale.description}</p>}

      {/* Date & Time */}
      <div className="flex items-center gap-4 mb-3 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-aurora-green">📅</span>
          <span className="text-white font-medium">
            {saleDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          {daysUntil === 0 && (
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">
              TODAY
            </span>
          )}
          {daysUntil === 1 && (
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
              TOMORROW
            </span>
          )}
          {daysUntil > 1 && daysUntil <= 7 && (
            <span className="px-2 py-0.5 bg-aurora-blue/20 text-aurora-blue rounded text-xs font-medium">
              {daysUntil} days
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-aurora-blue">🕐</span>
          <span className="text-gray-400">
            {sale.start_time} - {sale.end_time}
          </span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 mb-3">
        <span className="text-aurora-purple mt-0.5">📍</span>
        <div className="flex-1">
          <p className="text-sm text-gray-300">{sale.address}</p>
          {sale.location_details && (
            <p className="text-xs text-gray-500 mt-1">{sale.location_details}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      {sale.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {sale.tags.slice(0, 5).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded-lg capitalize"
            >
              {tag}
            </span>
          ))}
          {sale.tags.length > 5 && (
            <span className="px-2 py-1 text-gray-500 text-xs">+{sale.tags.length - 5} more</span>
          )}
        </div>
      )}

      {/* Items */}
      {sale.items_description && (
        <p className="text-sm text-gray-400 mb-3 italic">Items: {sale.items_description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700 flex-wrap gap-3">
        <div className="flex gap-3 text-xs">
          {sale.cash_only && (
            <span className="text-green-400 flex items-center gap-1">💵 Cash Only</span>
          )}
          {sale.early_birds_welcome && (
            <span className="text-yellow-400 flex items-center gap-1">🐦 Early Birds OK</span>
          )}
        </div>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${sale.latitude},${sale.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="px-4 py-2 bg-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue/30 rounded-lg transition-all text-sm font-medium flex items-center gap-1"
        >
          Get Directions →
        </a>
      </div>
    </div>
  );
}
