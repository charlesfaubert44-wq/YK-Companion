'use client';

import { GarageSale } from '@/types/garage-sales.types';
import SaleCard from './SaleCard';

interface ListViewProps {
  sales: GarageSale[];
  currentUserId?: string;
  favoritedSaleIds?: string[];
  onEdit?: (sale: GarageSale) => void;
  onDelete?: (saleId: string) => void;
  onFavorite?: (saleId: string) => void;
  onSaleClick?: (sale: GarageSale) => void;
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: () => void;
  emptyActionLabel?: string;
}

/**
 * ListView Component
 * 
 * Displays a list of garage sales in card format.
 * Handles empty states, loading states, and various interactions.
 * 
 * @example
 * ```tsx
 * <ListView
 *   sales={filteredSales}
 *   currentUserId={user?.id}
 *   favoritedSaleIds={favorites}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onFavorite={handleFavorite}
 * />
 * ```
 */
export default function ListView({
  sales,
  currentUserId,
  favoritedSaleIds = [],
  onEdit,
  onDelete,
  onFavorite,
  onSaleClick,
  loading = false,
  emptyMessage,
  emptyAction,
  emptyActionLabel = 'Clear Filters',
}: ListViewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className="bg-dark-800 rounded-xl p-4 border border-gray-700 animate-pulse"
          >
            <div className="h-6 bg-dark-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-dark-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-dark-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-dark-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-bold text-white mb-2">
          {emptyMessage || 'No garage sales found'}
        </h3>
        <p className="text-gray-400 mb-6">
          Try adjusting your filters or check back later for new sales!
        </p>
        {emptyAction && (
          <button
            onClick={emptyAction}
            className="px-6 py-3 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-all border border-gray-700"
          >
            {emptyActionLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sales count */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          {sales.length} {sales.length === 1 ? 'sale' : 'sales'} found
        </span>
      </div>

      {/* Sales list */}
      {sales.map(sale => (
        <SaleCard
          key={sale.id}
          sale={sale}
          currentUserId={currentUserId}
          isFavorited={favoritedSaleIds.includes(sale.id)}
          onEdit={onEdit ? () => onEdit(sale) : undefined}
          onDelete={onDelete ? () => onDelete(sale.id) : undefined}
          onFavorite={onFavorite ? () => onFavorite(sale.id) : undefined}
          onClick={onSaleClick ? () => onSaleClick(sale) : undefined}
          showDistance={true}
        />
      ))}
    </div>
  );
}

