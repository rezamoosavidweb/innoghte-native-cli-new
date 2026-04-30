import { useForm } from 'react-hook-form';
import * as React from 'react';

import {
  giveGiftFormResolver,
  type GiveGiftFormType,
} from '@/domains/user/model/giveGiftFormSchema';
import { resolveIsDotIr } from '@/shared/config/resolveIsDotIr';

export function useGiveGiftForm() {
  const isDotIr = resolveIsDotIr();

  const mobileDefaults = React.useMemo(
    () => ({
      dialCode: isDotIr ? '+98' : '+1',
      countryCode: isDotIr ? 'ir' : 'us',
      dial: '',
    }),
    [isDotIr],
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
