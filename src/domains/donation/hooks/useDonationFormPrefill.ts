import type { UserDto } from '@/domains/auth/model/apiTypes';
import { useEffect } from 'react';
import type { UseFormGetValues, UseFormSetValue } from 'react-hook-form';

import type { DonationFormType } from '@/domains/donation/model/donationForm.schema';

/** Prefill empty RHF user fields from `/auth/user` (does not overwrite typed values). */
export function useDonationFormPrefill(
  profile: UserDto | undefined,
  getValues: UseFormGetValues<DonationFormType>,
  setValue: UseFormSetValue<DonationFormType>,
) {
  useEffect(() => {
    if (!profile) return;

    const currentName = (getValues('user.fullName') ?? '').trim();
    const currentEmail = (getValues('user.email') ?? '').trim();

    const apiName =
      (profile.full_name ?? '').trim() ||
      [profile.name, profile.family]
        .map(p => (p ?? '').trim())
        .filter(Boolean)
        .join(' ')
        .trim();

    const apiEmail = (profile.email ?? '').trim();

    if (!currentName && apiName) {
      setValue('user.fullName', apiName, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
    if (!currentEmail && apiEmail) {
      setValue('user.email', apiEmail, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, [profile, getValues, setValue]);
}
