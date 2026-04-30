import type { ReactNode } from 'react';
import { Text, View, type TextStyle, type ViewStyle } from 'react-native';

export type GiveGiftLabeledFieldProps = {
  label: ReactNode;
  labelStyle: TextStyle;
  error?: string;
  errorTextStyle: TextStyle;
  children: ReactNode;
  fieldWrapperStyle?: ViewStyle;
};

export function GiveGiftLabeledField({
  label,
  labelStyle,
  error,
  errorTextStyle,
  children,
  fieldWrapperStyle,
}: GiveGiftLabeledFieldProps) {
  return (
    <View style={fieldWrapperStyle}>
      <Text style={labelStyle}>{label}</Text>
      {children}
      {error ? <Text style={errorTextStyle}>{error}</Text> : null}
    </View>
  );
}
