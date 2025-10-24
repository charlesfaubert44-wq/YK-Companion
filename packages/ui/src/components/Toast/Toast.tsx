import React, { createContext, useContext, useState, useCallback, HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Severity, Position } from '../../types';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastOptions {
  /**
   * Toast message
   */
  message: string;

  /**
   * Toast severity
   * @default 'info'
   */
  severity?: Severity;

  /**
   * Auto-hide duration in ms (0 = no auto-hide)
   * @default 5000
   */
  duration?: number;

  /**
   * Toast position
   * @default 'bottom-right'
   */
  position?: Position;
}

interface Toast extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (options: ToastOptions) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Hook to access toast functions
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Toast provider component - wrap your app with this
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      severity: 'info',
      duration: 5000,
      position: 'bottom-right',
      ...options,
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

interface ToastItemProps extends HTMLAttributes<HTMLDivElement> {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose, ...props }) => {
  const severityConfig: Record<Severity, { bg: string; border: string; icon: React.ReactNode }> = {
    success: {
      bg: 'bg-[#00ff88]/90',
      border: 'border-[#00cc6a]',
      icon: <CheckCircle className="w-5 h-5 text-[#0a1128]" />,
    },
    error: {
      bg: 'bg-[#ff66cc]/90',
      border: 'border-[#e052b3]',
      icon: <XCircle className="w-5 h-5 text-white" />,
    },
    warning: {
      bg: 'bg-[#FFD700]/90',
      border: 'border-[#FFA500]',
      icon: <AlertCircle className="w-5 h-5 text-[#0a1128]" />,
    },
    info: {
      bg: 'bg-[#4d94ff]/90',
      border: 'border-[#3d7ae0]',
      icon: <Info className="w-5 h-5 text-white" />,
    },
  };

  const config = severityConfig[toast.severity || 'info'];

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] min-w-[300px] max-w-md backdrop-blur-sm',
        'animate-in slide-in-from-bottom-5 fade-in duration-200',
        config.bg,
        config.border
      )}
      {...props}
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1 font-bold text-sm">
        {toast.message}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || 'bottom-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<Position, Toast[]>);

  const positionClasses: Record<Position, string> = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={cn(
            'fixed z-50 flex flex-col gap-2',
            positionClasses[position as Position]
          )}
        >
          {positionToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={onClose} />
          ))}
        </div>
      ))}
    </>
  );
};
