import * as React from 'react';
import {
  Pressable,
  TextInput,
  View,
  type TextStyle,
  type ViewStyle
} from 'react-native';
import { Text } from '@/shared/ui/Text';

export type VerifyCodeStepProps = {
  label: string;
  placeholder: string;
  placeholderTextColor: string;
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  isSubmitting: boolean;
  errorText: string | null;
  fieldLabelStyle: TextStyle;
  inputStyle: TextStyle;
  primaryButton: ViewStyle;
  primaryButtonPressed: ViewStyle;
  primaryButtonDisabled: ViewStyle;
  primaryButtonLabel: TextStyle;
  errorTextStyle: TextStyle;
};

export const VerifyCodeStep = React.memo(function VerifyCodeStep({
  label,
  placeholder,
  placeholderTextColor,
  value,
  onChangeText,
  onSubmit,
  submitLabel,
  isSubmitting,
  errorText,
  fieldLabelStyle,
  inputStyle,
  primaryButton,
  primaryButtonPressed,
  primaryButtonDisabled,
  primaryButtonLabel,
  errorTextStyle,
}: VerifyCodeStepProps) {
  const submitDisabled = isSubmitting;

  return (
    <View>
      <Text style={fieldLabelStyle}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType="number-pad"
        maxLength={8}
        editable={!isSubmitting}
        style={inputStyle}
      />
      {errorText ? <Text style={errorTextStyle}>{errorText}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: submitDisabled }}
        disabled={submitDisabled}
        onPress={onSubmit}
        style={({ pressed }) => {
          if (submitDisabled) {
            return [primaryButton, primaryButtonDisabled];
          }
          return pressed
            ? [primaryButton, primaryButtonPressed]
            : primaryButton;
        }}
      >
        <Text style={primaryButtonLabel}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
});
VerifyCodeStep.displayName = 'VerifyCodeStep';
