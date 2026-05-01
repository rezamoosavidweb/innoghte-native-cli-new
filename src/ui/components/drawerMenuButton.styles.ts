import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';

export function useDrawerMenuButtonStyles(
  semantic: ThemeColors,
  iconColor?: string,
) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        icon: {
          fontSize: 22,
          fontWeight: '600',
          paddingHorizontal: 4,
          color: iconColor ?? semantic.headerForeground,
        },
      }),
    [iconColor, semantic.headerForeground],
  );
}
