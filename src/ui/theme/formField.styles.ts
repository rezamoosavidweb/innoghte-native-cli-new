import { StyleSheet } from 'react-native';

import { FORM_CONTROL_HEIGHT } from '@/ui/theme/core/formControlHeight';
import { radius } from '@/ui/theme/core/radius';
import { fontSize, lineHeight } from '@/ui/theme/core/typography';
import type { ThemeColors } from '@/ui/theme/types';

/**
 * Reusable form control styles (shared by {@link @/ui/components/form/InputField} and domain login screens).
 *
 * Accepts the semantic {@link ThemeColors} so the input field background can
 * resolve to the right token (`inputBackground` — diverges between schemes
 * per the theme spec).
 */
export function createFormFieldStyles(themeColors: ThemeColors) {
  return StyleSheet.create({
    input: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.lg - 2,
      height: FORM_CONTROL_HEIGHT,
      paddingHorizontal: 14,
      paddingVertical: 0,
      fontSize: fontSize.base,
      borderColor: themeColors.border,
      color: themeColors.text,
      backgroundColor: themeColors.inputBackground,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    // Row variant used when an InputField renders a leading icon. The icon is
    // the first child so RTL places it at the start (right) of the field.
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.lg - 2,
      height: FORM_CONTROL_HEIGHT,
      paddingHorizontal: 14,
      borderColor: themeColors.border,
      backgroundColor: themeColors.inputBackground,
    },
    rowIcon: {
      marginEnd: 10,
    },
    secureToggle: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginStart: 6,
    },
    secureTogglePressed: {
      opacity: 0.6,
    },
    eyeSlash: {
      position: 'absolute',
      width: 22,
      height: StyleSheet.hairlineWidth * 2,
      borderRadius: 1,
      backgroundColor: themeColors.textMuted,
      transform: [{ rotate: '-42deg' }],
    },
    rowInput: {
      flex: 1,
      height: '100%',
      paddingVertical: 0,
      fontSize: fontSize.base,
      color: themeColors.text,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    errorText: {
      color: themeColors.errorText,
      fontSize: fontSize.sm,
      lineHeight: lineHeight.normal,
    },
  });
}
