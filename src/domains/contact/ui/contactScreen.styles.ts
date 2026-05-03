import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/ui/theme/types';
import { FORM_CONTROL_HEIGHT } from '@/ui/theme/core/formControlHeight';
import { radius } from '@/ui/theme/core/radius';
import { spacing } from '@/ui/theme/core/spacing';
import { fontSize, fontWeight } from '@/ui/theme/core/typography';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export function createContactScreenStyles(
  nav: Theme['colors'],
  ui: ThemeColors,
) {
  return StyleSheet.create({
    scrollContent: { paddingBottom: spacing['5xl'] },
    heroTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: nav.text,
      marginBottom: spacing.sm,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    heroLead: {
      fontSize: fontSize.md + 1,
      color: ui.textSecondary,
      marginBottom: spacing.lg,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    darkBand: {
      backgroundColor: '#0A0D12',
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      gap: spacing.md,
    },
    darkBandTitle: {
      color: '#FFFFFF',
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    linkBtn: {
      alignSelf: 'flex-start',
      height: FORM_CONTROL_HEIGHT,
      justifyContent: 'center',
    },
    linkLabel: {
      color: nav.primary,
      fontWeight: fontWeight.semibold,
      fontSize: fontSize.base,
      textAlign: 'right',
    },
    hint: {
      color: '#FDE68A',
      fontSize: fontSize.sm,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    fieldLabel: {
      color: '#FFFFFF',
      fontWeight: fontWeight.semibold,
      marginBottom: spacing.xs,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    input: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.md,
      borderColor: hexAlpha('#FFFFFF', 0.22),
      paddingHorizontal: spacing.md,
      paddingVertical: 0,
      height: FORM_CONTROL_HEIGHT,
      color: '#FFFFFF',
      backgroundColor: hexAlpha('#FFFFFF', 0.06),
      fontSize: fontSize.base,
    },
    inputLtr: {
      textAlign: 'left',
      writingDirection: 'ltr',
    },
    inputRtl: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    categorySelector: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.md,
      borderColor: hexAlpha('#FFFFFF', 0.22),
      padding: spacing.md,
      backgroundColor: hexAlpha('#FFFFFF', 0.06),
    },
    categorySelectorLabel: {
      color: '#FFFFFF',
      textAlign: 'right',
      fontSize: fontSize.base,
    },
    area: {
      minHeight: 110,
      textAlignVertical: 'top',
    },
    error: { color: '#FCA5A5', fontSize: fontSize.sm, marginTop: 4 },
    submit: {
      marginTop: spacing.lg,
      backgroundColor: '#67BD5C',
      height: FORM_CONTROL_HEIGHT,
      borderRadius: radius.md,
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
    submitLabelHidden: { opacity: 0 },
    submitLoaderOverlay: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitLabel: {
      color: '#FFFFFF',
      fontWeight: fontWeight.bold,
      fontSize: fontSize.lg,
    },
    footnote: {
      color: hexAlpha('#FFFFFF', 0.65),
      fontSize: fontSize.sm,
      lineHeight: 20,
      textAlign: 'justify',
      writingDirection: 'rtl',
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: hexAlpha('#000000', 0.45),
      justifyContent: 'center',
      padding: spacing.xl,
    },
    modalCard: {
      backgroundColor: nav.card,
      borderRadius: radius.lg,
      padding: spacing.lg,
      gap: spacing.md,
    },
    categoryScroll: {
      maxHeight: 360,
    },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: nav.text,
      textAlign: 'right',
    },
    otpInput: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.md,
      borderColor: nav.border,
      padding: spacing.md,
      fontSize: fontSize['2xl'],
      color: nav.text,
      textAlign: 'center',
      writingDirection: 'ltr',
    },
    row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
    categoryRow: {
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: hexAlpha('#000000', 0.08),
    },
    categoryRowLabel: {
      fontSize: fontSize.base,
      color: nav.text,
      textAlign: 'right',
    },
    smallBtn: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: nav.border,
    },
    smallBtnPrimary: {
      backgroundColor: nav.primary,
      borderColor: nav.primary,
    },
    smallBtnLabel: { color: nav.text, fontWeight: fontWeight.semibold },
    smallBtnLabelOnPrimary: { color: '#FFFFFF', fontWeight: fontWeight.bold },
  });
}
