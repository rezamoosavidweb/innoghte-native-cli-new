import type { ReactNode } from 'react';
import {View, type TextStyle, type ViewStyle} from 'react-native';
import { Text } from '@/shared/ui/Text';

export type GiveGiftLabeledFieldProps = {
  label: ReactNode;
  labelStyle?: TextStyle;
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
      {typeof label === 'string' ? (
        <Text style={labelStyle}>{label}</Text>
      ) : (
        label
      )}
      {children}
      {error ? <Text style={errorTextStyle}>{error}</Text> : null}
    </View>
  );
}
