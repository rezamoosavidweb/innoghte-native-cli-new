import type { Theme } from '@react-navigation/native';
import { I18nManager, type TextStyle, type ViewStyle } from 'react-native';

import {
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '@/ui/theme';
import type { ThemeColors } from '@/ui/theme/types';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export type GiveGiftPickerStyles = {
  block: ViewStyle;
  label: TextStyle;
  trigger: ViewStyle;
  triggerPressed: ViewStyle;
  triggerPlaceholder: TextStyle;
  chipWrap: ViewStyle;
  chip: ViewStyle;
  chipText: TextStyle;
  sheet: ViewStyle;
  sheetHeader: ViewStyle;
  sheetTitle: TextStyle;
  sheetCount: TextStyle;
  optionScroll: ViewStyle;
  optionList: ViewStyle;
  optionBase: ViewStyle;
  optionOn: ViewStyle;
  optionOff: ViewStyle;
  optionDisabled: ViewStyle;
  optionText: TextStyle;
  optionTextSelected: TextStyle;
  doneButton: ViewStyle;
};

export type GiveGiftStyles = {
  scrollInner: ViewStyle;
  screenTitle: TextStyle;
  formSection: ViewStyle;
  nameRow: ViewStyle;
  halfField: ViewStyle;
  fieldLabel: TextStyle;
  fieldLabelLg: TextStyle;
  emailLabelBlock: ViewStyle;
  emailHintDetail: TextStyle;
  emailHint: TextStyle;
  mobileDialInput: TextStyle;
  commentInput: TextStyle;
  submitPressable: ViewStyle;
  submitPressableBusy: ViewStyle;
  submitPressableIdle: ViewStyle;
  submitLabel: TextStyle;
  descriptionWrap: ViewStyle;
  descriptionRow: ViewStyle;
  descriptionText: TextStyle;
  picker: GiveGiftPickerStyles;
};

export function createGiveGiftStyles(
  themeColors: Theme['colors'],
  uiColors: ThemeColors,
  semanticPalette: ThemeColors,
): GiveGiftStyles {
  const optionSelectedBg = hexAlpha(uiColors.primary, 0.133);

  const picker: GiveGiftPickerStyles = {
    block: {
      marginBottom: 14,
    },
    label: {
      color: uiColors.text,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.medium,
      marginBottom: spacing.sm,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    trigger: {
      minHeight: 54,
      borderWidth: 1,
      borderColor: uiColors.border,
      borderRadius: radius.md,
      backgroundColor: uiColors.inputBackground,
      justifyContent: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    triggerPressed: {
      opacity: 0.82,
    },
    triggerPlaceholder: {
      color: uiColors.textMuted,
      fontSize: fontSize.base,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    chipWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      justifyContent: 'flex-start',
    },
    chip: {
      borderRadius: radius.sm,
      backgroundColor: uiColors.primary,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    chipText: {
      color: uiColors.onMedia,
      fontSize: fontSize.sm,
      writingDirection: 'rtl',
    },
    sheet: {
      gap: spacing.md,
      maxHeight: '78%',
    },
    sheetHeader: {
      gap: spacing.xs,
      alignItems: 'stretch',
    },
    sheetTitle: {
      color: uiColors.text,
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    sheetCount: {
      color: uiColors.textMuted,
      fontSize: fontSize.sm,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    optionScroll: {
      flexShrink: 1,
    },
    optionList: {
      gap: 6,
      paddingBottom: spacing.xs,
    },
    optionBase: {
      borderWidth: 1,
      borderRadius: radius.md,
      paddingVertical: 10,
      paddingHorizontal: spacing.md,
    },
    optionOn: {
      borderColor: uiColors.primary,
      backgroundColor: optionSelectedBg,
    },
    optionOff: {
      borderColor: uiColors.border,
      backgroundColor: uiColors.inputBackground,
    },
    optionDisabled: {
      opacity: 0.55,
    },
    optionText: {
      color: uiColors.text,
      fontSize: fontSize.base,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    optionTextSelected: {
      color: uiColors.primary,
      fontWeight: fontWeight.bold,
    },
    doneButton: {
      alignSelf: 'stretch',
    },
  };

  return {
    scrollInner: {
      paddingBottom: spacing['7xl'],
    },
    screenTitle: {
      marginTop: spacing.base,
      textAlign: 'center',
      color: themeColors.text,
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      writingDirection: 'rtl',
    },
    formSection: {
      paddingHorizontal: spacing.sm,
      gap: spacing.md,
    },
    nameRow: {
      flexDirection: 'row',
      gap: 10,
      flexWrap: 'wrap',
    },
    halfField: {
      flex: 1,
      minWidth: 140,
    },
    fieldLabel: {
      color: themeColors.text,
      marginBottom: 6,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    fieldLabelLg: {
      color: themeColors.text,
      marginBottom: 6,
      textAlign: 'right',
      writingDirection: 'rtl',
      fontSize: fontSize.lg,
      fontWeight: fontWeight.medium,
    },
    emailHintDetail: {
      color: semanticPalette.textMuted,
      fontSize: fontSize.sm,
      marginTop: 4,
      textAlign: 'right',
      writingDirection: 'rtl',
      lineHeight: 20,
    },
    emailLabelBlock: {
      marginBottom: 6,
      gap: 4,
    },
    emailHint: {
      color: uiColors.warning,
      fontSize: fontSize.sm,
    },
    mobileDialInput: {
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      writingDirection: 'ltr',
    },
    commentInput: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    submitPressable: {
      marginTop: spacing.sm,
      alignSelf: 'center',
      minWidth: 220,
      paddingVertical: 14,
      paddingHorizontal: spacing['3xl'],
      borderRadius: 10,
    },
    submitPressableBusy: {
      backgroundColor: semanticPalette.textMuted,
    },
    submitPressableIdle: {
      backgroundColor: themeColors.primary,
    },
    submitLabel: {
      color: uiColors.onMedia,
      textAlign: 'center',
      fontWeight: fontWeight.semibold,
      fontSize: fontSize.lg,
    },
    descriptionWrap: {
      marginVertical: spacing.md,
      marginHorizontal: spacing.sm,
      padding: 15,
      borderRadius: 10,
      backgroundColor: uiColors.surfaceSecondary,
      gap: 10,
      alignItems: 'stretch',
    },
    descriptionRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    descriptionText: {
      color: themeColors.text,
      fontSize: fontSize.sm,
      flex: 1,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    picker,
  };
}
