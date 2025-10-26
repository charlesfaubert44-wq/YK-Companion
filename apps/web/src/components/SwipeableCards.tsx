'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

export interface CardData {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  image?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

interface SwipeableCardsProps {
  cards: CardData[];
  onSwipeRight?: (card: CardData) => void;
  onSwipeLeft?: (card: CardData) => void;
  onCardExhausted?: () => void;
}

/**
 * SwipeableCards - Interactive card swiper with stunning 3D effects
 *
 * Features:
 * - Smooth drag and swipe interactions
 * - 3D perspective transforms and depth
 * - Glassmorphism with dynamic gradients
 * - Spring physics animations
 * - Card stack with parallax effect
 * - Keyboard navigation support
 * - Optimized performance with GPU acceleration
 *
 * @example
 * <SwipeableCards
 *   cards={cardData}
 *   onSwipeRight={(card) => saveCard(card)}
 *   onSwipeLeft={(card) => skipCard(card)}
 * />
 */
export default function SwipeableCards({
  cards,
  onSwipeRight,
  onSwipeLeft,
  onCardExhausted,
}: SwipeableCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentCard = cards[currentIndex];
  const hasCards = currentIndex < cards.length;

  useEffect(() => {
    if (!hasCards && onCardExhausted) {
      onCardExhausted();
    }
  }, [hasCards, onCardExhausted]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!hasCards) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipeLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipeRight();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasCards, currentIndex]);

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const offsetX = clientX - dragStart.x;
    const offsetY = clientY - dragStart.y;
    setDragOffset({ x: offsetX, y: offsetY });

    // Determine swipe direction
    if (Math.abs(offsetX) > 50) {
      setSwipeDirection(offsetX > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    const SWIPE_THRESHOLD = 100;

    if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
      // Swipe completed
      if (dragOffset.x > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    } else {
      // Reset card position with spring animation
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
    }
  };

  const handleSwipeRight = () => {
    if (currentCard && onSwipeRight) {
      onSwipeRight(currentCard);
    }
    animateCardExit('right');
  };

  const handleSwipeLeft = () => {
    if (currentCard && onSwipeLeft) {
      onSwipeLeft(currentCard);
    }
    animateCardExit('left');
  };

  const animateCardExit = (direction: 'left' | 'right') => {
    setIsExiting(true);
    const exitX = direction === 'right' ? 600 : -600;
    setDragOffset({ x: exitX, y: 0 });

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
      setIsExiting(false);
    }, 400);
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

  // Calculate transform values with easing
  const rotation = useMemo(() => Math.min(Math.max(dragOffset.x * 0.08, -15), 15), [dragOffset.x]);
  const opacity = useMemo(() => Math.max(1 - Math.abs(dragOffset.x) / 600, 0), [dragOffset.x]);
  const scale = useMemo(() => 1 - Math.abs(dragOffset.x) / 2000, [dragOffset.x]);

  if (!hasCards) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
        <div className="relative">
          <div className="text-8xl mb-6 animate-bounce-slow">🎉</div>
          <div className="absolute inset-0 blur-3xl bg-aurora-green/20 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
          All Done!
        </h3>
        <p className="text-gray-400 text-lg">You've explored all the cards</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-md mx-auto h-[600px] perspective-1000"
      role="region"
      aria-label="Swipeable cards"
    >
      {/* Card stack preview (next cards) with parallax effect */}
      {cards.slice(currentIndex + 1, currentIndex + 4).map((card, index) => {
        const stackOffset = (index + 1) * 8;
        const stackScale = 1 - (index + 1) * 0.04;
        const stackOpacity = 0.6 - index * 0.15;

        return (
          <div
            key={card.id}
            className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-black/90 rounded-3xl border-2 border-slate-700/50 backdrop-blur-sm overflow-hidden"
            style={{
              transform: `scale(${stackScale}) translateY(-${stackOffset}px) rotateX(2deg)`,
              zIndex: 10 - index,
              opacity: stackOpacity,
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            aria-hidden="true"
          >
            {/* Shimmer effect on stack cards */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] animate-shimmer-slow" />
          </div>
        );
      })}

      {/* Current card with 3D transforms */}
      <div
        ref={cardRef}
        className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-3xl border-2 border-aurora-green/40 shadow-2xl cursor-grab active:cursor-grabbing select-none overflow-hidden transition-shadow duration-300"
        style={{
          transform: `
            translateX(${dragOffset.x}px)
            translateY(${dragOffset.y * 0.5}px)
            rotate(${rotation}deg)
            scale(${scale})
            rotateY(${dragOffset.x * 0.03}deg)
            translateZ(${isDragging ? '50px' : '0px'})
          `,
          transition: isDragging || isExiting ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
          opacity,
          zIndex: 20,
          boxShadow: isDragging
            ? `0 20px 60px rgba(0, 255, 136, 0.3), 0 0 0 1px rgba(0, 255, 136, 0.2)`
            : `0 10px 40px rgba(0, 0, 0, 0.5)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="article"
        aria-label={`Card ${currentIndex + 1} of ${cards.length}: ${currentCard.title}`}
        tabIndex={0}
      >
        {/* Gradient glow overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + dragOffset.x * 0.05}% ${50 + dragOffset.y * 0.05}%, rgba(0, 255, 136, 0.3), transparent 70%)`
          }}
        />

        {/* Animated border gradient */}
        <div className="absolute inset-0 rounded-3xl opacity-50">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple animate-spin-slow blur-sm" />
        </div>

        <div className="relative h-full flex flex-col p-8">
          {/* Swipe indicators with enhanced animations */}
          {swipeDirection === 'right' && (
            <div className="absolute top-8 right-8 bg-gradient-to-r from-aurora-green to-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-xl transform rotate-12 shadow-2xl shadow-aurora-green/50 animate-pulse-subtle z-30">
              <span className="flex items-center gap-2">
                SAVE <span className="text-2xl">❤️</span>
              </span>
            </div>
          )}
          {swipeDirection === 'left' && (
            <div className="absolute top-8 left-8 bg-gradient-to-r from-red-500 to-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-xl transform -rotate-12 shadow-2xl shadow-red-500/50 animate-pulse-subtle z-30">
              <span className="flex items-center gap-2">
                SKIP <span className="text-2xl">✕</span>
              </span>
            </div>
          )}

          {/* Card content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            {currentCard.emoji && (
              <div
                className="text-9xl mb-8 animate-float filter drop-shadow-2xl"
                style={{
                  transform: `scale(${1 + Math.abs(dragOffset.x) * 0.0002})`,
                  transition: 'transform 0.2s ease-out'
                }}
              >
                {currentCard.emoji}
              </div>
            )}
            {currentCard.image && (
              <div className="w-full mb-6 overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={currentCard.image}
                  alt={currentCard.title}
                  className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            <h2 className="text-4xl font-bold text-white mb-4 leading-tight bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent">
              {currentCard.title}
            </h2>

            {currentCard.category && (
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-aurora-blue/30 to-aurora-purple/30 border border-aurora-blue/50 text-aurora-blue text-sm font-semibold rounded-full mb-4 backdrop-blur-sm">
                {currentCard.category}
              </span>
            )}

            <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-md">
              {currentCard.description}
            </p>

            {currentCard.tags && currentCard.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {currentCard.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-slate-800/60 backdrop-blur-sm text-slate-300 text-sm rounded-full border border-slate-700/50 hover:border-aurora-green/50 transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons with enhanced hover effects */}
          <div className="flex gap-6 justify-center mt-6">
            <button
              onClick={handleSwipeLeft}
              className="group relative w-20 h-20 bg-gradient-to-br from-red-500/20 to-rose-600/20 hover:from-red-500/30 hover:to-rose-600/30 text-red-400 rounded-full flex items-center justify-center text-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-red-500/30 hover:border-red-400/60 shadow-lg hover:shadow-red-500/50"
              aria-label="Skip card"
              disabled={isExiting}
            >
              <span className="relative z-10">✕</span>
              <div className="absolute inset-0 rounded-full bg-red-500/0 group-hover:bg-red-500/20 blur-xl transition-all duration-300" />
            </button>

            <button
              onClick={handleSwipeRight}
              className="group relative w-20 h-20 bg-gradient-to-br from-aurora-green/20 to-emerald-500/20 hover:from-aurora-green/30 hover:to-emerald-500/30 text-aurora-green rounded-full flex items-center justify-center text-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-aurora-green/30 hover:border-aurora-green/60 shadow-lg hover:shadow-aurora-green/50"
              aria-label="Save card"
              disabled={isExiting}
            >
              <span className="relative z-10">❤️</span>
              <div className="absolute inset-0 rounded-full bg-aurora-green/0 group-hover:bg-aurora-green/20 blur-xl transition-all duration-300" />
            </button>
          </div>

          {/* Enhanced progress indicator */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-700/50">
              <span className="text-slate-400 text-sm font-medium">
                {currentIndex + 1}
              </span>
              <div className="flex gap-1.5">
                {cards.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-8 bg-gradient-to-r from-aurora-green to-aurora-blue'
                        : idx < currentIndex
                        ? 'w-2 bg-slate-600'
                        : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-400 text-sm font-medium">
                {cards.length}
              </span>
            </div>
          </div>
        </div>

        {/* Noise texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
      </div>

      {/* Helper text */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-slate-500 text-sm">
          Drag cards or use arrow keys
        </p>
      </div>
    </div>
  );
}
