/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Color tokens for the "Projeto de Monitoramento de Florestas"
export const Colors = {
  light: {
    text: '#072A1B', // deep forest text
    background: '#FFFFFF',
    backgroundElement: '#F3FFF6',
    backgroundSelected: '#E6FFF0',
    textSecondary: '#506658',
    primary: '#0B6623', // forest green
    accent: '#071E3D', // space dark blue
    warning: '#FFB400', // amber/orange for alerts
    danger: '#FF3B30', // critical red
    success: '#2E9E47',
  },
  dark: {
    text: '#FFFFFF',
    background: '#071E3D', // space dark blue
    backgroundElement: '#0F2B4A',
    backgroundSelected: '#153652',
    textSecondary: '#A3C6B7',
    primary: '#2EC18A',
    accent: '#79A9FF',
    warning: '#FFB400',
    danger: '#FF6B6B',
    success: '#48C77B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
