/**
 * Application Theme Configuration
 * Defines colors, typography, spacing, and border radius tokens
 */

export const COLORS = {
  // Primary colors
  primary: '#FFFFFF',
  secondary: '#808080',

  // Background colors
  background: '#000000',
  surface: '#1A1A1A',
  surfaceLight: '#2A2A2A',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#808080',
  textMuted: '#666666',

  // Border colors
  border: '#333333',
  borderLight: '#444444',

  // Semantic colors
  success: '#4CAF50',
  error: '#FF5252',
  warning: '#FFC107',

  // Component specific
  inputBackground: '#1E1E1E',
  buttonDisabled: '#333333',
  buttonDisabledText: '#666666',
} as const;

export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  title: 28,
  header: 36,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export type ColorKey = keyof typeof COLORS;
export type FontKey = keyof typeof FONTS;
export type FontSizeKey = keyof typeof FONT_SIZES;
export type SpacingKey = keyof typeof SPACING;
export type BorderRadiusKey = keyof typeof BORDER_RADIUS;
