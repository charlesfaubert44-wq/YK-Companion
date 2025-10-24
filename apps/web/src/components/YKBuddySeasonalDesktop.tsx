'use client';

import React, { useState, useEffect } from 'react';

const YKBuddySeasonalDesktop = () => {
  const [currentSeason, setCurrentSeason] = useState('winter');
  const [isHovered, setIsHovered] = useState(false);

  // Winter Logo - Frosty with Aurora Borealis
  const WinterLogo = () => {
    const [snowflakes, setSnowflakes] = useState<Array<{id: number; left: number; delay: number; duration: number}>>([]);
    const [auroraPhase, setAuroraPhase] = useState(0);

    useEffect(() => {
      if (isHovered) {
        const flakes = Array.from({ length: 50 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 4,
          duration: 4 + Math.random() * 3
        }));
        setSnowflakes(flakes);
      }
    }, [isHovered]);

    useEffect(() => {
      const interval = setInterval(() => {
        setAuroraPhase(prev => (prev + 1) % 3);
      }, 2000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="relative w-full h-screen bg-gradient-to-b from-indigo-950 via-blue-950 to-slate-900 overflow-hidden">
        {/* Aurora Borealis - animated waves */}
        <div className="absolute inset-0">
          <div
            className={`absolute top-0 left-0 w-full h-96 transition-all duration-1000 ${
              auroraPhase === 0 ? 'opacity-70' : auroraPhase === 1 ? 'opacity-90' : 'opacity-50'
            }`}
            style={{
              background: 'linear-gradient(90deg, rgba(52,211,153,0.5) 0%, rgba(167,243,208,0.6) 30%, rgba(52,211,153,0.5) 60%, rgba(167,243,208,0.6) 100%)',
              clipPath: 'polygon(0 20%, 5% 15%, 10% 25%, 15% 12%, 20% 22%, 25% 10%, 30% 20%, 35% 15%, 40% 25%, 45% 12%, 50% 8%, 55% 18%, 60% 14%, 65% 22%, 70% 16%, 75% 24%, 80% 18%, 85% 26%, 90% 20%, 95% 24%, 100% 20%, 100% 100%, 0 100%)',
              filter: 'blur(25px)'
            }}
          />
          <div
            className={`absolute top-20 left-0 w-full h-80 transition-all duration-1000 ${
              auroraPhase === 1 ? 'opacity-80' : auroraPhase === 2 ? 'opacity-60' : 'opacity-70'
            }`}
            style={{
              background: 'linear-gradient(90deg, rgba(196,181,253,0.5) 0%, rgba(233,213,255,0.6) 25%, rgba(147,197,253,0.5) 50%, rgba(196,181,253,0.5) 75%, rgba(233,213,255,0.6) 100%)',
              clipPath: 'polygon(0 30%, 8% 22%, 12% 32%, 18% 20%, 24% 30%, 30% 18%, 36% 28%, 42% 22%, 48% 32%, 54% 20%, 60% 15%, 66% 25%, 72% 20%, 78% 30%, 84% 24%, 90% 32%, 96% 26%, 100% 30%, 100% 100%, 0 100%)',
              filter: 'blur(25px)'
            }}
          />
        </div>

        {/* Falling snowflakes */}
        {isHovered && snowflakes.map(flake => (
          <div
            key={flake.id}
            className="absolute w-3 h-3 bg-white rounded-full animate-fall"
            style={{
              left: `${flake.left}%`,
              top: '-20px',
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
              opacity: 0.9,
              boxShadow: '0 0 8px rgba(255,255,255,0.9)'
            }}
          />
        ))}

        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Large ice crystals decoration */}
        <div className="absolute top-20 right-32 opacity-20">
          <svg width="150" height="150" viewBox="0 0 150 150">
            <path d="M75,10 L75,140 M10,75 L140,75 M25,25 L125,125 M125,25 L25,125"
                  stroke="#a5f3fc" strokeWidth="4" fill="none"/>
            <circle cx="75" cy="75" r="20" stroke="#a5f3fc" strokeWidth="4" fill="none"/>
            <circle cx="75" cy="75" r="40" stroke="#a5f3fc" strokeWidth="3" fill="none" opacity="0.6"/>
          </svg>
        </div>
        <div className="absolute top-40 left-48 opacity-15 transform rotate-45">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <path d="M60,5 L60,115 M5,60 L115,60 M18,18 L102,102 M102,18 L18,102"
                  stroke="#e0f2fe" strokeWidth="3" fill="none"/>
            <circle cx="60" cy="60" r="15" stroke="#e0f2fe" strokeWidth="3" fill="none"/>
          </svg>
        </div>

        {/* Frosty mountain silhouette */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1920 400" className="w-full h-96" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="frostGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#e0f2fe', stopOpacity: 0.4}} />
                <stop offset="100%" style={{stopColor: '#0c4a6e', stopOpacity: 0.9}} />
              </linearGradient>
            </defs>
            <path d="M0,400 L0,200 L300,60 L500,150 L800,40 L1100,130 L1400,70 L1700,140 L1920,90 L1920,400 Z"
                  fill="url(#frostGrad)"
                  stroke="#0ea5e9"
                  strokeWidth="5"/>
            <path d="M200,400 L200,250 L500,120 L700,180 L1000,100 L1300,170 L1600,130 L1920,190 L1920,400 Z"
                  fill="#1e293b"
                  stroke="#0f172a"
                  strokeWidth="4"
                  opacity="0.8"/>
          </svg>
        </div>

        {/* Main text - centered and large */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="relative mb-8">
            <div className="text-9xl font-black text-white tracking-tight"
                 style={{
                   textShadow: '0 0 40px rgba(165,243,252,0.9), 6px 6px 0px rgba(14,165,233,0.6)',
                   filter: isHovered ? 'brightness(1.3)' : 'brightness(1)',
                   transition: 'filter 0.5s'
                 }}>
              YK <span className="text-cyan-300">BUDDY</span>
            </div>
            <div className="absolute -bottom-4 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"
                 style={{boxShadow: '0 0 20px rgba(165,243,252,0.9)'}}></div>
          </div>
          <div className="text-2xl font-black text-cyan-200 tracking-widest uppercase bg-blue-950 bg-opacity-70 px-8 py-3 rounded-full border-4 border-cyan-500">
            ❄️ Winter Wonderland
          </div>
          <div className="mt-6 text-lg text-slate-300 max-w-2xl text-center px-8">
            Experience the magic of northern winters with dancing auroras and crystal-clear nights at -35°C
          </div>
        </div>

        {/* Temperature indicator */}
        <div className="absolute top-12 left-12 text-cyan-300 font-bold text-2xl bg-blue-950 bg-opacity-80 px-8 py-4 rounded-2xl border-4 border-cyan-500 backdrop-blur-sm">
          <div className="text-5xl">-35°C</div>
          <div className="text-sm mt-2 text-cyan-400">January Average</div>
        </div>

        {/* Hover instruction */}
        <div className="absolute bottom-12 right-12 text-cyan-200 bg-blue-950 bg-opacity-70 px-6 py-3 rounded-xl text-lg backdrop-blur-sm">
          Hover for snowfall ❄️
        </div>
      </div>
    );
  };

  // Spring Logo - Ice Breakup & Thaw
  const SpringLogo = () => {
    const [thawProgress, setThawProgress] = useState(0);
    const [birds, setBirds] = useState<Array<{id: number; left: number; top: number; delay: number}>>([]);

    useEffect(() => {
      if (isHovered && thawProgress < 100) {
        const interval = setInterval(() => {
          setThawProgress(prev => Math.min(prev + 1, 100));
        }, 30);
        return () => clearInterval(interval);
      }
    }, [isHovered, thawProgress]);

    useEffect(() => {
      if (isHovered) {
        const birdList = Array.from({ length: 12 }, (_, i) => ({
          id: i,
          left: Math.random() * 80 + 10,
          top: Math.random() * 40 + 10,
          delay: i * 0.4
        }));
        setBirds(birdList);
      }
    }, [isHovered]);

    return (
      <div className="relative w-full h-screen bg-gradient-to-b from-sky-300 via-blue-200 to-blue-300 overflow-hidden">
        {/* Paint texture */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white to-transparent mix-blend-overlay"></div>

        {/* Melting snow effect */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white to-transparent opacity-70"
             style={{
               clipPath: `polygon(0 0, 100% 0, 100% ${100 - thawProgress}%, 0 ${100 - thawProgress}%)`
             }}>
          {/* Dripping effect */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around">
            {[...Array(20)].map((_, i) => (
              <div key={i}
                   className="w-3 bg-gradient-to-b from-white to-transparent rounded-full transition-all duration-700"
                   style={{
                     height: isHovered ? `${40 + i * 4}px` : '20px',
                     transitionDelay: `${i * 0.05}s`
                   }}
              />
            ))}
          </div>
        </div>

        {/* Sun */}
        <div className="absolute top-24 right-32">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-200 to-orange-400 border-6 border-yellow-500 shadow-2xl"
               style={{boxShadow: '0 0 80px rgba(251,191,36,0.6)'}}>
            {/* Sun rays */}
            {[...Array(12)].map((_, i) => (
              <div key={i}
                   className="absolute top-1/2 left-1/2 w-2 h-16 bg-yellow-300 rounded-full opacity-50"
                   style={{
                     transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-80px)`,
                   }}
              />
            ))}
          </div>
        </div>

        {/* Flying birds */}
        {birds.map(bird => (
          <div key={bird.id}
               className="absolute animate-fly"
               style={{
                 left: `${bird.left}%`,
                 top: `${bird.top}%`,
                 animationDelay: `${bird.delay}s`
               }}>
            <svg width="48" height="32" viewBox="0 0 48 32">
              <path d="M4,16 Q12,8 24,16 Q36,8 44,16" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        ))}

        {/* Ice breaking on lake */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-blue-400 to-blue-600">
          {/* Ice chunks */}
          <div className="absolute inset-0 flex justify-around items-center px-20">
            {[...Array(10)].map((_, i) => (
              <div key={i}
                   className="w-24 h-16 bg-white opacity-70 transform rotate-12 transition-all duration-1000 border-4 border-blue-200"
                   style={{
                     transform: isHovered ? `translateY(${i * 3}px) rotate(${i * 20}deg)` : 'rotate(12deg)',
                     transitionDelay: `${i * 0.1}s`,
                     clipPath: 'polygon(15% 0%, 85% 0%, 100% 75%, 50% 100%, 0% 75%)'
                   }}
              />
            ))}
          </div>
        </div>

        {/* Emerging trees */}
        <div className="absolute bottom-48 left-0 right-0 flex justify-around px-32">
          {[...Array(8)].map((_, i) => (
            <svg key={i} width="50" height="90" viewBox="0 0 50 90"
                 className="transition-all duration-700"
                 style={{
                   opacity: isHovered ? 1 : 0.4,
                   transform: isHovered ? 'scale(1)' : 'scale(0.8)',
                   transitionDelay: `${i * 0.15}s`
                 }}>
              <rect x="20" y="50" width="10" height="40" fill="#78350f" stroke="#451a03" strokeWidth="3"/>
              <path d="M25,10 L10,36 L40,36 Z" fill="#166534" stroke="#14532d" strokeWidth="3"/>
              <path d="M25,24 L14,44 L36,44 Z" fill="#22c55e" stroke="#16a34a" strokeWidth="3"/>
            </svg>
          ))}
        </div>

        {/* Main text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="relative mb-8">
            <div className="text-9xl font-black text-slate-800 tracking-tight"
                 style={{textShadow: '4px 4px 0px rgba(255,255,255,0.8), 3px 3px 30px rgba(56,189,248,0.6)'}}>
              YK <span className="text-emerald-600">BUDDY</span>
            </div>
            <div className="absolute -bottom-4 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full"></div>
          </div>
          <div className="text-2xl font-black text-slate-700 tracking-widest uppercase bg-white bg-opacity-80 px-8 py-3 rounded-full border-4 border-emerald-500">
            🌱 Spring Thaw
          </div>
          <div className="mt-6 text-lg text-slate-700 max-w-2xl text-center px-8 font-semibold">
            Watch the ice break and nature awaken as temperatures rise and birds return to the North
          </div>
        </div>

        {/* Temperature and thaw meter */}
        <div className="absolute top-12 left-12 bg-white bg-opacity-90 px-8 py-4 rounded-2xl border-4 border-emerald-500 backdrop-blur-sm">
          <div className="text-5xl font-bold text-emerald-700">+5°C</div>
          <div className="text-sm mt-2 text-emerald-600 font-bold">April Thaw</div>
          <div className="mt-4 w-48 h-4 bg-blue-200 rounded-full overflow-hidden border-2 border-emerald-600">
            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                 style={{width: `${thawProgress}%`}}></div>
          </div>
          <div className="text-xs mt-2 text-slate-600 font-semibold">Ice Breakup: {thawProgress}%</div>
        </div>

        <div className="absolute bottom-12 right-12 text-emerald-800 bg-white bg-opacity-80 px-6 py-3 rounded-xl text-lg backdrop-blur-sm font-bold">
          Hover to melt ice 🌱
        </div>
      </div>
    );
  };

  // Summer Logo - Midnight Sun
  const SummerLogo = () => {
    const [sunRotation, setSunRotation] = useState(0);
    const [lakeRipples, setLakeRipples] = useState<Array<{id: number; x: number; y: number}>>([]);

    useEffect(() => {
      const interval = setInterval(() => {
        setSunRotation(prev => (prev + 0.5) % 360);
      }, 30);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      if (isHovered) {
        const rippleInterval = setInterval(() => {
          setLakeRipples(prev => {
            const newRipple = {
              id: Date.now(),
              x: Math.random() * 100,
              y: 60 + Math.random() * 30
            };
            return [...prev.slice(-8), newRipple];
          });
        }, 600);
        return () => clearInterval(rippleInterval);
      }
    }, [isHovered]);

    return (
      <div className="relative w-full h-screen bg-gradient-to-b from-yellow-300 via-orange-300 to-amber-400 overflow-hidden">
        {/* Paint texture */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-tl from-white to-transparent mix-blend-overlay"></div>

        {/* Midnight sun - large and prominent */}
        <div className="absolute top-32 right-48">
          <div className="relative">
            <div className="w-72 h-72 rounded-full bg-gradient-to-br from-yellow-200 to-orange-400 border-8 border-yellow-500 shadow-2xl"
                 style={{
                   boxShadow: `0 0 100px rgba(251,191,36,0.9), 0 0 200px rgba(251,191,36,0.5)`,
                   transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                   transition: 'transform 0.7s'
                 }}>
              {/* Sun rays - rotating */}
              <div className="absolute inset-0" style={{transform: `rotate(${sunRotation}deg)`}}>
                {[...Array(16)].map((_, i) => (
                  <div key={i}
                       className="absolute top-1/2 left-1/2 w-3 h-32 bg-yellow-300 rounded-full"
                       style={{
                         transform: `translate(-50%, -50%) rotate(${i * 22.5}deg) translateY(-150px)`,
                         opacity: 0.6,
                         boxShadow: '0 0 20px rgba(251,191,36,0.6)'
                       }}
                  />
                ))}
              </div>
              {/* Inner glow circles */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-yellow-100 to-orange-300 opacity-80"></div>
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-yellow-50 to-orange-200 opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Wildflowers - larger field */}
        <div className="absolute bottom-48 left-0 right-0 flex justify-around px-20">
          {[
            {color: '#ec4899', stem: '#22c55e'},
            {color: '#8b5cf6', stem: '#22c55e'},
            {color: '#f59e0b', stem: '#16a34a'},
            {color: '#ef4444', stem: '#15803d'},
            {color: '#3b82f6', stem: '#22c55e'},
            {color: '#ec4899', stem: '#16a34a'},
            {color: '#f59e0b', stem: '#22c55e'},
            {color: '#8b5cf6', stem: '#15803d'},
            {color: '#ef4444', stem: '#22c55e'},
            {color: '#3b82f6', stem: '#16a34a'}
          ].map((flower, i) => (
            <div key={i} className="transition-all duration-700"
                 style={{
                   transform: isHovered ? `translateY(-10px) rotate(${(i - 5) * 5}deg)` : 'translateY(0)',
                   transitionDelay: `${i * 0.08}s`
                 }}>
              <div className="w-6 h-20 rounded-full" style={{backgroundColor: flower.stem}}></div>
              <div className="w-16 h-16 rounded-full -mt-10 mx-auto border-6 border-white shadow-lg"
                   style={{backgroundColor: flower.color, boxShadow: '0 4px 10px rgba(0,0,0,0.3)'}}>
                <div className="absolute inset-2 rounded-full bg-white opacity-30"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Lake with ripples */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden">
          {lakeRipples.map(ripple => (
            <div key={ripple.id}
                 className="absolute rounded-full border-4 border-white opacity-0 animate-ripple"
                 style={{
                   left: `${ripple.x}%`,
                   top: `${ripple.y}%`,
                   width: '20px',
                   height: '20px'
                 }}
            />
          ))}

          {/* Reflection shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
        </div>

        {/* Main text */}
        <div className="absolute top-1/2 left-32 -translate-y-1/2 z-20">
          <div className="bg-white bg-opacity-95 px-12 py-10 rounded-3xl border-6 border-orange-600 shadow-2xl backdrop-blur-sm">
            <div className="text-8xl font-black text-orange-600"
                 style={{textShadow: '3px 3px 0px rgba(251,191,36,0.6)'}}>
              YK
            </div>
            <div className="text-8xl font-black text-yellow-500 -mt-3"
                 style={{textShadow: '3px 3px 0px rgba(251,191,36,0.6)'}}>
              BUDDY
            </div>
            <div className="text-xl font-bold text-orange-700 mt-3 tracking-wider">☀️ MIDNIGHT SUN</div>
            <div className="mt-4 text-base text-orange-800 max-w-sm">
              Experience 24-hour daylight under the endless summer sun
            </div>
          </div>
        </div>

        {/* Time display */}
        <div className="absolute top-12 left-12 bg-yellow-200 bg-opacity-95 px-8 py-4 rounded-2xl border-4 border-orange-500 backdrop-blur-sm">
          <div className="text-5xl font-bold text-orange-700">+22°C</div>
          <div className="text-3xl font-black text-orange-600 mt-2">11:30 PM</div>
          <div className="text-sm mt-2 text-orange-700 font-bold">Still Daylight!</div>
        </div>

        <div className="absolute bottom-12 right-12 text-orange-800 bg-yellow-200 bg-opacity-90 px-6 py-3 rounded-xl text-lg backdrop-blur-sm font-bold">
          Hover for lake ripples 💦
        </div>
      </div>
    );
  };

  // Fall Logo - Autumn Colors & Migration
  const FallLogo = () => {
    const [leaves, setLeaves] = useState<Array<{id: number; color: string; left: number; delay: number; duration: number; rotation: number}>>([]);
    const [windGust, setWindGust] = useState(false);
    const [geeseMove, setGeeseMove] = useState(0);

    useEffect(() => {
      if (isHovered) {
        const leafColors = ['#dc2626', '#f59e0b', '#eab308', '#ea580c', '#b45309'];
        const newLeaves = Array.from({ length: 40 }, (_, i) => ({
          id: i,
          color: leafColors[Math.floor(Math.random() * leafColors.length)],
          left: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 4 + Math.random() * 3,
          rotation: Math.random() * 360
        }));
        setLeaves(newLeaves);
      }
    }, [isHovered]);

    useEffect(() => {
      const interval = setInterval(() => {
        setGeeseMove(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    }, []);

    const handleClick = () => {
      setWindGust(true);
      setTimeout(() => setWindGust(false), 1500);
    };

    return (
      <div className="relative w-full h-screen bg-gradient-to-b from-orange-500 via-red-500 to-amber-600 overflow-hidden cursor-pointer"
           onClick={handleClick}>
        {/* Paint texture */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white to-transparent mix-blend-overlay"></div>

        {/* Gradient sky */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-orange-300 to-transparent opacity-70"></div>

        {/* Falling leaves */}
        {leaves.map(leaf => (
          <div
            key={leaf.id}
            className={`absolute ${windGust ? 'animate-windGust' : 'animate-fall'}`}
            style={{
              left: `${leaf.left}%`,
              top: '-40px',
              animationDelay: `${leaf.delay}s`,
              animationDuration: `${leaf.duration}s`,
              transform: `rotate(${leaf.rotation}deg)`
            }}>
            <svg width="40" height="40" viewBox="0 0 40 40">
              <path d="M20,4 Q24,12 20,20 Q28,16 36,20 Q28,24 20,20 Q24,28 20,36 Q16,28 20,20 Q12,24 4,20 Q12,16 20,20 Q16,12 20,4 Z"
                    fill={leaf.color}
                    stroke="#78350f"
                    strokeWidth="2"/>
            </svg>
          </div>
        ))}

        {/* Migrating geese formation - moving across sky */}
        <div className="absolute top-32 left-0 right-0"
             style={{
               transform: `translateX(${geeseMove}vw)`,
               transition: 'transform 50ms linear'
             }}>
          <svg width="400" height="120" viewBox="0 0 400 120" className="mx-auto">
            {/* Large V-formation */}
            {[
              {x: 200, y: 20},
              {x: 170, y: 35}, {x: 230, y: 35},
              {x: 140, y: 50}, {x: 260, y: 50},
              {x: 110, y: 65}, {x: 290, y: 65},
              {x: 80, y: 80}, {x: 320, y: 80},
              {x: 50, y: 95}, {x: 350, y: 95}
            ].map((pos, i) => (
              <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                <path d="M-4,-2 Q0,-4 4,-2"
                      stroke="#1e293b"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"/>
                <path d="M-4,2 Q0,0 4,2"
                      stroke="#1e293b"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"/>
              </g>
            ))}
          </svg>
        </div>

        {/* Autumn trees - larger forest */}
        <div className="absolute bottom-48 left-0 right-0 flex justify-around px-16">
          {[
            ['#dc2626', '#ea580c', '#f59e0b'],
            ['#f59e0b', '#eab308', '#ea580c'],
            ['#ea580c', '#dc2626', '#f59e0b'],
            ['#eab308', '#f59e0b', '#ea580c'],
            ['#dc2626', '#ea580c', '#f59e0b'],
            ['#f59e0b', '#eab308', '#ea580c'],
            ['#ea580c', '#dc2626', '#f59e0b'],
            ['#eab308', '#f59e0b', '#ea580c']
          ].map((colors, i) => (
            <svg key={i} width="60" height="120" viewBox="0 0 60 120"
                 className={`transition-all duration-500 ${windGust ? 'animate-sway' : ''}`}
                 style={{transitionDelay: `${i * 0.08}s`}}>
              <rect x="24" y="70" width="12" height="50" fill="#78350f" stroke="#451a03" strokeWidth="3"/>
              {/* Colorful fall foliage - large circles */}
              <circle cx="30" cy="40" r="20" fill={colors[0]} stroke="#78350f" strokeWidth="3" opacity="0.95"/>
              <circle cx="20" cy="50" r="16" fill={colors[1]} stroke="#78350f" strokeWidth="3" opacity="0.95"/>
              <circle cx="40" cy="50" r="16" fill={colors[2]} stroke="#78350f" strokeWidth="3" opacity="0.95"/>
              <circle cx="30" cy="60" r="14" fill={colors[0]} stroke="#78350f" strokeWidth="3" opacity="0.9"/>
            </svg>
          ))}
        </div>

        {/* Ground with frost */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-amber-700 to-amber-900 border-t-6 border-amber-800">
          <div className="absolute inset-0 bg-white opacity-15"></div>
          {/* Grass texture */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="w-1 bg-amber-800 opacity-40"
                   style={{height: `${20 + Math.random() * 30}px`}}></div>
            ))}
          </div>
        </div>

        {/* Main text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="relative mb-8">
            <div className="text-9xl font-black text-white tracking-tight"
                 style={{
                   textShadow: '6px 6px 0px #78350f, 3px 3px 40px rgba(234,88,12,0.7)',
                   WebkitTextStroke: '2px #78350f'
                 }}>
              YK <span className="text-yellow-300">BUDDY</span>
            </div>
            <div className="absolute -bottom-4 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full"></div>
          </div>
          <div className="text-2xl font-black text-white tracking-widest uppercase bg-amber-900 bg-opacity-90 px-8 py-3 rounded-full border-4 border-yellow-500">
            🍂 Autumn Colors
          </div>
          <div className="mt-6 text-lg text-white max-w-2xl text-center px-8 font-bold drop-shadow-lg">
            Watch the landscape transform in brilliant reds and golds as geese migrate south
          </div>
        </div>

        {/* Temperature */}
        <div className="absolute top-12 left-12 bg-orange-200 bg-opacity-95 px-8 py-4 rounded-2xl border-4 border-amber-700 backdrop-blur-sm">
          <div className="text-5xl font-bold text-amber-900">+8°C</div>
          <div className="text-sm mt-2 text-amber-800 font-bold">September Cool</div>
        </div>

        {/* Click instruction */}
        <div className="absolute bottom-12 right-12 text-amber-900 bg-orange-200 bg-opacity-95 px-8 py-4 rounded-2xl text-xl backdrop-blur-sm font-black animate-pulse border-4 border-amber-700">
          CLICK FOR WIND GUST 🍃
        </div>
      </div>
    );
  };

  const seasons = [
    {
      name: 'winter',
      label: '❄️ WINTER',
      component: WinterLogo,
      gradient: 'from-blue-600 to-cyan-600',
      description: 'Aurora borealis, -35°C, endless snow'
    },
    {
      name: 'spring',
      label: '🌱 SPRING',
      component: SpringLogo,
      gradient: 'from-emerald-500 to-sky-500',
      description: 'Ice breakup, migration, thaw'
    },
    {
      name: 'summer',
      label: '☀️ SUMMER',
      component: SummerLogo,
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Midnight sun, wildflowers, warmth'
    },
    {
      name: 'fall',
      label: '🍂 FALL',
      component: FallLogo,
      gradient: 'from-orange-600 to-red-600',
      description: 'Autumn colors, geese, first frost'
    }
  ];

  const CurrentSeasonComponent = seasons.find(s => s.name === currentSeason)?.component;

  return (
    <div className="min-h-screen bg-slate-950">
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes fly {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes ripple {
          0% { width: 20px; height: 20px; opacity: 0.9; }
          100% { width: 120px; height: 120px; opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes windGust {
          0% { transform: translateX(0) translateY(0) rotate(0deg); opacity: 1; }
          50% { transform: translateX(200px) translateY(-40px) rotate(180deg); opacity: 0.8; }
          100% { transform: translateX(400px) translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-fall { animation: fall linear forwards; }
        .animate-fly { animation: fly 3s ease-in-out infinite; }
        .animate-ripple { animation: ripple 2.5s ease-out forwards; }
        .animate-shimmer { animation: shimmer 4s ease-in-out infinite; }
        .animate-windGust { animation: windGust 1.5s ease-out forwards; }
        .animate-sway { animation: sway 0.6s ease-in-out; }
        .animate-twinkle { animation: twinkle ease-in-out infinite; }
      `}</style>

      {/* Season Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950 bg-opacity-95 backdrop-blur-md border-b-4 border-slate-700">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-1">YK BUDDY</h1>
              <p className="text-sm text-slate-400">Seasonal Logos - Desktop Edition</p>
            </div>
            <div className="flex gap-4">
              {seasons.map((season) => (
                <button
                  key={season.name}
                  onClick={() => setCurrentSeason(season.name)}
                  className={`px-8 py-4 rounded-2xl font-black text-xl transition-all duration-300 border-4 ${
                    currentSeason === season.name
                      ? `bg-gradient-to-r ${season.gradient} text-white border-white scale-110 shadow-2xl`
                      : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-slate-400 hover:scale-105'
                  }`}>
                  {season.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Logo Display */}
      <div
        className="pt-24"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {CurrentSeasonComponent && <CurrentSeasonComponent />}
      </div>
    </div>
  );
};

export default YKBuddySeasonalDesktop;
