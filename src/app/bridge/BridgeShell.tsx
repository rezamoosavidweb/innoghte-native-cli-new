import { useShallow } from 'zustand/react/shallow';
import * as React from 'react';
import { useColorScheme } from 'react-native';

import { logout } from '@/domains/auth/api/auth.service';
import { useUiThemeStore } from '@/domains/settings/model/uiTheme.store';
import { registerUserPurchaseLookup } from '@/domains/user/hooks/registerUserPurchaseLookup';
import { navigationRef } from '@/shared/infra/navigation/navigationRef';
import { resolveColorScheme } from '@/shared/utils/resolveColorScheme';
import { isDrawerPhysicalRight } from '@/app/navigation/drawerLayout';
import { ShellDrawerProvider } from '@/ui/layout/ShellDrawerContext';
import { AppThemeProvider } from '@/ui/theme';

registerUserPurchaseLookup();

type BridgeShellProps = { children: React.ReactNode };

/**
 * Application composition edge: the only place that wires domain state into
 * shared/ui primitives. The rest of `app/` is shell + routing.
 */
export function BridgeShell({ children }: BridgeShellProps) {
  const rawSystem = useColorScheme();
  const systemScheme =
    rawSystem === 'dark' ? 'dark' : rawSystem === 'light' ? 'light' : null;
  const preference = useUiThemeStore(useShallow(s => s.preference));

  const colorScheme = React.useMemo(
    () => resolveColorScheme(preference, systemScheme),
    [preference, systemScheme],
  );

  const onRequestLogout = React.useCallback(async () => {
    await logout();
    if (navigationRef.isReady()) {
      navigationRef.navigate('Login');
    }
  }, []);

  const isDrawerOnPhysicalRight = isDrawerPhysicalRight();
  const shellDrawer = React.useMemo(
    () => ({
      onRequestLogout,
      isDrawerOnPhysicalRight,
    }),
    [onRequestLogout, isDrawerOnPhysicalRight],
  );

  return (
    <AppThemeProvider colorScheme={colorScheme}>
      <ShellDrawerProvider value={shellDrawer}>{children}</ShellDrawerProvider>
    </AppThemeProvider>
  );
}
