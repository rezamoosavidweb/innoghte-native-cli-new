import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, spacing } from '@/ui/theme';

export function useTermsCheckboxStyles(colors: ThemeColors, accepted: boolean) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        row: { flexDirection: 'row', alignItems: 'flex-start' },
        box: {
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: colors.primary,
          marginTop: 2,
          marginRight: spacing.sm,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: accepted ? colors.primary : 'transparent',
        },
        check: {
          color: colors.onPrimary,
          fontSize: 14,
          fontWeight: fontWeight.bold,
        },
        copy: {
          flex: 1,
          fontSize: fontSize.sm + 1,
          fontWeight: fontWeight.medium,
          color: colors.text,
        },
        link: { color: colors.primary, textDecorationLine: 'underline' },
      }),
    [accepted, colors.onPrimary, colors.primary, colors.text],
  );
}
