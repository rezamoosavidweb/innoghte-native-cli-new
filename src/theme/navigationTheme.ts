import { DarkTheme, DefaultTheme } from '@react-navigation/native';

/** Brand + surfaces used by React Navigation `theme` prop. */
export const appBrand = {
  headerBg: '#1976D2',
  headerForeground: '#ffffff',
  tabActive: '#1976D2',
  tabInactive: '#757575',
  drawerActiveBg: '#E3F2FD',
  drawerActiveTint: '#1976D2',
  drawerInactiveTint: '#757575',
  danger: '#FF3B30',
} as const;

export const navigationThemes = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: appBrand.tabActive,
      background: '#f2f2f7',
      card: '#ffffff',
      text: '#111111',
      border: '#d1d1d6',
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#64B5F6',
      background: '#000000',
      card: '#1c1c1e',
      text: '#f2f2f7',
      border: '#38383a',
    },
  },
} as const;
