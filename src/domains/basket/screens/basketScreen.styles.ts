import * as React from 'react';
import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';

export function useBasketScreenStyles(colors: ThemeColors, bottomInset: number) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1, backgroundColor: colors.background },
        scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
        card: {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          borderRadius: 16,
          padding: spacing.lg,
          marginBottom: spacing.md,
          backgroundColor: colors.card,
        },
        rowBetween: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.sm,
        },
        muted: { color: colors.textSecondary, fontWeight: fontWeight.medium },
        total: {
          fontWeight: fontWeight.semibold,
          color: colors.text,
          fontSize: fontSize.base,
        },
        strike: {
          textDecorationLine: 'line-through',
          color: colors.textMuted,
          fontSize: fontSize.sm,
        },
        priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
        banner: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: spacing.sm,
          padding: spacing.md,
          borderRadius: radius.md,
          marginBottom: spacing.sm,
        },
        bannerInfo: { backgroundColor: colors.infoBg },
        bannerWarn: { backgroundColor: colors.errorBg },
        bannerTxtInfo: {
          flex: 1,
          color: colors.infoText,
          fontWeight: fontWeight.medium,
          fontSize: fontSize.sm,
        },
        bannerTxtWarn: {
          flex: 1,
          color: colors.errorText,
          fontWeight: fontWeight.medium,
          fontSize: fontSize.sm,
        },
        footer: {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: Math.max(bottomInset, spacing.md),
          backgroundColor: colors.background,
        },
        loading: { padding: spacing.xl, alignItems: 'center' },
        emptyWrap: { flex: 1 },
        scrollContentBottom: { paddingBottom: 120 },
      }),
    [colors, bottomInset],
  );
}
