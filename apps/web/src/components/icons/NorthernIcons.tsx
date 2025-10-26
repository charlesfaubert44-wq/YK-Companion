'use client';

import { useState, useEffect } from 'react';

interface IconProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

/**
 * Northern-themed Interactive SVG Icons
 *
 * UltraThink Reasoning:
 * - Replace static emoji with custom SVG for better control
 * - Each icon has unique idle animation (sway, pulse, rotate, flicker)
 * - Interactive state adds emphasis on hover/click
 * - Uses aurora color palette for cohesive design
 * - Organic movements inspired by nature (wind, stars, fire, ice)
 */

// Pine Tree - Sways gently like wind
export function PineTree({ className = '', size = 48, interactive = true }: IconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`${className} ${interactive ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Tree trunk */}
      <rect
        x="21"
        y="28"
        width="6"
        height="12"
        fill="#8B4513"
        className={interactive ? 'transition-all duration-300' : ''}
        style={{
          animation: interactive ? 'sway 3s ease-in-out infinite' : 'none',
        }}
      />
      {/* Tree layers */}
      <path
        d="M24 8 L16 18 L32 18 Z"
        fill="#00804d"
        className="origin-bottom"
        style={{
          animation: interactive ? 'sway 3s ease-in-out infinite' : 'none',
          animationDelay: '0s'
        }}
      />
      <path
        d="M24 14 L14 24 L34 24 Z"
        fill="#00b36b"
        className="origin-bottom"
        style={{
          animation: interactive ? 'sway 3.2s ease-in-out infinite' : 'none',
          animationDelay: '0.2s'
        }}
      />
      <path
        d="M24 20 L12 30 L36 30 Z"
        fill="#00e68a"
        className="origin-bottom"
        style={{
          animation: interactive ? 'sway 3.4s ease-in-out infinite' : 'none',
          animationDelay: '0.4s'
        }}
      />
      {isHovered && (
        <g opacity="0.6">
          {/* Sparkle effect on hover */}
          <circle cx="18" cy="16" r="2" fill="#00ff88" className="animate-twinkle" />
          <circle cx="30" cy="22" r="1.5" fill="#4d94ff" className="animate-twinkle" style={{ animationDelay: '0.3s' }} />
        </g>
      )}
      <style jsx>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
      `}</style>
    </svg>
  );
}

// Snowflake - Rotates and twinkles
export function Snowflake({ className = '', size = 48, interactive = true }: IconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`${className} ${interactive ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{
        animation: interactive ? 'rotate-slow 8s linear infinite' : 'none',
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}
    >
      <g stroke="#4d94ff" strokeWidth="2" fill="none" strokeLinecap="round">
        {/* Main axes */}
        <line x1="24" y1="6" x2="24" y2="42" />
        <line x1="6" y1="24" x2="42" y2="24" />
        <line x1="12" y1="12" x2="36" y2="36" />
        <line x1="36" y1="12" x2="12" y2="36" />

        {/* Branches */}
        <line x1="24" y1="12" x2="20" y2="8" />
        <line x1="24" y1="12" x2="28" y2="8" />
        <line x1="24" y1="36" x2="20" y2="40" />
        <line x1="24" y1="36" x2="28" y2="40" />
        <line x1="12" y1="24" x2="8" y2="20" />
        <line x1="12" y1="24" x2="8" y2="28" />
        <line x1="36" y1="24" x2="40" y2="20" />
        <line x1="36" y1="24" x2="40" y2="28" />
      </g>
      <circle cx="24" cy="24" r="4" fill="#e0f2ff" opacity={isHovered ? "1" : "0.5"} />
      <style jsx>{`
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
}

// Aurora Wave - Flowing animation
export function AuroraWave({ className = '', size = 48, interactive = true }: IconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`${className} ${interactive ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      <defs>
        <linearGradient id="auroraGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8">
            <animate attributeName="stopColor" values="#00ff88;#4d94ff;#a366ff;#00ff88" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#4d94ff" stopOpacity="0.8">
            <animate attributeName="stopColor" values="#4d94ff;#a366ff;#00ff88;#4d94ff" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#a366ff" stopOpacity="0.8">
            <animate attributeName="stopColor" values="#a366ff;#00ff88;#4d94ff;#a366ff" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <g opacity={isHovered ? "1" : "0.7"}>
        <path
          d="M 4 24 Q 12 14, 24 20 T 44 18"
          stroke="url(#auroraGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        >
          {interactive && (
            <animate attributeName="d"
              values="M 4 24 Q 12 14, 24 20 T 44 18;M 4 24 Q 12 34, 24 28 T 44 22;M 4 24 Q 12 14, 24 20 T 44 18"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
        </path>
        <path
          d="M 4 28 Q 12 18, 24 24 T 44 22"
          stroke="url(#auroraGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        >
          {interactive && (
            <animate attributeName="d"
              values="M 4 28 Q 12 18, 24 24 T 44 22;M 4 28 Q 12 38, 24 32 T 44 26;M 4 28 Q 12 18, 24 24 T 44 22"
              dur="3.5s"
              repeatCount="indefinite"
            />
          )}
        </path>
      </g>
    </svg>
  );
}

// Campfire - Flickers with orange/yellow
export function Campfire({ className = '', size = 48, interactive = true }: IconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`${className} ${interactive ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      {/* Logs */}
      <rect x="10" y="34" width="28" height="4" rx="2" fill="#8B4513" />
      <rect x="14" y="30" width="20" height="4" rx="2" fill="#8B4513" transform="rotate(5 24 32)" />

      {/* Flames with flicker animation */}
      <g>
        <ellipse cx="24" cy="28" rx="8" ry="12" fill="#ff6600" opacity={isHovered ? "0.9" : "0.7"}>
          {interactive && (
            <animate attributeName="ry" values="12;14;11;13;12" dur="0.8s" repeatCount="indefinite" />
          )}
        </ellipse>
        <ellipse cx="24" cy="26" rx="6" ry="10" fill="#ffa500" opacity="0.8">
          {interactive && (
            <animate attributeName="ry" values="10;12;9;11;10" dur="0.9s" repeatCount="indefinite" />
          )}
        </ellipse>
        <ellipse cx="24" cy="24" rx="4" ry="8" fill="#ffcc00" opacity="0.9">
          {interactive && (
            <animate attributeName="ry" values="8;10;7;9;8" dur="1s" repeatCount="indefinite" />
          )}
        </ellipse>
        {isHovered && (
          <ellipse cx="24" cy="20" rx="2" ry="4" fill="#ffff00" opacity="0.9" className="animate-twinkle" />
        )}
      </g>
    </svg>
  );
}

// Northern Star - Twinkles
export function NorthernStar({ className = '', size = 48, interactive = true }: IconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`${className} ${interactive ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      <defs>
        <radialGradient id="starGlow">
          <stop offset="0%" stopColor="#ffff00" />
          <stop offset="100%" stopColor="#4d94ff" />
        </radialGradient>
      </defs>

      {/* Outer glow */}
      <circle cx="24" cy="24" r="16" fill="url(#starGlow)" opacity={isHovered ? "0.3" : "0.1"}>
        {interactive && (
          <animate attributeName="r" values="16;20;16" dur="2s" repeatCount="indefinite" />
        )}
      </circle>

      {/* Star shape */}
      <path
        d="M24 8 L27 18 L38 18 L29 25 L32 36 L24 29 L16 36 L19 25 L10 18 L21 18 Z"
        fill="#ffff00"
        stroke="#4d94ff"
        strokeWidth="1"
        opacity={isHovered ? "1" : "0.8"}
      >
        {interactive && (
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
        )}
      </path>

      {/* Center point */}
      <circle cx="24" cy="24" r="3" fill="#ffffff" opacity={isHovered ? "1" : "0.9"}>
        {interactive && (
          <animate attributeName="r" values="3;4;3" dur="1s" repeatCount="indefinite" />
        )}
      </circle>
    </svg>
  );
}

// Luggage - For visiting page
export function LuggageIcon({ className = '', size = 48, interactive = true }: IconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`${className} ${interactive ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Suitcase body */}
      <rect x="10" y="20" width="28" height="20" rx="2" fill="#4d94ff" stroke="#00ff88" strokeWidth="2" />

      {/* Handle */}
      <path d="M 18 20 L 18 14 Q 18 12, 20 12 L 28 12 Q 30 12, 30 14 L 30 20"
        fill="none"
        stroke="#00ff88"
        strokeWidth="2"
        style={{
          animation: isHovered && interactive ? 'bounce-subtle 1s ease-in-out' : 'none'
        }}
      />

      {/* Wheels */}
      <circle cx="16" cy="42" r="2" fill="#333" />
      <circle cx="32" cy="42" r="2" fill="#333" />

      {/* Latches */}
      <rect x="22" y="24" width="4" height="2" rx="1" fill="#00ff88" opacity={isHovered ? "1" : "0.7"} />
      <rect x="22" y="32" width="4" height="2" rx="1" fill="#00ff88" opacity={isHovered ? "1" : "0.7"} />
    </svg>
  );
}

// Home/Cabin - For living page
export function CabinIcon({ className = '', size = 48, interactive = true }: IconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [smokeOffset, setSmokeOffset] = useState(0);

  useEffect(() => {
    if (!interactive) return;
    const interval = setInterval(() => {
      setSmokeOffset(prev => (prev + 1) % 20);
    }, 100);
    return () => clearInterval(interval);
  }, [interactive]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`${className} ${interactive ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}
    >
      {/* House body */}
      <rect x="12" y="24" width="24" height="18" fill="#8B4513" stroke="#00804d" strokeWidth="2" />

      {/* Roof */}
      <path d="M 8 24 L 24 10 L 40 24 Z" fill="#00804d" stroke="#00ff88" strokeWidth="2" />

      {/* Door */}
      <rect x="20" y="30" width="8" height="12" rx="1" fill="#4d94ff" stroke="#00ff88" strokeWidth="1" />

      {/* Window */}
      <rect x="28" y="28" width="6" height="6" rx="1" fill="#ffcc00" opacity={isHovered ? "1" : "0.7"} />

      {/* Chimney */}
      <rect x="30" y="14" width="4" height="8" fill="#8B4513" />

      {/* Smoke */}
      {interactive && (
        <g opacity={isHovered ? "0.6" : "0.3"}>
          <circle cx="32" cy={12 - smokeOffset * 0.3} r="2" fill="#cccccc" />
          <circle cx="33" cy={10 - smokeOffset * 0.4} r="1.5" fill="#cccccc" />
          <circle cx="31" cy={8 - smokeOffset * 0.5} r="1" fill="#cccccc" />
        </g>
      )}
    </svg>
  );
}

// Moving Box - For moving page
export function MovingBoxIcon({ className = '', size = 48, interactive = true }: IconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`${className} ${interactive ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{
        transform: isHovered ? 'rotate(-5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Box */}
      <rect x="10" y="16" width="28" height="24" fill="#a366ff" stroke="#00ff88" strokeWidth="2" />

      {/* Tape */}
      <rect x="10" y="26" width="28" height="3" fill="#ffcc00" opacity="0.8" />
      <rect x="22" y="16" width="4" height="24" fill="#ffcc00" opacity="0.8" />

      {/* Label */}
      <rect x="16" y="20" width="16" height="4" rx="1" fill="#ffffff" opacity={isHovered ? "1" : "0.7"} />

      {/* Handle cutouts */}
      <ellipse cx="18" cy="28" rx="2" ry="3" fill="none" stroke="#00ff88" strokeWidth="2" />
      <ellipse cx="30" cy="28" rx="2" ry="3" fill="none" stroke="#00ff88" strokeWidth="2" />

      {isHovered && (
        <text x="24" y="24" textAnchor="middle" fontSize="8" fill="#a366ff" fontWeight="bold">YK</text>
      )}
    </svg>
  );
}
