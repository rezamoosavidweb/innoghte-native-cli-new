import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import {
  fontSize,
  fontWeight,
  FORM_CONTROL_HEIGHT,
  radius,
  spacing,
} from '@/ui/theme';

export function useCheckoutButtonStyles(colors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        btn: {
          marginTop: spacing.md,
          height: FORM_CONTROL_HEIGHT,
          borderRadius: radius.md,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        disabled: { opacity: 0.5 },
        txt: {
          color: colors.onPrimary,
          fontWeight: fontWeight.semibold,
          fontSize: fontSize.base,
        },
        btnSlot: {
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        },
        btnLabelHidden: { opacity: 0 },
        btnLoaderOverlay: {
          ...StyleSheet.absoluteFill,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors.onPrimary, colors.primary],
  );
}
