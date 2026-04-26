import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Text, TextInput } from 'react-native';

import { pickSemantic } from '@/ui/theme';
import { useFormFieldStyles } from '@/ui/theme/formField.styles';

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
}: Props) {
  const { colors, dark } = useTheme();
  const s = useFormFieldStyles(colors);
  const semantic = pickSemantic(dark);

  return (
    <>
      <TextInput
        accessibilityLabel={accessibilityLabel}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={semantic.textMuted}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        style={s.input}
      />
      {error ? <Text style={s.errorText}>{error}</Text> : null}
    </>
  );
}
