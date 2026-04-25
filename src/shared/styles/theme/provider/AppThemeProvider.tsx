import * as React from 'react';
import { useColorScheme } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import {
  resolveColorScheme,
  useUiThemeStore,
} from '@/shared/store/uiTheme.store';

import type { DesignTokens } from '@/shared/styles/theme/core/designTokens';
import { designTokens } from '@/shared/styles/theme/core/designTokens';
import { navigationThemes } from '@/shared/styles/theme/core/navigationTheme';
import type { ColorSchemeName } from '@/shared/styles/theme/core/semantic';

type AppThemeContextValue = {
  colorScheme: ColorSchemeName;
  tokens: DesignTokens;
  navigationTheme: (typeof navigationThemes)['light'];
};

const AppThemeContext = React.createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const rawSystem = useColorScheme();
  const systemScheme =
    rawSystem === 'dark' ? 'dark' : rawSystem === 'light' ? 'light' : null;
  const preference = useUiThemeStore(useShallow(s => s.preference));

  const colorScheme = React.useMemo(
    () => resolveColorScheme(preference, systemScheme),
    [preference, systemScheme],
  );

  const value = React.useMemo<AppThemeContextValue>(
    () => ({
      colorScheme,
      tokens: designTokens,
      navigationTheme: navigationThemes[colorScheme],
    }),
    [colorScheme],
  );

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
