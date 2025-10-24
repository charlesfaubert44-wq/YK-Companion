import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { ColorVariant, SizeVariant } from '../../types';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge color variant
   * @default 'aurora-green'
   */
  variant?: ColorVariant;

  /**
   * Badge size
   * @default 'md'
   */
  size?: SizeVariant;

  /**
   * Enable pixel art aesthetic
   * @default true
   */
  pixel?: boolean;

  /**
   * Dot indicator
   */
  dot?: boolean;
}

/**
 * Badge component for labels and status indicators
 *
 * @example
 * ```tsx
 * <Badge variant="aurora-green">New</Badge>
 * <Badge variant="aurora-blue" dot>Active</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'aurora-green',
  size = 'md',
  pixel = true,
  dot = false,
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 font-bold transition-all duration-200';

  const pixelClasses = pixel
    ? 'border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]'
    : 'rounded-full';

  const variantClasses: Record<ColorVariant, string> = {
    'aurora-green': 'bg-[#00ff88] text-[#0a1128] border-[#00cc6a]',
    'aurora-blue': 'bg-[#4d94ff] text-white border-[#3d7ae0]',
    'aurora-purple': 'bg-[#a366ff] text-white border-[#8c52e0]',
    'aurora-pink': 'bg-[#ff66cc] text-white border-[#e052b3]',
    midnight: 'bg-[#0a1128] text-[#00ff88] border-[#151b3a]',
    ice: 'bg-[#e0f2ff] text-[#0a1128] border-[#b8d9f5]',
    white: 'bg-white text-[#0a1128] border-gray-200',
    gray: 'bg-gray-500 text-white border-gray-600',
  };

  const sizeClasses: Record<SizeVariant, string> = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
    xl: 'px-4 py-2 text-lg',
  };

  return (
    <span
      className={cn(
        baseClasses,
        pixelClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'inline-block rounded-full',
            size === 'xs' ? 'w-1 h-1' : 'w-2 h-2',
            variant === 'aurora-green' ? 'bg-[#00cc6a]' : 'bg-current'
          )}
        />
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
