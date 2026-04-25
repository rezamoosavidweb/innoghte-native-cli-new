import * as React from 'react';

import { InputField } from '@/shared/components/form/InputField';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  error?: string;
};

export function MobileLoginForm({ value, onChangeText, onBlur, error }: Props) {
  return (
    <InputField
      accessibilityLabel="Mobile"
      placeholder="Mobile"
      keyboardType="phone-pad"
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      error={error}
    />
  );
}
