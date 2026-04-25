import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import { semantic, type ColorSchemeName } from '@/shared/styles/theme/core/semantic';

function buildNavigationTheme(scheme: ColorSchemeName): Theme {
  const s = semantic[scheme];
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: scheme === 'dark',
    colors: {
      ...base.colors,
      primary: s.primary,
      background: s.background,
      card: s.card,
      text: s.text,
      border: s.border,
      notification: s.danger,
    },
  };
}

export const navigationThemes = {
  light: buildNavigationTheme('light'),
  dark: buildNavigationTheme('dark'),
} as const;

/** Navigation theme + brand values for the active color scheme (header / drawer options). */
export function getChromeForScheme(scheme: ColorSchemeName) {
  const s = semantic[scheme];
  return {
    theme: navigationThemes[scheme],
    brand: {
      headerBg: s.headerBg,
      headerForeground: s.headerForeground,
      tabActive: s.tabActive,
      tabInactive: s.tabInactive,
      drawerActiveBg: s.drawerActiveBg,
      drawerActiveTint: s.drawerActiveTint,
      drawerInactiveTint: s.drawerInactiveTint,
      danger: s.danger,
    },
  } as const;
}
