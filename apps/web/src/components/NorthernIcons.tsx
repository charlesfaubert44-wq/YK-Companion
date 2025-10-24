'use client';

interface IconProps {
  className?: string;
}

// Animated Bush Plane Icon
export function BushPlaneIcon({ className = "" }: IconProps) {
  return (
    <div className={`inline-block transition-all duration-500 hover:scale-110 hover:-translate-y-2 ${className}`}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce-subtle">
        {/* Bush Plane */}
        <g className="hover:animate-wiggle">
          {/* Wings */}
          <path d="M15 40 L35 35 L35 45 L15 40 Z" fill="#64CCC5" stroke="#2DD4BF" strokeWidth="2"/>
          <path d="M45 35 L65 40 L45 45 Z" fill="#64CCC5" stroke="#2DD4BF" strokeWidth="2"/>

          {/* Body */}
          <ellipse cx="40" cy="40" rx="12" ry="6" fill="#86EFAC" stroke="#22C55E" strokeWidth="2"/>

          {/* Propeller */}
          <circle cx="40" cy="40" r="2" fill="#FCD34D" className="animate-spin-slow"/>
          <line x1="38" y1="40" x2="42" y2="40" stroke="#FCD34D" strokeWidth="1" className="animate-spin-slow"/>
          <line x1="40" y1="38" x2="40" y2="42" stroke="#FCD34D" strokeWidth="1" className="animate-spin-slow"/>

          {/* Tail */}
          <path d="M28 40 L22 37 L22 43 Z" fill="#64CCC5" stroke="#2DD4BF" strokeWidth="2"/>

          {/* Windows */}
          <circle cx="36" cy="39" r="1.5" fill="#BFDBFE"/>
          <circle cx="40" cy="39" r="1.5" fill="#BFDBFE"/>
          <circle cx="44" cy="39" r="1.5" fill="#BFDBFE"/>
        </g>
      </svg>
    </div>
  );
}

// Animated Northern Cabin Icon
export function NorthernCabinIcon({ className = "" }: IconProps) {
  return (
    <div className={`inline-block transition-all duration-500 hover:scale-110 ${className}`}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          {/* Smoke from chimney */}
          <circle cx="55" cy="25" r="2" fill="#9CA3AF" opacity="0.6" className="animate-pulse"/>
          <circle cx="57" cy="22" r="1.5" fill="#9CA3AF" opacity="0.4" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
          <circle cx="53" cy="20" r="1" fill="#9CA3AF" opacity="0.3" className="animate-pulse" style={{animationDelay: '0.4s'}}/>

          {/* Roof */}
          <path d="M20 35 L40 20 L60 35 Z" fill="#7C3AED" stroke="#6D28D9" strokeWidth="2"/>

          {/* Chimney */}
          <rect x="50" y="28" width="6" height="12" fill="#8B4513" stroke="#654321" strokeWidth="1"/>

          {/* House body */}
          <rect x="25" y="35" width="30" height="25" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>

          {/* Door */}
          <rect x="35" y="45" width="10" height="15" fill="#78350F" stroke="#451A03" strokeWidth="1.5" rx="1"/>
          <circle cx="42" cy="52" r="0.8" fill="#FCD34D"/>

          {/* Windows */}
          <rect x="28" y="40" width="5" height="5" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1"/>
          <line x1="28" y1="42.5" x2="33" y2="42.5" stroke="#3B82F6" strokeWidth="0.5"/>
          <line x1="30.5" y1="40" x2="30.5" y2="45" stroke="#3B82F6" strokeWidth="0.5"/>

          <rect x="47" y="40" width="5" height="5" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1"/>
          <line x1="47" y1="42.5" x2="52" y2="42.5" stroke="#3B82F6" strokeWidth="0.5"/>
          <line x1="49.5" y1="40" x2="49.5" y2="45" stroke="#3B82F6" strokeWidth="0.5"/>

          {/* Snow on roof */}
          <path d="M22 35 Q30 37 40 36 Q50 35 58 35" fill="white" opacity="0.8"/>
        </g>
      </svg>
    </div>
  );
}

// Animated Old Truck Icon
export function OldTruckIcon({ className = "" }: IconProps) {
  return (
    <div className={`inline-block transition-all duration-500 hover:scale-110 hover:translate-x-2 ${className}`}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          {/* Exhaust smoke */}
          <circle cx="28" cy="32" r="1.5" fill="#6B7280" opacity="0.5" className="animate-pulse"/>
          <circle cx="26" cy="30" r="1" fill="#6B7280" opacity="0.3" className="animate-pulse" style={{animationDelay: '0.3s'}}/>

          {/* Luggage on top */}
          <rect x="40" y="28" width="8" height="6" fill="#92400E" stroke="#78350F" strokeWidth="1" rx="1"/>
          <rect x="49" y="26" width="6" height="4" fill="#6B21A8" stroke="#581C87" strokeWidth="1" rx="1"/>
          <rect x="34" y="30" width="5" height="4" fill="#BE185D" stroke="#9F1239" strokeWidth="1" rx="1"/>

          {/* Truck body - cargo area */}
          <rect x="32" y="35" width="26" height="12" fill="#DC2626" stroke="#991B1B" strokeWidth="2" rx="1"/>

          {/* Truck cab */}
          <path d="M22 40 L22 47 L32 47 L32 35 L26 35 L22 40 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>

          {/* Window */}
          <path d="M23 41 L23 45 L30 45 L30 37 L26 37 Z" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1"/>

          {/* Wheels */}
          <circle cx="27" cy="49" r="4" fill="#1F2937" stroke="#111827" strokeWidth="2" className="hover:animate-spin-slow"/>
          <circle cx="27" cy="49" r="2" fill="#6B7280"/>

          <circle cx="48" cy="49" r="4" fill="#1F2937" stroke="#111827" strokeWidth="2" className="hover:animate-spin-slow"/>
          <circle cx="48" cy="49" r="2" fill="#6B7280"/>

          {/* Headlight */}
          <circle cx="20" cy="44" r="1.5" fill="#FCD34D" opacity="0.8"/>

          {/* Ground line */}
          <line x1="15" y1="53" x2="65" y2="53" stroke="#4B5563" strokeWidth="1" strokeDasharray="2,2"/>
        </g>
      </svg>
    </div>
  );
}

// Add custom animations to globals.css
export const customAnimationStyles = `
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-2deg); }
  75% { transform: rotate(2deg); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}

.animate-wiggle {
  animation: wiggle 2s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 4s linear infinite;
}
`;
