import type { Theme } from '@react-navigation/native';
import type { TextStyle, ViewStyle } from 'react-native';

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
  optionList: ViewStyle;
  optionBase: ViewStyle;
  optionOn: ViewStyle;
  optionOff: ViewStyle;
  optionDisabled: ViewStyle;
  optionText: TextStyle;
};

export const GIVE_GIFT_EMAIL_HINT_HEX = '#facc15';

export type GiveGiftStyles = {
  scrollInner: ViewStyle;
  screenTitle: TextStyle;
  formSection: ViewStyle;
  nameRow: ViewStyle;
  halfField: ViewStyle;
  fieldLabel: TextStyle;
  fieldLabelLg: TextStyle;
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
    optionList: {
      gap: 6,
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
    emailHint: {
      color: GIVE_GIFT_EMAIL_HINT_HEX,
      fontSize: fontSize.sm,
    },
    mobileDialInput: {
      textAlign: 'left',
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
      color: '#FFFFFF',
      textAlign: 'center',
      fontWeight: fontWeight.semibold,
      fontSize: fontSize.lg,
    },
    descriptionWrap: {
      marginVertical: spacing.md,
      marginHorizontal: spacing.sm,
      padding: 15,
      borderRadius: 10,
      backgroundColor: 'rgba(125,125,125,0.19)',
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
