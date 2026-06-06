import { isDotIr } from '@/shared/config/resolveIsDotIr';
import type {
  PaymentGatewayName,
  PaymentResultParams,
} from '@/shared/contracts/navigationPayment';

/** Unified gateway-agnostic status: `'OK'` success, `'NOK'` failure, else unknown. */
export type UnifiedPaymentStatus = 'OK' | 'NOK' | undefined;

export type ResolvedPaymentParams = Required<Pick<PaymentResultParams, 'gatewayName'>> &
  Omit<PaymentResultParams, 'gatewayName'>;

/** Fill in the region-default gateway when the redirect didn't carry one. */
export function resolvePaymentParams(
  params: PaymentResultParams | undefined,
): ResolvedPaymentParams {
  const p = params ?? {};
  return {
    ...p,
    gatewayName: p.gatewayName ?? defaultGatewayName(),
  };
}

export function defaultGatewayName(): PaymentGatewayName {
  return isDotIr ? 'zarinpal' : 'paypal';
}

/**
 * Collapse the gateway-specific callback fields into a single status —
 * mirrors client-web `PaymentResult` `unifiedStatus` derivation.
 */
export function deriveUnifiedStatus(
  p: ResolvedPaymentParams,
): UnifiedPaymentStatus {
  if (p.Status) {
    return p.Status === 'OK' ? 'OK' : 'NOK';
  }
  if (p.payment_status) {
    if (p.payment_status === 'OK') return 'OK';
    if (p.payment_status === 'FAILED') return 'NOK';
    return undefined;
  }
  if (p.gatewayName === 'paypal') {
    return p.PayerID ? 'OK' : 'NOK';
  }
  return undefined;
}

/** Whether enough params are present to attempt verification (matches web `enabled`). */
export function canVerify(p: ResolvedPaymentParams): boolean {
  const hasPaypal = Boolean(p.token && p.payment_status);
  const hasIr = Boolean(p.Authority && p.Status);
  return Boolean(p.gatewayName) && (hasPaypal || hasIr || Boolean(p.PayerID));
}

/** Stable signature for the verify query key. */
export function verifySignature(p: ResolvedPaymentParams): string {
  return [
    p.gatewayName,
    p.token,
    p.payment_status,
    p.Authority,
    p.Status,
    p.PayerID,
  ]
    .filter(Boolean)
    .join(',');
}
