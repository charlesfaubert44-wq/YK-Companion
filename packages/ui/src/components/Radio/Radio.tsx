import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Enable pixel art aesthetic
   * @default true
   */
  pixel?: boolean;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text below radio
   */
  helperText?: string;
}

/**
 * Radio component with aurora-themed styling
 *
 * @example
 * ```tsx
 * <Radio
 *   name="plan"
 *   value="basic"
 *   label="Basic Plan"
 *   checked={plan === 'basic'}
 *   onChange={(e) => setPlan(e.target.value)}
 * />
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      pixel = true,
      label,
      helperText,
      className,
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const radioId = props.id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className="peer sr-only"
            disabled={disabled}
            checked={checked}
            {...props}
          />
          <label
            htmlFor={radioId}
            className={cn(
              'w-6 h-6 flex items-center justify-center cursor-pointer transition-all duration-200',
              pixel
                ? 'border-4 border-[#00ff88] bg-[#0a1128] peer-checked:border-[#00cc6a] shadow-[2px_2px_0px_0px_rgba(0,255,136,0.3)] peer-focus:shadow-[2px_2px_0px_0px_rgba(77,148,255,0.5)]'
                : 'border-2 border-[#00ff88] rounded-full bg-[#0a1128] peer-focus:ring-2 peer-focus:ring-[#4d94ff]/50',
              disabled ? 'opacity-50 cursor-not-allowed' : '',
              className
            )}
          >
            {checked && (
              <div
                className={cn(
                  'bg-[#00ff88] transition-all duration-200',
                  pixel ? 'w-3 h-3' : 'w-3 h-3 rounded-full',
                  checked ? 'scale-100' : 'scale-0'
                )}
              />
            )}
          </label>
        </div>
        {(label || helperText) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={radioId}
                className={cn(
                  'text-white font-medium cursor-pointer block',
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                )}
              >
                {label}
              </label>
            )}
            {helperText && (
              <p className="text-xs text-gray-400 mt-1">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
