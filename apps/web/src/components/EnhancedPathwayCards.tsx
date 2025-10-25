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

        {/* LIVING Card - Robbie Craig Style: Community Life & Warmth */}
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
            {/* Bold Glassmorphic Border */}
            <div className="absolute inset-0 rounded-3xl border-4 border-blue-400/50 group-hover:border-blue-300/70 transition-all duration-500" />

            {/* Background Layers - Robbie Craig Community Style */}
            <div className="absolute inset-0">
              {/* Deep Twilight Sky with Warmth */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, #0c1445 0%, #1a1b5e 25%, #2d2570 50%, #1e1456 100%)',
                  transform: hoveredCard === 'living' ? 'translateZ(-20px) scale(1.05)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              />

              {/* Vibrant Community Aurora - Warm & Welcoming Colors */}
              <div
                className="absolute inset-0"
                style={{
                  transform: hoveredCard === 'living' ? 'translateZ(10px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                {/* Warm blue community glow */}
                <div
                  className="absolute w-full h-full opacity-75 group-hover:opacity-100 transition-all duration-1000"
                  style={{
                    background: 'radial-gradient(ellipse 145% 90% at 50% 15%, rgba(59, 130, 246, 0.95) 0%, rgba(96, 165, 250, 0.7) 22%, rgba(147, 197, 253, 0.4) 48%, transparent 82%)',
                    filter: 'blur(58px)',
                    animation: 'aurora-wave-fluid 8s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Warm orange/amber community warmth */}
                <div
                  className="absolute w-full h-full opacity-60 group-hover:opacity-85 transition-all duration-800"
                  style={{
                    background: 'radial-gradient(ellipse 120% 75% at 30% 20%, rgba(251, 146, 60, 0.8) 0%, rgba(251, 191, 36, 0.6) 28%, rgba(252, 211, 77, 0.35) 55%, transparent 78%)',
                    filter: 'blur(52px)',
                    animation: 'aurora-wave-fluid 10s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Teal/cyan accent */}
                <div
                  className="absolute w-full h-full opacity-55 group-hover:opacity-80 transition-all duration-600"
                  style={{
                    background: 'radial-gradient(ellipse 100% 65% at 70% 18%, rgba(20, 184, 166, 0.75) 0%, rgba(45, 212, 191, 0.5) 32%, transparent 68%)',
                    filter: 'blur(48px)',
                    animation: 'aurora-wave-fluid 12s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Emerald green connection */}
                <div
                  className="absolute w-full h-full opacity-50 group-hover:opacity-75 transition-all duration-500"
                  style={{
                    background: 'radial-gradient(ellipse 90% 55% at 80% 25%, rgba(16, 185, 129, 0.7) 0%, rgba(52, 211, 153, 0.45) 30%, transparent 65%)',
                    filter: 'blur(45px)',
                    animation: 'aurora-wave-fluid 9s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Rose/pink warmth */}
                <div
                  className="absolute w-full h-full opacity-40 group-hover:opacity-65 transition-all duration-700"
                  style={{
                    background: 'radial-gradient(ellipse 85% 50% at 20% 22%, rgba(251, 113, 133, 0.65) 0%, rgba(252, 165, 165, 0.4) 35%, transparent 70%)',
                    filter: 'blur(42px)',
                    animation: 'aurora-wave-fluid 11s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>

              {/* Enhanced Stars with Varied Twinkling */}
              {[...Array(70)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 50}%`,
                    width: `${0.4 + Math.random() * 2.8}px`,
                    height: `${0.4 + Math.random() * 2.8}px`,
                    opacity: 0.25 + Math.random() * 0.75,
                    boxShadow: `0 0 ${2 + Math.random() * 5}px rgba(255,255,255,${0.4 + Math.random() * 0.6})`,
                    animation: `twinkle-varied ${1.2 + Math.random() * 3.5}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3.5}s`,
                    transform: hoveredCard === 'living' ? `translateZ(${5 + Math.random() * 18}px)` : 'translateZ(0px)',
                    transition: 'transform 0.7s ease-out',
                  }}
                />
              ))}

              {/* Bold Graphic Community Homes - Robbie Craig Style */}
              <div
                className="absolute bottom-24 left-0 right-0 h-32 opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  transform: hoveredCard === 'living' ? 'translateZ(25px) scale(1.08)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                {/* Home 1 - Left Side */}
                <div className="absolute bottom-0 left-[15%]">
                  <svg width="85" height="75" viewBox="0 0 85 75">
                    {/* House shadow */}
                    <ellipse cx="42" cy="72" rx="35" ry="4" fill="#000" opacity="0.3"/>
                    {/* House body with bold outline */}
                    <rect x="12" y="35" width="60" height="37" fill="#dc2626" stroke="#fbbf24" strokeWidth="3.5" rx="2"/>
                    {/* Roof with bold outline */}
                    <path d="M8,35 L42,12 L76,35 Z" fill="#b91c1c" stroke="#fb923c" strokeWidth="3.5"/>
                    {/* Glowing windows with bold frames */}
                    <rect x="22" y="42" width="16" height="18" fill="#fef08a" opacity="0.98" rx="2" stroke="#fbbf24" strokeWidth="3"/>
                    <rect x="47" y="42" width="16" height="18" fill="#fef08a" opacity="0.98" rx="2" stroke="#fbbf24" strokeWidth="3"/>
                    {/* Window glow */}
                    <rect x="24" y="44" width="6" height="7" fill="#fef9c3" opacity="0.95"/>
                    <rect x="49" y="44" width="6" height="7" fill="#fef9c3" opacity="0.95"/>
                    {/* Door */}
                    <rect x="36" y="50" width="13" height="22" fill="#7f1d1d" stroke="#fb923c" strokeWidth="2.5" rx="1.5"/>
                    <circle cx="45" cy="61" r="1.5" fill="#fbbf24"/>
                    {/* Chimney with smoke */}
                    <rect x="55" y="18" width="7" height="17" fill="#475569" stroke="#3b82f6" strokeWidth="2.5"/>
                    <circle cx="58" cy="12" r="3" fill="#cbd5e1" opacity="0.5">
                      <animate attributeName="cy" values="12;7;12" dur="2.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>

                {/* Home 2 - Right Side */}
                <div className="absolute bottom-0 right-[18%]">
                  <svg width="75" height="70" viewBox="0 0 75 70">
                    {/* House shadow */}
                    <ellipse cx="37" cy="67" rx="32" ry="3.5" fill="#000" opacity="0.3"/>
                    {/* House body with bold outline */}
                    <rect x="10" y="30" width="54" height="37" fill="#0891b2" stroke="#06b6d4" strokeWidth="3.5" rx="2"/>
                    {/* Roof with bold outline */}
                    <path d="M6,30 L37,10 L68,30 Z" fill="#0e7490" stroke="#22d3ee" strokeWidth="3.5"/>
                    {/* Glowing windows */}
                    <rect x="18" y="37" width="14" height="16" fill="#fef08a" opacity="0.98" rx="2" stroke="#fbbf24" strokeWidth="3"/>
                    <rect x="43" y="37" width="14" height="16" fill="#fef08a" opacity="0.98" rx="2" stroke="#fbbf24" strokeWidth="3"/>
                    {/* Window glow */}
                    <rect x="20" y="39" width="5" height="6" fill="#fef9c3" opacity="0.95"/>
                    <rect x="45" y="39" width="5" height="6" fill="#fef9c3" opacity="0.95"/>
                    {/* Door */}
                    <rect x="32" y="47" width="11" height="20" fill="#164e63" stroke="#22d3ee" strokeWidth="2.5" rx="1.5"/>
                    <circle cx="40" cy="57" r="1.3" fill="#fbbf24"/>
                  </svg>
                </div>
              </div>

              {/* Bold Graphic Snowy Ground - Community Setting */}
              <div
                className="absolute bottom-0 left-0 right-0 h-36"
                style={{
                  transform: hoveredCard === 'living' ? 'translateZ(28px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                <svg viewBox="0 0 400 145" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="snow-bold-l1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.95" />
                    </linearGradient>
                    <linearGradient id="snow-bold-l2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  {/* Bold graphic snow layers */}
                  <path d="M0,50 Q100,42 200,52 T400,45 L400,145 L0,145 Z" fill="url(#snow-bold-l1)" stroke="#3b82f6" strokeWidth="2.5" opacity="0.8"/>
                  <path d="M0,68 Q120,58 240,70 T400,62 L400,145 L0,145 Z" fill="url(#snow-bold-l2)" stroke="#06b6d4" strokeWidth="3" opacity="0.9"/>
                  {/* Bold graphic snow drifts */}
                  <ellipse cx="150" cy="78" rx="70" ry="18" fill="#ffffff" opacity="0.6" stroke="#93c5fd" strokeWidth="2"/>
                  <ellipse cx="310" cy="82" rx="60" ry="15" fill="#ffffff" opacity="0.55" stroke="#bae6fd" strokeWidth="2"/>
                </svg>

                {/* Bold Graphic Community Campfire - Central Gathering */}
                <div
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 group-hover:bottom-22 group-hover:scale-115 transition-all duration-700"
                  style={{
                    transform: hoveredCard === 'living' ? 'translateZ(35px) scale(1.15)' : 'translateZ(0px) scale(1)',
                    filter: hoveredCard === 'living'
                      ? 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 30px rgba(251, 146, 60, 0.5))'
                      : 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))',
                  }}
                >
                  <svg width="120" height="75" viewBox="0 0 120 75">
                    {/* Person 1 - Bold Graphic Style */}
                    <g stroke="#fbbf24" strokeWidth="2.5">
                      <ellipse cx="28" cy="20" rx="6" ry="7" fill="#1e293b" stroke="#fb923c" strokeWidth="3"/>
                      <rect x="23" y="26" width="10" height="18" fill="#1e293b" stroke="#fb923c" strokeWidth="3" rx="2"/>
                      <line x1="23" y1="32" x2="17" y2="40" stroke="#1e293b" strokeWidth="4" strokeLinecap="round"/>
                      <line x1="33" y1="32" x2="39" y2="40" stroke="#1e293b" strokeWidth="4" strokeLinecap="round"/>
                    </g>

                    {/* Person 2 */}
                    <g>
                      <ellipse cx="60" cy="22" rx="6" ry="7" fill="#0e7490" stroke="#06b6d4" strokeWidth="3"/>
                      <rect x="55" y="28" width="10" height="16" fill="#0e7490" stroke="#06b6d4" strokeWidth="3" rx="2"/>
                    </g>

                    {/* Person 3 */}
                    <g>
                      <ellipse cx="92" cy="20" rx="6" ry="7" fill="#dc2626" stroke="#fb923c" strokeWidth="3"/>
                      <rect x="87" y="26" width="10" height="18" fill="#dc2626" stroke="#fb923c" strokeWidth="3" rx="2"/>
                      <line x1="87" y1="32" x2="81" y2="40" stroke="#dc2626" strokeWidth="4" strokeLinecap="round"/>
                      <line x1="97" y1="32" x2="103" y2="40" stroke="#dc2626" strokeWidth="4" strokeLinecap="round"/>
                    </g>

                    {/* Bold Graphic Campfire - Community Heart */}
                    <g>
                      {/* Fire base */}
                      <ellipse cx="60" cy="62" rx="12" ry="5" fill="#fb923c" opacity="0.7" stroke="#fbbf24" strokeWidth="2">
                        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.5s" repeatCount="indefinite"/>
                      </ellipse>
                      {/* Main fire */}
                      <ellipse cx="60" cy="56" rx="10" ry="8" fill="#fbbf24" opacity="0.95" stroke="#fb923c" strokeWidth="2.5">
                        <animate attributeName="ry" values="7;9;7" dur="1.5s" repeatCount="indefinite"/>
                      </ellipse>
                      {/* Fire core */}
                      <ellipse cx="60" cy="54" rx="6" ry="6" fill="#fef08a" opacity="1" stroke="#fbbf24" strokeWidth="2">
                        <animate attributeName="rx" values="5;7;5" dur="1.5s" repeatCount="indefinite"/>
                      </ellipse>
                      {/* Bold flame streaks */}
                      <path d="M60,50 Q57,44 56,38" stroke="#fb923c" strokeWidth="3.5" opacity="0.8" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
                      </path>
                      <path d="M60,50 Q60,43 60,35" stroke="#fef08a" strokeWidth="4" opacity="0.95" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" begin="0.3s"/>
                      </path>
                      <path d="M60,50 Q63,44 64,38" stroke="#fb923c" strokeWidth="3.5" opacity="0.8" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
                      </path>
                      {/* Log pile with bold outline */}
                      <rect x="48" y="62" width="24" height="4" fill="#3f2410" stroke="#fbbf24" strokeWidth="2" rx="1"/>
                      <rect x="52" y="58" width="16" height="4" fill="#3f2410" stroke="#fb923c" strokeWidth="2" rx="1"/>
                    </g>

                    {/* Campfire glow */}
                    <ellipse cx="60" cy="55" rx="35" ry="20" fill="#fb923c" opacity="0.15"/>
                  </svg>
                </div>

                {/* Bold Graphic Pine Trees */}
                <div
                  className="absolute bottom-26 left-[12%] opacity-75 group-hover:opacity-90 transition-opacity duration-700"
                  style={{
                    transform: hoveredCard === 'living' ? 'translateZ(28px) scale(1.08)' : 'translateZ(0px)',
                    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))',
                  }}
                >
                  <svg width="55" height="80" viewBox="0 0 55 80">
                    {/* Trunk with bold outline */}
                    <rect x="23" y="52" width="9" height="28" fill="#3f2410" stroke="#10b981" strokeWidth="2.5"/>
                    {/* Tree layers with bold graphic style */}
                    <path d="M27.5,8 L45,32 L41,32 L52,52 L45,52 L52,68 L3,68 L10,52 L3,52 L14,32 L10,32 Z" fill="#1a3a2a" stroke="#10b981" strokeWidth="3" opacity="0.95"/>
                    {/* Bold snow caps */}
                    <path d="M27.5,8 L36,24 L19,24 Z" fill="#f0f9ff" stroke="#06b6d4" strokeWidth="2.5" opacity="0.85"/>
                    <path d="M41,32 L46,44 L36,44 Z" fill="#f0f9ff" stroke="#06b6d4" strokeWidth="2" opacity="0.75"/>
                  </svg>
                </div>

                <div
                  className="absolute bottom-28 right-[15%] opacity-70 group-hover:opacity-85 transition-opacity duration-700"
                  style={{
                    transform: hoveredCard === 'living' ? 'translateZ(26px) scale(1.06)' : 'translateZ(0px)',
                    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))',
                  }}
                >
                  <svg width="48" height="70" viewBox="0 0 48 70">
                    {/* Trunk with bold outline */}
                    <rect x="20" y="45" width="8" height="25" fill="#3f2410" stroke="#3b82f6" strokeWidth="2.5"/>
                    {/* Tree with bold lines */}
                    <path d="M24,5 L40,26 L37,26 L45,42 L39,42 L45,58 L3,58 L9,42 L3,42 L11,26 L8,26 Z" fill="#1a3a2a" stroke="#3b82f6" strokeWidth="3" opacity="0.95"/>
                    {/* Snow accents */}
                    <path d="M24,5 L32,20 L16,20 Z" fill="#f0f9ff" stroke="#22d3ee" strokeWidth="2.5" opacity="0.8"/>
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

        {/* MOVING Card - Robbie Craig Style: Journey to the North */}
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
            {/* Bold Glassmorphic Border */}
            <div className="absolute inset-0 rounded-3xl border-4 border-purple-400/50 group-hover:border-purple-300/70 transition-all duration-500" />

            {/* Background Layers - Robbie Craig Journey Style */}
            <div className="absolute inset-0">
              {/* Bold Twilight Sky - Journey Colors */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, #2d1b69 0%, #4c1d95 25%, #701a75 50%, #be185d 75%, #ea580c 100%)',
                  transform: hoveredCard === 'moving' ? 'translateZ(-20px) scale(1.05)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              />

              {/* Vibrant Journey Aurora - Bold & Guiding */}
              <div
                className="absolute inset-0"
                style={{
                  transform: hoveredCard === 'moving' ? 'translateZ(10px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                {/* Rich purple curtain */}
                <div
                  className="absolute w-full h-full opacity-65 group-hover:opacity-90 transition-all duration-1000"
                  style={{
                    background: 'radial-gradient(ellipse 135% 80% at 50% 15%, rgba(168, 85, 247, 0.9) 0%, rgba(192, 132, 252, 0.7) 22%, rgba(216, 180, 254, 0.4) 48%, transparent 80%)',
                    filter: 'blur(55px)',
                    animation: 'aurora-wave-fluid 9s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Vibrant magenta flow */}
                <div
                  className="absolute w-full h-full opacity-60 group-hover:opacity-85 transition-all duration-800"
                  style={{
                    background: 'radial-gradient(ellipse 115% 70% at 30% 18%, rgba(236, 72, 153, 0.85) 0%, rgba(244, 114, 182, 0.6) 28%, rgba(251, 207, 232, 0.35) 55%, transparent 75%)',
                    filter: 'blur(50px)',
                    animation: 'aurora-wave-fluid 11s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Warm orange horizon */}
                <div
                  className="absolute w-full h-full opacity-55 group-hover:opacity-78 transition-all duration-700"
                  style={{
                    background: 'radial-gradient(ellipse 120% 50% at 50% 80%, rgba(249, 115, 22, 0.75) 0%, rgba(251, 146, 60, 0.5) 30%, transparent 70%)',
                    filter: 'blur(48px)',
                    animation: 'aurora-wave-fluid 13s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Fuchsia accent */}
                <div
                  className="absolute w-full h-full opacity-50 group-hover:opacity-75 transition-all duration-600"
                  style={{
                    background: 'radial-gradient(ellipse 95% 60% at 75% 22%, rgba(217, 70, 239, 0.7) 0%, rgba(232, 121, 249, 0.45) 32%, transparent 65%)',
                    filter: 'blur(45px)',
                    animation: 'aurora-wave-fluid 10s ease-in-out infinite',
                    mixBlendMode: 'screen',
                  }}
                />
                {/* Amber warmth */}
                <div
                  className="absolute w-full h-full opacity-45 group-hover:opacity-70 transition-all duration-500"
                  style={{
                    background: 'radial-gradient(ellipse 85% 45% at 20% 75%, rgba(245, 158, 11, 0.65) 0%, rgba(251, 191, 36, 0.4) 35%, transparent 70%)',
                    filter: 'blur(42px)',
                    animation: 'aurora-wave-fluid 12s ease-in-out infinite reverse',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>

              {/* Enhanced Stars - Journey Guides */}
              {[...Array(65)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 48}%`,
                    width: `${0.4 + Math.random() * 2.6}px`,
                    height: `${0.4 + Math.random() * 2.6}px`,
                    opacity: 0.25 + Math.random() * 0.75,
                    boxShadow: `0 0 ${2 + Math.random() * 5}px rgba(255,255,255,${0.4 + Math.random() * 0.6})`,
                    animation: `twinkle-varied ${1.5 + Math.random() * 3.5}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3.5}s`,
                    transform: hoveredCard === 'moving' ? `translateZ(${5 + Math.random() * 18}px)` : 'translateZ(0px)',
                    transition: 'transform 0.7s ease-out',
                  }}
                />
              ))}

              {/* Bold Graphic Mountain Ranges - Journey Landscape */}
              <svg
                viewBox="0 0 400 155"
                className="absolute bottom-32 w-full h-40"
                preserveAspectRatio="none"
                style={{
                  transform: hoveredCard === 'moving' ? 'translateZ(18px) scale(1.03)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                <defs>
                  <linearGradient id="mountain-bold-m1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e1456" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="mountain-bold-m2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2d1b69" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#1e1456" stopOpacity="0.92" />
                  </linearGradient>
                  <linearGradient id="mountain-bold-m3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#2d1b69" stopOpacity="1" />
                  </linearGradient>
                </defs>
                {/* Far mountains with bold outline */}
                <path d="M0,100 L120,65 L205,78 L285,60 L365,72 L400,82 L400,155 L0,155 Z" fill="url(#mountain-bold-m1)" stroke="#a855f7" strokeWidth="2.5" opacity="0.7"/>
                {/* Mid mountains with definition */}
                <path d="M0,110 L100,75 L185,88 L260,68 L330,80 L400,90 L400,155 L0,155 Z" fill="url(#mountain-bold-m2)" stroke="#d946ef" strokeWidth="3" opacity="0.82"/>
                {/* Near mountains with bold graphic outline */}
                <path d="M0,120 L80,85 L160,96 L240,79 L320,90 L400,100 L400,155 L0,155 Z" fill="url(#mountain-bold-m3)" stroke="#ec4899" strokeWidth="3.5" opacity="0.95"/>
                {/* Bold snow caps with vibrant colors */}
                <path d="M120,65 L130,71 L140,69 L150,73 L140,76" fill="#fae8ff" stroke="#d946ef" strokeWidth="2.5" opacity="0.85"/>
                <path d="M260,68 L270,74 L280,72 L290,76 L280,79" fill="#fef3c7" stroke="#fb923c" strokeWidth="2.5" opacity="0.8"/>
                <path d="M320,90 L330,96 L340,94 L350,98 L340,101" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" opacity="0.75"/>
              </svg>

              {/* Bold Graphic Ice Road - Journey Path */}
              <div
                className="absolute bottom-0 left-0 right-0 h-36"
                style={{
                  transform: hoveredCard === 'moving' ? 'translateZ(28px)' : 'translateZ(0px)',
                  transition: 'transform 0.7s ease-out',
                }}
              >
                <svg viewBox="0 0 400 125" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="ice-road-bold-m1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.85" />
                    </linearGradient>
                    <linearGradient id="ice-road-bold-m2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ede9fe" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#fae8ff" stopOpacity="0.95" />
                    </linearGradient>
                  </defs>
                  {/* Bold graphic ice road with perspective */}
                  <path d="M150,0 L250,0 L400,125 L0,125 Z" fill="url(#ice-road-bold-m1)" stroke="#a855f7" strokeWidth="3" opacity="0.8"/>
                  <path d="M165,0 L235,0 L375,125 L25,125 Z" fill="url(#ice-road-bold-m2)" stroke="#d946ef" strokeWidth="3.5" opacity="0.9"/>
                  {/* Bold graphic ice cracks */}
                  <path d="M175,0 Q165,40 155,80 T120,125" stroke="#c084fc" strokeWidth="2.5" opacity="0.5" fill="none" strokeLinecap="round"/>
                  <path d="M225,0 Q235,40 245,80 T280,125" stroke="#c084fc" strokeWidth="2.5" opacity="0.5" fill="none" strokeLinecap="round"/>
                  {/* Bold snow banks with vibrant outlines */}
                  <path d="M0,70 Q70,62 140,72 L0,125 Z" fill="#faf5ff" stroke="#ec4899" strokeWidth="2.5" opacity="0.9"/>
                  <path d="M400,70 Q330,62 260,72 L400,125 Z" fill="#faf5ff" stroke="#fb923c" strokeWidth="2.5" opacity="0.9"/>
                </svg>

                {/* Bold Graphic Moving Truck - Journey Vehicle */}
                <div
                  className="absolute bottom-14 left-1/2 -translate-x-1/2 group-hover:bottom-17 transition-all duration-700"
                  style={{
                    transform: hoveredCard === 'moving'
                      ? 'translateZ(42px) scale(1.2)'
                      : 'translateZ(0px) scale(1.05)',
                    filter: hoveredCard === 'moving'
                      ? 'drop-shadow(0 18px 40px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 35px rgba(168, 85, 247, 0.5))'
                      : 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.5))',
                  }}
                >
                  <svg width="110" height="55" viewBox="0 0 110 55">
                    {/* Bold shadow */}
                    <ellipse cx="55" cy="51" rx="48" ry="5" fill="#000" opacity="0.4"/>

                    {/* Bold graphic truck container */}
                    <rect x="14" y="14" width="48" height="26" fill="#dc2626" stroke="#fb923c" strokeWidth="4" rx="3"/>
                    <rect x="16" y="16" width="44" height="22" fill="#b91c1c" stroke="#fbbf24" strokeWidth="2.5" rx="2"/>

                    {/* Bold graphic cabin */}
                    <rect x="62" y="7" width="32" height="33" fill="#dc2626" stroke="#fb923c" strokeWidth="4" rx="3"/>
                    <rect x="64" y="9" width="28" height="29" fill="#b91c1c" stroke="#fbbf24" strokeWidth="2.5" rx="2"/>

                    {/* Bold windows with vibrant frames */}
                    <rect x="68" y="12" width="10" height="14" fill="#ddd6fe" opacity="0.9" rx="2" stroke="#a855f7" strokeWidth="3"/>
                    <rect x="70" y="14" width="4" height="6" fill="#fae8ff" opacity="0.95"/>
                    <rect x="80" y="12" width="9" height="14" fill="#c7d2fe" opacity="0.85" rx="2" stroke="#d946ef" strokeWidth="3"/>

                    {/* Bold grille */}
                    <rect x="92" y="22" width="3" height="14" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5" rx="1" opacity="0.9"/>

                    {/* Bold graphic wheels with colorful rims */}
                    <g>
                      <circle cx="30" cy="40" r="9" fill="#0f172a" stroke="#d946ef" strokeWidth="4"/>
                      <circle cx="30" cy="40" r="5" fill="#334155" stroke="#ec4899" strokeWidth="2.5"/>
                      <circle cx="30" cy="40" r="2" fill="#a855f7"/>
                    </g>
                    <g>
                      <circle cx="52" cy="40" r="9" fill="#0f172a" stroke="#d946ef" strokeWidth="4"/>
                      <circle cx="52" cy="40" r="5" fill="#334155" stroke="#ec4899" strokeWidth="2.5"/>
                      <circle cx="52" cy="40" r="2" fill="#a855f7"/>
                    </g>
                    <g>
                      <circle cx="78" cy="40" r="9" fill="#0f172a" stroke="#d946ef" strokeWidth="4"/>
                      <circle cx="78" cy="40" r="5" fill="#334155" stroke="#ec4899" strokeWidth="2.5"/>
                      <circle cx="78" cy="40" r="2" fill="#a855f7"/>
                    </g>

                    {/* Bold graphic headlights with glow */}
                    <circle cx="97" cy="20" r="4" fill="#fef08a" opacity="1" stroke="#fbbf24" strokeWidth="2.5">
                      <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="97" cy="31" r="4" fill="#fef08a" opacity="1" stroke="#fbbf24" strokeWidth="2.5">
                      <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    {/* Bold light beams */}
                    <path d="M101,20 L112,16 L112,24 Z" fill="#fef9c3" opacity="0.3" stroke="#fbbf24" strokeWidth="1.5"/>
                    <path d="M101,31 L112,27 L112,35 Z" fill="#fef9c3" opacity="0.3" stroke="#fbbf24" strokeWidth="1.5"/>

                    {/* Bold graphic exhaust smoke */}
                    <circle cx="16" cy="17" r="3.5" fill="#c084fc" opacity="0.5" stroke="#a855f7" strokeWidth="2">
                      <animate attributeName="cy" values="17;11;17" dur="2.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="14" cy="13" r="4" fill="#ddd6fe" opacity="0.45" stroke="#d946ef" strokeWidth="2">
                      <animate attributeName="cy" values="13;7;13" dur="2.5s" repeatCount="indefinite" begin="0.5s"/>
                      <animate attributeName="opacity" values="0.45;0.1;0.45" dur="2.5s" repeatCount="indefinite" begin="0.5s"/>
                    </circle>

                    {/* Aurora glow behind truck */}
                    <ellipse cx="55" cy="25" rx="50" ry="22" fill="url(#truckGlow)" opacity="0.4"/>
                    <defs>
                      <radialGradient id="truckGlow">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5"/>
                        <stop offset="50%" stopColor="#ec4899" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
                      </radialGradient>
                    </defs>
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
