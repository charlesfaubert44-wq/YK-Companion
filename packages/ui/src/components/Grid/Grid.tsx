import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns
   * @default 'auto'
   */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';

  /**
   * Gap size
   * @default 'md'
   */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Responsive columns (mobile, tablet, desktop)
   */
  responsive?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

/**
 * Grid component for grid layouts
 *
 * @example
 * ```tsx
 * <Grid cols={3} gap="lg">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Grid>
 * ```
 */
export const Grid: React.FC<GridProps> = ({
  cols = 'auto',
  gap = 'md',
  responsive,
  className,
  children,
  ...props
}) => {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const colsClasses = cols === 'auto'
    ? 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]'
    : {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        12: 'grid-cols-12',
      }[cols];

  let responsiveClasses = '';
  if (responsive) {
    responsiveClasses = cn(
      responsive.mobile ? `grid-cols-${responsive.mobile}` : '',
      responsive.tablet ? `md:grid-cols-${responsive.tablet}` : '',
      responsive.desktop ? `lg:grid-cols-${responsive.desktop}` : ''
    );
  }

  return (
    <div
      className={cn(
        'grid',
        !responsive && colsClasses,
        responsive && responsiveClasses,
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Grid.displayName = 'Grid';
