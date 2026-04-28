import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { InputField } from '@/ui/components/form/InputField';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  error?: string;
};

export function MobileLoginForm({ value, onChangeText, onBlur, error }: Props) {
  const { t } = useTranslation();
  const label = t('screens.login.mobile');

  return (
    <InputField
      accessibilityLabel={label}
      placeholder={label}
      keyboardType="phone-pad"
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      error={error}
    />
  );
}
