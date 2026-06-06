import '@/app/bridge/wireAppHttpClient';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

import { installNavigationGuard } from '@/app/bridge/auth/navigationGuard';
import { APP_LINKING_PREFIXES } from '@/app/bridge/auth/linkingAuth';
import { rootNavigator } from '@/app/bridge/rootNavigator';
import { navigationRef } from '@/shared/infra/navigation/navigationRef';
import { RootProviders } from '@/app/providers/RootProviders';
import { useAppTheme } from '@/ui/theme';

export { queryClient } from '@/app/queryClient';

const Navigation = createStaticNavigation(rootNavigator);

/**
 * Deep links. Payment gateways redirect back to `…/payment/result?Authority=…&Status=…`
 * (or `?token=…&PayerID=…` for PayPal); the query string maps onto
 * `PaymentResultParams`. Per-screen paths live in the static navigator
 * (`linking: 'payment/result'`); prefixes come from {@link APP_LINKING_PREFIXES}.
 */
const linking = {
  prefixes: [...APP_LINKING_PREFIXES],
};

const AppNavigation = React.memo(function AppNavigation() {
  const { i18n: i18nInstance } = useTranslation();
  const { navigationTheme } = useAppTheme();

  return (
    <>
      <Navigation
        ref={navigationRef}
        theme={navigationTheme}
        linking={linking}
        key={i18nInstance.language}
      />
    </>
  );
});

export default function App() {
  React.useEffect(() => installNavigationGuard(), []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <RootProviders>
        <AppNavigation />
      </RootProviders>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
