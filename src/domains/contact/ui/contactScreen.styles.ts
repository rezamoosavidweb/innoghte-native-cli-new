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

    smallBtnLabel: { color: ui.text, fontWeight: fontWeight.semibold },
  });
}
