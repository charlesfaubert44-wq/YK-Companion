'use client';

import { useEffect, useState } from 'react';
import { useWeatherEffectsSettings } from '@/hooks/useWeatherEffectsSettings';

interface WeatherData {
  condition: string;
  wind_speed: number;
  description: string;
}

interface LiveWeatherEffectsProps {
  weather: WeatherData | null | undefined;
}

export default function LiveWeatherEffects({ weather }: LiveWeatherEffectsProps) {
  const [mounted, setMounted] = useState(false);
  const effectsSettings = useWeatherEffectsSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render if weather effects are disabled globally
  if (!mounted || !effectsSettings.enabled) return null;

  // Use forced weather condition if enabled, otherwise use live weather
  let condition: string;
  let windSpeed = 0;

  if (effectsSettings.forceEnabled && effectsSettings.forceCondition !== 'none') {
    condition = effectsSettings.forceCondition.toLowerCase();
    // Set a default wind speed for forced conditions
    windSpeed = 15; // Default moderate wind
  } else if (weather) {
    condition = weather.condition.toLowerCase();
    windSpeed = weather.wind_speed || 0;
  } else {
    // No weather data and no forced weather
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* SNOW EFFECT */}
      {condition === 'snow' && effectsSettings.snow && (
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={`snow-${i}`}
              className="absolute animate-snowfall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: 'radial-gradient(circle, white, rgba(255, 255, 255, 0.5))',
                borderRadius: '50%',
                opacity: 0.6 + Math.random() * 0.4,
                animationDuration: `${5 + Math.random() * 5}s`,
                animationDelay: `${Math.random() * 5}s`,
                filter: 'blur(1px)',
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
              }}
            />
          ))}
        </div>
      )}

      {/* RAIN EFFECT */}
      {(condition === 'rain' || condition === 'drizzle') && effectsSettings.rain && (
        <div className="absolute inset-0">
          {[...Array(condition === 'drizzle' ? 40 : 100)].map((_, i) => (
            <div
              key={`rain-${i}`}
              className="absolute animate-rainfall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                width: '2px',
                height: `${condition === 'drizzle' ? 15 : 25}px`,
                background:
                  'linear-gradient(to bottom, rgba(174, 194, 224, 0.8), rgba(174, 194, 224, 0.2))',
                opacity: 0.5 + Math.random() * 0.3,
                animationDuration: `${condition === 'drizzle' ? 1.5 : 0.8}s`,
                animationDelay: `${Math.random() * 2}s`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>
      )}

      {/* THUNDERSTORM EFFECT */}
      {condition === 'thunderstorm' && effectsSettings.thunderstorm && (
        <>
          {/* Heavy Rain */}
          <div className="absolute inset-0">
            {[...Array(150)].map((_, i) => (
              <div
                key={`thunder-rain-${i}`}
                className="absolute animate-rainfall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  width: '3px',
                  height: '30px',
                  background:
                    'linear-gradient(to bottom, rgba(174, 194, 224, 0.9), rgba(174, 194, 224, 0.3))',
                  opacity: 0.6 + Math.random() * 0.4,
                  animationDuration: '0.5s',
                  animationDelay: `${Math.random() * 1}s`,
                }}
              />
            ))}
          </div>
          {/* Lightning Flashes */}
          <div className="absolute inset-0 animate-lightning" />
        </>
      )}

      {/* FOG/MIST EFFECT */}
      {(condition === 'mist' || condition === 'fog' || condition === 'haze') &&
        effectsSettings.fog && (
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 animate-fog-drift"
              style={{
                background:
                  'radial-gradient(ellipse at 30% 50%, rgba(200, 200, 220, 0.4) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <div
              className="absolute inset-0 animate-fog-drift-reverse"
              style={{
                background:
                  'radial-gradient(ellipse at 70% 50%, rgba(180, 180, 200, 0.35) 0%, transparent 70%)',
                filter: 'blur(50px)',
                animationDelay: '2s',
              }}
            />
            <div
              className="absolute inset-0 animate-fog-drift"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 80%, rgba(190, 190, 210, 0.3) 0%, transparent 60%)',
                filter: 'blur(60px)',
                animationDelay: '4s',
              }}
            />
          </div>
        )}

      {/* CLOUDS DRIFTING */}
      {condition === 'clouds' && effectsSettings.clouds && (
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={`cloud-${i}`}
              className="absolute animate-cloud-drift"
              style={{
                left: `${-20 + i * 40}%`,
                top: `${10 + i * 15}%`,
                width: `${100 + i * 50}px`,
                height: `${40 + i * 20}px`,
                background:
                  'radial-gradient(ellipse, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                filter: 'blur(25px)',
                animationDuration: `${40 + i * 10}s`,
                animationDelay: `${i * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* WIND PARTICLES (for windy conditions) */}
      {windSpeed > 20 && effectsSettings.wind && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={`wind-${i}`}
              className="absolute animate-wind-particle"
              style={{
                left: `-10%`,
                top: `${Math.random() * 100}%`,
                width: `${10 + Math.random() * 20}px`,
                height: '1px',
                background:
                  'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)',
                opacity: 0.3 + Math.random() * 0.3,
                animationDuration: `${1 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* CLEAR SKY SPARKLES */}
      {condition === 'clear' && effectsSettings.clear && (
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute animate-sparkle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                background: 'white',
                borderRadius: '50%',
                opacity: 0.4,
                animationDuration: `${3 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 5}s`,
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(${windSpeed > 15 ? 50 : 20}px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes rainfall {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) translateX(${windSpeed > 15 ? 30 : 10}px);
            opacity: 0.8;
          }
        }

        @keyframes lightning {
          0%,
          45%,
          55%,
          100% {
            background: transparent;
          }
          48%,
          52% {
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 100px rgba(200, 220, 255, 0.5);
          }
          50% {
            background: rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 150px rgba(200, 220, 255, 0.8);
          }
        }

        @keyframes fog-drift {
          0%,
          100% {
            transform: translateX(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateX(30px) scale(1.1);
            opacity: 0.5;
          }
        }

        @keyframes fog-drift-reverse {
          0%,
          100% {
            transform: translateX(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateX(-30px) scale(1.1);
            opacity: 0.5;
          }
        }

        @keyframes cloud-drift {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(120vw);
          }
        }

        @keyframes wind-particle {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateX(120vw);
            opacity: 0;
          }
        }

        @keyframes sparkle-float {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-15px) scale(1.5);
            opacity: 0.8;
          }
        }

        .animate-snowfall {
          animation: snowfall linear infinite;
        }

        .animate-rainfall {
          animation: rainfall linear infinite;
        }

        .animate-lightning {
          animation: lightning 8s ease-in-out infinite;
        }

        .animate-fog-drift {
          animation: fog-drift 20s ease-in-out infinite;
        }

        .animate-fog-drift-reverse {
          animation: fog-drift-reverse 25s ease-in-out infinite;
        }

        .animate-cloud-drift {
          animation: cloud-drift linear infinite;
        }

        .animate-wind-particle {
          animation: wind-particle linear infinite;
        }

        .animate-sparkle-float {
          animation: sparkle-float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
