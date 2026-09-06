export const COMMERCE_CONFIG = {
  sourceCountryHeaderName: 'x-country-code',
  backendScopeHeaderName: 'Scope',
  iranCountryCode: 'IR',
  iranScope: 'ir',
  internationalScope: 'com',
} as const;

export type CommerceScope =
  | typeof COMMERCE_CONFIG.iranScope
  | typeof COMMERCE_CONFIG.internationalScope;

export type IranPaymentGateway = 'zarinpal' | 'vandar';

export type CommerceMarket = {
  scope: CommerceScope;
  isDotIr: boolean;
  currency: 'IRR' | 'USD';
  displayCurrency: 'تومان' | '$';
  priceDivisor: 10 | 1;
  checkoutKind: 'iran_gateway' | 'paypal';
};

type ResolveCommerceMarketInput = {
  /** Explicit build/runtime override. It has the same precedence as the web app. */
  scopeOverride?: string | null;
  /** Country supplied by the edge header when that source becomes available to native. */
  countryCode?: string | null;
};

function normalizeScope(value?: string | null): CommerceScope | null {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized === COMMERCE_CONFIG.iranScope ||
    normalized === COMMERCE_CONFIG.internationalScope
  ) {
    return normalized;
  }
  return null;
}

export function resolveCommerceScope(
  input: ResolveCommerceMarketInput = {},
): CommerceScope {
  const override = normalizeScope(input.scopeOverride);
  if (override) return override;

  return input.countryCode?.trim().toUpperCase() ===
    COMMERCE_CONFIG.iranCountryCode
    ? COMMERCE_CONFIG.iranScope
    : COMMERCE_CONFIG.internationalScope;
}

export function resolveCommerceMarket(
  input: ResolveCommerceMarketInput = {},
): CommerceMarket {
  const scope = resolveCommerceScope(input);
  const iran = scope === COMMERCE_CONFIG.iranScope;

  return {
    scope,
    isDotIr: iran,
    currency: iran ? 'IRR' : 'USD',
    displayCurrency: iran ? 'تومان' : '$',
    priceDivisor: iran ? 10 : 1,
    checkoutKind: iran ? 'iran_gateway' : 'paypal',
  };
}

/**
 * Native has no inbound page request from which to read `x-country-code`.
 * Today the build scope is the source of truth; replacing it with an edge/API
 * country source later is intentionally contained in this module.
 */
export function getCommerceMarket(): CommerceMarket {
  return resolveCommerceMarket({
    // Direct access is required for Babel environment-variable inlining.
    scopeOverride: process.env.REACT_NATIVE_IS_DOT_IR,
  });
}

export const commerceMarket = getCommerceMarket();
export const isDotIr = commerceMarket.isDotIr;
export const scopeHeader = commerceMarket.scope;

export function getCommerceRequestHeaders(
  market: CommerceMarket = commerceMarket,
): Record<typeof COMMERCE_CONFIG.backendScopeHeaderName, CommerceScope> {
  return { [COMMERCE_CONFIG.backendScopeHeaderName]: market.scope };
}

export function apiPriceToDisplayAmount(
  value: number,
  market: CommerceMarket = commerceMarket,
): number {
  const amount = Number.isFinite(value) ? value : 0;
  return amount / market.priceDivisor;
}

export function displayAmountToApiAmount(
  value: number,
  market: CommerceMarket = commerceMarket,
): number {
  const amount = Number.isFinite(value) ? value : 0;
  return amount * market.priceDivisor;
}

export function formatCommercePrice(
  value: number,
  market: CommerceMarket = commerceMarket,
): string {
  const amount = apiPriceToDisplayAmount(value, market);
  const locale = market.isDotIr ? 'fa-IR' : 'en-US';
  let formatted: string;
  try {
    formatted = new Intl.NumberFormat(locale).format(amount);
  } catch {
    formatted = String(amount);
  }
  return market.isDotIr ? `${formatted} تومان` : `$${formatted}`;
}

function enabledFlag(value?: string): boolean {
  return value === 'true';
}

export function resolveEnabledIranGateways(input?: {
  showZarinpal?: string;
  showVandar?: string;
}): readonly IranPaymentGateway[] {
  const enabled: IranPaymentGateway[] = [];
  if (enabledFlag(input?.showZarinpal)) enabled.push('zarinpal');
  if (enabledFlag(input?.showVandar)) enabled.push('vandar');
  return enabled;
}

export const enabledIranGateways = resolveEnabledIranGateways({
  // Direct accesses are required for Babel environment-variable inlining.
  showZarinpal: process.env.REACT_NATIVE_IS_SHOW_ZARINPAL,
  showVandar: process.env.REACT_NATIVE_IS_SHOW_VANDAR,
});

export const defaultIranPaymentGateway: IranPaymentGateway =
  enabledIranGateways[0] ?? 'zarinpal';

export function isIranGatewayEnabled(gateway: IranPaymentGateway): boolean {
  return enabledIranGateways.includes(gateway);
}
