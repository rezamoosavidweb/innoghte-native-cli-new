import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useCurrentUser, useIsAuthenticated } from '@/domains/auth';
import { useUiThemeStore } from '@/domains/settings';
import { initialsFromDisplayName } from '@/shared/utils/initialsFromDisplayName';
import { resolveDisplayName } from '@/shared/utils/resolveDisplayName';
import { ErrorBoundary } from '@/ui/components/ErrorBoundary';
import { ToastHost } from '@/shared/ui/toast';
import { ShellDrawerProvider } from '@/ui/layout/ShellDrawerContext';
import { AppThemeProvider } from '@/ui/theme';
import { StatusBarChromeProvider } from '@/ui/statusBar';

type BridgeShellProps = { children: React.ReactNode };

/**
 * Application composition edge: the only place that wires domain state into
 * shared/ui primitives. The rest of `app/` is shell + routing.
 */
export function BridgeShell({ children }: BridgeShellProps) {
  const { t } = useTranslation();
  const colorScheme = useUiThemeStore(s => s.preference);

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
    const displayName = resolveDisplayName(user, t);
    return {
      isAuthenticated: true,
      displayName,
      emailLine: user?.email?.trim() ? user.email : t('drawer.user.noEmail'),
      avatarInitials: initialsFromDisplayName(displayName),
    };
  }, [isAuthenticated, t, user]);

  const shellDrawer = React.useMemo(
    () => ({
      user: shellUser,
    }),
    [shellUser],
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
