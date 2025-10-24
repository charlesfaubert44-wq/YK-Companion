import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { SizeVariant } from '../../types';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Select size
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
   * Helper text below select
   */
  helperText?: string;

  /**
   * Label text
   */
  label?: string;

  /**
   * Options array
   */
  options?: Array<{ value: string; label: string }>;
}

/**
 * Select component with aurora-themed styling
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   options={[
 *     { value: 'ca', label: 'Canada' },
 *     { value: 'us', label: 'United States' }
 *   ]}
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'md',
      pixel = true,
      error = false,
      helperText,
      label,
      options = [],
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full bg-[#0a1128] text-white transition-all duration-200 focus:outline-none appearance-none';

    const pixelClasses = pixel
      ? 'border-4 border-[#00ff88] focus:border-[#4d94ff] shadow-[2px_2px_0px_0px_rgba(0,255,136,0.5)]'
      : 'border-2 border-[#00ff88] rounded-lg focus:border-[#4d94ff] focus:ring-2 focus:ring-[#4d94ff]/50';

    const errorClasses = error
      ? 'border-[#ff66cc] focus:border-[#ff66cc]'
      : '';

    const sizeClasses: Record<SizeVariant, string> = {
      xs: 'px-2 py-1 text-xs pr-8',
      sm: 'px-3 py-1.5 text-sm pr-9',
      md: 'px-4 py-2 text-base pr-10',
      lg: 'px-6 py-3 text-lg pr-12',
      xl: 'px-8 py-4 text-xl pr-14',
    };

    const disabledClasses = disabled
      ? 'opacity-50 cursor-not-allowed bg-[#151b3a]'
      : 'cursor-pointer';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-[#00ff88] font-bold mb-2 text-sm">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              baseClasses,
              pixelClasses,
              errorClasses,
              sizeClasses[size],
              disabledClasses,
              className
            )}
            disabled={disabled}
            {...props}
          >
            {children ||
              options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#00ff88]">
            <ChevronDown className="w-5 h-5" />
          </div>
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

Select.displayName = 'Select';
