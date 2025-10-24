'use client';

import { GarageSale } from '@/types/garage-sales.types';
import { formatDate, formatTime } from '@/lib/utils';

interface Props {
  sales: GarageSale[];
  selectedSales: string[];
  onToggleSelection: (saleId: string) => void;
  enableSelection: boolean;
}

export default function GarageSaleList({ sales, selectedSales, onToggleSelection, enableSelection }: Props) {
  return (
    <div className="space-y-4">
      {sales.map(sale => (
        <GarageSaleCard
          key={sale.id}
          sale={sale}
          isSelected={selectedSales.includes(sale.id)}
          onToggleSelection={onToggleSelection}
          enableSelection={enableSelection}
        />
      ))}
    </div>
  );
}

function GarageSaleCard({
  sale,
  isSelected,
  onToggleSelection,
  enableSelection,
}: {
  sale: GarageSale;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  enableSelection: boolean;
}) {
  const saleDate = new Date(sale.sale_date);
  const isToday = saleDate.toDateString() === new Date().toDateString();
  const isTomorrow = saleDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

  return (
    <div
      className={`bg-dark-800 rounded-xl border-2 transition-all hover:shadow-lg ${
        isSelected
          ? 'border-aurora-green shadow-aurora'
          : 'border-aurora-green/20 hover:border-aurora-green/40'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Selection Checkbox */}
          {enableSelection && (
            <button
              onClick={() => onToggleSelection(sale.id)}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-aurora-green border-aurora-green'
                  : 'border-gray-600 hover:border-aurora-green'
              }`}
            >
              {isSelected && <span className="text-white text-sm">✓</span>}
            </button>
          )}

          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{sale.title}</h3>
                <p className="text-gray-400 text-sm">
                  📍 {sale.address}
                  {sale.location_details && ` • ${sale.location_details}`}
                </p>
              </div>
              <div className="text-right">
                {isToday && (
                  <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold mb-1">
                    TODAY
                  </span>
                )}
                {isTomorrow && (
                  <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold mb-1">
                    TOMORROW
                  </span>
                )}
                {sale.save_count && sale.save_count > 0 && (
                  <div className="text-gray-400 text-sm">
                    ⭐ {sale.save_count} saved
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {sale.description && (
              <p className="text-gray-300 mb-3">{sale.description}</p>
            )}

            {/* Date/Time */}
            <div className="flex flex-wrap gap-4 mb-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📅</span>
                <span className="text-white font-medium">
                  {saleDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">🕐</span>
                <span className="text-white font-medium">
                  {sale.start_time} - {sale.end_time}
                </span>
              </div>
            </div>

            {/* Tags */}
            {sale.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {sale.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-aurora-purple/20 text-aurora-purple rounded text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Items Description */}
            {sale.items_description && (
              <div className="bg-dark-900 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-300">{sale.items_description}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <div className="flex gap-3 text-sm">
                {sale.cash_only && (
                  <span className="text-yellow-400">💵 Cash Only</span>
                )}
                {sale.early_birds_welcome && (
                  <span className="text-green-400">🐦 Early Birds OK</span>
                )}
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue/30 rounded-lg transition-colors text-sm font-medium">
                  ⭐ Save
                </button>
                <button className="px-4 py-2 bg-aurora-green/20 text-aurora-green hover:bg-aurora-green/30 rounded-lg transition-colors text-sm font-medium">
                  📍 Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
