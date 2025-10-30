/**
 * Page Transition Component
 *
 * Provides smooth page transitions with multiple transition types:
 * - Fade transitions
 * - Slide transitions
 * - Aurora-curtain transitions
 *
 * @module components/transitions/PageTransition
 */

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AuroraCurtain from './AuroraCurtain';

/**
 * Transition type
 */
export type TransitionType = 'fade' | 'slide' | 'aurora-curtain';

/**
 * Props for PageTransition component
 */
export interface PageTransitionProps {
  /** Child components to transition */
  children: React.ReactNode;
  /** Transition type */
  type?: TransitionType;
  /** Duration in milliseconds */
  duration?: number;
  /** Enable reduced motion */
  reduceMotion?: boolean;
}

/**
 * PageTransition component
 *
 * @param props - Component props
 * @returns Transitioned page content
 *
 * @example
 * export default function Page() {
 *   return (
 *     <PageTransition type="aurora-curtain">
 *       <div>Page content</div>
 *     </PageTransition>
 *   );
 * }
 */
export default function PageTransition({
  children,
  type = 'fade',
  duration = 500,
  reduceMotion = false,
}: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [showAuroraCurtain, setShowAuroraCurtain] = useState(false);

  // Detect pathname changes
  useEffect(() => {
    setIsVisible(false);
    setDisplayChildren(children);

    // For aurora-curtain, show the curtain first
    if (type === 'aurora-curtain') {
      setShowAuroraCurtain(true);
    }

    // Trigger transition
    const timeout = setTimeout(
      () => {
        setIsVisible(true);
        if (type === 'aurora-curtain') {
          // Hide curtain after a short delay
          setTimeout(() => {
            setShowAuroraCurtain(false);
          }, duration / 2);
        }
      },
      type === 'aurora-curtain' ? 50 : 0
    );

    return () => clearTimeout(timeout);
  }, [pathname, children, type, duration]);

  // Check for reduced motion preference
  const prefersReducedMotion =
    reduceMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  if (prefersReducedMotion) {
    // Just render children without transition
    return <>{children}</>;
  }

  // Get transition classes based on type
  const getTransitionClasses = () => {
    if (type === 'fade') {
      return {
        enter: 'opacity-0',
        enterActive: 'opacity-100 transition-opacity',
        exit: 'opacity-100',
        exitActive: 'opacity-0 transition-opacity',
      };
    } else if (type === 'slide') {
      return {
        enter: 'opacity-0 translate-y-4',
        enterActive: 'opacity-100 translate-y-0 transition-all',
        exit: 'opacity-100 translate-y-0',
        exitActive: 'opacity-0 translate-y-4 transition-all',
      };
    }
    return {
      enter: '',
      enterActive: '',
      exit: '',
      exitActive: '',
    };
  };

  const transitionClasses = getTransitionClasses();

  if (type === 'aurora-curtain') {
    return (
      <>
        {showAuroraCurtain && <AuroraCurtain duration={duration} />}
        <div
          className={`${isVisible ? transitionClasses.enterActive : transitionClasses.enter}`}
          style={{
            transitionDuration: `${duration}ms`,
          }}
        >
          {displayChildren}
        </div>
      </>
    );
  }

  return (
    <div
      key={pathname} // Key for React to remount on pathname change
      className={`${isVisible ? transitionClasses.enterActive : transitionClasses.enter}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'ease-in-out',
      }}
    >
      {displayChildren}
    </div>
  );
}
