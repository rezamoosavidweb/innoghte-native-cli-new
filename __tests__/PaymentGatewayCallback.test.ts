import { parsePaymentGatewayCallback } from '@/domains/payment/model/gatewayCallback';
import {
  canVerify,
  deriveUnifiedStatus,
  resolvePaymentParams,
} from '@/domains/payment/model/paymentResultParams';

describe('payment gateway callback', () => {
  it('captures Vandar callback params from the web result URL', () => {
    const parsed = parsePaymentGatewayCallback(
      'https://stg-web.innoghte.ir/payment/result/vandar?payment_status=OK&token=abc',
      'zarinpal',
    );

    expect(parsed).toMatchObject({
      gatewayName: 'vandar',
      payment_status: 'OK',
      token: 'abc',
    });
  });

  it('maps the credit-card result route to the PayPal verification flow', () => {
    const parsed = parsePaymentGatewayCallback(
      'https://innoghte.com/payment/result/credit-card?token=card-token',
      'paypal',
    );
    const resolved = resolvePaymentParams(parsed ?? undefined);

    expect(resolved.gatewayName).toBe('creditCard');
    expect(canVerify(resolved)).toBe(true);
    expect(deriveUnifiedStatus(resolved)).toBe('OK');
  });

  it('ignores lookalike or unrelated URLs', () => {
    expect(
      parsePaymentGatewayCallback(
        'https://innoghte.ir.example.com/payment/result?Status=OK',
        'zarinpal',
      ),
    ).toBeNull();
    expect(
      parsePaymentGatewayCallback(
        'https://innoghte.ir/courses?Status=OK',
        'zarinpal',
      ),
    ).toBeNull();
    expect(
      parsePaymentGatewayCallback(
        'https://innoghte.ir/payment/results-fake?Status=OK',
        'zarinpal',
      ),
    ).toBeNull();
  });
});
