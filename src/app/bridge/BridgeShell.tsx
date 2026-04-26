import { useShallow } from 'zustand/react/shallow';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';

import { logout } from '@/domains/auth/api/auth.service';
import { useCurrentUser } from '@/domains/auth/hooks/useCurrentUser';
import { useAuthStore } from '@/domains/auth/model/auth.store';
import { useUiThemeStore } from '@/domains/settings/model/uiTheme.store';
import { registerUserPurchaseLookup } from '@/domains/user/hooks/registerUserPurchaseLookup';
import { fetchAndApplyPurchasedProductIds } from '@/domains/user/api/fetchPurchasedProductIds';
import { usePurchasedProductIdsStore } from '@/domains/user/model/purchases/purchasedProductIds.store';
import { navigationRef } from '@/shared/infra/navigation/navigationRef';
import { initialsFromDisplayName } from '@/shared/utils/initialsFromDisplayName';
import { resolveColorScheme } from '@/shared/utils/resolveColorScheme';
import { isDrawerPhysicalRight } from '@/app/navigation/drawerLayout';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';
import { ShellDrawerProvider } from '@/ui/layout/ShellDrawerContext';
import { AppThemeProvider } from '@/ui/theme';

registerUserPurchaseLookup();

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

  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
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
      fetchAndApplyPurchasedProductIds().catch(() => {});
    } else {
      usePurchasedProductIdsStore.getState().clear();
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
        <ShellDrawerProvider value={shellDrawer}>{children}</ShellDrawerProvider>
      </AppThemeProvider>
    </ErrorBoundary>
  );
}
