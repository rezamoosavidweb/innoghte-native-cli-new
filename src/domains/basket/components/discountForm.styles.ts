import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, FORM_CONTROL_HEIGHT, radius, spacing } from '@/ui/theme';

export function useDiscountFormStyles(colors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        wrap: { marginBottom: spacing.lg },
        label: {
          fontWeight: fontWeight.medium,
          marginBottom: spacing.sm,
          color: colors.text,
          fontSize: fontSize.sm + 1,
        },
        fieldRow: {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: radius.lg,
          backgroundColor: colors.surfaceSecondary,
          paddingLeft: spacing.md,
          paddingRight: spacing.xs,
          height: FORM_CONTROL_HEIGHT,
        },
        input: {
          flex: 1,
          color: colors.text,
          fontSize: fontSize.base,
          paddingVertical: 0,
        },
        addBtn: {
          width: FORM_CONTROL_HEIGHT,
          height: FORM_CONTROL_HEIGHT,
          borderRadius: FORM_CONTROL_HEIGHT / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.text,
          overflow: 'hidden',
        },
        addBtnSlot: {
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        },
        addBtnLabelHidden: { opacity: 0 },
        addBtnLoaderOverlay: {
          ...StyleSheet.absoluteFill,
          alignItems: 'center',
          justifyContent: 'center',
        },
        addBtnDisabled: { opacity: 0.45 },
        addLbl: {
          color: colors.background,
          fontSize: fontSize.xl,
          fontWeight: fontWeight.bold,
        },
      }),
    [
      colors.background,
      colors.surfaceSecondary,
      colors.text,
    ],
  );
}
