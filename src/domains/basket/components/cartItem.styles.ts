import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export function createCartItemStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    info: { flex: 1, gap: spacing.xs },
    title: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.medium,
      color: colors.text,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    metaLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
    metaValue: { fontSize: fontSize.sm, color: colors.text },
    priceValue: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    price: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: colors.text,
    },
    thumbWrap: {
      width: 70,
      height: 70,
      borderRadius: radius.md,
      borderWidth: 2,
      borderColor: colors.border,
      overflow: 'hidden',
      padding: 3,
    },
    thumb: { width: '100%', height: '100%', borderRadius: 4 },
    thumbPlaceholder: { backgroundColor: colors.surfaceSecondary },
    muted: { opacity: 0.35 },
    removeHit: { padding: 0, width: 20, minWidth: 0 },
    pill: {
      marginTop: spacing.xs,
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.primarySoft,
    },
    pillText: {
      color: colors.primary,
      fontWeight: fontWeight.medium,
      fontSize: fontSize.sm,
    },
  });
}
