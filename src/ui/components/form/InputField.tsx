import * as React from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import { Text } from '@/shared/ui/Text';
import EyeIcon from '@/assets/icons/inn/eye.svg';

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
  /** Adds an accessible show/hide control for secure text fields. */
  secureTextToggle?: { showLabel: string; hideLabel: string };
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
  secureTextToggle,
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
  const [isSecureTextVisible, setIsSecureTextVisible] = React.useState(false);
  const hasSecureTextToggle = Boolean(secureTextEntry && secureTextToggle);
  const hasAccessory = Boolean(leadingIcon || hasSecureTextToggle);

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
      secureTextEntry={Boolean(secureTextEntry && !isSecureTextVisible)}
      autoFocus={autoFocus}
      maxLength={maxLength}
      textContentType={oneTimeCode ? 'oneTimeCode' : undefined}
      autoComplete={oneTimeCode ? 'sms-otp' : undefined}
      importantForAutofill={oneTimeCode ? 'yes' : undefined}
      style={[
        hasAccessory ? s.rowInput : s.input,
        textAlign ? { textAlign } : undefined,
        androidInputMetrics,
      ]}
    />
  );

  return (
    <>
      {hasAccessory ? (
        <View style={s.row}>
          {leadingIcon ? <View style={s.rowIcon}>{leadingIcon}</View> : null}
          {textInput}
          {hasSecureTextToggle && secureTextToggle ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isSecureTextVisible
                  ? secureTextToggle.hideLabel
                  : secureTextToggle.showLabel
              }
              accessibilityState={{ selected: isSecureTextVisible }}
              hitSlop={10}
              onPress={() => {
                setIsSecureTextVisible(current => !current);
              }}
              style={({ pressed }) => [
                s.secureToggle,
                pressed ? s.secureTogglePressed : null,
              ]}
            >
              <EyeIcon width={22} height={22} color={colors.textMuted} />
              {isSecureTextVisible ? <View style={s.eyeSlash} /> : null}
            </Pressable>
          ) : null}
        </View>
      ) : (
        textInput
      )}
      {error ? <Text style={s.errorText}>{error}</Text> : null}
    </>
  );
}
