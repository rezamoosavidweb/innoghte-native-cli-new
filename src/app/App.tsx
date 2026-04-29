import '@/app/bridge/wireAppHttpClient';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

import { rootNavigator } from '@/app/bridge/rootNavigator';
import { navigationRef } from '@/shared/infra/navigation/navigationRef';
import { RootProviders } from '@/app/providers/RootProviders';
import { useAppTheme } from '@/ui/theme';

export { queryClient } from '@/app/providers/RootProviders';

const Navigation = createStaticNavigation(rootNavigator);

const AppNavigation = React.memo(function AppNavigation() {
  const { i18n: i18nInstance } = useTranslation();
  const { navigationTheme } = useAppTheme();

  return (
    <>
      <Navigation
        ref={navigationRef}
        theme={navigationTheme}
        key={i18nInstance.language}
      />
    </>
  );
});

export default function App() {
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
