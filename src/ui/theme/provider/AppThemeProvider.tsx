import * as React from 'react';

import type { DesignTokens } from '@/ui/theme/core/designTokens';
import { designTokens } from '@/ui/theme/core/designTokens';
import { navigationThemes } from '@/ui/theme/core/navigationTheme';
import type { ColorSchemeName } from '@/ui/theme/core/semantic';

type AppThemeContextValue = {
  colorScheme: ColorSchemeName;
  tokens: DesignTokens;
  navigationTheme: (typeof navigationThemes)['light'];
};

const AppThemeContext = React.createContext<AppThemeContextValue | null>(null);

type Props = {
  children: React.ReactNode;
  colorScheme: ColorSchemeName;
};

export function AppThemeProvider({ children, colorScheme }: Props) {
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
