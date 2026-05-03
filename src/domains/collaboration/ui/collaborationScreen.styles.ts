import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { createCardStyle } from '@/ui/theme/core/card.styles';
import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, fontWeight } from '@/ui/theme/core/typography';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export function createCollaborationScreenStyles(
  nav: Theme['colors'],
  ui: ThemeColors,
) {
  return StyleSheet.create({
    scroll: { paddingBottom: spacing['5xl'], gap: spacing.lg },
    card: createCardStyle(nav, { gap: spacing.md }),
    title: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: nav.text,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    subtitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: nav.text,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    muted: {
      color: ui.textMuted,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    label: {
      fontWeight: fontWeight.semibold,
      color: nav.text,
      marginBottom: spacing.xs,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    input: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.md,
      borderColor: nav.border,
      padding: spacing.md,
      color: nav.text,
      backgroundColor: ui.inputBackground,
      fontSize: fontSize.base,
    },
    inputLtr: { textAlign: 'left', writingDirection: 'ltr' },
    inputRtl: { textAlign: 'right', writingDirection: 'rtl' },
    area: { minHeight: 90, textAlignVertical: 'top' },
    row2: {
      flexDirection: 'row',
      gap: spacing.sm,
      flexWrap: 'wrap',
    },
    half: { flex: 1, minWidth: 140 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    chip: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: nav.border,
      backgroundColor: ui.inputBackground,
    },
    chipOn: {
      borderColor: nav.primary,
      backgroundColor: hexAlpha(nav.primary, 0.12),
    },
    chipLabel: { color: nav.text, fontSize: fontSize.sm },
    resumeBox: {
      borderStyle: 'dashed',
      borderWidth: 1,
      borderRadius: radius.md,
      borderColor: nav.border,
      padding: spacing.md,
    },
    submit: {
      backgroundColor: nav.primary,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      alignItems: 'center',
    },
    submitDisabled: { opacity: 0.55 },
    submitLabel: { color: '#FFFFFF', fontWeight: fontWeight.bold },
    error: { color: ui.errorText, fontSize: fontSize.sm },
  });
}
