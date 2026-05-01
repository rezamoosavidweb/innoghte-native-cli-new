import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import {
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '@/ui/theme';

export function createCartItemStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    grow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    thumbWrap: {
      width: 72,
      height: 72,
      borderRadius: radius.sm,
      borderWidth: 2,
      borderColor: colors.border,
      marginHorizontal: spacing.sm,
      overflow: 'hidden',
      padding: 3,
    },
    thumb: { width: '100%', height: '100%', borderRadius: 4 },
    thumbPlaceholder: {
      backgroundColor: colors.surfaceSecondary,
    },
    muted: { opacity: 0.35 },
    title: {
      flex: 1,
      fontSize: fontSize.base + 1,
      fontWeight: fontWeight.medium,
      color: colors.text,
    },
    removeHit: { padding: spacing.sm },
    remove: { fontSize: fontSize.lg, color: colors.textSecondary },
    qty: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: 4,
    },
    priceCol: { alignItems: 'flex-end' },
    price: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semibold,
      color: colors.text,
    },
    strike: {
      fontSize: fontSize.sm,
      textDecorationLine: 'line-through',
      color: colors.textMuted,
    },
    pill: {
      marginTop: spacing.sm,
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
