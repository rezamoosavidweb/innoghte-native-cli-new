import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useShallow } from 'zustand/react/shallow';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';

import { logout, useCurrentUser, useIsAuthenticated } from '@/domains/auth';
import { useUiThemeStore } from '@/domains/settings';
import { UserService } from '@/domains/user';
import { fireAndForget } from '@/shared/infra/http';
import { initialsFromDisplayName } from '@/shared/utils/initialsFromDisplayName';
import type { ThemeMode } from '@/shared/contracts/theme';
import { resolveColorScheme } from '@/shared/utils/resolveColorScheme';
import { themes } from '@/ui/theme/registry';
import { isDrawerPhysicalRight } from '@/app/navigation/drawerLayout';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';
import { ToastHost } from '@/shared/ui/toast';
import { ShellDrawerProvider } from '@/ui/layout/ShellDrawerContext';
import { AppThemeProvider } from '@/ui/theme';
import { StatusBarChromeProvider } from '@/ui/statusBar';

UserService.registerPurchaseLookup();

type BridgeShellProps = { children: React.ReactNode };

/**
 * Application composition edge: the only place that wires domain state into
 * shared/ui primitives. The rest of `app/` is shell + routing.
 */
export function BridgeShell({ children }: BridgeShellProps) {
  const { t } = useTranslation();
  const rawSystem = useColorScheme();
  const systemScheme =
    rawSystem === 'dark' ? 'dark' : rawSystem === 'light' ? 'light' : null;
  const preference = useUiThemeStore(useShallow(s => s.preference));

  const colorScheme = React.useMemo((): ThemeMode => {
    const resolved = resolveColorScheme(preference, systemScheme);
    return resolved in themes ? resolved : 'light';
  }, [preference, systemScheme]);

  const onRequestLogout = React.useCallback(() => logout(), []);

  const isAuthenticated = useIsAuthenticated();
  const { data: userRes } = useCurrentUser();
  const user = userRes?.data;

  const shellUser = React.useMemo(() => {
    if (!isAuthenticated) {
      return {
        isAuthenticated: false,
        displayName: t('drawer.user.signedOut'),
        emailLine: t('drawer.user.signInHint'),
        avatarInitials: '—',
      };
    }
    const displayName = (
      user?.full_name?.trim() ||
      [user?.name, user?.family].filter(Boolean).join(' ').trim() ||
      t('drawer.user.fallbackName')
    ).trim();
    return {
      isAuthenticated: true,
      displayName,
      emailLine: user?.email?.trim() ? user.email : t('drawer.user.noEmail'),
      avatarInitials: initialsFromDisplayName(displayName),
    };
  }, [isAuthenticated, t, user]);

  React.useEffect(() => {
    if (isAuthenticated) {
      fireAndForget(UserService.refreshPurchasedProductIds());
    } else {
      UserService.clearPurchasedProductIds();
    }
  }, [isAuthenticated]);

  const isDrawerOnPhysicalRight = isDrawerPhysicalRight();
  const shellDrawer = React.useMemo(
    () => ({
      onRequestLogout,
      isDrawerOnPhysicalRight,
      user: shellUser,
    }),
    [onRequestLogout, isDrawerOnPhysicalRight, shellUser],
  );

  return (
    <ErrorBoundary>
      <AppThemeProvider colorScheme={colorScheme}>
        <BottomSheetModalProvider>
          <StatusBarChromeProvider>
            <ShellDrawerProvider value={shellDrawer}>{children}</ShellDrawerProvider>
            <ToastHost />
          </StatusBarChromeProvider>
        </BottomSheetModalProvider>
      </AppThemeProvider>
    </ErrorBoundary>
  );
}
