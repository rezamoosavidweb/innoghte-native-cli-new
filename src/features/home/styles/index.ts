import * as React from 'react';
import { StyleSheet } from 'react-native';

import { spacing } from '@/shared/styles/theme';

export function useHomeScreenStyles() {
  return React.useMemo(
    () =>
      StyleSheet.create({
        actions: {
          marginTop: spacing.sm,
          width: '100%',
          maxWidth: 320,
          gap: spacing.md - 2,
        },
      }),
    [],
  );
}
