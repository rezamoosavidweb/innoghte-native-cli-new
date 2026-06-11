import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { FORM_CONTROL_HEIGHT } from '@/ui/theme/core/formControlHeight';
import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, fontWeight, lineHeight } from '@/ui/theme/core/typography';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export function createContactScreenStyles(ui: ThemeColors) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: ui.background },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: spacing['5xl'],
      gap: spacing.md,
    },

    lead: {
      fontSize: fontSize.md + 1,
      color: hexAlpha(ui.text, 0.85),
      lineHeight: lineHeight.relaxed,
    },

    methodsTitle: {
      color: ui.text,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
    },
    methodText: {
      color: hexAlpha(ui.text, 0.85),
      fontSize: fontSize.base,
      lineHeight: lineHeight.relaxed,
    },
    methodLink: {
      color: ui.primary,
      fontWeight: fontWeight.semibold,
    },

    hint: {
      color: ui.warningText,
      fontSize: fontSize.sm,
      lineHeight: lineHeight.normal,
    },

    field: { gap: spacing.xs },
    fieldLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    fieldLabel: {
      color: ui.text,
      fontWeight: fontWeight.semibold,
      fontSize: fontSize.base,
    },
    requiredMark: {
      color: ui.primary,
      fontWeight: fontWeight.bold,
    },

    categorySelector: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.lg - 2,
      borderColor: ui.border,
      height: FORM_CONTROL_HEIGHT,
      paddingHorizontal: 14,
      justifyContent: 'center',
      backgroundColor: ui.inputBackground,
    },
    categorySelectorLabel: {
      color: ui.text,
      fontSize: fontSize.base,
    },
    categorySelectorPlaceholder: {
      color: ui.textMuted,
      fontSize: fontSize.base,
    },

    error: { color: ui.errorText, fontSize: fontSize.sm, marginTop: 4 },

    submit: {
      marginTop: spacing.sm,
      backgroundColor: ui.primary,
      height: FORM_CONTROL_HEIGHT,
      borderRadius: radius.lg - 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitDisabled: { opacity: 0.55 },
    submitSlot: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitLabel: {
      color: ui.onPrimary,
      fontWeight: fontWeight.bold,
      fontSize: fontSize.lg,
    },

    footnote: {
      color: hexAlpha(ui.text, 0.65),
      fontSize: fontSize.sm,
      lineHeight: lineHeight.relaxed,
    },

    modalBackdrop: {
      flex: 1,
      backgroundColor: ui.overlay,
      justifyContent: 'center',
      padding: spacing.xl,
    },
    modalCard: {
      backgroundColor: ui.card,
      borderRadius: radius.lg,
      padding: spacing.lg,
      gap: spacing.md,
    },
    categoryScroll: { maxHeight: 360 },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: ui.text,
    },
    modalHint: {
      fontSize: fontSize.base,
      color: ui.textSecondary,
    },
    otpInput: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.md,
      borderColor: ui.border,
      backgroundColor: ui.inputBackground,
      padding: spacing.md,
      fontSize: fontSize['2xl'],
      color: ui.text,
      textAlign: 'center',
      writingDirection: 'ltr',
    },
    row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
    categoryRow: {
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: ui.divider,
    },
    categoryRowLabel: {
      fontSize: fontSize.base,
      color: ui.text,
    },
    smallBtn: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: ui.border,
    },
    smallBtnPrimary: {
      backgroundColor: ui.primary,
      borderColor: ui.primary,
    },
    smallBtnLabel: { color: ui.text, fontWeight: fontWeight.semibold },
    smallBtnLabelOnPrimary: {
      color: ui.onPrimary,
      fontWeight: fontWeight.bold,
    },
  });
}
