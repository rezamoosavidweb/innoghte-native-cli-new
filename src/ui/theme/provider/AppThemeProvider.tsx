import * as React from 'react';
import type { DesignTokens } from '@/ui/theme/core/designTokens';
import { designTokens } from '@/ui/theme/core/designTokens';
import { navigationThemes } from '@/ui/theme/core/navigationTheme';
import type { NavigationThemeWithScheme } from '@/ui/theme/navigationThemeContract';
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
  navigationTheme: NavigationThemeWithScheme;
};

const AppThemeContext = React.createContext<AppThemeContextValue | null>(null);

function buildContextValue(scheme: ColorSchemeName): AppThemeContextValue {
  return Object.freeze({
    colorScheme: scheme,
    theme: themes[scheme],
    tokens: designTokens,
    navigationTheme: navigationThemes[scheme],
  });
}

/**
 * Pre-built context values, one per supported scheme. Because each entry's
 * `theme`, `tokens` and `navigationTheme` references are stable module-level
 * constants, these objects never change between renders — switching schemes
 * is a pointer swap, not an allocation.
 */
const contextValueByScheme = Object.freeze(
  Object.fromEntries(
    (Object.keys(themes) as ColorSchemeName[]).map(scheme => [
      scheme,
      buildContextValue(scheme),
    ]),
  ),
) as Readonly<Record<ColorSchemeName, AppThemeContextValue>>;

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
