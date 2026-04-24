/**
 * @format
 */

import * as React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStaticNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { useTranslation } from 'react-i18next';

import { rootNavigator } from '@/navigation/rootNavigator';
import { AppThemeProvider, useAppTheme } from '@/theme';
import i18n from '@/translations';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
    queries: { retry: false },
  },
});

const Navigation = createStaticNavigation(rootNavigator);

const AppNavigation = React.memo(function AppNavigation() {
  const { i18n: i18nInstance } = useTranslation();
  const { colorScheme, navigationTheme } = useAppTheme();

  return (
    <>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Navigation theme={navigationTheme} key={i18nInstance.language} />
    </>
  );
});

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <AppThemeProvider>
              <AppNavigation />
            </AppThemeProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
