'use client';

import { GarageSale } from '@/types/garage-sales.types';
import { formatDate, formatTime } from '@/lib/utils';
import Carousel, { CarouselCard } from '../Carousel';

interface Props {
  sales: GarageSale[];
  selectedSales: string[];
  onToggleSelection: (saleId: string) => void;
  enableSelection: boolean;
  /** Show as carousel on all screen sizes (default: mobile only) */
  alwaysCarousel?: boolean;
  /** Auto-advance carousel */
  autoplay?: boolean;
  autoplayInterval?: number;
}

/**
 * Garage Sale Carousel - Mobile-first carousel for garage sale cards
 *
 * Features:
 * - Swipeable cards on mobile
 * - Grid layout on desktop (by default)
 * - Touch-friendly selection
 * - Smooth animations
 */
export default function GarageSaleCarousel({
  sales,
  selectedSales,
  onToggleSelection,
  enableSelection,
  alwaysCarousel = false,
  autoplay = false,
  autoplayInterval = 4000,
}: Props) {
  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">🏡</div>
        <h3 className="text-xl font-bold text-white mb-2">No Garage Sales</h3>
        <p className="text-gray-400">Check back later for new listings!</p>
      </div>
    );
  }

  const renderCard = (sale: GarageSale) => (
    <GarageSaleCard
      sale={sale}
      isSelected={selectedSales.includes(sale.id)}
      onToggleSelection={onToggleSelection}
      enableSelection={enableSelection}
    />
  );

  if (alwaysCarousel) {
    // Always use carousel mode
    return (
      <Carousel
        autoplayInterval={autoplay ? autoplayInterval : 0}
        showDots={true}
        showArrows={true}
        loop={false}
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
        gap={16}
        snap={true}
      >
        {sales.map((sale) => (
          <CarouselCard key={sale.id}>
            {renderCard(sale)}
          </CarouselCard>
        ))}
      </Carousel>
    );
  }

  // Responsive: Carousel on mobile, grid on desktop
  return (
    <>
      {/* Mobile: Carousel */}
      <div className="block md:hidden">
        <Carousel
          autoplayInterval={0}
          showDots={true}
          showArrows={false}
          loop={false}
          itemsPerView={{ mobile: 1, tablet: 1, desktop: 1 }}
          gap={16}
          snap={true}
        >
          {sales.map((sale) => (
            <CarouselCard key={sale.id}>
              {renderCard(sale)}
            </CarouselCard>
          ))}
        </Carousel>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:block space-y-4">
        {sales.map(renderCard)}
      </div>
    </>
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
      className={`bg-dark-800 rounded-xl border-2 transition-all hover:shadow-lg h-full ${
        isSelected
          ? 'border-aurora-green shadow-aurora'
          : 'border-aurora-green/20 hover:border-aurora-green/40'
      }`}
    >
      <div className="p-4 md:p-6 h-full flex flex-col">
        <div className="flex items-start gap-3 md:gap-4 mb-3">
          {/* Selection Checkbox */}
          {enableSelection && (
            <button
              onClick={() => onToggleSelection(sale.id)}
              className={`w-6 h-6 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-aurora-green border-aurora-green'
                  : 'border-gray-600 hover:border-aurora-green'
              }`}
              aria-label={isSelected ? 'Deselect sale' : 'Select sale'}
            >
              {isSelected && <span className="text-white text-sm">✓</span>}
            </button>
          )}

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 truncate">
                  {sale.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm truncate">
                  📍 {sale.address}
                  {sale.location_details && ` • ${sale.location_details}`}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                {isToday && (
                  <span className="inline-block px-2 md:px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold mb-1">
                    TODAY
                  </span>
                )}
                {isTomorrow && (
                  <span className="inline-block px-2 md:px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold mb-1">
                    TOMORROW
                  </span>
                )}
                {sale.save_count && sale.save_count > 0 && (
                  <div className="text-gray-400 text-xs md:text-sm">
                    ⭐ {sale.save_count}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {sale.description && (
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {sale.description}
              </p>
            )}

            {/* Date/Time */}
            <div className="flex flex-wrap gap-3 md:gap-4 mb-3 text-xs md:text-sm">
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
              <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3">
                {sale.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 md:py-1 bg-aurora-purple/20 text-aurora-purple rounded text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {sale.tags.length > 3 && (
                  <span className="px-2 py-0.5 md:py-1 bg-gray-700/50 text-gray-400 rounded text-xs font-medium">
                    +{sale.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Items Description */}
            {sale.items_description && (
              <div className="bg-dark-900 rounded-lg p-2 md:p-3 mb-3">
                <p className="text-xs md:text-sm text-gray-300 line-clamp-2">
                  {sale.items_description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700 mt-auto">
          <div className="flex gap-2 md:gap-3 text-xs md:text-sm flex-wrap">
            {sale.cash_only && (
              <span className="text-yellow-400">💵 Cash</span>
            )}
            {sale.early_birds_welcome && (
              <span className="text-green-400">🐦 Early OK</span>
            )}
          </div>
          <div className="flex gap-1.5 md:gap-2 flex-shrink-0">
            <button
              className="px-2 md:px-4 py-1.5 md:py-2 bg-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue/30 rounded-lg transition-colors text-xs md:text-sm font-medium"
              aria-label="Save this sale"
            >
              ⭐
            </button>
            <button
              className="px-2 md:px-4 py-1.5 md:py-2 bg-aurora-green/20 text-aurora-green hover:bg-aurora-green/30 rounded-lg transition-colors text-xs md:text-sm font-medium"
              aria-label="Get directions"
            >
              📍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
