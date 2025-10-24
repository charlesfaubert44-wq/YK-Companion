import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { ColorVariant } from '../../types';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Enable pixel art aesthetic
   * @default true
   */
  pixel?: boolean;

  /**
   * Border color variant
   * @default 'aurora-green'
   */
  borderColor?: ColorVariant;

  /**
   * Enable hover effects
   * @default false
   */
  hoverable?: boolean;

  /**
   * Card header content
   */
  header?: React.ReactNode;

  /**
   * Card footer content
   */
  footer?: React.ReactNode;

  /**
   * Card image
   */
  image?: string;

  /**
   * Image alt text
   */
  imageAlt?: string;
}

/**
 * Card component for content containers
 *
 * @example
 * ```tsx
 * <Card
 *   header={<h3>Card Title</h3>}
 *   footer={<Button>Learn More</Button>}
 * >
 *   Card content goes here
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  pixel = true,
  borderColor = 'aurora-green',
  hoverable = false,
  header,
  footer,
  image,
  imageAlt,
  className,
  children,
  ...props
}) => {
  const baseClasses = 'bg-[#0a1128] overflow-hidden transition-all duration-200';

  const pixelClasses = pixel
    ? 'border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]'
    : 'rounded-lg shadow-lg';

  const borderColorMap: Record<ColorVariant, string> = {
    'aurora-green': 'border-[#00ff88]',
    'aurora-blue': 'border-[#4d94ff]',
    'aurora-purple': 'border-[#a366ff]',
    'aurora-pink': 'border-[#ff66cc]',
    midnight: 'border-[#0a1128]',
    ice: 'border-[#e0f2ff]',
    white: 'border-white',
    gray: 'border-gray-500',
  };

  const hoverClasses = hoverable
    ? pixel
      ? 'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-x-[2px] hover:-translate-y-[2px] cursor-pointer'
      : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <div
      className={cn(
        baseClasses,
        pixelClasses,
        borderColorMap[borderColor],
        hoverClasses,
        className
      )}
      {...props}
    >
      {image && (
        <div className="w-full overflow-hidden">
          <img
            src={image}
            alt={imageAlt || ''}
            className={cn(
              'w-full h-48 object-cover',
              hoverable ? 'transition-transform duration-200 hover:scale-105' : ''
            )}
          />
        </div>
      )}

      {header && (
        <div className={cn(
          'px-6 py-4 border-b-4',
          borderColorMap[borderColor]
        )}>
          {header}
        </div>
      )}

      <div className="px-6 py-4">
        {children}
      </div>

      {footer && (
        <div className={cn(
          'px-6 py-4 border-t-4 bg-[#151b3a]',
          borderColorMap[borderColor]
        )}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.displayName = 'Card';
