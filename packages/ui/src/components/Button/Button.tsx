import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { ButtonVariant, SizeVariant } from '../../types';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: SizeVariant;

  /**
   * Enable pixel art aesthetic with retro borders
   * @default true
   */
  pixel?: boolean;

  /**
   * Show loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon before text
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon after text
   */
  rightIcon?: React.ReactNode;
}

/**
 * Button component with aurora-themed pixel aesthetics
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      pixel = true,
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'font-bold transition-all duration-200 inline-flex items-center justify-center gap-2';

    const pixelClasses = pixel
      ? 'border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
      : 'rounded-lg shadow-lg hover:shadow-xl';

    const variantClasses: Record<ButtonVariant, string> = {
      primary: pixel
        ? 'bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a1128] border-[#00cc6a]'
        : 'bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-[#0a1128] hover:from-[#00cc6a] hover:to-[#009955]',
      secondary: pixel
        ? 'bg-[#4d94ff] hover:bg-[#3d7ae0] text-white border-[#3d7ae0]'
        : 'bg-gradient-to-r from-[#4d94ff] to-[#3d7ae0] text-white hover:from-[#3d7ae0] hover:to-[#2d6ad0]',
      accent: pixel
        ? 'bg-[#a366ff] hover:bg-[#8c52e0] text-white border-[#8c52e0]'
        : 'bg-gradient-to-r from-[#a366ff] to-[#8c52e0] text-white hover:from-[#8c52e0] hover:to-[#7c42d0]',
      ghost: 'bg-transparent hover:bg-white/10 text-white border-transparent',
      outline: pixel
        ? 'bg-transparent hover:bg-white/5 text-[#00ff88] border-[#00ff88]'
        : 'bg-transparent hover:bg-white/5 text-[#00ff88] border-2 border-[#00ff88]',
    };

    const sizeClasses: Record<SizeVariant, string> = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    const disabledClasses = disabled || loading
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer';

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          pixelClasses,
          variantClasses[variant],
          sizeClasses[size],
          widthClasses,
          disabledClasses,
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
