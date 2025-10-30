'use client';

import { useState, useRef, useEffect, useCallback, Children, ReactElement } from 'react';

export interface CarouselProps {
  children: React.ReactNode;
  /** Auto-advance interval in milliseconds (0 to disable) */
  autoplayInterval?: number;
  /** Show pagination dots */
  showDots?: boolean;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Enable infinite loop */
  loop?: boolean;
  /** Custom class name */
  className?: string;
  /** Items visible at once (responsive: mobile, tablet, desktop) */
  itemsPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  /** Gap between items in pixels */
  gap?: number;
  /** Callback when slide changes */
  onSlideChange?: (index: number) => void;
  /** Enable snap scrolling (default: true) */
  snap?: boolean;
  /** Swipe sensitivity (0-1, higher = more sensitive) */
  swipeSensitivity?: number;
}

/**
 * Mobile-first carousel component with touch gesture support
 *
 * Features:
 * - Touch/swipe gestures for mobile
 * - Keyboard navigation (arrow keys)
 * - Pagination dots
 * - Optional autoplay
 * - Responsive items per view
 * - Accessible (ARIA labels, keyboard support)
 *
 * @example
 * ```tsx
 * <Carousel autoplayInterval={5000} showDots>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 *   <div>Slide 3</div>
 * </Carousel>
 * ```
 */
export default function Carousel({
  children,
  autoplayInterval = 0,
  showDots = true,
  showArrows = true,
  loop = true,
  className = '',
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 16,
  onSlideChange,
  snap = true,
  swipeSensitivity = 0.3,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView.mobile || 1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const childArray = Children.toArray(children);
  const totalItems = childArray.length;
  const maxIndex = Math.max(0, totalItems - itemsToShow);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsToShow(itemsPerView.desktop || 3);
      } else if (width >= 768) {
        setItemsToShow(itemsPerView.tablet || 2);
      } else {
        setItemsToShow(itemsPerView.mobile || 1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplayInterval > 0 && !isHovering && !isDragging) {
      autoplayTimerRef.current = setInterval(() => {
        goToNext();
      }, autoplayInterval);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplayInterval, isHovering, isDragging, currentIndex]);

  // Notify parent of slide changes
  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentIndex);
    }
  }, [currentIndex, onSlideChange]);

  const goToSlide = useCallback(
    (index: number) => {
      let newIndex = index;

      if (loop) {
        // Handle infinite loop
        if (newIndex < 0) {
          newIndex = maxIndex;
        } else if (newIndex > maxIndex) {
          newIndex = 0;
        }
      } else {
        // Clamp to bounds
        newIndex = Math.max(0, Math.min(maxIndex, newIndex));
      }

      setCurrentIndex(newIndex);
      setDragOffset(0);
    },
    [loop, maxIndex]
  );

  const goToPrevious = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  // Touch/Mouse handlers
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const offsetX = clientX - dragStart.x;
    const offsetY = clientY - dragStart.y;

    // Only handle horizontal swipes (ignore if more vertical than horizontal)
    if (Math.abs(offsetY) > Math.abs(offsetX)) return;

    setDragOffset(offsetX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const containerWidth = carouselRef.current?.offsetWidth || 0;
    const threshold = containerWidth * swipeSensitivity;

    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    } else {
      setDragOffset(0);
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(maxIndex);
    }
  };

  if (totalItems === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400">
        <p>No items to display</p>
      </div>
    );
  }

  const itemWidth = `calc((100% - ${gap * (itemsToShow - 1)}px) / ${itemsToShow})`;
  const translateX =
    -(currentIndex * (100 / itemsToShow)) +
    (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100;

  return (
    <div
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        handleMouseLeave();
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carousel"
      aria-live="polite"
    >
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          ref={carouselRef}
          className={`flex ${snap ? 'snap-x snap-mandatory' : ''} touch-pan-y`}
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            gap: `${gap}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={isDragging ? handleMouseMove : undefined}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="list"
        >
          {childArray.map((child, index) => (
            <div
              key={index}
              className={`flex-shrink-0 ${snap ? 'snap-start' : ''}`}
              style={{ width: itemWidth }}
              role="listitem"
              aria-label={`Slide ${index + 1} of ${totalItems}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalItems > itemsToShow && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!loop && currentIndex === 0}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-dark-900/80 backdrop-blur-sm border-2 border-aurora-blue/40 text-white flex items-center justify-center transition-all hover:bg-dark-800 hover:border-aurora-blue hover:scale-110 focus:outline-none focus:ring-2 focus:ring-aurora-blue focus:ring-offset-2 focus:ring-offset-dark-900 ${
              !loop && currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-glow'
            }`}
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            disabled={!loop && currentIndex >= maxIndex}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-dark-900/80 backdrop-blur-sm border-2 border-aurora-blue/40 text-white flex items-center justify-center transition-all hover:bg-dark-800 hover:border-aurora-blue hover:scale-110 focus:outline-none focus:ring-2 focus:ring-aurora-blue focus:ring-offset-2 focus:ring-offset-dark-900 ${
              !loop && currentIndex >= maxIndex
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-glow'
            }`}
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {showDots && totalItems > itemsToShow && (
        <div
          className="flex justify-center gap-2 mt-4"
          role="tablist"
          aria-label="Slide navigation"
        >
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-aurora-blue focus:ring-offset-1 focus:ring-offset-dark-900 ${
                index === currentIndex ? 'bg-aurora-blue w-8' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
            />
          ))}
        </div>
      )}

      {/* Screen reader only: current slide indicator */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {maxIndex + 1}
      </div>
    </div>
  );
}

/**
 * Carousel wrapper for card components
 * Provides consistent spacing and styling
 */
export function CarouselCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`h-full ${className}`}>{children}</div>;
}
