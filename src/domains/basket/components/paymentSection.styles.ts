import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import {
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '@/ui/theme';

export function usePaymentSectionStyles(semantic: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontSize: fontSize.lg,
          fontWeight: fontWeight.semibold,
          color: semantic.text,
          marginBottom: spacing.md,
        },
        gatewayRow: {
          flexDirection: 'row',
          gap: spacing.md,
          marginBottom: spacing.md,
        },
        gw: {
          flex: 1,
          paddingVertical: spacing.md,
          borderRadius: radius.md,
          borderWidth: 2,
          borderColor: semantic.border,
          alignItems: 'center',
        },
        gwOn: { borderColor: semantic.textSecondary },
        gwLbl: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.medium,
          color: semantic.text,
        },
        grid: { gap: spacing.md },
        row2: { flexDirection: 'row', gap: spacing.md },
        flex1: { flex: 1 },
        field: { gap: spacing.xs },
        label: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.medium,
          color: semantic.text,
        },
        input: {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: semantic.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: semantic.inputBackground,
          color: semantic.text,
          fontSize: fontSize.base,
        },
        error: { fontSize: fontSize.sm, color: semantic.errorText },
        typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
        chip: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: radius.full,
          borderWidth: 1,
          borderColor: semantic.border,
          backgroundColor: semantic.surface,
        },
        chipOn: {
          borderColor: semantic.primary,
          backgroundColor: semantic.primarySoft,
        },
        chipTxt: { fontSize: fontSize.sm, color: semantic.text },
      }),
    [
      semantic.border,
      semantic.errorText,
      semantic.inputBackground,
      semantic.primary,
      semantic.primarySoft,
      semantic.surface,
      semantic.text,
      semantic.textSecondary,
    ],
  );
}
