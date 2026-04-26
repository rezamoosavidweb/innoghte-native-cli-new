import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BridgeShell } from '@/app/bridge/BridgeShell';
import i18n from '@/shared/infra/i18n';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
    queries: { retry: false },
  },
});

type RootProvidersProps = {
  children: React.ReactNode;
};

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <BridgeShell>{children}</BridgeShell>
        </SafeAreaProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
