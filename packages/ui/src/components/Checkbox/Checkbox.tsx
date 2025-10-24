import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
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
   * Helper text below checkbox
   */
  helperText?: string;
}

/**
 * Checkbox component with aurora-themed styling
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Accept terms and conditions"
 *   checked={accepted}
 *   onChange={(e) => setAccepted(e.target.checked)}
 * />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="peer sr-only"
            disabled={disabled}
            checked={checked}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={cn(
              'w-6 h-6 flex items-center justify-center cursor-pointer transition-all duration-200',
              pixel
                ? 'border-4 border-[#00ff88] bg-[#0a1128] peer-checked:bg-[#00ff88] peer-checked:border-[#00cc6a] shadow-[2px_2px_0px_0px_rgba(0,255,136,0.3)] peer-focus:shadow-[2px_2px_0px_0px_rgba(77,148,255,0.5)]'
                : 'border-2 border-[#00ff88] rounded bg-[#0a1128] peer-checked:bg-[#00ff88] peer-focus:ring-2 peer-focus:ring-[#4d94ff]/50',
              disabled ? 'opacity-50 cursor-not-allowed' : '',
              className
            )}
          >
            {checked && (
              <Check className={cn(
                'w-4 h-4 text-[#0a1128] transition-transform duration-200',
                checked ? 'scale-100' : 'scale-0'
              )} />
            )}
          </label>
        </div>
        {(label || helperText) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={checkboxId}
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

Checkbox.displayName = 'Checkbox';
