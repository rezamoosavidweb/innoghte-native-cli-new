import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import { themes } from '@/ui/theme/registry';
import type { ColorSchemeName } from '@/ui/theme/types';

/**
 * Build the `@react-navigation/native` Theme from our semantic palette so
 * `useTheme().colors` reflects the same source of truth as
 * `useAppTheme().theme.colors`. Anything beyond the navigation contract
 * (header / drawer / chip roles) lives on the AppTheme — this only fills
 * the navigation slots.
 */
function buildNavigationTheme(scheme: ColorSchemeName): Theme {
  const c = themes[scheme].colors;
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: scheme === 'dark',
    colors: {
      ...base.colors,
      primary: c.primary,
      background: c.background,
      card: c.card,
      text: c.text,
      border: c.border,
      notification: c.error,
    },
  };
}

export const navigationThemes = {
  light: buildNavigationTheme('light'),
  dark: buildNavigationTheme('dark'),
} as const;

/** Navigation theme + brand values for the active color scheme (header / drawer options). */
export function getChromeForScheme(scheme: ColorSchemeName) {
  const c = themes[scheme].colors;
  return {
    theme: navigationThemes[scheme],
    brand: {
      headerBg: c.headerBg,
      headerForeground: c.headerForeground,
      tabActive: c.tabActive,
      tabInactive: c.tabInactive,
      drawerActiveBg: c.drawerActiveBg,
      drawerActiveTint: c.drawerActiveTint,
      drawerInactiveTint: c.drawerInactiveTint,
      danger: c.error,
    },
  } as const;
}
