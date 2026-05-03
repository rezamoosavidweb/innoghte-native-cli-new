import { useForm } from 'react-hook-form';

import {
  giveGiftFormResolver,
  type GiveGiftFormType,
} from '@/domains/user/model/giveGiftFormSchema';
import { isDotIr } from '@/shared/config/resolveIsDotIr';

const mobileDefaults = {
  dialCode: isDotIr ? '+98' : '+1',
  countryCode: isDotIr ? 'ir' : 'us',
  dial: '',
};

export function useGiveGiftForm() {
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
