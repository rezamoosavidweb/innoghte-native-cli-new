import type { DonationScreenParams } from '@/shared/contracts/navigationDonation';

export type PaymentGatewayParams = {
  authority: string | null;
  status: string | null;
  paymentId: string | null;
  payerID: string | null;
  token: string | null;
  payment_status: string | null;
};

export const emptyPaymentGatewayParams: PaymentGatewayParams = {
  authority: null,
  status: null,
  paymentId: null,
  payerID: null,
  token: null,
  payment_status: null,
};

function parseQueryString(search: string): Record<string, string> {
  const q = search.startsWith('?') ? search.slice(1) : search;
  const out: Record<string, string> = {};
  for (const part of q.split('&')) {
    if (!part) continue;
    const eq = part.indexOf('=');
    const k = eq >= 0 ? part.slice(0, eq) : part;
    const v = eq >= 0 ? part.slice(eq + 1) : '';
    try {
      out[decodeURIComponent(k)] = decodeURIComponent(v);
    } catch {
      out[k] = v;
    }
  }
  return out;
}

/**
 * Extract gateway callback query from any URL string (https, custom scheme, or `?a=b` only).
 * Used for web fallback pages that pass the full browser `location.href` as `returnUrl`.
 */
export function parsePaymentParamsFromUrl(
  url: string,
): Partial<PaymentGatewayParams> {
  const qIndex = url.indexOf('?');
  if (qIndex < 0) return {};
  const query = parseQueryString(url.slice(qIndex));
  return {
    authority: query.Authority ?? query.authority ?? null,
    status: query.Status ?? query.status ?? null,
    paymentId: query.paymentId ?? null,
    payerID: query.PayerID ?? query.payerID ?? null,
    token: query.token ?? null,
    payment_status: query.payment_status ?? null,
  };
}

function navParamsToGateway(
  input: DonationScreenParams | undefined,
): PaymentGatewayParams {
  if (!input) return { ...emptyPaymentGatewayParams };
  return {
    authority: input.Authority ?? null,
    status: input.Status ?? null,
    paymentId: input.paymentId ?? null,
    payerID: input.PayerID ?? null,
    token: input.token ?? null,
    payment_status: input.payment_status ?? null,
  };
}

/** Pick first non-empty string; earlier args win (higher priority). */
function coalesceStr(
  ...candidates: (string | null | undefined)[]
): string | null {
  for (const v of candidates) {
    if (typeof v === 'string' && v.trim() !== '') return v.trim();
  }
  return null;
}

/**
 * Merge callback sources. Precedence per field: **route discrete params** → **parsed `returnUrl`**
 * → **optional URL capture** (e.g. best-effort Linking). No source is required to be present.
 */
export function mergeDonationCallbackSources(
  discrete: DonationScreenParams | undefined,
  returnUrl: string | undefined,
  optionalUrlCapture: Partial<PaymentGatewayParams>,
): PaymentGatewayParams {
  const decodedReturnUrl =
    typeof returnUrl === 'string' && returnUrl.trim() !== ''
      ? (() => {
          try {
            return decodeURIComponent(returnUrl.trim());
          } catch {
            return returnUrl.trim();
          }
        })()
      : undefined;

  const fromDiscrete = navParamsToGateway(discrete);
  const fromReturn = decodedReturnUrl
    ? parsePaymentParamsFromUrl(decodedReturnUrl)
    : {};

  return {
    authority: coalesceStr(
      fromDiscrete.authority,
      fromReturn.authority,
      optionalUrlCapture.authority,
    ),
    status: coalesceStr(
      fromDiscrete.status,
      fromReturn.status,
      optionalUrlCapture.status,
    ),
    paymentId: coalesceStr(
      fromDiscrete.paymentId,
      fromReturn.paymentId,
      optionalUrlCapture.paymentId,
    ),
    payerID: coalesceStr(
      fromDiscrete.payerID,
      fromReturn.payerID,
      optionalUrlCapture.payerID,
    ),
    token: coalesceStr(fromDiscrete.token, fromReturn.token, optionalUrlCapture.token),
    payment_status: coalesceStr(
      fromDiscrete.payment_status,
      fromReturn.payment_status,
      optionalUrlCapture.payment_status,
    ),
  };
}

export function donationVerificationFingerprint(
  p: PaymentGatewayParams,
): string {
  return [
    p.authority,
    p.token,
    p.status,
    p.paymentId,
    p.payerID,
    p.payment_status,
  ]
    .filter(Boolean)
    .join(':');
}

/** True if parsed URL / partial looks like a PSP callback (not just empty). */
export function hasDonationCallbackHints(
  p: Partial<PaymentGatewayParams>,
): boolean {
  return Boolean(
    p.authority ||
      p.token ||
      p.paymentId ||
      p.payerID ||
      p.status ||
      p.payment_status,
  );
}

export function hasPaypalVerifyShape(p: PaymentGatewayParams): boolean {
  return Boolean(p.paymentId && p.payerID);
}

export function hasIranVerifyShape(
  p: PaymentGatewayParams,
  isDotIr: boolean,
): boolean {
  return Boolean(isDotIr && p.status && (p.authority || p.token));
}
