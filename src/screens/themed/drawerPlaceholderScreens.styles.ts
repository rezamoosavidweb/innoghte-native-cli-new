import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, lineHeight, radius, spacing } from '@/theme';

export function useExampleScreenStyles(themeColors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          padding: spacing['3xl'],
          gap: spacing.md,
          backgroundColor: themeColors.background,
        },
        title: {
          fontSize: fontSize['2xl'],
          fontWeight: fontWeight.bold,
          color: themeColors.text,
        },
        sub: {
          fontSize: fontSize.md + 1,
          lineHeight: lineHeight.normal,
          opacity: 0.8,
          color: themeColors.text,
        },
        actions: {
          marginTop: spacing.base,
          gap: spacing.md - 2,
          alignItems: 'stretch',
        },
      }),
    [themeColors.background, themeColors.text],
  );
}

export function useLegacyMenuPlaceholderStyles(themeColors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          padding: spacing['3xl'],
          gap: spacing.md,
          backgroundColor: themeColors.background,
        },
        title: {
          fontSize: fontSize.xl,
          fontWeight: fontWeight.bold,
          color: themeColors.text,
        },
        body: {
          fontSize: fontSize.md + 1,
          lineHeight: lineHeight.normal,
          opacity: 0.85,
          color: themeColors.text,
        },
      }),
    [themeColors.background, themeColors.text],
  );
}

export function useStartupScreenStyles(themeColors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        safe: { flex: 1, backgroundColor: themeColors.background },
        scroll: { padding: spacing['3xl'], gap: 14 },
        title: {
          fontSize: fontSize['2xl'],
          fontWeight: fontWeight.bold,
          color: themeColors.text,
        },
        body: {
          fontSize: fontSize.md + 1,
          lineHeight: lineHeight.normal,
          opacity: 0.85,
          color: themeColors.text,
        },
        actions: { marginTop: spacing.xl, gap: spacing.md - 2 },
      }),
    [themeColors.background, themeColors.text],
  );
}

export function useLoginScreenStyles(themeColors: Theme['colors']) {
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
          backgroundColor: themeColors.card,
        },
      }),
    [
      themeColors.background,
      themeColors.border,
      themeColors.card,
      themeColors.text,
    ],
  );
}
