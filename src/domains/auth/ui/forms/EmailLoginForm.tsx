import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { InputField } from '@/ui/components/form/InputField';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  error?: string;
};

export function EmailLoginForm({ value, onChangeText, onBlur, error }: Props) {
  const { t } = useTranslation();

  return (
    <InputField
      accessibilityLabel={t('screens.login.email')}
      placeholder={t('screens.login.emailPlaceholder')}
      keyboardType="email-address"
      forceInputLtr
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      error={error}
    />
  );
}
