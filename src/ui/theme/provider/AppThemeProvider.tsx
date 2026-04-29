import * as React from 'react';

import type { DesignTokens } from '@/ui/theme/core/designTokens';
import { designTokens } from '@/ui/theme/core/designTokens';
import { navigationThemes } from '@/ui/theme/core/navigationTheme';
import { themes } from '@/ui/theme/registry';
import type { AppTheme, ColorSchemeName, ThemeColors } from '@/ui/theme/types';

type AppThemeContextValue = {
  /** Active scheme name. */
  colorScheme: ColorSchemeName;
  /** Full semantic theme — preferred entry point for components. */
  theme: AppTheme;
  /** Static design-token bundle (spacing, typography, raw palette). */
  tokens: DesignTokens;
  /** React Navigation theme for the active scheme. */
  navigationTheme: (typeof navigationThemes)['light'];
};

const AppThemeContext = React.createContext<AppThemeContextValue | null>(null);

/**
 * Pre-built context values, one per supported scheme. Because each entry's
 * `theme`, `tokens` and `navigationTheme` references are stable module-level
 * constants, these objects never change between renders — switching schemes
 * is a pointer swap, not an allocation.
 */
const contextValueByScheme: Readonly<
  Record<ColorSchemeName, AppThemeContextValue>
> = Object.freeze({
  dark: {
    colorScheme: 'dark',
    theme: themes.dark,
    tokens: designTokens,
    navigationTheme: navigationThemes.dark,
  },
  light: {
    colorScheme: 'light',
    theme: themes.light,
    tokens: designTokens,
    navigationTheme: navigationThemes.light,
  },
});

type Props = {
  children: React.ReactNode;
  colorScheme: ColorSchemeName;
};

export function AppThemeProvider({ children, colorScheme }: Props) {
  const value = contextValueByScheme[colorScheme];

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme(): AppThemeContextValue {
  const ctx = React.useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return ctx;
}

/**
 * Convenience selector for `useAppTheme().theme.colors`. Returned reference
 * is stable for a given scheme so it's safe in `useMemo` deps.
 */
export function useThemeColors(): ThemeColors {
  return useAppTheme().theme.colors;
}
