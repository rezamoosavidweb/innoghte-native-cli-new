import * as React from 'react';
import { useForm } from 'react-hook-form';

import {
  giveGiftFormResolver,
  type GiveGiftFormType,
} from '@/domains/user/model/giveGiftFormSchema';
import { isDotIr } from '@/shared/config/resolveIsDotIr';

export function useGiveGiftForm() {
  const mobileDefaults = React.useMemo(
    () => ({
      dialCode: isDotIr ? '+98' : '+1',
      countryCode: isDotIr ? 'ir' : 'us',
      dial: '',
    }),
    [],
  );

  const form = useForm<GiveGiftFormType>({
    resolver: giveGiftFormResolver,
    mode: 'onBlur',
    defaultValues: {
      name: '',
      family: '',
      email: '',
      mobile: mobileDefaults,
      selectionGroup: {
        courses: [],
        albums: [],
        rooyeKhats: [],
        audioBooks: [],
      },
      comment: '',
    },
  });

  return { ...form, mobileDefaults };
}
