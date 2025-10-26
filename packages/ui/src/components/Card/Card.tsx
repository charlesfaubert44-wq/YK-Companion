import React, { HTMLAttributes, useState, useRef } from 'react';
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
 * Card - Versatile card component with stunning visual effects
 *
 * Features:
 * - Dual mode: pixel art or modern glassmorphism
 * - 3D hover effects with perspective
 * - Dynamic lighting based on mouse position
 * - Smooth micro-interactions
 * - Gradient animations
 * - Optimized GPU acceleration
 * - Full accessibility support
 * - Responsive design
 *
 * @example
 * ```tsx
 * <Card
 *   pixel={false}
 *   hoverable
 *   borderColor="aurora-green"
 *   header={<h3>Welcome</h3>}
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
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Track mouse position for lighting effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverable || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const baseClasses = 'bg-[#0a1128] overflow-hidden transition-all duration-300 relative';

  const pixelClasses = pixel
    ? 'border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]'
    : 'rounded-2xl shadow-2xl backdrop-blur-xl bg-gradient-to-br from-[#0a1128]/95 via-[#151b3a]/95 to-[#0a1128]/95';

  const borderColorMap: Record<ColorVariant, string> = {
    'aurora-green': pixel ? 'border-[#00ff88]' : 'border-[#00ff88]/40',
    'aurora-blue': pixel ? 'border-[#4d94ff]' : 'border-[#4d94ff]/40',
    'aurora-purple': pixel ? 'border-[#a366ff]' : 'border-[#a366ff]/40',
    'aurora-pink': pixel ? 'border-[#ff66cc]' : 'border-[#ff66cc]/40',
    midnight: pixel ? 'border-[#0a1128]' : 'border-[#0a1128]/40',
    ice: pixel ? 'border-[#e0f2ff]' : 'border-[#e0f2ff]/40',
    white: pixel ? 'border-white' : 'border-white/40',
    gray: pixel ? 'border-gray-500' : 'border-gray-500/40',
  };

  const glowColorMap: Record<ColorVariant, string> = {
    'aurora-green': 'rgba(0, 255, 136, 0.3)',
    'aurora-blue': 'rgba(77, 148, 255, 0.3)',
    'aurora-purple': 'rgba(163, 102, 255, 0.3)',
    'aurora-pink': 'rgba(255, 102, 204, 0.3)',
    midnight: 'rgba(10, 17, 40, 0.3)',
    ice: 'rgba(224, 242, 255, 0.3)',
    white: 'rgba(255, 255, 255, 0.3)',
    gray: 'rgba(128, 128, 128, 0.3)',
  };

  const hoverClasses = hoverable
    ? pixel
      ? 'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-x-[2px] hover:-translate-y-[2px] cursor-pointer'
      : 'cursor-pointer'
    : '';

  // Calculate 3D transform for non-pixel cards
  const get3DTransform = () => {
    if (!hoverable || pixel || !isHovered) return '';

    const rotateX = (mousePosition.y - 50) * -0.15;
    const rotateY = (mousePosition.x - 50) * 0.15;

    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        baseClasses,
        pixelClasses,
        borderColorMap[borderColor],
        hoverClasses,
        className
      )}
      style={{
        transform: get3DTransform(),
        transformStyle: 'preserve-3d',
        imageRendering: pixel ? 'pixelated' : 'auto',
        border: pixel ? undefined : '2px solid',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 50, y: 50 });
      }}
      onMouseMove={handleMouseMove}
      role="article"
      {...props}
    >
      {/* Modern mode: Dynamic lighting overlay */}
      {!pixel && isHovered && hoverable && (
        <>
          <div
            className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-300 z-10"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${glowColorMap[borderColor]}, transparent 60%)`,
            }}
          />
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 z-10"
            style={{
              background: `linear-gradient(135deg, transparent 40%, ${glowColorMap[borderColor]} 50%, transparent 60%)`,
              backgroundSize: '200% 200%',
              animation: 'shimmer 3s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* Pixel mode: Scanlines */}
      {pixel && (
        <div className="absolute inset-0 pointer-events-none opacity-10 z-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)',
            }}
          />
        </div>
      )}

      {/* Image section */}
      {image && (
        <div className={cn('w-full overflow-hidden relative', pixel ? '' : 'rounded-t-2xl')}>
          <img
            src={image}
            alt={imageAlt || ''}
            className={cn(
              'w-full h-48 object-cover transition-transform duration-500',
              hoverable && isHovered ? 'scale-110' : 'scale-100'
            )}
            style={{
              imageRendering: pixel ? 'pixelated' : 'auto',
            }}
          />
          {/* Image overlay gradient */}
          {!pixel && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-transparent to-transparent opacity-60" />
          )}
        </div>
      )}

      {/* Header section */}
      {header && (
        <div
          className={cn(
            'px-6 py-4 border-b-4 relative z-20',
            borderColorMap[borderColor],
            !pixel && 'backdrop-blur-sm bg-white/5'
          )}
        >
          {header}
        </div>
      )}

      {/* Main content section */}
      <div className="px-6 py-4 relative z-20">{children}</div>

      {/* Footer section */}
      {footer && (
        <div
          className={cn(
            'px-6 py-4 border-t-4 bg-[#151b3a] relative z-20',
            borderColorMap[borderColor],
            !pixel && 'backdrop-blur-sm bg-white/5 rounded-b-2xl'
          )}
        >
          {footer}
        </div>
      )}

      {/* Decorative corner accents for modern mode */}
      {!pixel && hoverable && (
        <>
          <div
            className={cn(
              'absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 transition-all duration-300',
              isHovered ? 'opacity-100 scale-110' : 'opacity-40 scale-100'
            )}
            style={{ borderColor: glowColorMap[borderColor] }}
          />
          <div
            className={cn(
              'absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 transition-all duration-300',
              isHovered ? 'opacity-100 scale-110' : 'opacity-40 scale-100'
            )}
            style={{ borderColor: glowColorMap[borderColor] }}
          />
          <div
            className={cn(
              'absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 transition-all duration-300',
              isHovered ? 'opacity-100 scale-110' : 'opacity-40 scale-100'
            )}
            style={{ borderColor: glowColorMap[borderColor] }}
          />
          <div
            className={cn(
              'absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 transition-all duration-300',
              isHovered ? 'opacity-100 scale-110' : 'opacity-40 scale-100'
            )}
            style={{ borderColor: glowColorMap[borderColor] }}
          />
        </>
      )}

      {/* Animated border glow on hover */}
      {!pixel && hoverable && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-0"
          style={{
            boxShadow: `0 0 40px ${glowColorMap[borderColor]}, inset 0 0 20px ${glowColorMap[borderColor]}`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Noise texture for depth (modern mode) */}
      {!pixel && (
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-5 mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id={`noise-${borderColor}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#noise-${borderColor})`} />
          </svg>
        </div>
      )}

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

Card.displayName = 'Card';
