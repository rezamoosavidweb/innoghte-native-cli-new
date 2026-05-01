import * as React from 'react';
import {
  Pressable,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextStyle,
  type ViewStyle
} from 'react-native';
import { Text } from '@/shared/ui/Text';

export type VerifyInputStepProps = {
  label: string;
  placeholder: string;
  placeholderTextColor: string;
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  isSubmitting: boolean;
  errorText: string | null;
  keyboardType: KeyboardTypeOptions;
  fieldLabelStyle: TextStyle;
  inputStyle: TextStyle;
  primaryButton: ViewStyle;
  primaryButtonPressed: ViewStyle;
  primaryButtonDisabled: ViewStyle;
  primaryButtonLabel: TextStyle;
  errorTextStyle: TextStyle;
};

export const VerifyInputStep = React.memo(function VerifyInputStep({
  label,
  placeholder,
  placeholderTextColor,
  value,
  onChangeText,
  onSubmit,
  submitLabel,
  isSubmitting,
  errorText,
  keyboardType,
  fieldLabelStyle,
  inputStyle,
  primaryButton,
  primaryButtonPressed,
  primaryButtonDisabled,
  primaryButtonLabel,
  errorTextStyle,
}: VerifyInputStepProps) {
  const submitDisabled = isSubmitting;

  return (
    <View>
      <Text style={fieldLabelStyle}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
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
VerifyInputStep.displayName = 'VerifyInputStep';
