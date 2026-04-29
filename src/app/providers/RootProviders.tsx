import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/app/queryClient';
import { BridgeShell } from '@/app/bridge/BridgeShell';
import i18n from '@/shared/infra/i18n';

export { queryClient };

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
