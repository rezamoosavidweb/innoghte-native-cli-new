import * as React from 'react';
import type { UseFormReset } from 'react-hook-form';
import { Linking } from 'react-native';

import type { DonateMutation } from '@/domains/donation/hooks/useDonateMutation';
import type { DonationFlowSend } from '@/domains/donation/hooks/useDonationFlow';
import {
  donationSuccessBodyLines,
  donationSuccessTitle,
} from '@/domains/donation/model/donationResultCopy';
import type { DonationFormType } from '@/domains/donation/schema/donationForm';

export function useDonationSubmit(args: {
  amount: string;
  gateway: string;
  donateMutation: DonateMutation;
  send: DonationFlowSend;
  openResult: (payload: {
    variant: 'success' | 'error';
    title: string;
    bodyLines: string[];
  }) => void;
  reset: UseFormReset<DonationFormType>;
}) {
  const { amount, gateway, donateMutation, send, openResult, reset } = args;

  const submitDonation = React.useCallback(
    async (data: DonationFormType) => {
      if (!amount || parseFloat(amount) <= 0) {
        openResult({
          variant: 'error',
          title: 'خطا',
          bodyLines: ['لطفا مبلغ معتبری وارد کنید.'],
        });
        return;
      }
      send({ type: 'START_CHECKOUT' });
      try {
        const result = await donateMutation.mutateAsync({
          amount,
          gateway,
          user: data.user,
          paymentType: data.paymentType,
          cart: data.paymentType === 'credit_card' ? data.cart : undefined,
        });

        if (data.paymentType === 'credit_card') {
          send({ type: 'CHECKOUT_INLINE_SUCCESS' });
          openResult({
            variant: 'success',
            title: donationSuccessTitle,
            bodyLines: donationSuccessBodyLines,
          });
          reset({
            paymentType: 'paypal',
            user: { fullName: '', email: '', comment: '' },
          });
          return;
        }

        const payUrl = result.data.url;
        if (!payUrl) {
          send({ type: 'CHECKOUT_ERROR' });
          openResult({
            variant: 'error',
            title: 'خطا',
            bodyLines: ['خطا در پردازش پرداخت. لطفا دوباره تلاش کنید.'],
          });
          return;
        }

        const can = await Linking.canOpenURL(payUrl).catch(() => false);
        if (!can) {
          send({ type: 'CHECKOUT_ERROR' });
          openResult({
            variant: 'error',
            title: 'خطا',
            bodyLines: [
              'مرورگر برای ادامه پرداخت در دسترس نیست. می‌توانید از نسخه وب یا دستگاه دیگر استفاده کنید.',
            ],
          });
          return;
        }

        send({
          type: 'CHECKOUT_SUCCESS',
          url: payUrl,
          gateway,
        });
      } catch {
        send({ type: 'CHECKOUT_ERROR' });
        openResult({
          variant: 'error',
          title: 'خطا',
          bodyLines: ['خطا در پردازش پرداخت. لطفا دوباره تلاش کنید.'],
        });
      }
    },
    [amount, donateMutation, gateway, openResult, reset, send],
  );

  return { submitDonation };
}
