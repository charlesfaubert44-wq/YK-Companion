# Carousel Utilities and Mobile UX - Usage Guide

This document provides comprehensive examples for using the newly created utility functions and React hooks for carousel interactions and mobile UX in the YK-Companion web app.

## Table of Contents

1. [Utility Libraries](#utility-libraries)
2. [React Hooks](#react-hooks)
3. [Complete Examples](#complete-examples)
4. [Integration Guide](#integration-guide)

---

## Utility Libraries

### 1. Gestures (`/lib/gestures.ts`)

**Purpose:** Low-level touch and gesture detection utilities.

#### Example: Detect Swipe Direction

```typescript
import { detectSwipe, getTouchPoint } from '@/lib/gestures';

let startPoint: TouchPoint | null = null;

element.addEventListener('touchstart', (e) => {
  startPoint = getTouchPoint(e.touches[0]);
});

element.addEventListener('touchend', (e) => {
  if (!startPoint) return;

  const endPoint = getTouchPoint(e.changedTouches[0]);
  const gesture = detectSwipe(startPoint, endPoint, {
    threshold: 75,
    velocityThreshold: 0.5,
  });

  if (gesture) {
    console.log(`Swiped ${gesture.direction} at ${gesture.velocity}px/ms`);
  }
});
```

#### Example: Pinch Zoom Detection

```typescript
import { detectPinch, getTouchDistance } from '@/lib/gestures';

let initialDistance = 0;

element.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    initialDistance = getTouchDistance(e.touches[0], e.touches[1]);
  }
});

element.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2) {
    const pinch = detectPinch(e.touches, initialDistance);
    console.log(`Scale: ${pinch.scale}, Center: (${pinch.center.x}, ${pinch.center.y})`);
  }
});
```

---

### 2. Animations (`/lib/animations.ts`)

**Purpose:** Animation utilities including easing functions and CSS transform helpers.

#### Example: Smooth Transform Animation

```typescript
import { animate, createTransform, easeOutCubic } from '@/lib/animations';

const element = document.getElementById('carousel-item');

animate(
  500, // duration in ms
  (progress) => {
    const transform = createTransform({
      x: progress * 300,
      scale: 1 - progress * 0.2,
    });
    element!.style.transform = transform;
  },
  easeOutCubic
);
```

#### Example: Spring Animation

```typescript
import { spring, animate } from '@/lib/animations';

const bouncy = spring({ stiffness: 300, damping: 20 });

animate(1000, (progress) => {
  const easedProgress = bouncy(progress);
  element.style.transform = `scale(${1 + easedProgress * 0.2})`;
}, bouncy);
```

#### Example: Smooth Scroll

```typescript
import { smoothScrollTo, easeInOutCubic } from '@/lib/animations';

// Scroll to element
const targetSection = document.getElementById('section-3');
await smoothScrollTo(targetSection!, 800, easeInOutCubic);

// Scroll to position
await smoothScrollTo(1000, 500);
```

---

### 3. Mobile Utilities (`/lib/mobile.ts`)

**Purpose:** Mobile device detection, orientation handling, vibration, and platform-specific utilities.

#### Example: Device Detection

```typescript
import { isMobile, isIOS, getDeviceType, getMobileOS } from '@/lib/mobile';

if (isMobile()) {
  console.log('Mobile device detected');

  if (isIOS()) {
    // Apply iOS-specific styles
  }
}

const deviceType = getDeviceType(); // 'mobile' | 'tablet' | 'desktop'
const os = getMobileOS(); // 'iOS' | 'Android' | 'Windows Phone' | 'unknown'
```

#### Example: Orientation Handling

```typescript
import { getOrientation, onOrientationChange } from '@/lib/mobile';

// Get current orientation
const orientation = getOrientation(); // 'portrait' | 'landscape'

// Listen for changes
const cleanup = onOrientationChange((orientation) => {
  console.log(`Orientation changed to: ${orientation}`);
  // Adjust carousel layout
});

// Cleanup when component unmounts
cleanup();
```

#### Example: Haptic Feedback

```typescript
import { vibrate, hapticFeedback, hapticSuccess } from '@/lib/mobile';

// Button click
button.addEventListener('click', () => {
  hapticFeedback(); // Light vibration
});

// Success action
hapticSuccess(); // Success pattern

// Custom pattern
vibrate([100, 50, 100, 50, 200]); // Vibrate-pause-vibrate pattern
```

#### Example: Lock Body Scroll (for Modals)

```typescript
import { lockBodyScroll, unlockBodyScroll } from '@/lib/mobile';

// When opening modal
function openModal() {
  lockBodyScroll();
  // Show modal
}

// When closing modal
function closeModal() {
  unlockBodyScroll();
  // Hide modal
}
```

---

## React Hooks

### 1. useCarousel (`/hooks/useCarousel.ts`)

**Purpose:** Complete carousel state management with auto-advance, keyboard navigation, and preloading.

#### Example: Basic Carousel

```typescript
import { useCarousel } from '@/hooks/useCarousel';

function ImageCarousel({ images }: { images: string[] }) {
  const carousel = useCarousel({
    itemCount: images.length,
    autoAdvanceInterval: 3000,
    loop: true,
  });

  return (
    <div {...carousel.containerProps} className="carousel">
      <img src={images[carousel.currentIndex]} alt="" />

      <button onClick={carousel.prev}>Previous</button>
      <button onClick={carousel.next}>Next</button>

      <div className="indicators">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => carousel.goTo(idx)}
            className={idx === carousel.currentIndex ? 'active' : ''}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### Example: Carousel with Swipe Support

```typescript
import { useCarouselWithSwipe } from '@/hooks/useCarousel';

function SwipeableCarousel({ items }: { items: any[] }) {
  const carousel = useCarouselWithSwipe({
    itemCount: items.length,
    autoAdvanceInterval: 4000,
    pauseOnHover: true,
  });

  return (
    <div {...carousel.containerProps} {...carousel.swipeHandlers} className="carousel">
      {items[carousel.currentIndex]}

      {/* Preload adjacent items */}
      {carousel.getPreloadIndices().map(idx => (
        <div key={idx} style={{ display: 'none' }}>
          {items[idx]}
        </div>
      ))}
    </div>
  );
}
```

---

### 2. useSwipe (`/hooks/useSwipe.ts`)

**Purpose:** Comprehensive swipe gesture detection.

#### Example: Basic Swipe Detection

```typescript
import { useSwipe } from '@/hooks/useSwipe';

function SwipeCard() {
  const swipe = useSwipe({
    onSwipeLeft: () => console.log('Swiped left'),
    onSwipeRight: () => console.log('Swiped right'),
    threshold: 100,
    velocityThreshold: 0.5,
  });

  return (
    <div {...swipe.handlers} className="swipe-card">
      Swipe me!
    </div>
  );
}
```

#### Example: Swipe to Dismiss

```typescript
import { useSwipeToDismiss } from '@/hooks/useSwipe';

function DismissableNotification({ onDismiss }: { onDismiss: () => void }) {
  const dismiss = useSwipeToDismiss(onDismiss);

  return (
    <div
      {...dismiss.handlers}
      style={{
        transform: `translateX(${dismiss.swipeProgress}px)`,
        opacity: 1 - Math.abs(dismiss.swipeProgress) / 300,
      }}
      className="notification"
    >
      Swipe to dismiss
    </div>
  );
}
```

#### Example: Pull to Refresh

```typescript
import { usePullToRefresh } from '@/hooks/useSwipe';

function RefreshableList({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const refresh = usePullToRefresh(onRefresh, { threshold: 100 });

  return (
    <div {...refresh.handlers}>
      {refresh.isRefreshing && <Spinner />}
      <div style={{ transform: `translateY(${refresh.pullDistance}px)` }}>
        <ListItems />
      </div>
    </div>
  );
}
```

---

### 3. useLongPress (`/hooks/useLongPress.ts`)

**Purpose:** Long press gesture detection with progress tracking.

#### Example: Long Press with Progress

```typescript
import { useLongPress } from '@/hooks/useLongPress';

function LongPressButton() {
  const longPress = useLongPress({
    onLongPress: () => console.log('Long pressed!'),
    delay: 800,
    haptic: true,
  });

  return (
    <button {...longPress.handlers} className="long-press-btn">
      Hold me
      {longPress.isLongPressing && (
        <div
          className="progress-bar"
          style={{ width: `${longPress.progress * 100}%` }}
        />
      )}
    </button>
  );
}
```

#### Example: Context Menu

```typescript
import { useLongPressContextMenu } from '@/hooks/useLongPress';

function ContextMenuCard() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const longPress = useLongPressContextMenu(
    (position) => {
      setMenuPosition(position);
      setMenuVisible(true);
    },
    { delay: 600 }
  );

  return (
    <>
      <div {...longPress.handlers}>Long press for menu</div>
      {menuVisible && (
        <ContextMenu
          position={menuPosition}
          onClose={() => setMenuVisible(false)}
        />
      )}
    </>
  );
}
```

---

### 4. useIntersectionObserver (`/hooks/useIntersectionObserver.ts`)

**Purpose:** Enhanced intersection observation for lazy loading and animations.

#### Example: Lazy Load Images

```typescript
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {isIntersecting ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="placeholder" />
      )}
    </div>
  );
}
```

#### Example: Scroll-Triggered Animation

```typescript
import { useViewportAnimation } from '@/hooks/useIntersectionObserver';

function AnimatedCard() {
  const { ref, className } = useViewportAnimation('fade-in-up', {
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={className}>
      Content that animates in
    </div>
  );
}
```

#### Example: Infinite Scroll

```typescript
import { useInfiniteScroll } from '@/hooks/useIntersectionObserver';

function InfiniteList() {
  const [items, setItems] = useState([...]);
  const [hasMore, setHasMore] = useState(true);

  const { ref, isLoading } = useInfiniteScroll(
    async () => {
      const newItems = await fetchMoreItems();
      setItems([...items, ...newItems]);
      if (newItems.length === 0) setHasMore(false);
    },
    { enabled: hasMore }
  );

  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)}
      {hasMore && <div ref={ref}>{isLoading ? 'Loading...' : 'Load more'}</div>}
    </div>
  );
}
```

---

### 5. useTouch (`/hooks/useTouch.ts`)

**Purpose:** Low-level touch event handling for custom gestures.

#### Example: Multi-Touch Tracking

```typescript
import { useTouch } from '@/hooks/useTouch';

function MultiTouchCanvas() {
  const touch = useTouch({
    onTouchStart: (touches) => {
      console.log(`${touches.length} touch(es) started`);
    },
    onTouchMove: (touches) => {
      // Draw based on touch positions
    },
  });

  return (
    <canvas {...touch.handlers} width={800} height={600}>
      {touch.isTouching && <p>{touch.touchCount} finger(s)</p>}
    </canvas>
  );
}
```

#### Example: Pinch Zoom

```typescript
import { useMultiTouch } from '@/hooks/useTouch';

function PinchZoomImage({ src }: { src: string }) {
  const pinch = useMultiTouch({
    onPinch: (scale, center) => {
      console.log(`Pinch scale: ${scale}`);
    },
  });

  return (
    <div {...pinch.handlers} className="pinch-container">
      <img
        src={src}
        style={{
          transform: `scale(${pinch.scale})`,
          transformOrigin: pinch.center
            ? `${pinch.center.x}px ${pinch.center.y}px`
            : 'center',
        }}
        alt=""
      />
    </div>
  );
}
```

#### Example: Draggable Element

```typescript
import { useDrag } from '@/hooks/useTouch';

function DraggableCard() {
  const drag = useDrag({
    onDrag: (x, y) => console.log(`Dragged to (${x}, ${y})`),
    bounds: { minX: 0, maxX: 300, minY: 0, maxY: 300 },
  });

  return (
    <div
      {...drag.handlers}
      style={{
        transform: `translate(${drag.position.x}px, ${drag.position.y}px)`,
        cursor: drag.isDragging ? 'grabbing' : 'grab',
      }}
    >
      Drag me
    </div>
  );
}
```

---

## Complete Examples

### Complete Mobile Carousel Component

```typescript
'use client';

import { useCarouselWithSwipe, useCarouselTracking } from '@/hooks/useCarousel';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { isMobile, hapticFeedback } from '@/lib/mobile';
import { animate, easeOutCubic } from '@/lib/animations';

interface CarouselItem {
  id: string;
  image: string;
  title: string;
}

export function MobileCarousel({ items }: { items: CarouselItem[] }) {
  const carousel = useCarouselWithSwipe({
    itemCount: items.length,
    autoAdvanceInterval: 5000,
    loop: true,
    pauseOnHover: !isMobile(),
    preloadStrategy: 'adjacent',
  });

  // Track analytics
  useCarouselTracking(carousel.currentIndex, items.length, (index, duration) => {
    console.log(`Viewed slide ${index} for ${duration}ms`);
  });

  const handleSlideChange = (index: number) => {
    carousel.goTo(index);
    if (isMobile()) {
      hapticFeedback();
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        {...carousel.containerProps}
        {...carousel.swipeHandlers}
        className="carousel-container"
      >
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${carousel.currentIndex * 100}%)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {items.map((item, index) => (
            <CarouselSlide
              key={item.id}
              item={item}
              isActive={index === carousel.currentIndex}
              shouldPreload={carousel.shouldPreload(index)}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={carousel.prev}
        className="carousel-btn prev"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={carousel.next}
        className="carousel-btn next"
        aria-label="Next"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={index === carousel.currentIndex ? 'active' : ''}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === carousel.currentIndex}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      {carousel.isAutoPlaying && (
        <div className="autoplay-indicator">▶</div>
      )}
    </div>
  );
}

function CarouselSlide({
  item,
  isActive,
  shouldPreload
}: {
  item: CarouselItem;
  isActive: boolean;
  shouldPreload: boolean;
}) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: true,
  });

  const shouldLoad = isActive || shouldPreload || isIntersecting;

  return (
    <div ref={ref} className="carousel-slide">
      {shouldLoad ? (
        <img
          src={item.image}
          alt={item.title}
          className="carousel-image"
          loading={isActive ? 'eager' : 'lazy'}
        />
      ) : (
        <div className="carousel-placeholder" />
      )}
      <h3 className="carousel-title">{item.title}</h3>
    </div>
  );
}
```

---

## Integration Guide

### 1. Import Utilities

```typescript
// Gestures
import { detectSwipe, getTouchPoint } from '@/lib/gestures';

// Animations
import { animate, easeOutCubic, createTransform } from '@/lib/animations';

// Mobile
import { isMobile, hapticFeedback, lockBodyScroll } from '@/lib/mobile';

// Hooks
import { useCarousel } from '@/hooks/useCarousel';
import { useSwipe } from '@/hooks/useSwipe';
import { useLongPress } from '@/hooks/useLongPress';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useTouch } from '@/hooks/useTouch';
```

### 2. TypeScript Types

All utilities export TypeScript types for better type safety:

```typescript
import type {
  SwipeDirection,
  TouchPoint,
  SwipeGesture
} from '@/lib/gestures';

import type {
  EasingFunction,
  Transform
} from '@/lib/animations';

import type {
  DeviceType,
  MobileOS,
  Orientation
} from '@/lib/mobile';
```

### 3. SSR Compatibility

All utilities check for `window` and `document` availability, making them SSR-safe:

```typescript
// These are safe to use in Next.js components
const isMobileDevice = isMobile(); // Returns false on server
const orientation = getOrientation(); // Returns 'portrait' on server
```

### 4. Performance Tips

- Use `triggerOnce: true` for one-time animations
- Use `preloadStrategy: 'adjacent'` for carousels to balance performance and UX
- Enable `pauseOnInteraction` to prevent jarring auto-advances
- Use `rafThrottle` for scroll/resize handlers

---

## File Summary

| File | Lines | Description |
|------|-------|-------------|
| `lib/gestures.ts` | 423 | Touch/gesture detection utilities |
| `lib/animations.ts` | 532 | Animation utilities and easing functions |
| `lib/mobile.ts` | 636 | Mobile device detection and platform utilities |
| `hooks/useCarousel.ts` | 438 | Carousel state management hook |
| `hooks/useSwipe.ts` | 432 | Swipe gesture detection hook |
| `hooks/useLongPress.ts` | 382 | Long press gesture hook |
| `hooks/useIntersectionObserver.ts` | 526 | Enhanced intersection observer hook |
| `hooks/useTouch.ts` | 579 | Low-level touch handling hook |
| **Total** | **3,948** | **8 files** |

---

## Next Steps

1. **Test the utilities** in your carousel components
2. **Add custom CSS animations** that work with the animation utilities
3. **Create Tailwind variants** for mobile-specific styles
4. **Add analytics tracking** using the carousel tracking hook
5. **Optimize images** using the lazy loading hooks

For questions or issues, refer to the inline JSDoc comments in each file.
