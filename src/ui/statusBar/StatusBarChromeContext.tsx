import * as React from 'react';
import { Platform, StatusBar } from 'react-native';

import { useAppTheme } from '@/ui/theme/provider/AppThemeProvider';

import { inferStatusBarContentStyle } from '@/ui/statusBar/inferStatusBarContentStyle';

export type StatusBarChromeConfig = {
  backgroundColor: string;
  barStyle: 'light-content' | 'dark-content';
};

type StatusBarChromeContextValue = {
  setOverride: (config: StatusBarChromeConfig | null) => void;
};

const StatusBarChromeContext =
  React.createContext<StatusBarChromeContextValue | null>(null);

/**
 * Owns a single {@link StatusBar} bound to {@link theme.colors.headerBg} and
 * coordinates per-screen overrides from {@link useScreenStatusBar}.
 */
export function StatusBarChromeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useAppTheme();

  const baseline = React.useMemo(
    (): StatusBarChromeConfig => ({
      backgroundColor: theme.colors.headerBg,
      barStyle: inferStatusBarContentStyle(theme.colors.headerBg),
    }),
    [theme.colors.headerBg],
  );

  const [override, setOverride] = React.useState<StatusBarChromeConfig | null>(
    null,
  );

  React.useEffect(() => {
    setOverride(null);
  }, [baseline]);

  const setOverrideStable = React.useCallback((config: StatusBarChromeConfig | null) => {
    setOverride(config);
  }, []);

  const value = React.useMemo(
    (): StatusBarChromeContextValue => ({
      setOverride: setOverrideStable,
    }),
    [setOverrideStable],
  );

  const active = override ?? baseline;

  return (
    <StatusBarChromeContext.Provider value={value}>
      <StatusBar
        backgroundColor={
          Platform.OS === 'android' ? active.backgroundColor : undefined
        }
        barStyle={active.barStyle}
        translucent={false}
      />
      {children}
    </StatusBarChromeContext.Provider>
  );
}

export function useStatusBarChromeContext(): StatusBarChromeContextValue {
  const ctx = React.useContext(StatusBarChromeContext);
  if (!ctx) {
    throw new Error(
      'Status bar chrome requires StatusBarChromeProvider (see BridgeShell).',
    );
  }
  return ctx;
}
