'use client';

import { ReactNode, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { hapticFeedback } from '@/lib/mobile';

interface MobileCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'flat';
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  showArrow?: boolean;
  interactive?: boolean;
}

export default function MobileCard({
  children,
  onClick,
  className = '',
  variant = 'default',
  theme,
  showArrow = false,
  interactive = true,
}: MobileCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (onClick && interactive) {
      hapticFeedback();
      onClick();
    }
  };

  const variantStyles = {
    default: 'backdrop-blur-md bg-white/5 border border-white/10',
    elevated: 'backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20',
    flat: 'bg-dark-800/50 border border-dark-700/50',
  };

  return (
    <div
      onClick={handleClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        rounded-2xl p-4 transition-all duration-200
        ${variantStyles[variant]}
        ${interactive ? 'touch-feedback active:scale-98 cursor-pointer' : ''}
        ${isPressed && interactive ? 'scale-98' : 'scale-100'}
        ${className}
      `}
      style={{
        transform: isPressed && interactive ? 'scale(0.98)' : 'scale(1)',
        boxShadow: theme
          ? `0 4px 20px ${theme.glow}, 0 0 0 1px ${theme.primary}20`
          : '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">{children}</div>
        {showArrow && (
          <ChevronRight
            size={20}
            className="ml-2 flex-shrink-0 transition-transform"
            style={{
              color: theme?.primary || '#9ca3af',
              transform: isPressed ? 'translateX(4px)' : 'translateX(0)',
            }}
          />
        )}
      </div>

      {/* Animated border glow on press */}
      {theme && isPressed && interactive && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}40, ${theme.secondary}40, ${theme.accent}40)`,
            animation: 'border-glow 0.5s ease-out',
            opacity: 0.5,
          }}
        />
      )}

      <style jsx>{`
        @keyframes border-glow {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
          }
        }

        .touch-feedback {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .scale-98 {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}

// Specialized card variants

interface MobileFeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
}

export function MobileFeatureCard({
  icon,
  title,
  description,
  onClick,
  theme,
}: MobileFeatureCardProps) {
  return (
    <MobileCard onClick={onClick} variant="elevated" theme={theme} showArrow>
      <div className="flex items-start space-x-4">
        <div
          className="p-3 rounded-xl flex-shrink-0"
          style={{
            backgroundColor: theme ? `${theme.primary}20` : '#ffffff20',
          }}
        >
          <div
            style={{
              color: theme?.primary || '#ffffff',
              filter: theme ? `drop-shadow(0 0 8px ${theme.glow})` : 'none',
            }}
          >
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-lg mb-1"
            style={{
              color: theme?.primary || '#ffffff',
              textShadow: theme ? `0 0 12px ${theme.glow}` : 'none',
            }}
          >
            {title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </MobileCard>
  );
}

interface MobileContentCardProps {
  image?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
}

export function MobileContentCard({
  image,
  title,
  subtitle,
  badge,
  onClick,
  theme,
}: MobileContentCardProps) {
  return (
    <MobileCard onClick={onClick} variant="default" theme={theme} className="p-0 overflow-hidden">
      {image && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.8)',
            }}
          />
          {badge && (
            <div
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md"
              style={{
                backgroundColor: theme ? `${theme.primary}40` : '#ffffff40',
                color: theme?.primary || '#ffffff',
                border: `1px solid ${theme?.primary || '#ffffff'}60`,
              }}
            >
              {badge}
            </div>
          )}
          {/* Aurora gradient overlay */}
          {theme && (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}40, ${theme.secondary}40, transparent)`,
              }}
            />
          )}
        </div>
      )}
      <div className="p-4">
        <h3
          className="font-bold text-base mb-1"
          style={{
            color: theme?.primary || '#ffffff',
          }}
        >
          {title}
        </h3>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    </MobileCard>
  );
}
