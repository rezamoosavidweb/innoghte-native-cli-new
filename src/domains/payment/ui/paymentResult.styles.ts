import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { fontSize, fontWeight, hexAlpha, lineHeight, radius, spacing } from '@/ui/theme';

/**
 * Design-specified success surface: fill #00AF66 @ ~8%, border #4AAF57.
 * `#4AAF57` equals the theme `success` token, so only the tint is a literal.
 */
const SUCCESS_TINT = '#00AF66';

export function usePaymentResultStyles(colors: ThemeColors) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1, backgroundColor: colors.background },
        scrollContent: {
          padding: spacing.lg,
          paddingBottom: spacing['4xl'],
          flexGrow: 1,
        },
        center: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.xl,
          gap: spacing.md,
        },

        // Success card
        card: {
          borderWidth: 1,
          borderColor: colors.success,
          borderRadius: radius.xl,
          backgroundColor: hexAlpha(SUCCESS_TINT, 0.08),
          padding: spacing.lg,
        },
        successTitle: {
          fontSize: fontSize.xl,
          fontWeight: fontWeight.bold,
          color: colors.success,
          textAlign: 'center',
        },
        helper: {
          marginTop: spacing.sm,
          fontSize: fontSize.base,
          fontWeight: fontWeight.medium,
          color: colors.text,
          textAlign: 'center',
          lineHeight: lineHeight.relaxed,
        },
        note: {
          marginTop: spacing.sm,
          marginBottom: spacing.sm,
          fontSize: fontSize.sm + 1,
          fontWeight: fontWeight.medium,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: lineHeight.relaxed,
        },

        // Order details grid
        detailsRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: spacing.md,
          paddingVertical: spacing.md,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        detailCol: { flex: 1, gap: 4 },
        detailColFull: { paddingVertical: spacing.md, gap: 4 },
        detailLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
        detailValue: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.medium,
          color: colors.text,
        },

        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginVertical: spacing.md,
        },
        sectionTitle: {
          fontSize: fontSize.lg,
          fontWeight: fontWeight.semibold,
          color: colors.text,
          marginBottom: spacing.sm,
        },

        // Order item
        item: {
          paddingVertical: spacing.md,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          gap: spacing.sm,
        },
        itemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
        itemInfo: { flex: 1, gap: spacing.xs },
        itemTitle: {
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
        price: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
          color: colors.text,
        },
        thumbWrap: {
          width: 64,
          height: 64,
          borderRadius: radius.md,
          borderWidth: 2,
          borderColor: colors.border,
          overflow: 'hidden',
          padding: 3,
        },
        thumb: { width: '100%', height: '100%', borderRadius: 4 },
        thumbPlaceholder: { backgroundColor: colors.surfaceSecondary },
        greenBtn: { backgroundColor: colors.success, borderRadius: radius.md },

        finalRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: spacing.md,
        },
        finalLabel: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
          color: colors.text,
        },
        finalValue: {
          fontSize: fontSize.lg,
          fontWeight: fontWeight.bold,
          color: colors.text,
        },
        thanks: {
          marginTop: spacing.lg,
          fontSize: fontSize.base,
          fontWeight: fontWeight.bold,
          color: colors.textSecondary,
          textAlign: 'center',
        },

        // Failure / pending state
        statusTitle: {
          fontSize: fontSize.lg,
          fontWeight: fontWeight.bold,
          color: colors.text,
          textAlign: 'center',
          lineHeight: lineHeight.relaxed,
        },
        statusBtn: { marginTop: spacing.md, minWidth: 200 },
      }),
    [colors],
  );
}
