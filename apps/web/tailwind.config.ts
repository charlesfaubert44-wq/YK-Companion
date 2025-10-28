import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Aurora-inspired color palette (True North Trips brand)
        // YellowBuddy brand colors - Your Friendly Yellowknife Companion
        buddy: {
          yellow: '#FFD700',   // Primary warm gold
          gold: '#FFA500',     // Accent orange-gold
        },
        aurora: {
          50: '#e6fff5',
          100: '#b3ffe0',
          200: '#80ffcc',
          300: '#4dffb8',
          400: '#1affa3',
          500: '#00e68a',
          600: '#00b36b',
          700: '#00804d',
          800: '#004d2e',
          900: '#001a0f',
          green: '#00ff88',   // CTAs, energy, success
          blue: '#4d94ff',    // Trust, secondary actions
          purple: '#a366ff',  // Culture, premium
          pink: '#ff66cc',    // Accents, warmth
        },
        northern: {
          sky: '#87ceeb',
          ice: '#e0f2ff',      // Ice White - light backgrounds
          midnight: '#0a1128', // Northern Midnight - backgrounds
          snow: '#f0f9ff',     // Ice White variant
          forest: '#1a3d2e',
        },
        // Territory-specific accent colors (for future expansion)
        territory: {
          yukon: '#fbbf24',    // Yukon Gold
          nunavut: '#1e3a8a',  // Nunavut Navy
          nwt: '#059669',      // NWT Forest
        },
        dark: {
          900: '#0a0e1a',
          800: '#151b2e',
          700: '#1f2937',
        },
        slate: {
          DEFAULT: '#64748b', // Slate Gray - body text
        },
        // Pixel UI colors
        pixel: {
          white: '#ffffff',
          black: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        pixel: ['var(--font-pixel)', 'monospace'], // Pixel art font
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #00ff88 0%, #4d94ff 50%, #a366ff 100%)',
        'night-sky': 'linear-gradient(to bottom, #0a1128 0%, #1a2844 100%)',
        'winter-gradient': 'linear-gradient(to bottom, #e0f2ff 0%, #ffffff 100%)',
      },
      boxShadow: {
        'aurora': '0 0 30px rgba(0, 255, 136, 0.3)',
        'glow': '0 0 20px rgba(77, 148, 255, 0.4)',
        // Pixel UI shadows (retro 8-bit style drop shadows)
        'pixel-green': '4px 4px 0px rgba(0, 255, 136, 1)',
        'pixel-blue': '4px 4px 0px rgba(77, 148, 255, 1)',
        'pixel-purple': '4px 4px 0px rgba(163, 102, 255, 1)',
        'pixel-hover': '2px 2px 0px rgba(255, 255, 255, 0.8)',
      },
      keyframes: {
        aurora: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
      animation: {
        aurora: 'aurora 15s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 3s ease-in-out infinite',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for pixel UI components
    function({ addComponents }: any) {
      addComponents({
        '.card-pixel': {
          '@apply bg-dark-900 border-4 relative overflow-hidden': {},
          'image-rendering': 'pixelated',
        },
        '.card-pixel-hover': {
          '@apply transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px]': {},
        },
        '.text-pixel-shadow': {
          'text-shadow': '2px 2px 0px rgba(0, 0, 0, 0.8)',
        },
        '.border-pixel-white': {
          '@apply border-white': {},
        },
      });
    },
  ],
};

export default config;
