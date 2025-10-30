'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hapticSuccess, hapticFeedback } from '@/lib/mobile';

interface SwipeablePageTransitionProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  enableBackSwipe?: boolean;
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
}

export default function SwipeablePageTransition({
  children,
  onSwipeLeft,
  onSwipeRight,
  enableBackSwipe = true,
  theme,
}: SwipeablePageTransitionProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const swipeThreshold = 100; // Minimum distance for swipe
  const swipeVelocityThreshold = 0.3; // Minimum velocity

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientX);
      setIsSwiping(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStart === null) return;

      const currentTouch = e.touches[0].clientX;
      const diff = currentTouch - touchStart;

      setTouchCurrent(currentTouch);

      // Only allow right swipe for back navigation if enabled
      if (enableBackSwipe && diff > 10) {
        setIsSwiping(true);
        // Add slight haptic feedback when swipe starts
        if (diff > 20 && !isSwiping) {
          hapticFeedback();
        }
      } else if (diff < -10) {
        setIsSwiping(true);
      }
    };

    const handleTouchEnd = () => {
      if (touchStart === null || touchCurrent === null) {
        setTouchStart(null);
        setTouchCurrent(null);
        setIsSwiping(false);
        return;
      }

      const diff = touchCurrent - touchStart;
      const velocity = Math.abs(diff) / 100; // Simple velocity calculation

      // Right swipe (back navigation)
      if (enableBackSwipe && diff > swipeThreshold && velocity > swipeVelocityThreshold) {
        hapticSuccess();
        router.back();
        if (onSwipeRight) onSwipeRight();
      }
      // Left swipe (custom action)
      else if (diff < -swipeThreshold && velocity > swipeVelocityThreshold) {
        hapticSuccess();
        if (onSwipeLeft) onSwipeLeft();
      }

      setTouchStart(null);
      setTouchCurrent(null);
      setIsSwiping(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [touchStart, touchCurrent, isSwiping, enableBackSwipe, onSwipeLeft, onSwipeRight, router]);

  // Calculate swipe progress for visual feedback
  const getSwipeProgress = () => {
    if (touchStart === null || touchCurrent === null) return 0;
    const diff = touchCurrent - touchStart;
    return Math.max(-100, Math.min(100, diff / 3)); // Limit to ±100px
  };

  const swipeProgress = getSwipeProgress();
  const isSwipingRight = swipeProgress > 0;
  const isSwipingLeft = swipeProgress < 0;

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Swipe indicator - Left edge (back navigation) */}
      {enableBackSwipe && isSwipingRight && (
        <div
          className="fixed left-0 top-1/2 -translate-y-1/2 w-1 h-32 rounded-r-full transition-all pointer-events-none z-50"
          style={{
            backgroundColor: theme?.primary || '#00ff88',
            boxShadow: `0 0 20px ${theme?.glow || 'rgba(0, 255, 136, 0.5)'}`,
            opacity: Math.min(swipeProgress / 100, 1),
            transform: `translateY(-50%) scaleY(${Math.min(swipeProgress / 50, 1)})`,
          }}
        />
      )}

      {/* Swipe indicator - Right edge (forward action) */}
      {onSwipeLeft && isSwipingLeft && (
        <div
          className="fixed right-0 top-1/2 -translate-y-1/2 w-1 h-32 rounded-l-full transition-all pointer-events-none z-50"
          style={{
            backgroundColor: theme?.accent || '#ff66cc',
            boxShadow: `0 0 20px ${theme?.glow || 'rgba(255, 102, 204, 0.5)'}`,
            opacity: Math.min(Math.abs(swipeProgress) / 100, 1),
            transform: `translateY(-50%) scaleY(${Math.min(Math.abs(swipeProgress) / 50, 1)})`,
          }}
        />
      )}

      {/* Aurora curtain effect during swipe */}
      {isSwiping && theme && (
        <div
          className="fixed inset-0 pointer-events-none z-40 transition-opacity"
          style={{
            background: isSwipingRight
              ? `linear-gradient(to right, ${theme.primary}40, transparent 30%)`
              : `linear-gradient(to left, ${theme.accent}40, transparent 30%)`,
            opacity: Math.min(Math.abs(swipeProgress) / 100, 0.5),
          }}
        />
      )}

      {/* Content with transform during swipe */}
      <div
        className="transition-transform"
        style={{
          transform: isSwiping ? `translateX(${swipeProgress}px)` : 'translateX(0)',
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>

      {/* Swipe hint - Shows on first visit */}
      {enableBackSwipe && <SwipeHint theme={theme} />}
    </div>
  );
}

// Component to show swipe hint on first visit
function SwipeHint({ theme }: { theme?: any }) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const hasSeenHint = localStorage.getItem('ykbuddy_seen_swipe_hint');
    if (!hasSeenHint) {
      setTimeout(() => setShowHint(true), 1000);
      setTimeout(() => {
        setShowHint(false);
        localStorage.setItem('ykbuddy_seen_swipe_hint', 'true');
      }, 4000);
    }
  }, []);

  if (!showHint) return null;

  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 px-4 py-3 rounded-full backdrop-blur-md z-50 pointer-events-none"
      style={{
        backgroundColor: theme ? `${theme.primary}20` : '#00ff8820',
        border: `1px solid ${theme?.primary || '#00ff88'}40`,
        animation: 'slide-hint 3s ease-in-out infinite',
      }}
    >
      <div
        className="text-2xl"
        style={{
          animation: 'swipe-arrow 1.5s ease-in-out infinite',
        }}
      >
        ←
      </div>
      <span className="text-sm font-medium" style={{ color: theme?.primary || '#00ff88' }}>
        Swipe to go back
      </span>

      <style jsx>{`
        @keyframes slide-hint {
          0%,
          100% {
            opacity: 0;
            transform: translateX(-20px) translateY(-50%);
          }
          10%,
          90% {
            opacity: 1;
            transform: translateX(0) translateY(-50%);
          }
        }

        @keyframes swipe-arrow {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-8px);
          }
        }
      `}</style>
    </div>
  );
}
