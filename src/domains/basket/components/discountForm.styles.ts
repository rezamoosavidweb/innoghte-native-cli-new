import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, hexAlpha, radius, spacing } from '@/ui/theme';

const FIELD_HEIGHT = 56;
const ADD_BTN_SIZE = 36;

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
          gap: spacing.sm,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surfaceSecondary,
          paddingHorizontal: spacing.md,
          height: FIELD_HEIGHT,
        },
        input: {
          flex: 1,
          color: colors.text,
          fontSize: fontSize.base,
          paddingVertical: 0,
          textAlign: 'right',
        },
        addBtn: {
          width: ADD_BTN_SIZE,
          height: ADD_BTN_SIZE,
          // Override Button layout="auto" (minHeight:48 + alignSelf:'stretch')
          // so the control stays a fixed circle instead of filling the field.
          minHeight: ADD_BTN_SIZE,
          alignSelf: 'center',
          borderRadius: ADD_BTN_SIZE / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: hexAlpha(colors.text, 0.16),
          overflow: 'hidden',
        },
        addBtnSlot: {
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        },
        addBtnDisabled: { opacity: 0.45 },
      }),
    [colors.border, colors.surfaceSecondary, colors.text],
  );
}
