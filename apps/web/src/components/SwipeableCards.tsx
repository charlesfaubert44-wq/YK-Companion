'use client';

import { useState, useRef, useEffect } from 'react';

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
  const cardRef = useRef<HTMLDivElement>(null);

  const currentCard = cards[currentIndex];
  const hasCards = currentIndex < cards.length;

  useEffect(() => {
    if (!hasCards && onCardExhausted) {
      onCardExhausted();
    }
  }, [hasCards, onCardExhausted]);

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
      // Reset card position
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
    const exitX = direction === 'right' ? 500 : -500;
    setDragOffset({ x: exitX, y: 0 });

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setSwipeDirection(null);
    }, 300);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
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

  if (!hasCards) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-white mb-2">All Done!</h3>
        <p className="text-gray-400">You've seen all the cards</p>
      </div>
    );
  }

  const rotation = dragOffset.x * 0.1;
  const opacity = 1 - Math.abs(dragOffset.x) / 500;

  return (
    <div className="relative w-full max-w-md mx-auto h-[500px]">
      {/* Card stack preview (next cards) */}
      {cards.slice(currentIndex + 1, currentIndex + 3).map((card, index) => (
        <div
          key={card.id}
          className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border-2 border-gray-700"
          style={{
            transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * -10}px)`,
            zIndex: 10 - index,
            opacity: 0.5 - index * 0.2,
          }}
        />
      ))}

      {/* Current card */}
      <div
        ref={cardRef}
        className="absolute inset-0 bg-gradient-to-br from-aurora-green/10 via-aurora-blue/10 to-aurora-purple/10 backdrop-blur-xl rounded-3xl border-2 border-aurora-green/30 shadow-2xl cursor-grab active:cursor-grabbing select-none"
        style={{
          transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          opacity,
          zIndex: 20,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-full flex flex-col p-6">
          {/* Swipe indicators */}
          {swipeDirection === 'right' && (
            <div className="absolute top-8 right-8 bg-aurora-green text-white px-6 py-3 rounded-full font-bold text-lg transform rotate-12 animate-pulse">
              SAVE ❤️
            </div>
          )}
          {swipeDirection === 'left' && (
            <div className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg transform -rotate-12 animate-pulse">
              SKIP ✕
            </div>
          )}

          {/* Card content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            {currentCard.emoji && (
              <div className="text-8xl mb-6 animate-bounce-slow">{currentCard.emoji}</div>
            )}
            {currentCard.image && (
              <img
                src={currentCard.image}
                alt={currentCard.title}
                className="w-full h-48 object-cover rounded-2xl mb-4"
              />
            )}
            <h2 className="text-3xl font-bold text-white mb-3">{currentCard.title}</h2>
            {currentCard.category && (
              <span className="inline-block px-4 py-1 bg-aurora-blue/20 text-aurora-blue text-sm font-semibold rounded-full mb-3">
                {currentCard.category}
              </span>
            )}
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              {currentCard.description}
            </p>
            {currentCard.tags && currentCard.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {currentCard.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center mt-4">
            <button
              onClick={handleSwipeLeft}
              className="w-16 h-16 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full flex items-center justify-center text-2xl transition-all transform hover:scale-110"
              aria-label="Skip"
            >
              ✕
            </button>
            <button
              onClick={handleSwipeRight}
              className="w-16 h-16 bg-aurora-green/20 hover:bg-aurora-green/30 text-aurora-green rounded-full flex items-center justify-center text-2xl transition-all transform hover:scale-110"
              aria-label="Save"
            >
              ❤️
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 text-center text-gray-500 text-sm">
            {currentIndex + 1} of {cards.length}
          </div>
        </div>
      </div>
    </div>
  );
}
