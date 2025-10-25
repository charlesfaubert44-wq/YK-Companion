'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function EnhancedPathwayCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [planeOffset, setPlaneOffset] = useState(0);
  const visitingCardRef = useRef<HTMLDivElement>(null);

  // Continuous plane animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaneOffset(prev => (prev + 0.5) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for interactive aurora
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!visitingCardRef.current) return;
    const rect = visitingCardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
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
      <div className="grid md:grid-cols-3 gap-8 perspective-1000">
        {/* VISITING Card - Robbie Craig Style: Plane Flying in Auroras */}
        <Link href="/visiting" className="group">
          <div
            ref={visitingCardRef}
            className="relative h-96 rounded-3xl overflow-hidden transform-gpu transition-all duration-700 cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              transform: hoveredCard === 'visiting' ? 'rotateY(-5deg) rotateX(5deg) scale(1.05)' : 'rotateY(0deg) rotateX(0deg) scale(1)',
              boxShadow: hoveredCard === 'visiting'
                ? '0 40px 80px -12px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.3), inset 0 0 60px rgba(16, 185, 129, 0.1)'
                : '0 25px 50px -12px rgba(16, 185, 129, 0.25)',
            }}
            onMouseEnter={() => setHoveredCard('visiting')}
            onMouseLeave={() => setHoveredCard(null)}
            onMouseMove={handleMouseMove}
          >
            {/* Glassmorphic Border with Bold Outline */}
            <div className="absolute inset-0 rounded-3xl border-4 border-emerald-400/50 group-hover:border-emerald-300/70 transition-all duration-500" />

            {/* Background Layers - Robbie Craig Style */}
            <div className="absolute inset-0">
              {/* Deep Night Sky with Bold Gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, #0a0e27 0%, #1a1347 30%, #2d1b69 60%, #1e0a3c 100%)',
                  transform: hoveredCard === 'visiting' ? 'translateZ(-20px) scale(1.05)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              />

              {/* Vibrant Multi-Color Aurora Curtains - Bold & Fluid */}
              <div
                className="absolute inset-0"
                style={{
                  transform: hoveredCard === 'visiting' ? 'translateZ(10px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                {/* Emerald green curtain */}
                <div
                  className="absolute w-full h-full opacity-70 group-hover:opacity-95 transition-all duration-1000"
                  style={{
                    background: `radial-gradient(ellipse 140% 95% at ${mousePos.x}% ${Math.max(10, mousePos.y * 0.3)}%, rgba(16, 185, 129, 0.95) 0%, rgba(52, 211, 153, 0.75) 20%, rgba(167, 243, 208, 0.4) 45%, transparent 85%)`,
                    filter: 'blur(60px)',
                    animation: 'aurora-wave-fluid 7s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Electric blue wave */}
                <div
                  className="absolute w-full h-full opacity-60 group-hover:opacity-85 transition-all duration-700"
                  style={{
                    background: 'radial-gradient(ellipse 120% 80% at 70% 15%, rgba(59, 130, 246, 0.9) 0%, rgba(96, 165, 250, 0.6) 25%, rgba(147, 197, 253, 0.3) 50%, transparent 80%)',
                    filter: 'blur(55px)',
                    animation: 'aurora-wave-fluid 9s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Vivid purple accent */}
                <div
                  className="absolute w-full h-full opacity-55 group-hover:opacity-80 transition-all duration-500"
                  style={{
                    background: 'radial-gradient(ellipse 100% 70% at 25% 20%, rgba(168, 85, 247, 0.8) 0%, rgba(192, 132, 252, 0.5) 30%, transparent 70%)',
                    filter: 'blur(50px)',
                    animation: 'aurora-wave-fluid 11s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Magenta splash */}
                <div
                  className="absolute w-full h-full opacity-45 group-hover:opacity-70 transition-all duration-600"
                  style={{
                    background: 'radial-gradient(ellipse 90% 60% at 85% 25%, rgba(236, 72, 153, 0.7) 0%, rgba(244, 114, 182, 0.4) 35%, transparent 70%)',
                    filter: 'blur(48px)',
                    animation: 'aurora-wave-fluid 8s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Cyan streak */}
                <div
                  className="absolute w-full h-full opacity-50 group-hover:opacity-75 transition-all duration-500"
                  style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% 18%, rgba(6, 182, 212, 0.75) 0%, rgba(34, 211, 238, 0.45) 30%, transparent 65%)',
                    filter: 'blur(45px)',
                    animation: 'aurora-wave-fluid 10s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Warm yellow glow */}
                <div
                  className="absolute w-full h-full opacity-35 group-hover:opacity-60 transition-all duration-400"
                  style={{
                    background: 'radial-gradient(ellipse 70% 40% at 40% 22%, rgba(250, 204, 21, 0.6) 0%, rgba(252, 211, 77, 0.35) 28%, transparent 60%)',
                    filter: 'blur(42px)',
                    animation: 'aurora-wave-fluid 13s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>

              {/* Enhanced Twinkling Stars with Varied Sizes */}
              {[...Array(80)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 65}%`,
                    width: `${0.3 + Math.random() * 3}px`,
                    height: `${0.3 + Math.random() * 3}px`,
                    opacity: 0.2 + Math.random() * 0.8,
                    boxShadow: `0 0 ${2 + Math.random() * 6}px rgba(255,255,255,${0.4 + Math.random() * 0.6})`,
                    animation: `twinkle-varied ${1 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 4}s`,
                    transform: hoveredCard === 'visiting' ? `translateZ(${5 + Math.random() * 20}px)` : 'translateZ(0px)',
                    transition: 'transform 0.7s ease-out',
                  }}
                />
              ))}

              {/* Animated Bush Plane Flying Through Auroras - Bold Graphic Style */}
              <div
                className="absolute transition-all duration-300"
                style={{
                  left: `${planeOffset}%`,
                  top: `${35 + Math.sin(planeOffset * 0.08) * 15}%`,
                  transform: hoveredCard === 'visiting'
                    ? `translateZ(35px) scale(1.3) rotate(${Math.sin(planeOffset * 0.05) * 5}deg)`
                    : `translateZ(0px) scale(1.1) rotate(${Math.sin(planeOffset * 0.05) * 3}deg)`,
                  filter: hoveredCard === 'visiting'
                    ? 'drop-shadow(0 0 40px rgba(16, 185, 129, 0.9)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.7))'
                    : 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                }}
              >
                <svg width="130" height="65" viewBox="0 0 130 65" className="opacity-90 group-hover:opacity-100 transition-opacity">
                  {/* Bold Graphic Motion Trails */}
                  <path d="M0,32 Q20,28 40,32" stroke="#10b981" strokeWidth="6" fill="none" opacity="0.4" strokeLinecap="round">
                    <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" repeatCount="indefinite"/>
                  </path>
                  <path d="M5,32 Q25,30 45,32" stroke="#3b82f6" strokeWidth="5" fill="none" opacity="0.5" strokeLinecap="round">
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" begin="0.3s"/>
                  </path>
                  <path d="M10,32 Q30,31 50,32" stroke="#a855f7" strokeWidth="4" fill="none" opacity="0.3" strokeLinecap="round">
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
                  </path>

                  {/* Bold Plane Silhouette with Graphic Lines */}
                  <g>
                    {/* Main fuselage - bold and graphic */}
                    <ellipse cx="55" cy="32" rx="26" ry="10" fill="#1e293b" stroke="#10b981" strokeWidth="3"/>
                    <ellipse cx="55" cy="32" rx="24" ry="8" fill="#334155"/>

                    {/* Cockpit with bold outline */}
                    <ellipse cx="70" cy="32" rx="10" ry="7" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5"/>
                    <ellipse cx="73" cy="32" rx="6" ry="5" fill="rgba(147, 197, 253, 0.5)" stroke="#60a5fa" strokeWidth="2"/>

                    {/* Bold wings */}
                    <ellipse cx="55" cy="32" rx="52" ry="4" fill="#1e293b" stroke="#10b981" strokeWidth="3" opacity="0.95"/>
                    <ellipse cx="55" cy="32" rx="50" ry="2.5" fill="#334155" opacity="0.9"/>

                    {/* Tail with bold lines */}
                    <path d="M32,32 L22,22 L28,32 L22,42 Z" fill="#1e293b" stroke="#a855f7" strokeWidth="2.5"/>
                    <path d="M33,32 L25,24 L29,32 L25,40 Z" fill="#334155"/>

                    {/* Engine with glow */}
                    <circle cx="78" cy="32" r="4" fill="#475569" stroke="#fbbf24" strokeWidth="2"/>
                    <circle cx="78" cy="32" r="2" fill="#fcd34d">
                      <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite"/>
                    </circle>

                    {/* Bold pontoons */}
                    <ellipse cx="60" cy="42" rx="18" ry="3" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" opacity="0.85"/>
                    <ellipse cx="48" cy="42" rx="15" ry="2.5" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" opacity="0.85"/>
                  </g>

                  {/* Aurora glow behind plane */}
                  <ellipse cx="60" cy="32" rx="45" ry="25" fill="url(#planeGlow)" opacity="0.6"/>
                  <defs>
                    <radialGradient id="planeGlow">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Bold Graphic Mountain Silhouettes - Impressionistic Style */}
              <svg
                viewBox="0 0 400 140"
                className="absolute bottom-0 w-full h-40"
                preserveAspectRatio="none"
                style={{
                  transform: hoveredCard === 'visiting' ? 'translateZ(15px) scale(1.02)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                <defs>
                  <linearGradient id="mountain-bold-v1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0a0e27" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="mountain-bold-v2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="mountain-bold-v3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#334155" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#1e293b" stopOpacity="1" />
                  </linearGradient>
                </defs>
                {/* Far mountains with bold shapes */}
                <path d="M0,85 L95,50 L175,62 L245,45 L315,58 L400,68 L400,140 L0,140 Z" fill="url(#mountain-bold-v1)" stroke="#10b981" strokeWidth="2" opacity="0.6"/>
                {/* Mid mountains with definition */}
                <path d="M0,95 L75,60 L135,72 L195,55 L255,68 L315,62 L400,78 L400,140 L0,140 Z" fill="url(#mountain-bold-v2)" stroke="#3b82f6" strokeWidth="2.5" opacity="0.75"/>
                {/* Near mountains with bold outline */}
                <path d="M0,105 L55,70 L115,82 L175,65 L235,78 L295,72 L355,82 L400,88 L400,140 L0,140 Z" fill="url(#mountain-bold-v3)" stroke="#a855f7" strokeWidth="3" opacity="0.9"/>
                {/* Bold snow caps with vibrant colors */}
                <path d="M95,50 L105,56 L115,54 L125,58 L115,62" fill="#f0f9ff" stroke="#06b6d4" strokeWidth="2" opacity="0.8"/>
                <path d="M195,55 L205,61 L215,59 L225,63 L215,67" fill="#fef3c7" stroke="#fbbf24" strokeWidth="2" opacity="0.8"/>
                <path d="M295,72 L305,78 L315,76 L325,80 L315,84" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" opacity="0.7"/>
              </svg>

              {/* Title with Ultra-Enhanced Glow */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: hoveredCard === 'visiting' ? 'translateZ(40px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                <h3
                  className="text-5xl md:text-6xl font-black text-white group-hover:scale-110 transition-all duration-500"
                  style={{
                    textShadow: '0 0 80px rgba(16, 185, 129, 1), 0 0 40px rgba(52, 211, 153, 0.8), 0 0 20px rgba(167, 243, 208, 0.6), 6px 6px 0px rgba(15, 23, 42, 0.95), 10px 10px 0px rgba(15, 23, 42, 0.4)',
                    letterSpacing: '0.08em',
                  }}
                >
                  VISITING
                </h3>
              </div>

              {/* Atmospheric Vignette and Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-indigo-950/30 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40 pointer-events-none" />

              {/* Glassmorphic overlay on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-cyan-500/0 to-purple-500/0 group-hover:from-emerald-500/10 group-hover:via-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-700 pointer-events-none"
                style={{
                  backdropFilter: hoveredCard === 'visiting' ? 'blur(0.5px)' : 'blur(0px)',
                }}
              />
            </div>
          </div>
        </Link>

        {/* LIVING Card */}
        <Link href="/living" className="group">
          <div
            className="relative h-96 rounded-3xl overflow-hidden transform-gpu transition-all duration-700 cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              transform: hoveredCard === 'living' ? 'rotateY(-5deg) rotateX(5deg) scale(1.05)' : 'rotateY(0deg) rotateX(0deg) scale(1)',
              boxShadow: hoveredCard === 'living'
                ? '0 40px 80px -12px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3), inset 0 0 60px rgba(59, 130, 246, 0.1)'
                : '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
            }}
            onMouseEnter={() => setHoveredCard('living')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Glassmorphic Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/40 group-hover:border-blue-300/60 transition-all duration-500" />

            {/* Background Layers with Parallax */}
            <div className="absolute inset-0">
              {/* Deep Night Sky */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-950 to-blue-950"
                style={{
                  transform: hoveredCard === 'living' ? 'translateZ(-20px) scale(1.05)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              />

              {/* Magnificent Aurora - Dominant Feature */}
              <div
                className="absolute inset-0"
                style={{
                  transform: hoveredCard === 'living' ? 'translateZ(10px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                {/* Main emerald aurora curtain */}
                <div
                  className="absolute w-full h-full opacity-70 group-hover:opacity-100 transition-all duration-1000"
                  style={{
                    background: 'radial-gradient(ellipse 150% 95% at 50% 12%, rgba(16, 185, 129, 0.95) 0%, rgba(52, 211, 153, 0.7) 18%, rgba(167, 243, 208, 0.4) 40%, transparent 80%)',
                    filter: 'blur(70px)',
                    animation: 'aurora-wave 7s ease-in-out infinite',
                  }}
                />
                {/* Vibrant blue aurora layer */}
                <div
                  className="absolute w-full h-full opacity-60 group-hover:opacity-90 transition-all duration-700"
                  style={{
                    background: 'radial-gradient(ellipse 110% 75% at 75% 18%, rgba(59, 130, 246, 0.8) 0%, rgba(96, 165, 250, 0.5) 30%, transparent 75%)',
                    filter: 'blur(60px)',
                    animation: 'aurora-wave 9s ease-in-out infinite reverse',
                  }}
                />
                {/* Purple accent */}
                <div
                  className="absolute w-full h-full opacity-45 group-hover:opacity-70 transition-all duration-500"
                  style={{
                    background: 'radial-gradient(ellipse 80% 55% at 20% 22%, rgba(139, 92, 246, 0.6) 0%, rgba(196, 181, 253, 0.3) 35%, transparent 70%)',
                    filter: 'blur(50px)',
                    animation: 'aurora-wave 11s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Twinkling Stars with Depth */}
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 55}%`,
                    width: `${0.5 + Math.random() * 2.2}px`,
                    height: `${0.5 + Math.random() * 2.2}px`,
                    opacity: 0.3 + Math.random() * 0.7,
                    boxShadow: `0 0 ${2 + Math.random() * 4}px rgba(255,255,255,${0.5 + Math.random() * 0.5})`,
                    animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`,
                    transform: hoveredCard === 'living' ? `translateZ(${5 + Math.random() * 15}px)` : 'translateZ(0px)',
                    transition: 'transform 0.7s ease-out',
                  }}
                />
              ))}

              {/* Distant Yellowknife City Lights - Enhanced */}
              <div
                className="absolute bottom-36 left-0 right-0 h-10 opacity-65 group-hover:opacity-85 transition-opacity duration-700"
                style={{
                  transform: hoveredCard === 'living' ? 'translateZ(20px) scale(1.05)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                {/* City skyline with warm lights */}
                {[...Array(18)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bottom-0 transition-all duration-700"
                    style={{
                      left: `${12 + i * 4.5}%`,
                      width: `${6 + Math.random() * 14}px`,
                      height: `${3 + Math.random() * 12}px`,
                      background: 'linear-gradient(to top, rgba(251, 191, 36, 0.85), rgba(251, 191, 36, 0.4))',
                      boxShadow: '0 0 12px rgba(251, 191, 36, 0.7)',
                      borderRadius: '1px 1px 0 0',
                    }}
                  >
                    {/* Windows */}
                    {Math.random() > 0.6 && (
                      <div
                        className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-200 opacity-80"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Great Slave Lake - Frozen Surface with Enhanced Detail */}
              <div
                className="absolute bottom-0 left-0 right-0 h-36"
                style={{
                  transform: hoveredCard === 'living' ? 'translateZ(25px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                <svg viewBox="0 0 400 145" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lake-ice-grad-l" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.35" />
                      <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="snow-grad-lake-l" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#dbeafe" stopOpacity="1" />
                    </linearGradient>
                    <radialGradient id="ice-shine-l">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* Ice surface with gentle waves */}
                  <path d="M0,45 Q100,38 200,48 T400,42 L400,145 L0,145 Z" fill="url(#lake-ice-grad-l)"/>
                  {/* Snow patches */}
                  <path d="M0,62 Q120,52 240,65 T400,58 L400,145 L0,145 Z" fill="url(#snow-grad-lake-l)"/>
                  {/* Ice reflections */}
                  <ellipse cx="150" cy="75" rx="60" ry="15" fill="url(#ice-shine-l)" opacity="0.3"/>
                  <ellipse cx="300" cy="80" rx="50" ry="12" fill="url(#ice-shine-l)" opacity="0.25"/>
                  {/* Ice cracks - detailed */}
                  <path d="M80,55 Q95,80 110,145" stroke="#93c5fd" strokeWidth="1.2" opacity="0.25" fill="none"/>
                  <path d="M220,50 Q235,75 250,145" stroke="#93c5fd" strokeWidth="1.2" opacity="0.25" fill="none"/>
                  <line x1="150" y1="60" x2="180" y2="145" stroke="#93c5fd" strokeWidth="0.8" opacity="0.2"/>
                </svg>

                {/* Enhanced Ice Fishing Hut */}
                <div
                  className="absolute bottom-16 left-20 group-hover:bottom-18 transition-all duration-700"
                  style={{
                    transform: hoveredCard === 'living' ? 'translateZ(35px) scale(1.1)' : 'translateZ(0px)',
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))',
                  }}
                >
                  <svg width="60" height="42" viewBox="0 0 60 42">
                    {/* Shadow */}
                    <ellipse cx="30" cy="40" rx="25" ry="3" fill="#000" opacity="0.3"/>
                    {/* Hut body */}
                    <rect x="8" y="18" width="44" height="22" fill="#dc2626" stroke="#991b1b" strokeWidth="2" rx="2"/>
                    {/* Roof */}
                    <path d="M5,18 L30,8 L55,18 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5"/>
                    {/* Window with warm glow */}
                    <rect x="22" y="23" width="16" height="12" fill="#fef08a" opacity="0.95" rx="1.5" stroke="#fbbf24" strokeWidth="1"/>
                    <rect x="24" y="25" width="5" height="5" fill="#fef9c3" opacity="0.8"/>
                    {/* Door */}
                    <rect x="12" y="26" width="8" height="14" fill="#7f1d1d" rx="1"/>
                    <circle cx="18" cy="33" r="0.8" fill="#fbbf24"/>
                    {/* Chimney */}
                    <rect x="40" y="10" width="4" height="8" fill="#4a5568" stroke="#1e293b" strokeWidth="1"/>
                    {/* Smoke */}
                    <circle cx="42" cy="6" r="2" fill="#cbd5e1" opacity="0.4">
                      <animate attributeName="cy" values="6;3;6" dur="3s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>

                {/* Enhanced Person Walking Dog */}
                <div
                  className="absolute bottom-18 right-28 group-hover:right-24 transition-all duration-1000"
                  style={{
                    transform: hoveredCard === 'living' ? 'translateZ(30px) scale(1.08)' : 'translateZ(0px)',
                    filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))',
                  }}
                >
                  <svg width="70" height="35" viewBox="0 0 70 35">
                    {/* Person with more detail */}
                    <ellipse cx="28" cy="9" rx="4.5" ry="5.5" fill="#1e293b" opacity="0.95"/>
                    <rect x="24.5" y="13.5" width="7" height="14" fill="#1e293b" opacity="0.95" rx="1.5"/>
                    {/* Arms */}
                    <line x1="25" y1="18" x2="22" y2="24" stroke="#1e293b" strokeWidth="2.5" opacity="0.95" strokeLinecap="round"/>
                    <line x1="31" y1="18" x2="34" y2="24" stroke="#1e293b" strokeWidth="2.5" opacity="0.95" strokeLinecap="round"/>
                    {/* Legs */}
                    <line x1="26" y1="27" x2="23" y2="33" stroke="#1e293b" strokeWidth="2.5" opacity="0.95" strokeLinecap="round"/>
                    <line x1="30" y1="27" x2="33" y2="33" stroke="#1e293b" strokeWidth="2.5" opacity="0.95" strokeLinecap="round"/>

                    {/* Dog with more detail */}
                    <ellipse cx="50" cy="22" rx="6" ry="4.5" fill="#334155" opacity="0.9"/>
                    <ellipse cx="54" cy="20" rx="3.5" ry="3.5" fill="#334155" opacity="0.9"/>
                    <path d="M54,18 L56,16" stroke="#334155" strokeWidth="1.5" opacity="0.9" strokeLinecap="round"/>
                    <path d="M57,18 L59,16" stroke="#334155" strokeWidth="1.5" opacity="0.9" strokeLinecap="round"/>
                    {/* Legs */}
                    <line x1="46" y1="25" x2="44" y2="30" stroke="#334155" strokeWidth="2" opacity="0.9" strokeLinecap="round"/>
                    <line x1="49" y1="25" x2="48" y2="30" stroke="#334155" strokeWidth="2" opacity="0.9" strokeLinecap="round"/>
                    <line x1="51" y1="25" x2="52" y2="30" stroke="#334155" strokeWidth="2" opacity="0.9" strokeLinecap="round"/>
                    <line x1="54" y1="23" x2="56" y2="28" stroke="#334155" strokeWidth="2" opacity="0.9" strokeLinecap="round"/>
                    {/* Tail */}
                    <path d="M46,21 Q43,18 44,15" stroke="#334155" strokeWidth="2" opacity="0.9" fill="none" strokeLinecap="round"/>

                    {/* Leash */}
                    <path d="M31,19 Q40,21 48,21" stroke="#64748b" strokeWidth="1.5" opacity="0.8" fill="none"/>
                  </svg>
                </div>

                {/* Enhanced Friends Group */}
                <div
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 group-hover:bottom-22 group-hover:scale-110 transition-all duration-700"
                  style={{
                    transform: hoveredCard === 'living' ? 'translateZ(32px) scale(1.1)' : 'translateZ(0px) scale(1)',
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))',
                  }}
                >
                  <svg width="80" height="40" viewBox="0 0 80 40">
                    {/* Person 1 */}
                    <ellipse cx="23" cy="13" rx="4.5" ry="5.5" fill="#1e293b" opacity="0.9"/>
                    <rect x="19.5" y="17.5" width="7" height="11" fill="#1e293b" opacity="0.9" rx="1.5"/>

                    {/* Person 2 */}
                    <ellipse cx="40" cy="14" rx="4.5" ry="5.5" fill="#1e293b" opacity="0.9"/>
                    <rect x="36.5" y="18.5" width="7" height="10" fill="#1e293b" opacity="0.9" rx="1.5"/>

                    {/* Person 3 */}
                    <ellipse cx="57" cy="13" rx="4.5" ry="5.5" fill="#1e293b" opacity="0.9"/>
                    <rect x="53.5" y="17.5" width="7" height="11" fill="#1e293b" opacity="0.9" rx="1.5"/>

                    {/* Enhanced campfire */}
                    <circle cx="40" cy="35" r="4" fill="#fbbf24" opacity="0.9">
                      <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="40" cy="32" r="3" fill="#fef08a" opacity="0.95">
                      <animate attributeName="r" values="2.5;3.5;2.5" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <path d="M40,29 Q38,26 37,23" stroke="#fb923c" strokeWidth="1.5" opacity="0.7" fill="none">
                      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.5s" repeatCount="indefinite"/>
                    </path>
                    <path d="M40,29 Q42,26 43,23" stroke="#fb923c" strokeWidth="1.5" opacity="0.7" fill="none">
                      <animate attributeName="opacity" values="0.7;0.9;0.7" dur="1.5s" repeatCount="indefinite" begin="0.3s"/>
                    </path>
                  </svg>
                </div>

                {/* Enhanced Pine Tree */}
                <div
                  className="absolute bottom-28 left-12 opacity-60 group-hover:opacity-75 transition-opacity duration-700"
                  style={{
                    transform: hoveredCard === 'living' ? 'translateZ(25px) scale(1.05)' : 'translateZ(0px)',
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))',
                  }}
                >
                  <svg width="42" height="65" viewBox="0 0 42 65">
                    {/* Trunk */}
                    <rect x="18" y="45" width="6" height="20" fill="#3f2410" stroke="#2d1810" strokeWidth="1"/>
                    {/* Tree layers */}
                    <path d="M21,5 L35,25 L32,25 L42,42 L36,42 L42,58 L0,58 L6,42 L0,42 L10,25 L7,25 Z" fill="#1a3a2a" opacity="0.95"/>
                    {/* Snow on branches */}
                    <path d="M21,5 L28,18 L14,18 Z" fill="#f0f9ff" opacity="0.7"/>
                    <path d="M32,25 L36,35 L28,35 Z" fill="#f0f9ff" opacity="0.6"/>
                  </svg>
                </div>
              </div>

              {/* Title with Ultra-Enhanced Glow */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: hoveredCard === 'living' ? 'translateZ(40px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                <h3
                  className="text-5xl md:text-6xl font-black text-white group-hover:scale-110 transition-all duration-500"
                  style={{
                    textShadow: '0 0 90px rgba(16, 185, 129, 1), 0 0 50px rgba(59, 130, 246, 0.9), 0 0 25px rgba(167, 243, 208, 0.7), 6px 6px 0px rgba(15, 23, 42, 0.95), 10px 10px 0px rgba(15, 23, 42, 0.4)',
                    letterSpacing: '0.08em',
                  }}
                >
                  LIVING
                </h3>
              </div>

              {/* Atmospheric Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-indigo-950/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 pointer-events-none" />

              {/* Glassmorphic overlay on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-emerald-500/0 group-hover:from-blue-500/10 group-hover:via-cyan-500/10 group-hover:to-emerald-500/10 transition-all duration-700 pointer-events-none"
                style={{
                  backdropFilter: hoveredCard === 'living' ? 'blur(0.5px)' : 'blur(0px)',
                }}
              />
            </div>
          </div>
        </Link>

        {/* MOVING Card */}
        <Link href="/moving" className="group">
          <div
            className="relative h-96 rounded-3xl overflow-hidden transform-gpu transition-all duration-700 cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              transform: hoveredCard === 'moving' ? 'rotateY(-5deg) rotateX(5deg) scale(1.05)' : 'rotateY(0deg) rotateX(0deg) scale(1)',
              boxShadow: hoveredCard === 'moving'
                ? '0 40px 80px -12px rgba(167, 139, 250, 0.5), 0 0 60px rgba(167, 139, 250, 0.3), inset 0 0 60px rgba(167, 139, 250, 0.1)'
                : '0 25px 50px -12px rgba(167, 139, 250, 0.25)',
            }}
            onMouseEnter={() => setHoveredCard('moving')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Glassmorphic Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-purple-400/40 group-hover:border-purple-300/60 transition-all duration-500" />

            {/* Background Layers with Parallax */}
            <div className="absolute inset-0">
              {/* Twilight Sky Background */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-purple-950 via-pink-950 to-orange-900"
                style={{
                  transform: hoveredCard === 'moving' ? 'translateZ(-20px) scale(1.05)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              />

              {/* Multi-Layered Aurora - Twilight Glow */}
              <div
                className="absolute inset-0"
                style={{
                  transform: hoveredCard === 'moving' ? 'translateZ(10px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                {/* Main purple aurora */}
                <div
                  className="absolute w-full h-full opacity-55 group-hover:opacity-80 transition-all duration-1000"
                  style={{
                    background: 'radial-gradient(ellipse 130% 70% at 50% 12%, rgba(167, 139, 250, 0.75) 0%, rgba(196, 181, 253, 0.5) 25%, rgba(221, 214, 254, 0.25) 50%, transparent 80%)',
                    filter: 'blur(65px)',
                    animation: 'aurora-wave 8s ease-in-out infinite',
                  }}
                />
                {/* Pink glow layer */}
                <div
                  className="absolute w-full h-full opacity-45 group-hover:opacity-70 transition-all duration-700"
                  style={{
                    background: 'radial-gradient(ellipse 100% 60% at 25% 18%, rgba(236, 72, 153, 0.6) 0%, rgba(251, 207, 232, 0.4) 30%, transparent 70%)',
                    filter: 'blur(55px)',
                    animation: 'aurora-wave 10s ease-in-out infinite reverse',
                  }}
                />
                {/* Orange horizon glow */}
                <div
                  className="absolute w-full h-full opacity-40 group-hover:opacity-60 transition-all duration-500"
                  style={{
                    background: 'radial-gradient(ellipse 110% 45% at 50% 85%, rgba(249, 115, 22, 0.5) 0%, rgba(251, 146, 60, 0.3) 35%, transparent 75%)',
                    filter: 'blur(60px)',
                    animation: 'aurora-wave 12s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Distant Twinkling Stars */}
              {[...Array(45)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 45}%`,
                    width: `${0.5 + Math.random() * 1.5}px`,
                    height: `${0.5 + Math.random() * 1.5}px`,
                    opacity: 0.25 + Math.random() * 0.6,
                    boxShadow: `0 0 ${2 + Math.random() * 3}px rgba(255,255,255,${0.4 + Math.random() * 0.5})`,
                    animation: `twinkle ${2.5 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`,
                    transform: hoveredCard === 'moving' ? `translateZ(${5 + Math.random() * 15}px)` : 'translateZ(0px)',
                    transition: 'transform 0.7s ease-out',
                  }}
                />
              ))}

              {/* Enhanced Mountain Ranges with Deep Perspective */}
              <svg
                viewBox="0 0 400 155"
                className="absolute bottom-32 w-full h-40"
                preserveAspectRatio="none"
                style={{
                  transform: hoveredCard === 'moving' ? 'translateZ(15px) scale(1.02)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                <defs>
                  <linearGradient id="mountain-far-m" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="mountain-mid-m" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="mountain-near-m" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                  </linearGradient>
                </defs>
                <path d="M0,100 L125,70 L210,82 L290,65 L370,75 L400,85 L400,155 L0,155 Z" fill="url(#mountain-far-m)"/>
                <path d="M0,110 L105,78 L190,90 L265,72 L335,82 L400,92 L400,155 L0,155 Z" fill="url(#mountain-mid-m)"/>
                <path d="M0,120 L85,88 L165,98 L245,82 L325,92 L400,102 L400,155 L0,155 Z" fill="url(#mountain-near-m)"/>
                {/* Snow caps with purple/pink glow */}
                <path d="M125,70 L135,76 L145,74 L155,79 L145,82" fill="#ede9fe" opacity="0.5"/>
                <path d="M265,72 L275,78 L285,76 L295,81 L285,84" fill="#ede9fe" opacity="0.5"/>
              </svg>

              {/* Ice Road with Enhanced Perspective */}
              <div
                className="absolute bottom-0 left-0 right-0 h-36"
                style={{
                  transform: hoveredCard === 'moving' ? 'translateZ(25px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                <svg viewBox="0 0 400 125" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="ice-road-grad-1-m" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0.75" />
                    </linearGradient>
                    <linearGradient id="ice-road-grad-2-m" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.85" />
                    </linearGradient>
                  </defs>
                  {/* Ice surface with perspective */}
                  <path d="M150,0 L250,0 L400,125 L0,125 Z" fill="url(#ice-road-grad-1-m)"/>
                  <path d="M160,0 L240,0 L380,125 L20,125 Z" fill="url(#ice-road-grad-2-m)"/>
                  {/* Ice cracks */}
                  <path d="M175,0 Q165,40 155,80 T120,125" stroke="#a5b4fc" strokeWidth="1.2" opacity="0.3" fill="none"/>
                  <path d="M225,0 Q235,40 245,80 T280,125" stroke="#a5b4fc" strokeWidth="1.2" opacity="0.3" fill="none"/>
                  {/* Snow banks with purple tint */}
                  <path d="M0,70 Q70,62 140,72 L0,125 Z" fill="#faf5ff" opacity="0.9"/>
                  <path d="M400,70 Q330,62 260,72 L400,125 Z" fill="#faf5ff" opacity="0.9"/>
                </svg>

                {/* Enhanced Moving Truck with Ultra-Detail */}
                <div
                  className="absolute bottom-14 left-1/2 -translate-x-1/2 group-hover:bottom-16 transition-all duration-700"
                  style={{
                    transform: hoveredCard === 'moving'
                      ? 'translateZ(40px) scale(1.15)'
                      : 'translateZ(0px) scale(1)',
                    filter: hoveredCard === 'moving'
                      ? 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.5))'
                      : 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.4))',
                  }}
                >
                  <svg width="95" height="48" viewBox="0 0 95 48">
                    {/* Shadow */}
                    <ellipse cx="47" cy="45" rx="40" ry="4" fill="#000" opacity="0.35"/>

                    {/* Truck container with detail */}
                    <rect x="14" y="14" width="44" height="23" fill="#dc2626" stroke="#991b1b" strokeWidth="2.5" rx="2.5"/>
                    {/* Panel lines */}
                    <line x1="30" y1="14" x2="30" y2="37" stroke="#b91c1c" strokeWidth="1.2" opacity="0.6"/>
                    <line x1="42" y1="14" x2="42" y2="37" stroke="#b91c1c" strokeWidth="1.2" opacity="0.6"/>
                    {/* Rivets */}
                    <circle cx="20" cy="20" r="1" fill="#7f1d1d" opacity="0.7"/>
                    <circle cx="36" cy="20" r="1" fill="#7f1d1d" opacity="0.7"/>
                    <circle cx="52" cy="20" r="1" fill="#7f1d1d" opacity="0.7"/>

                    {/* Truck cabin with detail */}
                    <rect x="58" y="7" width="28" height="30" fill="#dc2626" stroke="#991b1b" strokeWidth="2.5" rx="2.5"/>

                    {/* Windows with realistic reflection */}
                    <rect x="62" y="11" width="9" height="12" fill="#dbeafe" opacity="0.85" rx="1.5"/>
                    <rect x="73" y="11" width="8" height="12" fill="#bfdbfe" opacity="0.75" rx="1.5"/>
                    {/* Sky reflection in window */}
                    <rect x="63" y="12" width="4" height="5" fill="#f0f9ff" opacity="0.95"/>
                    <path d="M62,11 L71,21" stroke="#a5b4fc" strokeWidth="0.5" opacity="0.4"/>

                    {/* Door handle */}
                    <rect x="72" y="20" width="2" height="3" fill="#475569" rx="0.5"/>

                    {/* Grille detail */}
                    <rect x="84" y="20" width="2" height="12" fill="#0f172a" opacity="0.85" rx="0.5"/>
                    {[0, 1, 2, 3, 4].map(i => (
                      <line key={i} x1="84" y1={22 + i * 2} x2="86" y2={22 + i * 2} stroke="#334155" strokeWidth="0.6"/>
                    ))}

                    {/* Wheels with enhanced detail */}
                    <g>
                      <circle cx="27" cy="37" r="7.5" fill="#1e293b" stroke="#0f172a" strokeWidth="3"/>
                      <circle cx="27" cy="37" r="4.5" fill="#334155"/>
                      <circle cx="27" cy="37" r="2" fill="#64748b"/>
                      <circle cx="27" cy="37" r="0.8" fill="#94a3b8"/>
                    </g>
                    <g>
                      <circle cx="48" cy="37" r="7.5" fill="#1e293b" stroke="#0f172a" strokeWidth="3"/>
                      <circle cx="48" cy="37" r="4.5" fill="#334155"/>
                      <circle cx="48" cy="37" r="2" fill="#64748b"/>
                      <circle cx="48" cy="37" r="0.8" fill="#94a3b8"/>
                    </g>
                    <g>
                      <circle cx="71" cy="37" r="7.5" fill="#1e293b" stroke="#0f172a" strokeWidth="3"/>
                      <circle cx="71" cy="37" r="4.5" fill="#334155"/>
                      <circle cx="71" cy="37" r="2" fill="#64748b"/>
                      <circle cx="71" cy="37" r="0.8" fill="#94a3b8"/>
                    </g>

                    {/* Headlights with enhanced glow */}
                    <circle cx="88" cy="19" r="3" fill="#fef08a" opacity="0.98">
                      <animate attributeName="opacity" values="0.98;0.75;0.98" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="88" cy="28" r="3" fill="#fef08a" opacity="0.98">
                      <animate attributeName="opacity" values="0.98;0.75;0.98" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    {/* Light beams */}
                    <path d="M91,19 L100,15 L100,23 Z" fill="#fef9c3" opacity="0.2"/>
                    <path d="M91,28 L100,24 L100,32 Z" fill="#fef9c3" opacity="0.2"/>

                    {/* Exhaust smoke with animation */}
                    <circle cx="16" cy="17" r="2.5" fill="#94a3b8" opacity="0.4">
                      <animate attributeName="cy" values="17;12;17" dur="3s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="14" cy="13" r="3" fill="#cbd5e1" opacity="0.35">
                      <animate attributeName="cy" values="13;8;13" dur="3s" repeatCount="indefinite" begin="0.5s"/>
                      <animate attributeName="opacity" values="0.35;0.05;0.35" dur="3s" repeatCount="indefinite" begin="0.5s"/>
                    </circle>

                    {/* Logo/Company name */}
                    <rect x="32" y="23" width="14" height="6" fill="#fef9c3" opacity="0.2" rx="1"/>
                  </svg>
                </div>
              </div>

              {/* Title with Ultra-Enhanced Glow */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: hoveredCard === 'moving' ? 'translateZ(40px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                <h3
                  className="text-5xl md:text-6xl font-black text-white group-hover:scale-110 transition-all duration-500"
                  style={{
                    textShadow: '0 0 80px rgba(167, 139, 250, 1), 0 0 40px rgba(236, 72, 153, 0.8), 0 0 20px rgba(251, 207, 232, 0.6), 6px 6px 0px rgba(15, 23, 42, 0.95), 10px 10px 0px rgba(15, 23, 42, 0.4)',
                    letterSpacing: '0.08em',
                  }}
                >
                  MOVING
                </h3>
              </div>

              {/* Atmospheric Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-purple-950/25 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40 pointer-events-none" />

              {/* Glassmorphic overlay on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-orange-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-orange-500/10 transition-all duration-700 pointer-events-none"
                style={{
                  backdropFilter: hoveredCard === 'moving' ? 'blur(0.5px)' : 'blur(0px)',
                }}
              />
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

        @keyframes aurora-wave {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(10px) scale(1.05); }
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

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes twinkle-varied {
          0%, 100% { opacity: 0.2; transform: scale(1) rotate(0deg); }
          25% { opacity: 0.6; transform: scale(1.3) rotate(90deg); }
          50% { opacity: 1; transform: scale(1.6) rotate(180deg); }
          75% { opacity: 0.6; transform: scale(1.3) rotate(270deg); }
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
