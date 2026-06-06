import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, hexAlpha, radius, spacing } from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';

export function createBasketScreenStyles(
  colors: ThemeColors,
  bottomInset: number,
) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing["3xl"] },
    scrollContentBottom: {
      paddingBottom: Math.max(bottomInset, spacing.lg) + spacing.md,
    },
    card: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      borderRadius: radius.xl,
      padding: spacing.lg,
      backgroundColor: colors.card,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
    },
    totalLabel: {
      color: colors.text,
      fontWeight: fontWeight.semibold,
      fontSize: fontSize.base,
    },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    strike: {
      textDecorationLine: 'line-through',
      color: colors.textMuted,
      fontSize: fontSize.sm,
    },
    total: {
      fontWeight: fontWeight.semibold,
      color: colors.text,
      fontSize: fontSize.base,
    },
    section: { marginTop: spacing.lg },
    terms: { marginTop: spacing.lg },
    banner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radius.md,
      marginTop: spacing.md,
    },
    bannerInfo: { backgroundColor: colors.infoBg },
    bannerWarn: { backgroundColor: hexAlpha(colors.error, 0.12) },
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
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyWrap: { flex: 1 },
  });
}
