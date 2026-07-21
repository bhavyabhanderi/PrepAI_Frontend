/**
 * Theme Configuration
 * Color palette based on the provided design system:
 * - Deep Purple (#533086) - Primary dark
 * - Blue Indigo (#4A4DC9) - Primary accent
 * - Orange (#FC9145) - CTA / Accent
 * - Lavender (#C1C1EA) - Soft secondary
 * - Peach (#FFF3E4) - Warm background accent
 * - Neutrals: #4E4E4E, #CACACA, #EBEBEB, #F5F5F5
 */

export const colors = {
  primary: {
    deepPurple: '#533086',
    indigo: '#4A4DC9',
    lavender: '#C1C1EA',
  },
  accent: {
    orange: '#FC9145',
    peach: '#FFF3E4',
  },
  neutral: {
    900: '#1a1a2e',
    800: '#2d2d44',
    700: '#4E4E4E',
    500: '#8888A0',
    400: '#CACACA',
    300: '#DDDDF0',
    200: '#EBEBEB',
    100: '#F5F5F5',
    50: '#FAFAFE',
  },
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#4A4DC9',
};

export const THEME_MODES = {
  DARK: 'dark',
  LIGHT: 'light',
};
