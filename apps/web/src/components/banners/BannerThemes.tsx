'use client';

import { useState } from 'react';

interface BannerProps {
  temperature: number;
}

// WINTER - Robbie Craig Style: Aurora and Frozen Wilderness
export const WinterBanner = ({ temperature }: BannerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDev = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENV === 'dev';

  return (
    <div
      className="relative w-full h-64 overflow-hidden cursor-pointer transition-all duration-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950">
        {/* Deep atmospheric sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-blue-950/60 to-transparent" />

        {/* Dynamic Aurora Borealis */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: isHovered ? 1 : 0.7 }}
        >
          <div className="absolute w-full h-full">
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{
                background: 'radial-gradient(ellipse 120% 100% at 50% 30%, rgba(16, 185, 129, 0.5) 0%, rgba(52, 211, 153, 0.3) 40%, transparent 70%)',
                filter: 'blur(60px)',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              }}
            />
            <div
              className="absolute inset-0 transition-all duration-1000"
              style={{
                background: 'radial-gradient(ellipse 100% 80% at 30% 40%, rgba(139, 92, 246, 0.4) 0%, rgba(196, 181, 253, 0.2) 50%, transparent 70%)',
                filter: 'blur(50px)',
                transform: isHovered ? 'translateX(10px)' : 'translateX(0)',
              }}
            />
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background: 'radial-gradient(ellipse 90% 70% at 70% 35%, rgba(34, 211, 238, 0.3) 0%, transparent 60%)',
                filter: 'blur(40px)',
                transform: isHovered ? 'translateX(-10px)' : 'translateX(0)',
              }}
            />
          </div>
        </div>

        {/* Stars - twinkling */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white transition-opacity duration-${1000 + Math.random() * 2000}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              opacity: isHovered ? 0.8 : 0.4,
              boxShadow: '0 0 2px rgba(255,255,255,0.8)',
            }}
          />
        ))}

        {/* Frozen landscape layers - Robbie Craig style */}
        <div className="absolute bottom-0 left-0 right-0 h-40">
          {/* Distant mountains */}
          <svg viewBox="0 0 1920 300" className="w-full h-full absolute bottom-0" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="iceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Far mountains */}
            <path
              d="M0,150 L320,100 L480,120 L640,80 L800,110 L960,85 L1120,105 L1280,95 L1440,115 L1600,90 L1920,120 L1920,300 L0,300 Z"
              fill="url(#mountainGrad)"
              opacity="0.6"
            />

            {/* Ice surface */}
            <path
              d="M0,180 Q400,170 800,185 Q1200,175 1600,190 T1920,185 L1920,300 L0,300 Z"
              fill="url(#iceGrad)"
            />

            {/* Snow drifts */}
            <path
              d="M0,220 Q300,210 600,225 Q900,215 1200,230 Q1500,220 1920,235 L1920,300 L0,300 Z"
              fill="#f0f9ff"
              opacity="0.8"
            />
          </svg>

          {/* Tree silhouettes */}
          <div className="absolute bottom-12 left-0 right-0 flex items-end justify-around px-12 opacity-70">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="relative transition-transform duration-700"
                style={{
                  width: '4px',
                  height: `${25 + Math.random() * 35}px`,
                  background: 'linear-gradient(to top, #0f172a, #1e293b)',
                  transform: isHovered ? `translateY(-${2}px)` : 'translateY(0)',
                  transitionDelay: `${i * 20}ms`,
                }}>
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '12px solid #1e293b',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Temperature badge */}
        <div
          className="absolute top-4 left-4 md:top-6 md:left-6 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-emerald-400/40 transition-all duration-300"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            boxShadow: isHovered ? '0 0 30px rgba(16, 185, 129, 0.3)' : 'none',
          }}
        >
          <div className="text-xl md:text-3xl font-black text-emerald-300">{temperature}°C</div>
        </div>

        {/* Logo and slogan */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <h1
                className="text-7xl font-black tracking-tight text-white transition-all duration-500"
                style={{
                  textShadow: '0 0 40px rgba(16, 185, 129, 0.6), 4px 4px 0px rgba(15, 23, 42, 0.8)',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                }}>
                YK <span className="text-emerald-300">BUDDY</span>
              </h1>
              {isDev && (
                <span className="px-3 py-1 bg-yellow-500 text-black text-sm font-bold rounded-md">
                  DEV
                </span>
              )}
            </div>
            <p
              className="text-cyan-100 text-sm mt-3 opacity-90 transition-opacity duration-300"
              style={{ opacity: isHovered ? 1 : 0.9 }}
            >
              Surviving the North, One Buddy at a Time
            </p>
          </div>
        </div>

        {/* Atmospheric vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-indigo-950/40 pointer-events-none" />
      </div>
    </div>
  );
};

// SPRING - Ice Breakup and Renewal
export const SpringBanner = ({ temperature }: BannerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDev = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENV === 'dev';

  return (
    <div
      className="relative w-full h-64 overflow-hidden cursor-pointer transition-all duration-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-300 to-blue-400">
        {/* Atmospheric depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/30 via-transparent to-orange-200/20" />

        {/* Sun with rays */}
        <div
          className="absolute top-12 right-32 transition-all duration-700"
          style={{
            transform: isHovered ? 'scale(1.1) rotate(10deg)' : 'scale(1) rotate(0deg)',
          }}
        >
          <div
            className="w-28 h-28 rounded-full relative"
            style={{
              background: 'radial-gradient(circle, #fef08a 0%, #fde047 40%, #facc15 70%, #f59e0b 100%)',
              boxShadow: '0 0 80px rgba(250, 204, 21, 0.6), 0 0 120px rgba(251, 191, 36, 0.4)',
            }}>
            {/* Sun rays */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 origin-center transition-opacity duration-500"
                style={{
                  width: '4px',
                  height: '40px',
                  background: 'linear-gradient(to bottom, rgba(254, 240, 138, 0.8), transparent)',
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-60px)`,
                  borderRadius: '2px',
                  opacity: isHovered ? 0.9 : 0.6,
                }}
              />
            ))}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 opacity-80" />
          </div>
        </div>

        {/* Migrating birds */}
        {isHovered && [...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-fly"
            style={{
              left: `${20 + i * 10}%`,
              top: `${15 + Math.random() * 20}%`,
              animationDelay: `${i * 0.3}s`,
            }}>
            <svg width="40" height="24" viewBox="0 0 40 24">
              <path
                d="M4,12 Q10,6 20,12 Q30,6 36,12"
                stroke="#1e293b"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ))}

        {/* Ice breakup - Great Slave Lake */}
        <div className="absolute bottom-0 left-0 right-0 h-36">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600">
            {/* Water shimmer */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000"
              style={{
                transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
              }}
            />

            {/* Floating ice chunks */}
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute transition-all duration-700"
                style={{
                  left: `${i * 10}%`,
                  top: `${40 + Math.random() * 30}%`,
                  width: `${40 + i * 5}px`,
                  height: `${25 + i * 3}px`,
                  background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe, #bae6fd)',
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 70%, 75% 100%, 25% 100%, 0% 70%)',
                  transform: isHovered ? `translateY(5px) rotate(${i * 5}deg)` : `rotate(${i * 3}deg)`,
                  boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
                  border: '1px solid rgba(191, 219, 254, 0.8)',
                }}
              />
            ))}
          </div>

          {/* Muddy shoreline */}
          <svg viewBox="0 0 1920 80" className="w-full h-20 absolute bottom-0" preserveAspectRatio="none">
            <path d="M0,40 Q200,30 400,45 T800,35 T1200,48 T1920,43 L1920,80 L0,80 Z" fill="#78350f" opacity="0.8"/>
            <path d="M0,50 Q150,45 300,52 T600,48 T1200,55 T1920,52 L1920,80 L0,80 Z" fill="#92400e" opacity="0.9"/>
          </svg>
        </div>

        {/* Temperature badge */}
        <div
          className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-emerald-500/50 transition-all duration-300"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <div className="text-xl md:text-3xl font-black text-emerald-700">{temperature}°C</div>
        </div>

        {/* Logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <h1
                className="text-7xl font-black text-slate-800 transition-all duration-500"
                style={{
                  textShadow: '3px 3px 0px rgba(255, 255, 255, 0.9), 2px 2px 30px rgba(56, 189, 248, 0.4)',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                }}>
                YK <span className="text-emerald-600">BUDDY</span>
              </h1>
              {isDev && (
                <span className="px-3 py-1 bg-yellow-500 text-black text-sm font-bold rounded-md">
                  DEV
                </span>
              )}
            </div>
            <p className="text-slate-700 text-sm mt-3 opacity-90">
              Surviving the North, One Buddy at a Time
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fly {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-fly { animation: fly 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

// SUMMER - Midnight Sun Glory
export const SummerBanner = ({ temperature }: BannerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-64 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-amber-300 via-orange-300 to-yellow-400">
        {/* Warm atmospheric layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/50 via-transparent to-orange-400/30" />

        {/* Massive Midnight Sun */}
        <div
          className="absolute top-8 right-20 transition-all duration-1000"
          style={{
            transform: isHovered ? 'scale(1.08) rotate(15deg)' : 'scale(1) rotate(0deg)',
          }}
        >
          <div className="relative">
            {/* Outer glow */}
            <div
              className="absolute w-48 h-48 rounded-full -left-8 -top-8 transition-all duration-700"
              style={{
                background: 'radial-gradient(circle, rgba(254, 243, 199, 0.6) 0%, rgba(253, 224, 71, 0.3) 40%, transparent 70%)',
                filter: 'blur(40px)',
                opacity: isHovered ? 1 : 0.7,
              }}
            />

            {/* Main sun */}
            <div
              className="relative w-32 h-32 rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #fef3c7 0%, #fde047 30%, #facc15 60%, #f59e0b 85%, #f97316 100%)',
                boxShadow: '0 0 100px rgba(251, 191, 36, 0.8), 0 0 150px rgba(249, 115, 22, 0.5), inset -15px -15px 40px rgba(249, 115, 22, 0.4)',
              }}>

              {/* Rotating rays */}
              <div className={`absolute inset-0 ${isHovered ? 'animate-spin-slow' : ''}`}>
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      width: '6px',
                      height: '55px',
                      background: 'linear-gradient(to bottom, rgba(254, 243, 199, 0.9) 0%, rgba(253, 224, 71, 0.5) 50%, transparent 100%)',
                      transform: `translate(-50%, -50%) rotate(${i * 22.5}deg) translateY(-90px)`,
                      borderRadius: '3px',
                      boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
                    }}
                  />
                ))}
              </div>

              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-yellow-50 via-yellow-200 to-orange-300 opacity-90" />
              <div className="absolute inset-14 rounded-full bg-gradient-to-br from-white via-yellow-100 to-yellow-200 opacity-80" />
            </div>
          </div>
        </div>

        {/* Wildflower meadow */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-around px-8">
          {[
            {color: '#ec4899', stem: '#22c55e'},
            {color: '#a855f7', stem: '#16a34a'},
            {color: '#f59e0b', stem: '#22c55e'},
            {color: '#ef4444', stem: '#15803d'},
            {color: '#3b82f6', stem: '#22c55e'},
            {color: '#ec4899', stem: '#16a34a'},
            {color: '#f59e0b', stem: '#22c55e'},
            {color: '#a855f7', stem: '#15803d'},
          ].map((flower, i) => (
            <div
              key={i}
              className="relative transition-all duration-500"
              style={{
                transform: isHovered ? `translateY(-10px) rotate(${(i - 4) * 5}deg)` : 'translateY(0)',
                transitionDelay: `${i * 50}ms`,
              }}>
              <div
                className="w-2 h-16 rounded-full mx-auto"
                style={{
                  background: `linear-gradient(to bottom, ${flower.stem}, #166534)`,
                }}
              />
              <div
                className="w-10 h-10 rounded-full -mt-7 mx-auto relative"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${flower.color}, ${flower.color}dd)`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                }}>
                <div className="absolute inset-2 rounded-full bg-white/40" />
                <div className="absolute inset-4 rounded-full bg-yellow-200/60" />
              </div>
            </div>
          ))}
        </div>

        {/* Sparkling lake */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-400/30 to-blue-500/40" />
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-200 rounded-full transition-opacity duration-300"
              style={{
                left: `${i * 5}%`,
                top: `${30 + Math.random() * 40}%`,
                opacity: isHovered ? 0.8 : 0.4,
                boxShadow: '0 0 10px rgba(254, 240, 138, 0.8)',
              }}
            />
          ))}
        </div>

        {/* Temperature */}
        <div
          className="absolute top-4 left-4 md:top-6 md:left-6 bg-orange-100/90 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-yellow-500/60 transition-all duration-300"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        >
          <div className="text-xl md:text-3xl font-black text-orange-700">{temperature}°C</div>
        </div>

        {/* Logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <h1
              className="text-7xl font-black text-orange-700 transition-all duration-500"
              style={{
                textShadow: '3px 3px 0px rgba(254, 243, 199, 0.9), 2px 2px 30px rgba(249, 115, 22, 0.5)',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              }}>
              YK <span className="text-yellow-500">BUDDY</span>
            </h1>
            <p className="text-orange-800 text-sm mt-3 opacity-90">
              Surviving the North, One Buddy at a Time
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 30s linear infinite; }
      `}</style>
    </div>
  );
};

// FALL - Autumn Majesty
export const FallBanner = ({ temperature }: BannerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-64 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-red-400 to-amber-500">
        {/* Atmospheric depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-transparent to-red-500/20" />

        {/* Sunset glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-orange-300/60 via-pink-300/40 to-transparent" />

        {/* Falling leaves */}
        {isHovered && [...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-40px',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <path
                d="M16,2 Q18,8 16,16 Q24,12 30,16 Q24,20 16,16 Q18,24 16,30 Q14,24 16,16 Q8,20 2,16 Q8,12 16,16 Q14,8 16,2 Z"
                fill={['#dc2626', '#ea580c', '#f59e0b', '#eab308'][Math.floor(Math.random() * 4)]}
                stroke="#78350f"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        ))}

        {/* Vibrant fall forest */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-around px-8">
          {[
            ['#dc2626', '#ea580c', '#f59e0b'],
            ['#f59e0b', '#eab308', '#d97706'],
            ['#ea580c', '#dc2626', '#b91c1c'],
            ['#eab308', '#f59e0b', '#d97706'],
            ['#dc2626', '#b91c1c', '#991b1b'],
            ['#f59e0b', '#ea580c', '#dc2626'],
            ['#d97706', '#eab308', '#f59e0b'],
            ['#b91c1c', '#dc2626', '#ea580c'],
          ].map((colors, i) => (
            <div
              key={i}
              className="relative transition-all duration-500"
              style={{
                transform: isHovered ? `scale(1.08) translateY(-5px)` : 'scale(1)',
                transitionDelay: `${i * 40}ms`,
              }}>
              <svg width="50" height="100" viewBox="0 0 50 100">
                <rect x="20" y="50" width="10" height="50" fill="#78350f" stroke="#451a03" strokeWidth="2"/>
                <circle cx="25" cy="30" r="18" fill={colors[0]} opacity="0.95" style={{filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'}}/>
                <circle cx="17" cy="38" r="14" fill={colors[1]} opacity="0.95" style={{filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'}}/>
                <circle cx="33" cy="38" r="14" fill={colors[2]} opacity="0.95" style={{filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'}}/>
                <circle cx="22" cy="28" r="6" fill="rgba(255,255,255,0.3)"/>
              </svg>
            </div>
          ))}
        </div>

        {/* Frost-touched ground */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900">
          <div className="absolute inset-0 bg-white/10" />
          <svg viewBox="0 0 1920 150" className="w-full h-full absolute bottom-0" preserveAspectRatio="none">
            <path d="M0,60 Q240,50 480,65 T960,55 T1920,60 L1920,150 L0,150 Z" fill="#92400e" opacity="0.9"/>
            <path d="M0,80 Q200,70 400,85 T800,75 T1920,85 L1920,150 L0,150 Z" fill="#78350f" opacity="0.95"/>
          </svg>
        </div>

        {/* Temperature */}
        <div
          className="absolute top-4 left-4 md:top-6 md:left-6 bg-amber-900/80 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-orange-400/50 transition-all duration-300"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        >
          <div className="text-xl md:text-3xl font-black text-orange-300">{temperature}°C</div>
        </div>

        {/* Logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <h1
              className="text-7xl font-black text-white transition-all duration-500"
              style={{
                textShadow: '5px 5px 0px #78350f, 8px 8px 0px rgba(120, 53, 15, 0.5), 2px 2px 40px rgba(234, 88, 12, 0.6)',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              }}>
              YK <span className="text-yellow-300">BUDDY</span>
            </h1>
            <p className="text-amber-100 text-sm mt-3 opacity-90">
              Surviving the North, One Buddy at a Time
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(300px) rotate(360deg); opacity: 0; }
        }
        .animate-fall { animation: fall linear forwards; }
      `}</style>
    </div>
  );
};

// HALLOWEEN - Spooky Aurora
export const HalloweenBanner = ({ temperature }: BannerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-64 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-orange-900">
        <div
          className="absolute inset-0 bg-gradient-to-b from-orange-500/30 via-purple-500/20 to-transparent blur-3xl transition-opacity duration-700"
          style={{ opacity: isHovered ? 0.8 : 0.5 }}
        />

        <div className="absolute bottom-8 left-10 text-6xl transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1)' }}>🎃</div>
        <div className="absolute bottom-6 right-16 text-5xl opacity-80 transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.2) rotate(-10deg)' : 'scale(1)' }}>🎃</div>

        <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-orange-900/80 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-orange-400/50">
          <div className="text-xl md:text-3xl font-black text-orange-300">{temperature}°C</div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-7xl font-black text-white" style={{textShadow: '0 0 40px rgba(249, 115, 22, 0.8)'}}>
            YK <span className="text-orange-400">BUDDY</span>
          </h1>
          <p className="text-orange-200 text-sm mt-3 opacity-90">Happy Halloween, Yellowknife!</p>
        </div>
      </div>
    </div>
  );
};

// REMEMBRANCE DAY
export const RemembranceBanner = ({ temperature }: BannerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-64 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
        <div className="absolute bottom-10 right-12 text-5xl transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}>🌺</div>
        <div className="absolute bottom-12 right-32 text-4xl opacity-80 transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}>🌺</div>

        <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-gray-800/80 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-red-500/40">
          <div className="text-xl md:text-3xl font-black text-gray-300">{temperature}°C</div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-7xl font-black text-white" style={{textShadow: '3px 3px 0px rgba(0, 0, 0, 0.5)'}}>
            YK <span className="text-red-500">BUDDY</span>
          </h1>
          <p className="text-gray-300 text-sm mt-3 opacity-90">Lest We Forget</p>
        </div>
      </div>
    </div>
  );
};

// CHRISTMAS
export const ChristmasBanner = ({ temperature }: BannerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-64 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="absolute inset-0 bg-gradient-to-b from-green-900 via-red-900 to-green-950">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/30 via-red-500/20 to-transparent blur-3xl" style={{ opacity: isHovered ? 0.8 : 0.5 }} />

        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute text-white text-xl opacity-60 transition-all duration-300"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80}%`,
              transform: isHovered ? `scale(1.5)` : 'scale(1)',
            }}>❄️</div>
        ))}

        <div className="absolute bottom-8 left-10 text-5xl transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}>🎄</div>
        <div className="absolute bottom-10 right-12 text-4xl transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}>⛄</div>

        <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-green-900/80 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-green-400/50">
          <div className="text-xl md:text-3xl font-black text-green-300">{temperature}°C</div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-7xl font-black text-white" style={{textShadow: '0 0 40px rgba(34, 197, 94, 0.6)'}}>
            YK <span className="text-red-400">BUDDY</span>
          </h1>
          <p className="text-green-200 text-sm mt-3 opacity-90">Merry Christmas, Yellowknife!</p>
        </div>
      </div>
    </div>
  );
};

// NEW YEAR
export const NewYearBanner = ({ temperature }: BannerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-64 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-blue-950">
        <div className="absolute top-10 left-20 text-6xl transition-all duration-500" style={{ transform: isHovered ? 'scale(1.3) rotate(20deg)' : 'scale(1)' }}>🎆</div>
        <div className="absolute top-8 right-24 text-5xl transition-all duration-500" style={{ transform: isHovered ? 'scale(1.3) rotate(-20deg)' : 'scale(1)' }}>✨</div>
        <div className="absolute top-16 left-1/2 text-6xl transition-all duration-500" style={{ transform: isHovered ? 'scale(1.3)' : 'scale(1)' }}>🎇</div>
        <div className="absolute top-12 right-1/3 text-4xl transition-all duration-500" style={{ transform: isHovered ? 'scale(1.3)' : 'scale(1)' }}>💫</div>

        <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-indigo-900/80 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-yellow-400/50">
          <div className="text-xl md:text-3xl font-black text-yellow-300">{temperature}°C</div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-7xl font-black text-white" style={{textShadow: '0 0 40px rgba(234, 179, 8, 0.8)'}}>
            YK <span className="text-yellow-400">BUDDY</span>
          </h1>
          <p className="text-yellow-200 text-sm mt-3 opacity-90">Happy New Year, Yellowknife!</p>
        </div>
      </div>
    </div>
  );
};

// CANADA DAY
export const CanadaDayBanner = ({ temperature }: BannerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-64 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-white to-red-600">
        <div className="absolute top-10 left-16 text-6xl text-red-600 transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.2) rotate(20deg)' : 'scale(1)' }}>🍁</div>
        <div className="absolute top-8 right-20 text-5xl text-red-700 transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.2) rotate(-20deg)' : 'scale(1)' }}>🍁</div>
        <div className="absolute bottom-12 left-1/3 text-4xl text-red-600 opacity-70 transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}>🍁</div>

        <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-red-600/50">
          <div className="text-xl md:text-3xl font-black text-red-700">{temperature}°C</div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-7xl font-black text-red-700" style={{textShadow: '3px 3px 0px rgba(255, 255, 255, 0.9)'}}>
            YK <span className="text-white" style={{textShadow: '3px 3px 0px rgba(220, 38, 38, 0.9)'}}>BUDDY</span>
          </h1>
          <p className="text-red-700 text-sm mt-3 opacity-90">Happy Canada Day!</p>
        </div>
      </div>
    </div>
  );
};

// INDIGENOUS PEOPLES DAY
export const IndigenousBanner = ({ temperature }: BannerProps) => {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-700 via-red-700 to-yellow-700">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-red-600 via-yellow-600 to-amber-600" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-amber-600 via-yellow-600 to-red-600" />
        </div>

        <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-amber-900/80 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-yellow-400/50">
          <div className="text-xl md:text-3xl font-black text-yellow-200">{temperature}°C</div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-7xl font-black text-white" style={{textShadow: '4px 4px 0px rgba(120, 53, 15, 0.8)'}}>
            YK <span className="text-yellow-300">BUDDY</span>
          </h1>
          <p className="text-yellow-100 text-sm mt-3 opacity-90">Celebrating Indigenous Peoples</p>
        </div>
      </div>
    </div>
  );
};

// EASTER
export const EasterBanner = ({ temperature }: BannerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-64 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="absolute inset-0 bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300">
        <div className="absolute bottom-10 left-12 text-5xl transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}>🌸</div>
        <div className="absolute bottom-8 right-16 text-5xl transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}>🐰</div>
        <div className="absolute top-12 left-1/3 text-4xl transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}>🥚</div>

        <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-purple-200/90 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl border border-purple-400/50">
          <div className="text-xl md:text-3xl font-black text-purple-700">{temperature}°C</div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-7xl font-black text-purple-900" style={{textShadow: '3px 3px 0px rgba(255, 255, 255, 0.9)'}}>
            YK <span className="text-pink-600">BUDDY</span>
          </h1>
          <p className="text-purple-700 text-sm mt-3 opacity-90">Happy Easter, Yellowknife!</p>
        </div>
      </div>
    </div>
  );
};

export const BANNER_THEMES = {
  winter: WinterBanner,
  spring: SpringBanner,
  summer: SummerBanner,
  fall: FallBanner,
  halloween: HalloweenBanner,
  remembrance: RemembranceBanner,
  christmas: ChristmasBanner,
  newyear: NewYearBanner,
  canada: CanadaDayBanner,
  indigenous: IndigenousBanner,
  easter: EasterBanner,
};

export type BannerTheme = keyof typeof BANNER_THEMES;
