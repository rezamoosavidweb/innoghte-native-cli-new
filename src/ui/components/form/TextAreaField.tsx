import * as React from 'react';

import { InputField } from '@/ui/components/form/InputField';

type Props = {
  accessibilityLabel: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  error?: string;
};

export function TextAreaField(props: Props) {
  return <InputField {...props} />;
}
