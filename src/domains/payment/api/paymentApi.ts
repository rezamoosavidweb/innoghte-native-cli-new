import { scopeHeader } from '@/shared/config/resolveIsDotIr';
import { endpoints, parseJsonResponse } from '@/shared/infra/http';
import { getApiClient } from '@/shared/infra/http/appHttpClient';

import {
  verifyPaymentResponseSchema,
  type VerifyPaymentResult,
} from '@/domains/payment/model/schemas';
import type { ResolvedPaymentParams } from '@/domains/payment/model/paymentResultParams';

/**
 * `.ir` gateway verify — GET `/payment/verify?gateway_name&Authority&Status…`.
 * Mirrors client-web `getVerifyPayment`.
 */
export async function getVerifyPayment(
  params: ResolvedPaymentParams,
): Promise<VerifyPaymentResult> {
  const search = new URLSearchParams({ gateway_name: params.gatewayName });
  if (params.payment_status) search.set('payment_status', params.payment_status);
  if (params.token) search.set('token', params.token);
  if (params.Status) search.set('Status', params.Status);
  if (params.Authority) search.set('Authority', params.Authority);
  if (params.PayerID) search.set('PayerID', params.PayerID);

  return parseJsonResponse(
    getApiClient().get(`${endpoints.payment.verify}?${search.toString()}`, {
      headers: { Scope: scopeHeader },
    }),
    verifyPaymentResponseSchema,
  );
}

/**
 * `.com` PayPal verify — GET `/payment/paypal/verify?gateway_name&paymentId`.
 * Mirrors client-web `getVerifyPaymentPaypal` (PayPal `token` is the paymentId).
 */
export async function getVerifyPaymentPaypal(
  params: ResolvedPaymentParams,
): Promise<VerifyPaymentResult> {
  const search = new URLSearchParams({ gateway_name: params.gatewayName });
  if (params.token) search.set('paymentId', params.token);

  return parseJsonResponse(
    getApiClient().get(
      `${endpoints.payment.verifyPaypal}?${search.toString()}`,
      { headers: { Scope: scopeHeader } },
    ),
    verifyPaymentResponseSchema,
  );
}
