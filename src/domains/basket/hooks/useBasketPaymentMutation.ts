import { useMutation } from '@tanstack/react-query';

import {
  createBasketPayment,
  type CreateBasketPaymentBody,
} from '@/domains/basket/api/basketApi';

export function useBasketPaymentMutation() {
  return useMutation({
    mutationFn: (body: CreateBasketPaymentBody) => createBasketPayment(body),
  });
}
