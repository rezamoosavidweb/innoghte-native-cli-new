import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import {
  fetchContactUsCategories,
  postContactUsCreate,
  postContactUsSendOtp,
  postContactUsVerifyOtp,
} from '@/domains/contact/api/contactPublicApi';

export const contactCategoriesQueryKey = ['contactUs', 'categories'] as const;

export function useContactUsCategoriesQuery() {
  return useQuery({
    queryKey: contactCategoriesQueryKey,
    queryFn: fetchContactUsCategories,
    staleTime: 60_000,
  });
}

export function useContactUsSendOtpMutation() {
  return useMutation({
    mutationFn: postContactUsSendOtp,
  });
}

export function useContactUsVerifyAndCreateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      otp: string;
      email: string;
      payload: {
        full_name: string;
        email: string;
        mobile: string;
        title: string;
        info: string;
        category_id: string;
      };
    }) => {
      const ok = await postContactUsVerifyOtp({
        otp: input.otp,
        email: input.email,
      });
      if (!ok) {
        throw new Error('OTP_INVALID');
      }
      const status = await postContactUsCreate(input.payload);
      if (status !== 1) {
        throw new Error('CREATE_FAILED');
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contactCategoriesQueryKey });
    },
  });
}

export type ContactOtpFlowSnapshot = {
  email: string;
  mobileE164: string;
  ttl?: string;
};

export function useContactOtpSheet() {
  const [open, setOpen] = React.useState(false);
  const [snapshot, setSnapshot] = React.useState<ContactOtpFlowSnapshot | null>(
    null,
  );
  const show = React.useCallback((next: ContactOtpFlowSnapshot) => {
    setSnapshot(next);
    setOpen(true);
  }, []);
  const hide = React.useCallback(() => {
    setOpen(false);
    setSnapshot(null);
  }, []);
  return { open, snapshot, show, hide } as const;
}
