import * as React from 'react';

import type { ShellDrawerUiModel } from '@/shared/contracts/shellUi';

const ShellDrawerContext = React.createContext<ShellDrawerUiModel | null>(null);

export function ShellDrawerProvider({
  value,
  children,
}: {
  value: ShellDrawerUiModel;
  children: React.ReactNode;
}) {
  return (
    <ShellDrawerContext.Provider value={value}>
      {children}
    </ShellDrawerContext.Provider>
  );
}

export function useShellDrawerModel(): ShellDrawerUiModel {
  const ctx = React.useContext(ShellDrawerContext);
  if (!ctx) {
    throw new Error('useShellDrawerModel must be used under ShellDrawerProvider');
  }
  return ctx;
}
