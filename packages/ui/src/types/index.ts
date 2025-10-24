import { ReactNode } from 'react';

/**
 * Aurora color variants matching the YK-Companion theme
 */
export type ColorVariant =
  | 'aurora-green'
  | 'aurora-blue'
  | 'aurora-purple'
  | 'aurora-pink'
  | 'midnight'
  | 'ice'
  | 'white'
  | 'gray';

/**
 * Component size variants
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button and interactive component variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';

/**
 * Common props for all components
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Props for components with visual feedback states
 */
export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Alert and notification severity levels
 */
export type Severity = 'success' | 'error' | 'warning' | 'info';

/**
 * Position variants for floating components
 */
export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Animation variants
 */
export type Animation = 'fade' | 'slide' | 'bounce' | 'scale' | 'aurora-glow';
