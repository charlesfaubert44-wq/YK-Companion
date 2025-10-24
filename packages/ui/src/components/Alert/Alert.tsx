import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Severity } from '../../types';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Alert severity
   * @default 'info'
   */
  severity?: Severity;

  /**
   * Enable pixel art aesthetic
   * @default true
   */
  pixel?: boolean;

  /**
   * Alert title
   */
  title?: string;

  /**
   * Show close button
   */
  closable?: boolean;

  /**
   * Close callback
   */
  onClose?: () => void;
}

/**
 * Alert component for feedback messages
 *
 * @example
 * ```tsx
 * <Alert severity="success" title="Success!">
 *   Your changes have been saved.
 * </Alert>
 * ```
 */
export const Alert: React.FC<AlertProps> = ({
  severity = 'info',
  pixel = true,
  title,
  closable = false,
  onClose,
  className,
  children,
  ...props
}) => {
  const baseClasses = 'p-4 flex items-start gap-3 transition-all duration-200';

  const pixelClasses = pixel
    ? 'border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]'
    : 'rounded-lg';

  const severityConfig: Record<Severity, { bg: string; border: string; icon: React.ReactNode }> = {
    success: {
      bg: 'bg-[#00ff88]/10',
      border: 'border-[#00ff88]',
      icon: <CheckCircle className="w-5 h-5 text-[#00ff88]" />,
    },
    error: {
      bg: 'bg-[#ff66cc]/10',
      border: 'border-[#ff66cc]',
      icon: <XCircle className="w-5 h-5 text-[#ff66cc]" />,
    },
    warning: {
      bg: 'bg-[#FFD700]/10',
      border: 'border-[#FFD700]',
      icon: <AlertCircle className="w-5 h-5 text-[#FFD700]" />,
    },
    info: {
      bg: 'bg-[#4d94ff]/10',
      border: 'border-[#4d94ff]',
      icon: <Info className="w-5 h-5 text-[#4d94ff]" />,
    },
  };

  const config = severityConfig[severity];

  return (
    <div
      role="alert"
      className={cn(
        baseClasses,
        pixelClasses,
        config.bg,
        config.border,
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1">
        {title && (
          <h4 className="font-bold text-white mb-1">{title}</h4>
        )}
        <div className="text-gray-300 text-sm">{children}</div>
      </div>
      {closable && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';
