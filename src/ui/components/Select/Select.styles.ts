import { StyleSheet } from 'react-native';

import { FORM_CONTROL_HEIGHT } from '@/ui/theme/core/formControlHeight';
import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, fontWeight } from '@/ui/theme/core/typography';
import type { ThemeColors } from '@/ui/theme/types';

export function createSelectStyles(colors: ThemeColors) {
  return StyleSheet.create({
    trigger: {
      height: FORM_CONTROL_HEIGHT,
      borderRadius: radius.lg - 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.inputBackground,
      paddingHorizontal: 14,
      justifyContent: 'center',
    },
    triggerError: { borderColor: colors.error },
    triggerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: spacing.sm,
    },
    triggerLabel: {
      flex: 1,
      color: colors.text,
      fontSize: fontSize.base,
    },
    triggerPlaceholder: {
      flex: 1,
      color: colors.textMuted,
      fontSize: fontSize.base,
    },
    chevron: { color: colors.textMuted, fontSize: fontSize.base },
    error: { color: colors.errorText, fontSize: fontSize.sm, marginTop: 4 },

    scroll: { flexShrink: 1, alignSelf: 'stretch' },
    scrollContent: { paddingVertical: spacing.xs },
    stateText: {
      color: colors.textSecondary,
      fontSize: fontSize.base,
      textAlign: 'center',
      paddingVertical: spacing.md,
    },
    row: {
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    rowLabel: { fontSize: fontSize.base, color: colors.text },
    rowLabelSelected: { color: colors.primary, fontWeight: fontWeight.bold },
  });
}
