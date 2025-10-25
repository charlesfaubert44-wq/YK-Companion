'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function EnhancedPathwayCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Mouse tracking for interactive effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, card: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (hoveredCard === card) {
      setMousePos({ x, y });
    }
  };

  return (
    <div className="relative">
      {/* Beautiful Wrapper with Aurora Flow */}
      <div className="absolute inset-0 -top-20 -bottom-20 -z-10 overflow-hidden">
        {/* Animated Aurora Flow connecting the sections */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 50% 50%, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 40%, rgba(167, 139, 250, 0.15) 70%, transparent 100%)',
            animation: 'aurora-flow 8s ease-in-out infinite',
          }}
        />

        {/* Flowing particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                background: i % 3 === 0 ? 'rgba(16, 185, 129, 0.4)' : i % 3 === 1 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(167, 139, 250, 0.4)',
                animation: `float-particle ${10 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Vertical connecting lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-aurora-green/30 to-transparent"
            style={{
              animation: 'flow-down 3s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Three Ultra-Premium Pathway Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* VISITING Card - Abstract Interactive Aurora */}
        <Link href="/visiting" className="group">
          <div
            className="relative h-96 rounded-3xl overflow-hidden transform-gpu transition-all duration-700 cursor-pointer"
            style={{
              transform: hoveredCard === 'visiting' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: hoveredCard === 'visiting'
                ? '0 40px 80px -12px rgba(16, 185, 129, 0.6), 0 0 80px rgba(16, 185, 129, 0.4)'
                : '0 25px 50px -12px rgba(16, 185, 129, 0.3)',
            }}
            onMouseEnter={() => setHoveredCard('visiting')}
            onMouseLeave={() => setHoveredCard(null)}
            onMouseMove={(e) => handleMouseMove(e, 'visiting')}
          >
            {/* Border */}
            <div className="absolute inset-0 rounded-3xl border-4 border-emerald-400/60 group-hover:border-emerald-300/90 transition-all duration-500" />

            {/* Pure Abstract Aurora Layers */}
            <div className="absolute inset-0">
              {/* Deep gradient base */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950" />

              {/* Interactive flowing aurora layers */}
              <div className="absolute inset-0">
                {/* Mouse-reactive emerald wave */}
                <div
                  className="absolute w-full h-full opacity-75 group-hover:opacity-100 transition-all duration-1000"
                  style={{
                    background: `radial-gradient(ellipse 160% 110% at ${hoveredCard === 'visiting' ? mousePos.x : 50}% ${hoveredCard === 'visiting' ? mousePos.y * 0.5 : 25}%, rgba(16, 185, 129, 1) 0%, rgba(52, 211, 153, 0.8) 18%, rgba(167, 243, 208, 0.5) 40%, transparent 85%)`,
                    filter: 'blur(70px)',
                    animation: 'aurora-wave-fluid 8s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Electric blue flow */}
                <div
                  className="absolute w-full h-full opacity-70 group-hover:opacity-95 transition-all duration-800"
                  style={{
                    background: `radial-gradient(ellipse 140% 90% at ${100 - (hoveredCard === 'visiting' ? mousePos.x : 50)}% 20%, rgba(59, 130, 246, 1) 0%, rgba(96, 165, 250, 0.7) 25%, rgba(147, 197, 253, 0.4) 55%, transparent 85%)`,
                    filter: 'blur(65px)',
                    animation: 'aurora-wave-fluid 11s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Purple accent */}
                <div
                  className="absolute w-full h-full opacity-65 group-hover:opacity-90 transition-all duration-700"
                  style={{
                    background: 'radial-gradient(ellipse 120% 75% at 30% 30%, rgba(168, 85, 247, 0.9) 0%, rgba(192, 132, 252, 0.6) 30%, transparent 75%)',
                    filter: 'blur(60px)',
                    animation: 'aurora-wave-fluid 13s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Magenta burst */}
                <div
                  className="absolute w-full h-full opacity-60 group-hover:opacity-85 transition-all duration-600"
                  style={{
                    background: 'radial-gradient(ellipse 100% 65% at 75% 35%, rgba(236, 72, 153, 0.85) 0%, rgba(244, 114, 182, 0.5) 35%, transparent 70%)',
                    filter: 'blur(55px)',
                    animation: 'aurora-wave-fluid 9s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Cyan shimmer */}
                <div
                  className="absolute w-full h-full opacity-55 group-hover:opacity-80 transition-all duration-500"
                  style={{
                    background: 'radial-gradient(ellipse 90% 55% at 60% 25%, rgba(6, 182, 212, 0.8) 0%, rgba(34, 211, 238, 0.5) 32%, transparent 68%)',
                    filter: 'blur(50px)',
                    animation: 'aurora-wave-fluid 10s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Warm yellow glow */}
                <div
                  className="absolute w-full h-full opacity-50 group-hover:opacity-75 transition-all duration-450"
                  style={{
                    background: 'radial-gradient(ellipse 80% 45% at 45% 28%, rgba(250, 204, 21, 0.7) 0%, rgba(252, 211, 77, 0.4) 30%, transparent 65%)',
                    filter: 'blur(45px)',
                    animation: 'aurora-wave-fluid 14s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>

              {/* Light particles */}
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${0.5 + Math.random() * 4}px`,
                    height: `${0.5 + Math.random() * 4}px`,
                    background: i % 4 === 0 ? '#10b981' : i % 4 === 1 ? '#3b82f6' : i % 4 === 2 ? '#a855f7' : '#ec4899',
                    opacity: 0.3 + Math.random() * 0.7,
                    boxShadow: `0 0 ${4 + Math.random() * 8}px currentColor`,
                    animation: `twinkle-varied ${1.5 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 4}s`,
                  }}
                />
              ))}

              {/* Title */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3
                  className="text-5xl md:text-6xl font-black text-white group-hover:scale-110 transition-all duration-500"
                  style={{
                    textShadow: '0 0 80px rgba(16, 185, 129, 1), 0 0 40px rgba(52, 211, 153, 0.8), 6px 6px 0px rgba(15, 23, 42, 0.95)',
                    letterSpacing: '0.08em',
                  }}
                >
                  VISITING
                </h3>
              </div>
            </div>
          </div>
        </Link>

        {/* LIVING Card - Abstract Warm Aurora */}
        <Link href="/living" className="group">
          <div
            className="relative h-96 rounded-3xl overflow-hidden transform-gpu transition-all duration-700 cursor-pointer"
            style={{
              transform: hoveredCard === 'living' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: hoveredCard === 'living'
                ? '0 40px 80px -12px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.4)'
                : '0 25px 50px -12px rgba(59, 130, 246, 0.3)',
            }}
            onMouseEnter={() => setHoveredCard('living')}
            onMouseLeave={() => setHoveredCard(null)}
            onMouseMove={(e) => handleMouseMove(e, 'living')}
          >
            {/* Border */}
            <div className="absolute inset-0 rounded-3xl border-4 border-blue-400/60 group-hover:border-blue-300/90 transition-all duration-500" />

            {/* Pure Abstract Aurora Layers */}
            <div className="absolute inset-0">
              {/* Deep gradient base */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-blue-950" />

              {/* Interactive flowing aurora layers */}
              <div className="absolute inset-0">
                {/* Mouse-reactive blue wave */}
                <div
                  className="absolute w-full h-full opacity-80 group-hover:opacity-100 transition-all duration-1000"
                  style={{
                    background: `radial-gradient(ellipse 155% 105% at ${hoveredCard === 'living' ? mousePos.x : 50}% ${hoveredCard === 'living' ? mousePos.y * 0.6 : 30}%, rgba(59, 130, 246, 1) 0%, rgba(96, 165, 250, 0.8) 20%, rgba(147, 197, 253, 0.5) 45%, transparent 85%)`,
                    filter: 'blur(70px)',
                    animation: 'aurora-wave-fluid 9s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Warm orange flow */}
                <div
                  className="absolute w-full h-full opacity-70 group-hover:opacity-90 transition-all duration-850"
                  style={{
                    background: `radial-gradient(ellipse 130% 85% at ${100 - (hoveredCard === 'living' ? mousePos.x : 50)}% 35%, rgba(251, 146, 60, 0.95) 0%, rgba(251, 191, 36, 0.7) 28%, rgba(252, 211, 77, 0.4) 55%, transparent 80%)`,
                    filter: 'blur(65px)',
                    animation: 'aurora-wave-fluid 12s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Teal accent */}
                <div
                  className="absolute w-full h-full opacity-65 group-hover:opacity-85 transition-all duration-700"
                  style={{
                    background: 'radial-gradient(ellipse 110% 70% at 70% 25%, rgba(20, 184, 166, 0.85) 0%, rgba(45, 212, 191, 0.6) 32%, transparent 72%)',
                    filter: 'blur(60px)',
                    animation: 'aurora-wave-fluid 14s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Emerald warmth */}
                <div
                  className="absolute w-full h-full opacity-60 group-hover:opacity-80 transition-all duration-600"
                  style={{
                    background: 'radial-gradient(ellipse 100% 60% at 25% 40%, rgba(16, 185, 129, 0.8) 0%, rgba(52, 211, 153, 0.5) 30%, transparent 70%)',
                    filter: 'blur(55px)',
                    animation: 'aurora-wave-fluid 10s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Rose glow */}
                <div
                  className="absolute w-full h-full opacity-55 group-hover:opacity-75 transition-all duration-500"
                  style={{
                    background: 'radial-gradient(ellipse 90% 50% at 80% 45%, rgba(251, 113, 133, 0.75) 0%, rgba(252, 165, 165, 0.45) 35%, transparent 68%)',
                    filter: 'blur(50px)',
                    animation: 'aurora-wave-fluid 11s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>

              {/* Light particles */}
              {[...Array(90)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${0.5 + Math.random() * 4}px`,
                    height: `${0.5 + Math.random() * 4}px`,
                    background: i % 5 === 0 ? '#3b82f6' : i % 5 === 1 ? '#fb923c' : i % 5 === 2 ? '#14b8a6' : i % 5 === 3 ? '#10b981' : '#fb7185',
                    opacity: 0.3 + Math.random() * 0.7,
                    boxShadow: `0 0 ${4 + Math.random() * 8}px currentColor`,
                    animation: `twinkle-varied ${1.5 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 4}s`,
                  }}
                />
              ))}

              {/* Title */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3
                  className="text-5xl md:text-6xl font-black text-white group-hover:scale-110 transition-all duration-500"
                  style={{
                    textShadow: '0 0 90px rgba(59, 130, 246, 1), 0 0 50px rgba(251, 146, 60, 0.9), 6px 6px 0px rgba(15, 23, 42, 0.95)',
                    letterSpacing: '0.08em',
                  }}
                >
                  LIVING
                </h3>
              </div>
            </div>
          </div>
        </Link>

        {/* MOVING Card - Abstract Twilight Aurora */}
        <Link href="/moving" className="group">
          <div
            className="relative h-96 rounded-3xl overflow-hidden transform-gpu transition-all duration-700 cursor-pointer"
            style={{
              transform: hoveredCard === 'moving' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: hoveredCard === 'moving'
                ? '0 40px 80px -12px rgba(167, 139, 250, 0.6), 0 0 80px rgba(167, 139, 250, 0.4)'
                : '0 25px 50px -12px rgba(167, 139, 250, 0.3)',
            }}
            onMouseEnter={() => setHoveredCard('moving')}
            onMouseLeave={() => setHoveredCard(null)}
            onMouseMove={(e) => handleMouseMove(e, 'moving')}
          >
            {/* Border */}
            <div className="absolute inset-0 rounded-3xl border-4 border-purple-400/60 group-hover:border-purple-300/90 transition-all duration-500" />

            {/* Pure Abstract Aurora Layers */}
            <div className="absolute inset-0">
              {/* Deep gradient base */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-pink-950 to-orange-900" />

              {/* Interactive flowing aurora layers */}
              <div className="absolute inset-0">
                {/* Mouse-reactive purple wave */}
                <div
                  className="absolute w-full h-full opacity-75 group-hover:opacity-100 transition-all duration-1000"
                  style={{
                    background: `radial-gradient(ellipse 150% 100% at ${hoveredCard === 'moving' ? mousePos.x : 50}% ${hoveredCard === 'moving' ? mousePos.y * 0.5 : 20}%, rgba(168, 85, 247, 1) 0%, rgba(192, 132, 252, 0.8) 22%, rgba(216, 180, 254, 0.5) 48%, transparent 85%)`,
                    filter: 'blur(70px)',
                    animation: 'aurora-wave-fluid 10s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Magenta flow */}
                <div
                  className="absolute w-full h-full opacity-70 group-hover:opacity-92 transition-all duration-850"
                  style={{
                    background: `radial-gradient(ellipse 135% 90% at ${100 - (hoveredCard === 'moving' ? mousePos.x : 50)}% 30%, rgba(236, 72, 153, 0.95) 0%, rgba(244, 114, 182, 0.7) 28%, rgba(251, 207, 232, 0.4) 58%, transparent 82%)`,
                    filter: 'blur(65px)',
                    animation: 'aurora-wave-fluid 13s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Warm orange horizon */}
                <div
                  className="absolute w-full h-full opacity-65 group-hover:opacity-85 transition-all duration-750"
                  style={{
                    background: 'radial-gradient(ellipse 125% 60% at 50% 75%, rgba(249, 115, 22, 0.9) 0%, rgba(251, 146, 60, 0.65) 30%, transparent 75%)',
                    filter: 'blur(60px)',
                    animation: 'aurora-wave-fluid 15s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Fuchsia accent */}
                <div
                  className="absolute w-full h-full opacity-60 group-hover:opacity-80 transition-all duration-650"
                  style={{
                    background: 'radial-gradient(ellipse 105% 65% at 75% 28%, rgba(217, 70, 239, 0.8) 0%, rgba(232, 121, 249, 0.55) 32%, transparent 70%)',
                    filter: 'blur(55px)',
                    animation: 'aurora-wave-fluid 11s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Amber warmth */}
                <div
                  className="absolute w-full h-full opacity-55 group-hover:opacity-75 transition-all duration-550"
                  style={{
                    background: 'radial-gradient(ellipse 95% 50% at 25% 65%, rgba(245, 158, 11, 0.75) 0%, rgba(251, 191, 36, 0.48) 35%, transparent 68%)',
                    filter: 'blur(50px)',
                    animation: 'aurora-wave-fluid 12s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>

              {/* Light particles */}
              {[...Array(85)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${0.5 + Math.random() * 4}px`,
                    height: `${0.5 + Math.random() * 4}px`,
                    background: i % 5 === 0 ? '#a855f7' : i % 5 === 1 ? '#ec4899' : i % 5 === 2 ? '#f97316' : i % 5 === 3 ? '#d946ef' : '#f59e0b',
                    opacity: 0.3 + Math.random() * 0.7,
                    boxShadow: `0 0 ${4 + Math.random() * 8}px currentColor`,
                    animation: `twinkle-varied ${1.5 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 4}s`,
                  }}
                />
              ))}

              {/* Title */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3
                  className="text-5xl md:text-6xl font-black text-white group-hover:scale-110 transition-all duration-500"
                  style={{
                    textShadow: '0 0 80px rgba(168, 85, 247, 1), 0 0 40px rgba(236, 72, 153, 0.8), 6px 6px 0px rgba(15, 23, 42, 0.95)',
                    letterSpacing: '0.08em',
                  }}
                >
                  MOVING
                </h3>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes aurora-flow {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.5; }
        }

        @keyframes float-particle {
          0% { transform: translateY(100%) translateX(0) scale(0); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-100%) translateX(${Math.random() * 40 - 20}px) scale(1); opacity: 0; }
        }

        @keyframes flow-down {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }

        @keyframes aurora-wave-fluid {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translateX(15px) translateY(-8px) scale(1.03) rotate(1deg);
            opacity: 0.9;
          }
          50% {
            transform: translateX(10px) translateY(5px) scale(1.06) rotate(-0.5deg);
            opacity: 1;
          }
          75% {
            transform: translateX(-8px) translateY(-3px) scale(1.02) rotate(0.8deg);
            opacity: 0.95;
          }
        }

        @keyframes twinkle-varied {
          0%, 100% { opacity: 0.2; transform: scale(1) rotate(0deg); }
          25% { opacity: 0.6; transform: scale(1.3) rotate(90deg); }
          50% { opacity: 1; transform: scale(1.6) rotate(180deg); }
          75% { opacity: 0.6; transform: scale(1.3) rotate(270deg); }
        }
      `}</style>
    </div>
  );
}
