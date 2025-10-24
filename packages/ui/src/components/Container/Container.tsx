import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Max width size
   * @default 'lg'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

  /**
   * Center the container
   * @default true
   */
  center?: boolean;

  /**
   * Padding
   * @default true
   */
  padding?: boolean;
}

/**
 * Container component for page layouts
 *
 * @example
 * ```tsx
 * <Container maxWidth="lg">
 *   <h1>Page Content</h1>
 * </Container>
 * ```
 */
export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'lg',
  center = true,
  padding = true,
  className,
  children,
  ...props
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const centerClasses = center ? 'mx-auto' : '';
  const paddingClasses = padding ? 'px-4 md:px-6 lg:px-8' : '';

  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        centerClasses,
        paddingClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Container.displayName = 'Container';
