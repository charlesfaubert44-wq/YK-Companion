import { useState } from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  borderColor?: 'white' | 'green' | 'blue' | 'purple' | 'pink';
  hover?: boolean;
  className?: string;
  icon?: string;
  title?: string;
}

/**
 * PixelCard - Retro pixel-art themed card with modern interactions
 *
 * Features:
 * - Pixel-perfect retro aesthetic with 8-bit styling
 * - Scanline and CRT monitor effects
 * - Glitch animations on hover
 * - Pixelated shadows and borders
 * - Animated icon with float effect
 * - RGB chromatic aberration effects
 * - Responsive pixel scaling
 * - Accessibility compliant
 *
 * @example
 * <PixelCard
 *   icon="🎮"
 *   title="Player Stats"
 *   borderColor="green"
 *   hover
 * >
 *   Level: 42 | XP: 9001
 * </PixelCard>
 */
export function PixelCard({
  children,
  borderColor = 'white',
  hover = false,
  className = '',
  icon,
  title,
}: PixelCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const borderColors = {
    white: 'border-pixel-white shadow-pixel-white',
    green: 'border-aurora-green shadow-pixel-green',
    blue: 'border-aurora-blue shadow-pixel-blue',
    purple: 'border-aurora-purple shadow-pixel-purple',
    pink: 'border-aurora-pink',
  };

  const glowColors = {
    white: 'rgba(255, 255, 255, 0.4)',
    green: 'rgba(0, 255, 136, 0.4)',
    blue: 'rgba(77, 148, 255, 0.4)',
    purple: 'rgba(163, 102, 255, 0.4)',
    pink: 'rgba(255, 102, 204, 0.4)',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const hoverEffect = hover ? 'card-pixel-hover cursor-pointer' : '';
  const shadowStyle =
    isHovered && hover
      ? 'shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]'
      : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]';

  return (
    <div
      className={`card-pixel relative ${borderColors[borderColor]} ${hoverEffect} ${shadowStyle} ${className} p-6 md:p-8 transition-all duration-150 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      style={{
        imageRendering: 'pixelated',
        transform: isHovered && hover ? 'translate(-2px, -2px)' : 'translate(0, 0)',
      }}
      role="article"
      aria-label={title ? `${title} card` : 'Pixel card'}
    >
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)',
          }}
        />
      </div>

      {/* CRT glow effect */}
      {isHovered && hover && (
        <>
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-30 blur-2xl transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${glowColors[borderColor]}, transparent 60%)`,
            }}
          />
          {/* RGB chromatic aberration */}
          <div
            className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-20"
            style={{
              background: `
                radial-gradient(circle at ${mousePos.x + 1}% ${mousePos.y}%, rgba(255, 0, 0, 0.3), transparent 40%),
                radial-gradient(circle at ${mousePos.x}% ${mousePos.y + 1}%, rgba(0, 255, 0, 0.3), transparent 40%),
                radial-gradient(circle at ${mousePos.x - 1}% ${mousePos.y}%, rgba(0, 0, 255, 0.3), transparent 40%)
              `,
            }}
          />
        </>
      )}

      {/* Glitch effect bars on hover */}
      {isHovered && hover && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div
            className="absolute h-1 w-full bg-aurora-green opacity-70 animate-glitch-bar-1"
            style={{ top: `${Math.random() * 80}%` }}
          />
          <div
            className="absolute h-1 w-full bg-aurora-blue opacity-70 animate-glitch-bar-2"
            style={{ top: `${Math.random() * 80}%` }}
          />
        </div>
      )}

      {/* Content container */}
      <div className="relative z-10">
        {icon && (
          <div className="mb-4 relative">
            <div
              className={`text-6xl md:text-7xl ${isHovered ? 'animate-float' : ''} transition-transform duration-300`}
              style={{
                imageRendering: 'pixelated',
                filter: isHovered ? 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.8))' : 'none',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {icon}
            </div>
            {/* Pixel-art style shadow for icon */}
            {isHovered && (
              <div
                className="absolute top-0 left-0 text-6xl md:text-7xl opacity-30 -z-10"
                style={{
                  transform: 'translate(4px, 4px)',
                  color: glowColors[borderColor],
                  imageRendering: 'pixelated',
                }}
              >
                {icon}
              </div>
            )}
          </div>
        )}

        {title && (
          <h3 className="font-pixel text-xl md:text-2xl text-pixel-white mb-4 text-pixel-shadow relative">
            <span className={`${isHovered ? 'animate-glitch-text' : ''}`}>{title}</span>
            {/* Pixelated underline */}
            <div
              className={`mt-2 h-1 bg-gradient-to-r from-${borderColor === 'white' ? 'white' : `aurora-${borderColor}`} to-transparent transition-all duration-300`}
              style={{
                width: isHovered ? '100%' : '60%',
                imageRendering: 'pixelated',
              }}
            />
          </h3>
        )}

        <div className="font-mono text-base md:text-lg text-gray-300 leading-relaxed">
          {children}
        </div>

        {/* Decorative pixel corners */}
        <div
          className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
          style={{ borderColor: glowColors[borderColor] }}
        />
        <div
          className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
          style={{ borderColor: glowColors[borderColor] }}
        />
        <div
          className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
          style={{ borderColor: glowColors[borderColor] }}
        />
        <div
          className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
          style={{ borderColor: glowColors[borderColor] }}
        />
      </div>

      {/* Animated border pulse on hover */}
      {isHovered && hover && (
        <div
          className="absolute inset-0 border-4 pointer-events-none animate-pulse-border"
          style={{
            borderColor: glowColors[borderColor],
          }}
        />
      )}

      {/* Retro CRT vignette effect */}
      <div className="absolute inset-0 pointer-events-none z-5 opacity-20">
        <div
          className="h-full w-full"
          style={{
            background:
              'radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.6) 100%)',
          }}
        />
      </div>

      {/* CSS Animations for glitch effects */}
      <style jsx>{`
        @keyframes glitch-bar-1 {
          0%,
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            transform: translateX(100%);
            opacity: 0.7;
          }
        }

        @keyframes glitch-bar-2 {
          0%,
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
          50% {
            transform: translateX(-100%);
            opacity: 0.7;
          }
        }

        @keyframes glitch-text {
          0%,
          100% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(2px, -2px);
          }
          60% {
            transform: translate(-2px, -2px);
          }
          80% {
            transform: translate(2px, 2px);
          }
        }

        @keyframes pulse-border {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-glitch-bar-1 {
          animation: glitch-bar-1 3s ease-in-out infinite;
        }

        .animate-glitch-bar-2 {
          animation: glitch-bar-2 3.5s ease-in-out infinite;
        }

        .animate-glitch-text {
          animation: glitch-text 0.3s ease-in-out infinite;
        }

        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
