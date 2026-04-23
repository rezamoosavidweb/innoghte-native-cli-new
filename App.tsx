/**
 * @format
 */

import * as React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStaticNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { useTranslation } from 'react-i18next';

import { rootNavigator } from './src/navigation/rootNavigator';
import { navigationThemes } from './src/theme/navigationTheme';
import i18n from './src/translations';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
    queries: { retry: false },
  },
});

const Navigation = createStaticNavigation(rootNavigator);

const AppNavigation = React.memo(function AppNavigation() {
  const { i18n: i18nInstance } = useTranslation();
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? navigationThemes.dark : navigationThemes.light;

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Navigation theme={theme} key={i18nInstance.language} />
    </>
  );
});

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <AppNavigation />
          </SafeAreaProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
