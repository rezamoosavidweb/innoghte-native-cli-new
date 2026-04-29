import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  spacing,
} from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';

export function useLoginScreenStyles(themeColors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1, backgroundColor: themeColors.background },
        inner: {
          flex: 1,
          padding: spacing.xl,
          justifyContent: 'center',
          gap: spacing.md,
          maxWidth: 400,
          alignSelf: 'center',
          width: '100%',
        },
        title: {
          fontSize: 26,
          fontWeight: fontWeight.bold,
          textAlign: 'center',
          color: themeColors.text,
        },
        sub: {
          fontSize: fontSize.md,
          lineHeight: lineHeight.snug,
          textAlign: 'center',
          opacity: 0.8,
          marginBottom: spacing.sm,
          color: themeColors.text,
        },
        input: {
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: radius.lg - 2,
          paddingHorizontal: 14,
          paddingVertical: spacing.md,
          fontSize: fontSize.base,
          borderColor: themeColors.border,
          color: themeColors.text,
          backgroundColor: themeColors.inputBackground,
        },
        row: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        modeButton: {
          flex: 1,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: themeColors.border,
          borderRadius: radius.lg - 4,
          paddingVertical: spacing.sm,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: themeColors.card,
        },
        modeButtonActive: {
          borderColor: themeColors.primary,
        },
        modeText: {
          color: themeColors.text,
          fontSize: fontSize.md,
          fontWeight: fontWeight.semibold,
        },
        helperText: {
          color: themeColors.text,
          opacity: 0.7,
          fontSize: fontSize.sm,
        },
        errorText: {
          color: themeColors.errorText,
          fontSize: fontSize.sm,
          lineHeight: lineHeight.normal,
        },
      }),
    [
      themeColors.background,
      themeColors.border,
      themeColors.card,
      themeColors.errorText,
      themeColors.inputBackground,
      themeColors.primary,
      themeColors.text,
    ],
  );
}
