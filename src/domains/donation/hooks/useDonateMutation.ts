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

export function buildDonationRequestBody(
  data: DonateMutationInput,
  isDotIr: true,
): CreateDonationIrBodyTypes;
export function buildDonationRequestBody(
  data: DonateMutationInput,
  isDotIr: false,
): CreateDonationComBodyTypes;
export function buildDonationRequestBody(
  data: DonateMutationInput,
  isDotIr: boolean,
): CreateDonationIrBodyTypes | CreateDonationComBodyTypes {
  const base = {
    gateway_name: data.gateway,
    message: data.user.comment,
    full_name: data.user.fullName,
    email: data.user.email,
  };

  if (isDotIr) {
    return {
      ...base,
      // The IR API accepts rials while the UI and the reference web page show tomans.
      price: String(Number(data.amount) * 10),
    };
  }

  return {
    ...base,
    // The COM API accepts the displayed dollar amount without IR currency conversion.
    price: data.amount,
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
}

export function useDonateMutation(isDotIr: boolean) {
  return useMutation({
    mutationFn: async (data: DonateMutationInput) => {
      if (isDotIr) {
        return postCreateDonationIr(buildDonationRequestBody(data, true));
      }

      return postCreateDonationCom(buildDonationRequestBody(data, false));
    },
  });
}

export type DonateMutation = ReturnType<typeof useDonateMutation>;
