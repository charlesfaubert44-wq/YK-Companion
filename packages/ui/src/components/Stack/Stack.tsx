import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Stack direction
   * @default 'vertical'
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * Gap size
   * @default 'md'
   */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Align items
   * @default 'stretch'
   */
  align?: 'start' | 'center' | 'end' | 'stretch';

  /**
   * Justify content
   * @default 'start'
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

  /**
   * Wrap items
   * @default false
   */
  wrap?: boolean;
}

/**
 * Stack component for flexbox layouts
 *
 * @example
 * ```tsx
 * <Stack direction="horizontal" gap="md" align="center">
 *   <Button>Action 1</Button>
 *   <Button>Action 2</Button>
 * </Stack>
 * ```
 */
export const Stack: React.FC<StackProps> = ({
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
  children,
  ...props
}) => {
  const directionClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const wrapClasses = wrap ? 'flex-wrap' : 'flex-nowrap';

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        wrapClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Stack.displayName = 'Stack';
