import {
  apiPriceToDisplayAmount,
  displayAmountToApiAmount,
  formatCommercePrice,
  getCommerceRequestHeaders,
  resolveCommerceMarket,
  resolveCommerceScope,
  resolveEnabledIranGateways,
} from '@/shared/config/commerceMarket';

describe('commerce market resolver', () => {
  it('mirrors the web precedence: explicit scope wins over country header', () => {
    expect(
      resolveCommerceScope({ scopeOverride: 'com', countryCode: 'IR' }),
    ).toBe('com');
    expect(
      resolveCommerceScope({ scopeOverride: 'ir', countryCode: 'US' }),
    ).toBe('ir');
  });

  it('maps the country header to ir and falls back to com', () => {
    expect(resolveCommerceScope({ countryCode: ' ir ' })).toBe('ir');
    expect(resolveCommerceScope({ countryCode: 'US' })).toBe('com');
    expect(resolveCommerceScope()).toBe('com');
  });

  it('builds Scope and currency behavior for both markets', () => {
    const ir = resolveCommerceMarket({ scopeOverride: 'ir' });
    const com = resolveCommerceMarket({ scopeOverride: 'com' });

    expect(getCommerceRequestHeaders(ir)).toEqual({ Scope: 'ir' });
    expect(getCommerceRequestHeaders(com)).toEqual({ Scope: 'com' });
    expect(apiPriceToDisplayAmount(2_450_000, ir)).toBe(245_000);
    expect(apiPriceToDisplayAmount(45, com)).toBe(45);
    expect(displayAmountToApiAmount(200_000, ir)).toBe(2_000_000);
    expect(displayAmountToApiAmount(25, com)).toBe(25);
    expect(formatCommercePrice(2_450_000, ir)).toContain('تومان');
    expect(formatCommercePrice(45, com)).toBe('$45');
  });

  it('returns only enabled Iranian gateways in web order', () => {
    expect(
      resolveEnabledIranGateways({
        showZarinpal: 'true',
        showVandar: 'false',
      }),
    ).toEqual(['zarinpal']);
    expect(
      resolveEnabledIranGateways({
        showZarinpal: 'true',
        showVandar: 'true',
      }),
    ).toEqual(['zarinpal', 'vandar']);
  });
});
