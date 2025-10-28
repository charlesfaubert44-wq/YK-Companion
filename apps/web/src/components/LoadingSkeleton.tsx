/**
 * Loading Skeleton Components
 *
 * Architecture Reference: Arc42 Section 4.3 - Usability Strategy
 * Implements loading states with skeletons and spinners for perceived performance
 *
 * Benefits:
 * - Reduces perceived loading time
 * - Provides visual feedback
 * - Maintains layout stability (no CLS)
 * - Improves user experience
 *
 * @example
 * {loading ? <CardSkeleton /> : <Card data={data} />}
 */

/**
 * Base Skeleton component with pulse animation
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-800/50 via-gray-700/50 to-gray-800/50 rounded ${className}`}
      style={{
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite linear',
      }}
    />
  );
}

/**
 * Card Skeleton - for content cards
 */
export function CardSkeleton() {
  return (
    <div className="bg-dark-800/50 rounded-xl p-6 border border-gray-700/50">
      {/* Image placeholder */}
      <Skeleton className="w-full h-48 mb-4" />

      {/* Title */}
      <Skeleton className="h-6 w-3/4 mb-3" />

      {/* Description lines */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6 mb-4" />

      {/* Button */}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

/**
 * List Item Skeleton - for lists
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 bg-dark-800/30 rounded-lg">
      {/* Icon/Avatar */}
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />

      <div className="flex-1">
        {/* Title */}
        <Skeleton className="h-5 w-2/3 mb-2" />
        {/* Subtitle */}
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Action button */}
      <Skeleton className="w-20 h-8 rounded-lg" />
    </div>
  );
}

/**
 * Table Row Skeleton - for data tables
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-700/30">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Garage Sale Card Skeleton - specific to YK Buddy
 */
export function GarageSaleCardSkeleton() {
  return (
    <div className="bg-dark-800/50 rounded-xl p-5 border border-gray-700/50">
      {/* Header with icon and date */}
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-24 h-5 rounded" />
      </div>

      {/* Address */}
      <Skeleton className="h-5 w-4/5 mb-2" />

      {/* Description */}
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4 mb-3" />

      {/* Items tags */}
      <div className="flex gap-2 mb-3">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-18 h-6 rounded-full" />
      </div>

      {/* Footer with distance and button */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-28 h-9 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Spinner - for inline loading
 */
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="absolute inset-0 rounded-full border-2 border-gray-700"></div>
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-aurora-blue animate-spin"
        style={{ borderTopColor: 'var(--aurora-blue, #3b82f6)' }}
      ></div>
    </div>
  );
}

/**
 * Full Page Loading - for page transitions
 */
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-400">{message}</p>
      </div>
    </div>
  );
}

/**
 * Button Loading State - for loading buttons
 */
export function ButtonSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

/**
 * Grid of Card Skeletons - for loading multiple cards
 */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Shimmer keyframes for CSS animation
 * Add this to your global CSS or Tailwind config
 */
export const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
`;
