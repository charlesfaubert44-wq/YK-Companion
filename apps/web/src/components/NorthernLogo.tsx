'use client';

import { useState, useEffect } from 'react';

export default function NorthernLogo({ size = 140 }: { size?: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; delay: number }>>(
    []
  );

  useEffect(() => {
    // Generate star field
    const newStars = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 200,
      y: Math.random() * 200,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 3,
    }));
    setStars(newStars);

    // Smooth continuous animation
    const interval = setInterval(() => {
      setTime(prev => (prev + 0.02) % (Math.PI * 2));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      className="relative mx-auto transition-transform duration-300 ease-out cursor-pointer select-none"
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 50, y: 50 });
      }}
    >
      {/* Outer atmospheric glow */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-700"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%,
            rgba(0, 255, 136, 0.25),
            rgba(77, 148, 255, 0.15),
            rgba(163, 102, 255, 0.1),
            transparent 70%)`,
          transform: isHovered ? 'scale(1.3)' : 'scale(1.1)',
          filter: 'blur(20px)',
          opacity: isHovered ? 0.9 : 0.6,
        }}
      />

      {/* Main SVG - Beautiful Aurora Display */}
      <svg width={size} height={size} viewBox="0 0 200 200" className="relative z-10">
        <defs>
          {/* Aurora gradient definitions */}
          <linearGradient id="green-blue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8">
              <animate
                attributeName="stopOpacity"
                values="0.6;0.9;0.6"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#4d94ff" stopOpacity="0.7">
              <animate
                attributeName="stopOpacity"
                values="0.5;0.8;0.5"
                dur="3s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0.8">
              <animate
                attributeName="stopOpacity"
                values="0.6;0.9;0.6"
                dur="3s"
                begin="1s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <linearGradient id="purple-pink" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a366ff" stopOpacity="0.7">
              <animate
                attributeName="stopOpacity"
                values="0.5;0.8;0.5"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#ff66cc" stopOpacity="0.6">
              <animate
                attributeName="stopOpacity"
                values="0.4;0.7;0.4"
                dur="4s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#a366ff" stopOpacity="0.7">
              <animate
                attributeName="stopOpacity"
                values="0.5;0.8;0.5"
                dur="4s"
                begin="1s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>

          <radialGradient id="sky-gradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#0a1128" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#05080f" stopOpacity="1" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dark sky background */}
        <circle cx="100" cy="100" r="98" fill="url(#sky-gradient)" />

        {/* Starfield */}
        {stars.map((star, i) => (
          <circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill="white"
            opacity="0.6"
            filter="url(#softGlow)"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.9;0.3"
              dur={`${2 + star.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Aurora ribbons - multiple flowing layers */}

        {/* Back layer - Purple/Pink */}
        <path
          d={`M 0 ${120 + Math.sin(time) * 15}
              Q ${50 + Math.sin(time + 1) * 20} ${100 + Math.cos(time) * 20},
                ${100 + Math.sin(time + 2) * 15} ${110 + Math.sin(time + 1) * 25}
              T ${200} ${115 + Math.cos(time) * 20}
              L 200 200 L 0 200 Z`}
          fill="url(#purple-pink)"
          opacity={isHovered ? '0.5' : '0.35'}
          filter="url(#glow)"
          className="transition-opacity duration-500"
        />

        {/* Middle layer - Green/Blue */}
        <path
          d={`M 0 ${90 + Math.sin(time + 0.5) * 20}
              Q ${50 + Math.cos(time) * 25} ${70 + Math.sin(time + 0.5) * 30},
                ${100 + Math.sin(time + 1.5) * 20} ${80 + Math.cos(time + 1) * 35}
              T ${200} ${85 + Math.sin(time + 0.5) * 25}
              L 200 200 L 0 200 Z`}
          fill="url(#green-blue)"
          opacity={isHovered ? '0.6' : '0.4'}
          filter="url(#glow)"
          className="transition-opacity duration-500"
        />

        {/* Foreground flowing ribbons - More dynamic */}
        <path
          d={`M ${20 + Math.sin(time) * 10} ${60 + Math.sin(time * 1.2) * 15}
              Q ${60 + Math.cos(time) * 20} ${40 + Math.sin(time * 0.8) * 25},
                ${100 + Math.sin(time * 1.5) * 15} ${50 + Math.cos(time * 1.1) * 30}
              T ${180 + Math.cos(time) * 10} ${65 + Math.sin(time * 0.9) * 20}`}
          stroke="url(#green-blue)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          opacity={isHovered ? '0.85' : '0.6'}
          filter="url(#glow)"
          className="transition-opacity duration-500"
        />

        <path
          d={`M ${30 + Math.cos(time) * 10} ${70 + Math.cos(time * 1.1) * 18}
              Q ${70 + Math.sin(time * 0.9) * 18} ${50 + Math.cos(time * 1.2) * 28},
                ${110 + Math.cos(time * 1.3) * 12} ${60 + Math.sin(time * 0.7) * 32}
              T ${170 + Math.sin(time) * 10} ${75 + Math.cos(time * 1.1) * 22}`}
          stroke="url(#purple-pink)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          opacity={isHovered ? '0.75' : '0.5'}
          filter="url(#glow)"
          className="transition-opacity duration-500"
        />

        <path
          d={`M ${15 + Math.sin(time * 0.8) * 8} ${80 + Math.sin(time * 0.9) * 12}
              Q ${55 + Math.cos(time * 1.1) * 15} ${55 + Math.sin(time) * 20},
                ${95 + Math.sin(time * 1.2) * 10} ${65 + Math.cos(time * 0.8) * 25}
              T ${185 + Math.cos(time * 0.9) * 8} ${85 + Math.sin(time * 1.3) * 15}`}
          stroke="url(#green-blue)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          opacity={isHovered ? '0.7' : '0.45'}
          filter="url(#glow)"
          className="transition-opacity duration-500"
        />

        {/* Accent sparkle ribbons */}
        <path
          d={`M ${25 + Math.cos(time * 1.4) * 12} ${55 + Math.cos(time) * 10}
              Q ${65 + Math.sin(time * 1.1) * 15} ${35 + Math.cos(time * 0.9) * 18},
                ${105 + Math.cos(time * 1.2) * 10} ${45 + Math.sin(time * 1.3) * 20}
              T ${175 + Math.sin(time * 0.8) * 12} ${60 + Math.cos(time * 1.1) * 15}`}
          stroke="#FFD700"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity={isHovered ? '0.6' : '0.3'}
          filter="url(#glow)"
          className="transition-opacity duration-500"
        />

        {/* Center focal point - responsive to mouse */}
        <g
          style={{
            transform: `translate(${(mousePos.x - 50) * 0.1}px, ${(mousePos.y - 50) * 0.1}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <circle
            cx="100"
            cy="100"
            r={isHovered ? '8' : '6'}
            fill="url(#gold-gradient)"
            filter="url(#glow)"
            className="transition-all duration-300"
          >
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Star rays */}
          <g opacity={isHovered ? '0.9' : '0.6'} className="transition-opacity duration-300">
            <line
              x1="100"
              y1="85"
              x2="100"
              y2="92"
              stroke="#FFD700"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#softGlow)"
            />
            <line
              x1="100"
              y1="108"
              x2="100"
              y2="115"
              stroke="#FFD700"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#softGlow)"
            />
            <line
              x1="85"
              y1="100"
              x2="92"
              y2="100"
              stroke="#FFD700"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#softGlow)"
            />
            <line
              x1="108"
              y1="100"
              x2="115"
              y2="100"
              stroke="#FFD700"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#softGlow)"
            />
          </g>
        </g>

        {/* Floating light particles */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 60 + Math.sin(time + i) * 10;
          const x = 100 + Math.cos(angle + time * 0.3) * radius;
          const y = 100 + Math.sin(angle + time * 0.3) * radius;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill={i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#a366ff' : '#FFD700'}
              opacity="0.6"
              filter="url(#softGlow)"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur={`${2 + (i % 3)}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>
    </div>
  );
}
