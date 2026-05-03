import * as React from 'react';
import { Platform, TextInput } from 'react-native';
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
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** RTL placeholder + LTR typed text (email, mobile, password fields in Farsi UI) */
  forceInputLtr?: boolean;
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

  return (
    <>
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
        style={[
          s.input,
          textAlign ? { textAlign } : undefined,
          androidInputMetrics,
        ]}
      />
      {error ? <Text style={s.errorText}>{error}</Text> : null}
    </>
  );
}
