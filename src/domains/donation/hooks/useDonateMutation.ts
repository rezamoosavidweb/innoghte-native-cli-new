import { useMutation } from '@tanstack/react-query';

import {
  postCreateDonationCom,
  postCreateDonationIr,
} from '@/domains/donation/api/donationApi';
import type {
  CreateDonationComBodyTypes,
  CreateDonationIrBodyTypes,
} from '@/domains/donation/model/types';

export type DonateMutationInput = {
  amount: string;
  gateway: string;
  user: { fullName: string; email: string; comment?: string };
  paymentType: 'credit_card' | 'paypal';
  cart?: {
    fistName: string;
    lastName: string;
    cardType: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvv: string;
  };
};

export function useDonateMutation(isDotIr: boolean) {
  return useMutation({
    mutationFn: async (data: DonateMutationInput) => {
      const base: CreateDonationIrBodyTypes = {
        gateway_name: data.gateway,
        price: String(Number(data.amount) * 10),
        message: data.user.comment,
        full_name: data.user.fullName,
        email: data.user.email,
      };

      if (isDotIr) {
        return postCreateDonationIr(base);
      }

      const body: CreateDonationComBodyTypes = {
        ...base,
        payment_method: data.paymentType,
        ...(data.paymentType === 'credit_card'
          ? {
              first_name: data.cart?.fistName,
              last_name: data.cart?.lastName,
              card_number: data.cart?.cardNumber,
              type: data.cart?.cardType,
              expiry_month: data.cart?.expireMonth,
              expiry_year: data.cart?.expireYear,
              cvv: data.cart?.cvv,
            }
          : {}),
      };

      return postCreateDonationCom(body);
    },
  });
}

export type DonateMutation = ReturnType<typeof useDonateMutation>;
