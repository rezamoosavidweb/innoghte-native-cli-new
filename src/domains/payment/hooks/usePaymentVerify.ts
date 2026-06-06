import { useQuery } from '@tanstack/react-query';

import {
  getVerifyPayment,
  getVerifyPaymentPaypal,
} from '@/domains/payment/api/paymentApi';
import { paymentKeys } from '@/domains/payment/model/queryKeys';
import {
  canVerify,
  verifySignature,
  type ResolvedPaymentParams,
} from '@/domains/payment/model/paymentResultParams';

/**
 * Verifies a gateway callback and returns the resulting order.
 * `.com` PayPal hits the paypal verify endpoint; everything else hits the
 * gateway verify endpoint. Disabled until the callback params are sufficient.
 */
export function usePaymentVerify(params: ResolvedPaymentParams) {
  return useQuery({
    queryKey: paymentKeys.verify(verifySignature(params)),
    queryFn: () =>
      params.gatewayName === 'paypal'
        ? getVerifyPaymentPaypal(params)
        : getVerifyPayment(params),
    enabled: canVerify(params),
  });
}
