import { buildBasketPaymentPayload } from '@/domains/basket/services/buildBasketPaymentPayload';
import { resolveCommerceMarket } from '@/shared/config/commerceMarket';

const base = {
  payableCourseIds: [12],
  giftsCourseIds: [] as number[],
  presentId: null,
  gateway: 'zarinpal' as const,
  paymentMethod: 'paypal' as const,
  discount: null,
};

describe('basket payment web parity', () => {
  it('uses an Iranian gateway for ir checkout', () => {
    expect(
      buildBasketPaymentPayload({
        ...base,
        market: resolveCommerceMarket({ scopeOverride: 'ir' }),
        form: { paymentType: 'paypal' },
      }),
    ).toEqual({
      course_ids: [12],
      order_type: 'normal',
      gateway_name: 'zarinpal',
      payment_method: 'paypal',
    });
  });

  it('sends the exact web snake_case credit-card payload for com checkout', () => {
    expect(
      buildBasketPaymentPayload({
        ...base,
        paymentMethod: 'credit_card',
        market: resolveCommerceMarket({ scopeOverride: 'com' }),
        form: {
          paymentType: 'credit_card',
          cart: {
            fistName: 'Sara',
            lastName: 'Ahmadi',
            cardType: '1',
            cardNumber: '4111 1111 1111 1111',
            expireMonth: '12',
            expireYear: '2030',
            cvv: '123',
          },
        },
      }),
    ).toEqual({
      course_ids: [12],
      order_type: 'normal',
      gateway_name: 'paypal',
      payment_method: 'credit_card',
      first_name: 'Sara',
      last_name: 'Ahmadi',
      card_number: '4111111111111111',
      type: 'visa',
      cvv: '123',
      expiry_month: '12',
      expiry_year: '2030',
    });
  });
});
