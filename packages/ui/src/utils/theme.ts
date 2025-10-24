import { ColorVariant, SizeVariant } from '../types';

/**
 * Aurora color palette configuration
 */
export const colors = {
  'aurora-green': {
    base: '#00ff88',
    dark: '#00cc6a',
    light: '#33ffaa',
    glow: 'rgba(0, 255, 136, 0.5)',
  },
  'aurora-blue': {
    base: '#4d94ff',
    dark: '#3d7ae0',
    light: '#6da8ff',
    glow: 'rgba(77, 148, 255, 0.5)',
  },
  'aurora-purple': {
    base: '#a366ff',
    dark: '#8c52e0',
    light: '#b580ff',
    glow: 'rgba(163, 102, 255, 0.5)',
  },
  'aurora-pink': {
    base: '#ff66cc',
    dark: '#e052b3',
    light: '#ff80d6',
    glow: 'rgba(255, 102, 204, 0.5)',
  },
  midnight: {
    base: '#0a1128',
    dark: '#050814',
    light: '#151b3a',
    glow: 'rgba(10, 17, 40, 0.5)',
  },
  ice: {
    base: '#e0f2ff',
    dark: '#b8d9f5',
    light: '#f0f9ff',
    glow: 'rgba(224, 242, 255, 0.5)',
  },
  white: {
    base: '#ffffff',
    dark: '#f3f4f6',
    light: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.5)',
  },
  gray: {
    base: '#6b7280',
    dark: '#4b5563',
    light: '#9ca3af',
    glow: 'rgba(107, 114, 128, 0.5)',
  },
} as const;

/**
 * Get Tailwind CSS classes for a color variant
 */
export function getColorClasses(variant: ColorVariant, type: 'bg' | 'text' | 'border' = 'bg'): string {
  const colorMap: Record<ColorVariant, Record<typeof type, string>> = {
    'aurora-green': {
      bg: 'bg-[#00ff88] hover:bg-[#00cc6a]',
      text: 'text-[#00ff88]',
      border: 'border-[#00ff88]',
    },
    'aurora-blue': {
      bg: 'bg-[#4d94ff] hover:bg-[#3d7ae0]',
      text: 'text-[#4d94ff]',
      border: 'border-[#4d94ff]',
    },
    'aurora-purple': {
      bg: 'bg-[#a366ff] hover:bg-[#8c52e0]',
      text: 'text-[#a366ff]',
      border: 'border-[#a366ff]',
    },
    'aurora-pink': {
      bg: 'bg-[#ff66cc] hover:bg-[#e052b3]',
      text: 'text-[#ff66cc]',
      border: 'border-[#ff66cc]',
    },
    midnight: {
      bg: 'bg-[#0a1128] hover:bg-[#151b3a]',
      text: 'text-[#0a1128]',
      border: 'border-[#0a1128]',
    },
    ice: {
      bg: 'bg-[#e0f2ff] hover:bg-[#b8d9f5]',
      text: 'text-[#e0f2ff]',
      border: 'border-[#e0f2ff]',
    },
    white: {
      bg: 'bg-white hover:bg-gray-50',
      text: 'text-white',
      border: 'border-white',
    },
    gray: {
      bg: 'bg-gray-500 hover:bg-gray-600',
      text: 'text-gray-500',
      border: 'border-gray-500',
    },
  };

  return colorMap[variant][type];
}

/**
 * Get size classes for components
 */
export function getSizeClasses(size: SizeVariant, type: 'padding' | 'text' | 'icon' = 'padding'): string {
  const sizeMap: Record<SizeVariant, Record<typeof type, string>> = {
    xs: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      icon: 'w-3 h-3',
    },
    sm: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      padding: 'px-4 py-2',
      text: 'text-base',
      icon: 'w-5 h-5',
    },
    lg: {
      padding: 'px-6 py-3',
      text: 'text-lg',
      icon: 'w-6 h-6',
    },
    xl: {
      padding: 'px-8 py-4',
      text: 'text-xl',
      icon: 'w-8 h-8',
    },
  };

  return sizeMap[size][type];
}

/**
 * Pixel shadow utility for retro aesthetic
 */
export function getPixelShadow(color: ColorVariant = 'midnight'): string {
  return `shadow-[4px_4px_0px_0px_${colors[color].base}]`;
}
