import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  PhoneInput,
  type PhoneInputValue,
} from '@/ui/components/PhoneInput';

type Props = {
  value: PhoneInputValue;
  onChange: (value: PhoneInputValue) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  disableDropdown?: boolean;
  defaultCountryIso?: string;
};

export function MobileLoginForm({
  value,
  onChange,
  onBlur,
  error,
  touched,
  disableDropdown,
  defaultCountryIso,
}: Props) {
  const { t } = useTranslation();
  const placeholder = t('screens.login.mobilePlaceholder');

  return (
    <PhoneInput
      accessibilityLabelDial={t('screens.login.mobile')}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      touched={touched}
      placeholder={placeholder}
      disableDropdown={disableDropdown}
      defaultCountryIso={defaultCountryIso}
    />
  );
}
