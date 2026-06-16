import * as React from 'react';
import { Platform, TextInput, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useThemeColors } from '@/ui/theme';
import { createFormFieldStyles } from '@/ui/theme/formField.styles';

type Props = {
  accessibilityLabel: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** RTL placeholder + LTR typed text (email, mobile, password fields in Farsi UI) */
  forceInputLtr?: boolean;
  /** Optional leading field icon; rendered at the start (right in RTL) of the input row. */
  leadingIcon?: React.ReactNode;
  /**
   * Enables SMS one-time-code autofill (iOS `oneTimeCode`, Android `sms-otp`).
   * Use for OTP/verification code fields so the keyboard offers the received code.
   */
  oneTimeCode?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
};

export function InputField({
  accessibilityLabel,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  forceInputLtr = false,
  leadingIcon,
  oneTimeCode = false,
  autoFocus = false,
  maxLength,
}: Props) {
  const colors = useThemeColors();
  const s = createFormFieldStyles(colors);

  const textAlign = forceInputLtr
    ? value.length > 0 ? 'left' : 'right'
    : undefined;

  const androidInputMetrics =
    Platform.OS === 'android'
      ? ({
          textAlignVertical: 'center' as const,
          includeFontPadding: false,
        } as const)
      : null;

  const textInput = (
    <TextInput
      accessibilityLabel={accessibilityLabel}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      secureTextEntry={secureTextEntry}
      autoFocus={autoFocus}
      maxLength={maxLength}
      textContentType={oneTimeCode ? 'oneTimeCode' : undefined}
      autoComplete={oneTimeCode ? 'sms-otp' : undefined}
      importantForAutofill={oneTimeCode ? 'yes' : undefined}
      style={[
        leadingIcon ? s.rowInput : s.input,
        textAlign ? { textAlign } : undefined,
        androidInputMetrics,
      ]}
    />
  );

  return (
    <>
      {leadingIcon ? (
        <View style={s.row}>
          <View style={s.rowIcon}>{leadingIcon}</View>
          {textInput}
        </View>
      ) : (
        textInput
      )}
      {error ? <Text style={s.errorText}>{error}</Text> : null}
    </>
  );
}
