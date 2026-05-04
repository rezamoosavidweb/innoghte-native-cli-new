import * as React from 'react';
import {
  TextInput,
  View,
  type TextStyle,
  type ViewStyle
} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { Button } from '@/ui/components/Button';

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
      <Button
        variant="filled"
        title={submitLabel}
        accessibilityState={{ disabled: submitDisabled }}
        disabled={submitDisabled}
        loading={isSubmitting}
        onPress={onSubmit}
        style={[
          primaryButton,
          submitDisabled ? primaryButtonDisabled : null,
        ]}
        contentStyle={{ width: '100%' }}
      >
        <Text style={primaryButtonLabel}>{submitLabel}</Text>
      </Button>
    </View>
  );
});
VerifyCodeStep.displayName = 'VerifyCodeStep';
