/**
 * Color and theme utilities for YK Buddy
 * Provides functions for color manipulation, aurora theme generation, and accessibility
 */

/**
 * Aurora color palette (from brand guidelines)
 */
export const AURORA_COLORS = {
  green: {
    primary: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  blue: {
    primary: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
  },
  purple: {
    primary: '#8B5CF6',
    light: '#A78BFA',
    dark: '#7C3AED',
  },
  pink: {
    primary: '#F472B6',
    light: '#F9A8D4',
    dark: '#EC4899',
  },
} as const;

/**
 * Northern theme colors
 */
export const NORTHERN_COLORS = {
  midnight: '#0A1128',
  gold: '#FFD700',
  ice: '#E0F2FE',
  snow: '#F8FAFC',
} as const;

/**
 * Convert hex color to RGB values
 * @param hex - Hex color code (with or without #)
 * @returns RGB object { r, g, b }
 * @example
 * hexToRgb('#10B981') // { r: 16, g: 185, b: 129 }
 * hexToRgb('3B82F6') // { r: 59, g: 130, b: 246 }
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '');

  if (cleanHex.length !== 6) return null;

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Convert RGB to hex color
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color code
 * @example
 * rgbToHex(16, 185, 129) // '#10B981'
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert hex color to HSL values
 * @param hex - Hex color code
 * @returns HSL object { h, s, l }
 * @example
 * hexToHsl('#10B981') // { h: 160, s: 84, l: 39 }
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Lighten a color by a percentage
 * @param hex - Hex color code
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened hex color
 * @example
 * lightenColor('#10B981', 20) // Lighter green
 * lightenColor('#3B82F6', 50) // Much lighter blue
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = 1 + percent / 100;
  const r = Math.min(255, rgb.r * factor);
  const g = Math.min(255, rgb.g * factor);
  const b = Math.min(255, rgb.b * factor);

  return rgbToHex(r, g, b);
}

/**
 * Darken a color by a percentage
 * @param hex - Hex color code
 * @param percent - Percentage to darken (0-100)
 * @returns Darkened hex color
 * @example
 * darkenColor('#10B981', 20) // Darker green
 * darkenColor('#3B82F6', 50) // Much darker blue
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = 1 - percent / 100;
  const r = Math.max(0, rgb.r * factor);
  const g = Math.max(0, rgb.g * factor);
  const b = Math.max(0, rgb.b * factor);

  return rgbToHex(r, g, b);
}

/**
 * Add alpha/opacity to a hex color
 * @param hex - Hex color code
 * @param opacity - Opacity value (0-1)
 * @returns RGBA CSS string
 * @example
 * addOpacity('#10B981', 0.5) // 'rgba(16, 185, 129, 0.5)'
 * addOpacity('#3B82F6', 0.2) // 'rgba(59, 130, 246, 0.2)'
 */
export function addOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampedOpacity})`;
}

/**
 * Generate a gradient CSS string between two colors
 * @param color1 - Start color (hex)
 * @param color2 - End color (hex)
 * @param direction - Gradient direction
 * @returns CSS gradient string
 * @example
 * generateGradient('#10B981', '#3B82F6', 'to right')
 * // 'linear-gradient(to right, #10B981, #3B82F6)'
 */
export function generateGradient(
  color1: string,
  color2: string,
  direction: string = 'to right'
): string {
  return `linear-gradient(${direction}, ${color1}, ${color2})`;
}

/**
 * Generate aurora gradient (multiple colors)
 * @param kpIndex - Aurora KP index (affects color intensity)
 * @returns CSS gradient string
 * @example
 * generateAuroraGradient(3) // Green-blue gradient
 * generateAuroraGradient(7) // Full spectrum aurora gradient
 */
export function generateAuroraGradient(kpIndex: number): string {
  if (kpIndex >= 7) {
    // Outstanding - full spectrum
    return `linear-gradient(135deg, ${AURORA_COLORS.green.primary}, ${AURORA_COLORS.blue.primary}, ${AURORA_COLORS.purple.primary}, ${AURORA_COLORS.pink.primary})`;
  }
  if (kpIndex >= 5) {
    // Excellent - green, blue, purple
    return `linear-gradient(135deg, ${AURORA_COLORS.green.primary}, ${AURORA_COLORS.blue.primary}, ${AURORA_COLORS.purple.primary})`;
  }
  if (kpIndex >= 3) {
    // Good - green and blue
    return `linear-gradient(135deg, ${AURORA_COLORS.green.primary}, ${AURORA_COLORS.blue.primary})`;
  }
  // Fair/Poor - mostly green
  return `linear-gradient(135deg, ${AURORA_COLORS.green.dark}, ${AURORA_COLORS.green.light})`;
}

/**
 * Get contrast ratio between two colors (WCAG)
 * @param hex1 - First color (hex)
 * @param hex2 - Second color (hex)
 * @returns Contrast ratio (1-21)
 * @example
 * getContrastRatio('#10B981', '#FFFFFF') // ~2.8
 * getContrastRatio('#0A1128', '#FFFFFF') // ~15.4 (better contrast)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      const normalized = val / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if a color combination meets WCAG AA standards
 * @param textColor - Text color (hex)
 * @param bgColor - Background color (hex)
 * @param largeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns True if combination meets WCAG AA
 * @example
 * meetsWCAGAA('#10B981', '#0A1128', false) // true
 * meetsWCAGAA('#34D399', '#FFFFFF', false) // false (insufficient contrast)
 */
export function meetsWCAGAA(
  textColor: string,
  bgColor: string,
  largeText: boolean = false
): boolean {
  const ratio = getContrastRatio(textColor, bgColor);
  return largeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Get a color from the aurora palette by name
 * @param name - Color name
 * @param shade - Shade variant ('primary', 'light', 'dark')
 * @returns Hex color code
 * @example
 * getAuroraColor('green', 'primary') // '#10B981'
 * getAuroraColor('blue', 'light') // '#60A5FA'
 */
export function getAuroraColor(
  name: keyof typeof AURORA_COLORS,
  shade: 'primary' | 'light' | 'dark' = 'primary'
): string {
  return AURORA_COLORS[name][shade];
}

/**
 * Generate complementary color (opposite on color wheel)
 * @param hex - Hex color code
 * @returns Complementary hex color
 * @example
 * getComplementaryColor('#10B981') // Returns complementary color
 */
export function getComplementaryColor(hex: string): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  // Rotate hue by 180 degrees
  const compH = (hsl.h + 180) % 360;

  return hslToHex(compH, hsl.s, hsl.l);
}

/**
 * Convert HSL to hex color
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color code
 */
export function hslToHex(h: number, s: number, l: number): string {
  const hDecimal = h / 360;
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  let r, g, b;

  if (sDecimal === 0) {
    r = g = b = lDecimal;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q =
      lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
    const p = 2 * lDecimal - q;

    r = hue2rgb(p, q, hDecimal + 1 / 3);
    g = hue2rgb(p, q, hDecimal);
    b = hue2rgb(p, q, hDecimal - 1 / 3);
  }

  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

/**
 * Generate a random aurora color
 * @returns Random aurora color (hex)
 * @example
 * getRandomAuroraColor() // '#10B981' or '#3B82F6' or '#8B5CF6' or '#F472B6'
 */
export function getRandomAuroraColor(): string {
  const colors = Object.values(AURORA_COLORS);
  const randomColorSet = colors[Math.floor(Math.random() * colors.length)];
  const shades = Object.values(randomColorSet);
  return shades[Math.floor(Math.random() * shades.length)];
}
