/**
 * Enhanced Intersection Observer Hook for YK-Companion
 *
 * Provides advanced intersection observation with support for:
 * - Lazy loading carousel items
 * - Batch observations
 * - Multiple threshold tracking
 * - Animation triggers
 *
 * @module hooks/useIntersectionObserver
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Intersection observer options
 */
export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Trigger callback only once (default: false) */
  triggerOnce?: boolean;
  /** Skip observation if disabled (default: false) */
  skip?: boolean;
  /** Callback when intersection changes */
  onChange?: (entry: IntersectionObserverEntry) => void;
  /** Callback when element enters viewport */
  onEnter?: (entry: IntersectionObserverEntry) => void;
  /** Callback when element leaves viewport */
  onLeave?: (entry: IntersectionObserverEntry) => void;
}

/**
 * Intersection observer return value
 */
export interface UseIntersectionObserverReturn<T extends Element> {
  /** Ref to attach to the observed element */
  ref: (node: T | null) => void;
  /** Current intersection entry */
  entry: IntersectionObserverEntry | null;
  /** Whether element is currently intersecting */
  isIntersecting: boolean;
  /** Intersection ratio (0-1) */
  intersectionRatio: number;
}

/**
 * Enhanced hook for intersection observation
 *
 * @param options - Intersection observer options
 * @returns Observer state and ref
 *
 * @example
 * function LazyImage({ src }: { src: string }) {
 *   const { ref, isIntersecting } = useIntersectionObserver({
 *     threshold: 0.1,
 *     triggerOnce: true,
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       {isIntersecting && <img src={src} alt="" />}
 *     </div>
 *   );
 * }
 */
export function useIntersectionObserver<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn<T> {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false,
    skip = false,
    onChange,
    onEnter,
    onLeave,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<T | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const wasIntersecting = useRef(false);

  const ref = useCallback((node: T | null) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (skip || !node) return;

    // Disconnect previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        setEntry(entry);
        onChange?.(entry);

        // Trigger enter/leave callbacks
        if (isIntersecting && !wasIntersecting.current) {
          onEnter?.(entry);
        } else if (!isIntersecting && wasIntersecting.current) {
          onLeave?.(entry);
        }

        wasIntersecting.current = isIntersecting;

        // Disconnect if triggerOnce and now intersecting
        if (triggerOnce && isIntersecting && observer.current) {
          observer.current.disconnect();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.current.observe(node);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [node, root, rootMargin, threshold, triggerOnce, skip, onChange, onEnter, onLeave]);

  return {
    ref,
    entry,
    isIntersecting: entry?.isIntersecting ?? false,
    intersectionRatio: entry?.intersectionRatio ?? 0,
  };
}

/**
 * Hook for lazy loading images with fade-in effect
 *
 * @param options - Intersection observer options
 * @returns Observer state and image props
 *
 * @example
 * function LazyImage({ src, alt }: { src: string; alt: string }) {
 *   const { ref, imageSrc, imageProps } = useLazyImage({
 *     src,
 *     threshold: 0.1,
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       <img src={imageSrc} alt={alt} {...imageProps} />
 *     </div>
 *   );
 * }
 */
export function useLazyImage(
  options: UseIntersectionObserverOptions & {
    src: string;
    placeholder?: string;
  }
): UseIntersectionObserverReturn<HTMLDivElement> & {
  imageSrc: string;
  imageProps: {
    style: React.CSSProperties;
    onLoad: () => void;
  };
} {
  const { src, placeholder = '', ...observerOptions } = options;

  const [imageSrc, setImageSrc] = useState(placeholder);
  const [loaded, setLoaded] = useState(false);

  const observer = useIntersectionObserver<HTMLDivElement>({
    ...observerOptions,
    triggerOnce: true,
    onEnter: () => {
      setImageSrc(src);
    },
  });

  return {
    ...observer,
    imageSrc,
    imageProps: {
      style: {
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      },
      onLoad: () => setLoaded(true),
    },
  };
}

/**
 * Hook for carousel item lazy loading
 * Preloads items adjacent to the current item
 *
 * @param currentIndex - Current carousel index
 * @param itemIndex - This item's index
 * @param preloadDistance - Number of items to preload on each side (default: 1)
 * @returns Whether this item should be loaded
 *
 * @example
 * function CarouselItem({ index, currentIndex }: Props) {
 *   const shouldLoad = useCarouselLazyLoad(currentIndex, index);
 *
 *   return (
 *     <div>
 *       {shouldLoad && <HeavyComponent />}
 *     </div>
 *   );
 * }
 */
export function useCarouselLazyLoad(
  currentIndex: number,
  itemIndex: number,
  preloadDistance: number = 1
): boolean {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const distance = Math.abs(currentIndex - itemIndex);
    if (distance <= preloadDistance) {
      setShouldLoad(true);
    }
  }, [currentIndex, itemIndex, preloadDistance]);

  return shouldLoad;
}

/**
 * Hook for batch intersection observation
 * Efficiently observes multiple elements with a single observer
 *
 * @param options - Intersection observer options
 * @returns Observer controller
 *
 * @example
 * function ImageGrid({ images }: { images: string[] }) {
 *   const observer = useBatchIntersectionObserver({
 *     threshold: 0.1,
 *     onEnter: (element) => {
 *       console.log('Image visible:', element);
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       {images.map((src, i) => (
 *         <img key={i} ref={observer.observe} src={src} alt="" />
 *       ))}
 *     </div>
 *   );
 * }
 */
export function useBatchIntersectionObserver<T extends Element = Element>(
  options: {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
    onEnter?: (element: T) => void;
    onLeave?: (element: T) => void;
  } = {}
): {
  observe: (element: T | null) => void;
  unobserve: (element: T) => void;
  disconnect: () => void;
  entries: Map<T, IntersectionObserverEntry>;
} {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    onEnter,
    onLeave,
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const [entries, setEntries] = useState<Map<T, IntersectionObserverEntry>>(
    new Map()
  );
  const intersectingMap = useRef<Map<T, boolean>>(new Map());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (observerEntries) => {
        setEntries((prev) => {
          const next = new Map(prev);

          observerEntries.forEach((entry) => {
            const element = entry.target as T;
            next.set(element, entry);

            const wasIntersecting = intersectingMap.current.get(element);
            const isIntersecting = entry.isIntersecting;

            if (isIntersecting && !wasIntersecting) {
              onEnter?.(element);
            } else if (!isIntersecting && wasIntersecting) {
              onLeave?.(element);
            }

            intersectingMap.current.set(element, isIntersecting);
          });

          return next;
        });
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [root, rootMargin, threshold, onEnter, onLeave]);

  const observe = useCallback((element: T | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: T) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
      setEntries((prev) => {
        const next = new Map(prev);
        next.delete(element);
        return next;
      });
      intersectingMap.current.delete(element);
    }
  }, []);

  const disconnect = useCallback(() => {
    observerRef.current?.disconnect();
    setEntries(new Map());
    intersectingMap.current.clear();
  }, []);

  return {
    observe,
    unobserve,
    disconnect,
    entries,
  };
}

/**
 * Hook for scroll-triggered animations
 * Tracks element position in viewport for parallax/reveal effects
 *
 * @param options - Intersection observer options
 * @returns Observer state with scroll progress
 *
 * @example
 * function ParallaxImage() {
 *   const { ref, scrollProgress } = useScrollAnimation({
 *     threshold: [0, 0.25, 0.5, 0.75, 1],
 *   });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{
 *         transform: `translateY(${scrollProgress * 50}px)`,
 *       }}
 *     >
 *       Parallax content
 *     </div>
 *   );
 * }
 */
export function useScrollAnimation<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn<T> & {
  scrollProgress: number;
} {
  const [scrollProgress, setScrollProgress] = useState(0);

  const observer = useIntersectionObserver<T>({
    ...options,
    threshold: options.threshold || [0, 0.25, 0.5, 0.75, 1],
    onChange: (entry) => {
      setScrollProgress(entry.intersectionRatio);
      options.onChange?.(entry);
    },
  });

  return {
    ...observer,
    scrollProgress,
  };
}

/**
 * Hook for viewport-aware animations
 * Adds CSS class when element enters viewport
 *
 * @param animationClass - CSS class to add when visible
 * @param options - Intersection observer options
 * @returns Ref and className to apply
 *
 * @example
 * function AnimatedCard() {
 *   const { ref, className } = useViewportAnimation('fade-in-up', {
 *     threshold: 0.2,
 *     triggerOnce: true,
 *   });
 *
 *   return (
 *     <div ref={ref} className={className}>
 *       Content that animates in
 *     </div>
 *   );
 * }
 */
export function useViewportAnimation<T extends Element = Element>(
  animationClass: string,
  options: UseIntersectionObserverOptions = {}
): {
  ref: (node: T | null) => void;
  className: string;
  isVisible: boolean;
} {
  const [isVisible, setIsVisible] = useState(false);

  const { ref, isIntersecting } = useIntersectionObserver<T>({
    ...options,
    onEnter: (entry) => {
      setIsVisible(true);
      options.onEnter?.(entry);
    },
  });

  return {
    ref,
    className: isIntersecting || isVisible ? animationClass : '',
    isVisible,
  };
}

/**
 * Hook for infinite scroll
 * Triggers callback when sentinel element enters viewport
 *
 * @param onLoadMore - Callback to load more items
 * @param options - Configuration options
 * @returns Ref to attach to sentinel element
 *
 * @example
 * function InfiniteList() {
 *   const [items, setItems] = useState([...]);
 *   const [hasMore, setHasMore] = useState(true);
 *
 *   const { ref } = useInfiniteScroll(
 *     async () => {
 *       const newItems = await fetchMoreItems();
 *       setItems([...items, ...newItems]);
 *       if (newItems.length === 0) setHasMore(false);
 *     },
 *     { enabled: hasMore }
 *   );
 *
 *   return (
 *     <div>
 *       {items.map(item => <Item key={item.id} {...item} />)}
 *       <div ref={ref}>Loading...</div>
 *     </div>
 *   );
 * }
 */
export function useInfiniteScroll(
  onLoadMore: () => void | Promise<void>,
  options: {
    threshold?: number;
    rootMargin?: string;
    enabled?: boolean;
  } = {}
): {
  ref: (node: HTMLDivElement | null) => void;
  isLoading: boolean;
} {
  const { threshold = 0.1, rootMargin = '100px', enabled = true } = options;

  const [isLoading, setIsLoading] = useState(false);
  const hasTriggered = useRef(false);

  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin,
    skip: !enabled || isLoading,
  });

  useEffect(() => {
    if (isIntersecting && !hasTriggered.current && enabled && !isLoading) {
      hasTriggered.current = true;
      setIsLoading(true);

      Promise.resolve(onLoadMore()).finally(() => {
        setIsLoading(false);
        // Allow triggering again after a short delay
        setTimeout(() => {
          hasTriggered.current = false;
        }, 500);
      });
    }
  }, [isIntersecting, enabled, isLoading, onLoadMore]);

  return {
    ref,
    isLoading,
  };
}
