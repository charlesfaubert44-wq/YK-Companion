import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { SizeVariant } from '../../types';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input size
   * @default 'md'
   */
  size?: SizeVariant;

  /**
   * Enable pixel art aesthetic
   * @default true
   */
  pixel?: boolean;

  /**
   * Show error state
   */
  error?: boolean;

  /**
   * Helper text below input
   */
  helperText?: string;

  /**
   * Label text
   */
  label?: string;

  /**
   * Left icon or element
   */
  leftElement?: React.ReactNode;

  /**
   * Right icon or element
   */
  rightElement?: React.ReactNode;
}

/**
 * Input component with aurora-themed styling
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   type="email"
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      pixel = true,
      error = false,
      helperText,
      label,
      leftElement,
      rightElement,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full bg-[#0a1128] text-white transition-all duration-200 focus:outline-none';

    const pixelClasses = pixel
      ? 'border-4 border-[#00ff88] focus:border-[#4d94ff] shadow-[2px_2px_0px_0px_rgba(0,255,136,0.5)]'
      : 'border-2 border-[#00ff88] rounded-lg focus:border-[#4d94ff] focus:ring-2 focus:ring-[#4d94ff]/50';

    const errorClasses = error
      ? 'border-[#ff66cc] focus:border-[#ff66cc]'
      : '';

    const sizeClasses: Record<SizeVariant, string> = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

    const disabledClasses = disabled
      ? 'opacity-50 cursor-not-allowed bg-[#151b3a]'
      : 'cursor-text';

    const hasLeftElement = leftElement ? 'pl-10' : '';
    const hasRightElement = rightElement ? 'pr-10' : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-[#00ff88] font-bold mb-2 text-sm">
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              baseClasses,
              pixelClasses,
              errorClasses,
              sizeClasses[size],
              disabledClasses,
              hasLeftElement,
              hasRightElement,
              className
            )}
            disabled={disabled}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightElement}
            </div>
          )}
        </div>
        {helperText && (
          <p
            className={cn(
              'mt-1 text-xs',
              error ? 'text-[#ff66cc]' : 'text-gray-400'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
