'use client';

interface IconProps {
  className?: string;
}

// Animated Aurora Night Scene Icon - Visiting
export function BushPlaneIcon({ className = "" }: IconProps) {
  return (
    <div className={`inline-block transition-all duration-500 hover:scale-110 ${className}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Square */}
        <rect x="10" y="10" width="100" height="100" fill="#0F172A" rx="8"/>

        {/* Night Sky Gradient */}
        <defs>
          <linearGradient id="nightSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#312E81" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0.9"/>
          </linearGradient>

          {/* Aurora Borealis Gradients */}
          <linearGradient id="auroraGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
            <stop offset="50%" stopColor="#34D399" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.3"/>
          </linearGradient>

          <linearGradient id="auroraBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"/>
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2"/>
          </linearGradient>

          <linearGradient id="auroraPurple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2"/>
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2"/>
          </linearGradient>
        </defs>

        <rect x="10" y="10" width="100" height="70" fill="url(#nightSkyGradient)" rx="8"/>

        {/* Stars */}
        <circle cx="25" cy="20" r="1" fill="white" opacity="0.8" className="animate-pulse"/>
        <circle cx="45" cy="15" r="0.8" fill="white" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
        <circle cx="70" cy="18" r="1.2" fill="white" opacity="0.9" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
        <circle cx="90" cy="22" r="0.7" fill="white" opacity="0.7" className="animate-pulse" style={{animationDelay: '0.9s'}}/>
        <circle cx="35" cy="28" r="0.9" fill="white" opacity="0.8" className="animate-pulse" style={{animationDelay: '1.2s'}}/>
        <circle cx="85" cy="30" r="1" fill="white" opacity="0.7" className="animate-pulse" style={{animationDelay: '1.5s'}}/>
        <circle cx="55" cy="25" r="0.8" fill="white" opacity="0.6" className="animate-pulse" style={{animationDelay: '1.8s'}}/>
        <circle cx="100" cy="35" r="1.1" fill="white" opacity="0.8" className="animate-pulse" style={{animationDelay: '2.1s'}}/>

        {/* Aurora Borealis - Layered flowing lights */}
        <path d="M10 30 Q30 25 50 28 T90 30 L110 32 L110 45 Q90 42 70 45 T30 43 L10 45 Z"
              fill="url(#auroraGreen)" className="animate-aurora" opacity="0.7"/>
        <path d="M10 35 Q35 32 55 35 T95 37 L110 38 L110 48 Q85 45 65 47 T25 46 L10 48 Z"
              fill="url(#auroraBlue)" className="animate-aurora-delayed" opacity="0.6"/>
        <path d="M10 40 Q40 38 60 40 T100 42 L110 43 L110 52 Q80 49 60 51 T20 50 L10 52 Z"
              fill="url(#auroraPurple)" className="animate-aurora" opacity="0.5" style={{animationDelay: '1s'}}/>

        {/* Snowy mountains silhouette */}
        <path d="M10 60 L25 45 L40 55 L55 40 L70 50 L85 38 L100 48 L110 55 L110 110 L10 110 Z"
              fill="#1E293B" opacity="0.9"/>
        <path d="M10 65 L30 50 L50 58 L70 45 L90 53 L110 60 L110 110 L10 110 Z"
              fill="#0F172A" opacity="0.8"/>

        {/* Snow caps on mountains (reflecting aurora glow) */}
        <path d="M23 46 L25 45 L27 47" stroke="#10B981" strokeWidth="1" opacity="0.5"/>
        <path d="M53 41 L55 40 L57 42" stroke="#34D399" strokeWidth="1" opacity="0.6"/>
        <path d="M83 39 L85 38 L87 40" stroke="#10B981" strokeWidth="1" opacity="0.5"/>

        {/* Snow-covered evergreen trees */}
        <g opacity="0.8">
          <path d="M15 75 L19 62 L23 75 Z" fill="#064E3B"/>
          <path d="M17 70 L19 62 L21 70 Z" fill="white" opacity="0.6"/>

          <path d="M30 78 L35 65 L40 78 Z" fill="#065F46"/>
          <path d="M32 72 L35 65 L38 72 Z" fill="white" opacity="0.6"/>

          <path d="M75 77 L80 64 L85 77 Z" fill="#064E3B"/>
          <path d="M77 71 L80 64 L83 71 Z" fill="white" opacity="0.6"/>

          <path d="M92 80 L97 67 L102 80 Z" fill="#065F46"/>
          <path d="M94 74 L97 67 L100 74 Z" fill="white" opacity="0.6"/>
        </g>

        {/* Snowy ground with aurora reflection */}
        <rect x="10" y="85" width="100" height="25" fill="#E0F2FE" opacity="0.2"/>
        <ellipse cx="40" cy="85" rx="25" ry="4" fill="#10B981" opacity="0.15"/>
        <ellipse cx="80" cy="88" rx="20" ry="3" fill="#3B82F6" opacity="0.15"/>

        {/* Snow texture */}
        <circle cx="20" cy="90" r="1.5" fill="white" opacity="0.4"/>
        <circle cx="50" cy="95" r="1.2" fill="white" opacity="0.3"/>
        <circle cx="85" cy="92" r="1.3" fill="white" opacity="0.35"/>
        <circle cx="100" cy="97" r="1" fill="white" opacity="0.3"/>
      </svg>
    </div>
  );
}

// Snowy Neighborhood Icon - Living
export function NorthernCabinIcon({ className = "" }: IconProps) {
  return (
    <div className={`inline-block transition-all duration-500 hover:scale-110 ${className}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Square */}
        <rect x="10" y="10" width="100" height="100" fill="#1E293B" rx="8"/>

        {/* Winter Sky - Dusk/Evening */}
        <defs>
          <linearGradient id="winterSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2"/>
            <stop offset="50%" stopColor="#EC4899" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        <rect x="10" y="10" width="100" height="55" fill="url(#winterSkyGradient)" rx="8"/>

        {/* Falling snow */}
        <circle cx="20" cy="18" r="1" fill="white" opacity="0.6" className="animate-float"/>
        <circle cx="45" cy="22" r="0.8" fill="white" opacity="0.5" className="animate-float-delayed"/>
        <circle cx="75" cy="15" r="1.2" fill="white" opacity="0.7" className="animate-float"/>
        <circle cx="90" cy="25" r="0.9" fill="white" opacity="0.5" className="animate-float-delayed"/>
        <circle cx="35" cy="30" r="1.1" fill="white" opacity="0.6" className="animate-float"/>
        <circle cx="95" cy="35" r="0.8" fill="white" opacity="0.5" className="animate-float-delayed"/>

        {/* Distant hills/treeline */}
        <path d="M10 60 L110 60 L110 110 L10 110 Z" fill="#334155" opacity="0.4"/>

        {/* Snow ground with rolling hills */}
        <ellipse cx="30" cy="75" rx="35" ry="8" fill="white" opacity="0.15"/>
        <ellipse cx="80" cy="78" rx="40" ry="10" fill="white" opacity="0.15"/>
        <rect x="10" y="75" width="100" height="35" fill="#E0F2FE" opacity="0.25"/>

        {/* House 1 - Left (Blue house) */}
        <g>
          {/* Smoke from chimney */}
          <circle cx="28" cy="48" r="1.5" fill="#9CA3AF" opacity="0.5" className="animate-pulse"/>
          <circle cx="29" cy="46" r="1" fill="#9CA3AF" opacity="0.3" className="animate-pulse" style={{animationDelay: '0.2s'}}/>

          {/* Roof with snow */}
          <path d="M15 62 L30 52 L45 62 Z" fill="#3B82F6" opacity="0.8"/>
          <path d="M17 62 Q30 54 43 62" fill="white" opacity="0.9" strokeWidth="0"/>

          {/* Chimney */}
          <rect x="26" y="53" width="4" height="9" fill="#8B4513" opacity="0.8"/>

          {/* House body */}
          <rect x="20" y="62" width="20" height="18" fill="#60A5FA" opacity="0.85"/>

          {/* Windows - warm glow */}
          <rect x="23" y="66" width="4" height="4" fill="#FCD34D" opacity="0.8"/>
          <rect x="33" y="66" width="4" height="4" fill="#FCD34D" opacity="0.8"/>

          {/* Door */}
          <rect x="28" y="72" width="4" height="8" fill="#78350F" rx="0.5"/>
        </g>

        {/* House 2 - Center (Red/Orange house) */}
        <g>
          {/* Smoke from chimney */}
          <circle cx="60" cy="45" r="1.5" fill="#9CA3AF" opacity="0.5" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
          <circle cx="61" cy="43" r="1" fill="#9CA3AF" opacity="0.3" className="animate-pulse" style={{animationDelay: '0.7s'}}/>

          {/* Roof with snow */}
          <path d="M47 58 L60 48 L73 58 Z" fill="#DC2626" opacity="0.8"/>
          <path d="M49 58 Q60 50 71 58" fill="white" opacity="0.9" strokeWidth="0"/>

          {/* Chimney */}
          <rect x="58" y="50" width="4" height="8" fill="#8B4513" opacity="0.8"/>

          {/* House body */}
          <rect x="52" y="58" width="16" height="22" fill="#F59E0B" opacity="0.85"/>

          {/* Windows - warm glow */}
          <rect x="55" y="62" width="4" height="4" fill="#FCD34D" opacity="0.8"/>
          <rect x="61" y="62" width="4" height="4" fill="#FCD34D" opacity="0.8"/>
          <rect x="58" y="69" width="4" height="4" fill="#FCD34D" opacity="0.8"/>

          {/* Door */}
          <rect x="55" y="74" width="5" height="6" fill="#78350F" rx="0.5"/>
        </g>

        {/* House 3 - Right (Purple house) */}
        <g>
          {/* Smoke from chimney */}
          <circle cx="92" cy="50" r="1.5" fill="#9CA3AF" opacity="0.5" className="animate-pulse" style={{animationDelay: '1s'}}/>
          <circle cx="93" cy="48" r="1" fill="#9CA3AF" opacity="0.3" className="animate-pulse" style={{animationDelay: '1.2s'}}/>

          {/* Roof with snow */}
          <path d="M78 64 L91 54 L104 64 Z" fill="#7C3AED" opacity="0.8"/>
          <path d="M80 64 Q91 56 102 64" fill="white" opacity="0.9" strokeWidth="0"/>

          {/* Chimney */}
          <rect x="89" y="55" width="4" height="9" fill="#8B4513" opacity="0.8"/>

          {/* House body */}
          <rect x="83" y="64" width="16" height="16" fill="#A78BFA" opacity="0.85"/>

          {/* Windows - warm glow */}
          <rect x="86" y="68" width="3" height="3" fill="#FCD34D" opacity="0.8"/>
          <rect x="93" y="68" width="3" height="3" fill="#FCD34D" opacity="0.8"/>

          {/* Door */}
          <rect x="89" y="74" width="4" height="6" fill="#78350F" rx="0.5"/>
        </g>

        {/* Snow drifts around houses */}
        <ellipse cx="30" cy="80" rx="18" ry="3" fill="white" opacity="0.4"/>
        <ellipse cx="60" cy="80" rx="15" ry="3" fill="white" opacity="0.4"/>
        <ellipse cx="91" cy="80" rx="16" ry="3" fill="white" opacity="0.4"/>

        {/* Footprints in snow */}
        <ellipse cx="42" cy="82" rx="1.5" ry="2" fill="#1E293B" opacity="0.2"/>
        <ellipse cx="44" cy="85" rx="1.5" ry="2" fill="#1E293B" opacity="0.2"/>
        <ellipse cx="46" cy="88" rx="1.5" ry="2" fill="#1E293B" opacity="0.2"/>

        {/* Small evergreen trees between houses */}
        <path d="M44 70 L46 64 L48 70 Z" fill="#065F46" opacity="0.7"/>
        <path d="M45 67 L46 64 L47 67 Z" fill="white" opacity="0.6"/>

        <path d="M74 72 L76 66 L78 72 Z" fill="#064E3B" opacity="0.7"/>
        <path d="M75 69 L76 66 L77 69 Z" fill="white" opacity="0.6"/>
      </svg>
    </div>
  );
}

// Animated Old Truck Icon with Highway, Forest & River
export function OldTruckIcon({ className = "" }: IconProps) {
  return (
    <div className={`inline-block transition-all duration-500 hover:scale-110 ${className}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Square */}
        <rect x="10" y="10" width="100" height="100" fill="#1E293B" rx="8"/>

        {/* Sky */}
        <defs>
          <linearGradient id="truckSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0.1"/>
          </linearGradient>
          <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6"/>
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6"/>
          </linearGradient>
        </defs>
        <rect x="10" y="10" width="100" height="50" fill="url(#truckSkyGradient)" rx="8"/>

        {/* Distant mountains/hills */}
        <path d="M10 60 L30 45 L50 55 L70 42 L90 50 L110 55 L110 110 L10 110 Z" fill="#334155" opacity="0.4"/>

        {/* Forest background */}
        <path d="M15 58 L19 48 L23 58 Z" fill="#065F46" opacity="0.6"/>
        <path d="M22 60 L26 50 L30 60 Z" fill="#047857" opacity="0.6"/>
        <path d="M28 59 L32 49 L36 59 Z" fill="#065F46" opacity="0.6"/>
        <path d="M75 57 L79 47 L83 57 Z" fill="#047857" opacity="0.6"/>
        <path d="M82 59 L86 49 L90 59 Z" fill="#065F46" opacity="0.6"/>
        <path d="M88 58 L92 48 L96 58 Z" fill="#047857" opacity="0.6"/>
        <path d="M95 60 L99 50 L103 60 Z" fill="#065F46" opacity="0.6"/>

        {/* River flowing through landscape */}
        <path d="M110 65 Q90 68 70 66 Q50 64 30 67 Q20 68 10 65 L10 75 Q20 73 30 75 Q50 77 70 75 Q90 73 110 75 Z"
              fill="url(#riverGradient)" opacity="0.7"/>
        <path d="M110 75 Q85 77 60 76 Q35 75 10 77" stroke="#93C5FD" strokeWidth="0.5" opacity="0.5"/>

        {/* Highway road */}
        <path d="M10 75 L110 85" stroke="#374151" strokeWidth="18" opacity="0.8"/>
        <path d="M10 75 L110 85" stroke="#4B5563" strokeWidth="16" opacity="0.9"/>

        {/* Road markings */}
        <line x1="15" y1="77" x2="25" y2="78.5" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="4,6"/>
        <line x1="35" y1="79.5" x2="45" y2="81" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="4,6"/>
        <line x1="55" y1="82" x2="65" y2="83" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="4,6"/>
        <line x1="75" y1="83.5" x2="85" y2="85" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="4,6"/>
        <line x1="95" y1="85.5" x2="105" y2="86.5" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="4,6"/>

        {/* Truck on highway */}
        <g transform="translate(25, 20)">
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
        </g>

        {/* Foreground vegetation */}
        <path d="M12 95 L15 88 L18 95 Z" fill="#059669" opacity="0.7"/>
        <path d="M102 98 L106 90 L110 98 Z" fill="#047857" opacity="0.7"/>
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

@keyframes float {
  0%, 100% { transform: translateX(0px) translateY(0px); }
  50% { transform: translateX(10px) translateY(-5px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateX(0px) translateY(0px); }
  50% { transform: translateX(-8px) translateY(-3px); }
}

@keyframes aurora {
  0%, 100% {
    transform: translateY(0px) scaleY(1);
    opacity: 0.7;
  }
  33% {
    transform: translateY(-3px) scaleY(1.1);
    opacity: 0.85;
  }
  66% {
    transform: translateY(2px) scaleY(0.95);
    opacity: 0.6;
  }
}

@keyframes aurora-delayed {
  0%, 100% {
    transform: translateY(0px) scaleY(1);
    opacity: 0.6;
  }
  33% {
    transform: translateY(2px) scaleY(0.95);
    opacity: 0.5;
  }
  66% {
    transform: translateY(-2px) scaleY(1.08);
    opacity: 0.75;
  }
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

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite;
}

.animate-aurora {
  animation: aurora 8s ease-in-out infinite;
}

.animate-aurora-delayed {
  animation: aurora-delayed 9s ease-in-out infinite;
}
`;
