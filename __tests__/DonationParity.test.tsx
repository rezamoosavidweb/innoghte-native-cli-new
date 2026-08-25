import * as React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

import {
  buildDonationRequestBody,
  type DonateMutationInput,
} from '@/domains/donation/hooks/useDonateMutation';
import {
  donationAmountOptions,
  useDonationAmountState,
} from '@/domains/donation/hooks/useDonationAmountState';
import {
  DONATION_COMMENT_MAX_LENGTH,
  donationValidationSchema,
} from '@/domains/donation/model/donationForm.schema';
import { resolveShowZarinpal } from '@/domains/donation/model/env';

const paypalDonation: DonateMutationInput = {
  amount: '200000',
  gateway: 'zarinpal',
  paymentType: 'paypal',
  user: {
    fullName: 'Test Supporter',
    email: 'supporter@example.com',
    comment: 'Thank you',
  },
};

describe('donation reference-page parity', () => {
  test('uses the same default and preset amounts as the reference page', () => {
    expect(donationAmountOptions.ir).toEqual({
      defaultAmount: '200000',
      presets: ['200000', '400000'],
    });
    expect(donationAmountOptions.com).toEqual({
      defaultAmount: '5',
      presets: ['5', '25'],
    });
  });

  test('selects Zarinpal by default in the IR staging build', () => {
    expect(resolveShowZarinpal()).toBe(true);
  });

  test('keeps presets read-only until custom amount mode is selected', async () => {
    let current!: ReturnType<typeof useDonationAmountState>;

    function Harness() {
      current = useDonationAmountState(true);
      return null;
    }

    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(() => {
      renderer = ReactTestRenderer.create(<Harness />);
    });

    expect(current.amount).toBe('200000');
    expect(current.isCustomAmount).toBe(false);
    expect(current.preset.isIrPreset200).toBe(true);

    await act(() => current.handlePresetAmount('400000'));
    expect(current.amount).toBe('400000');
    expect(current.isCustomAmount).toBe(false);
    expect(current.preset.isIrPreset400).toBe(true);

    await act(() => current.handleCustomPress());
    expect(current.amount).toBe('400000');
    expect(current.isCustomAmount).toBe(true);

    await act(() => current.onAmountChangeText('123,456'));
    expect(current.amount).toBe('123456');

    await act(() => renderer.unmount());
  });

  test('converts tomans to rials only for the IR API', () => {
    expect(buildDonationRequestBody(paypalDonation, true)).toEqual({
      gateway_name: 'zarinpal',
      price: '2000000',
      message: 'Thank you',
      full_name: 'Test Supporter',
      email: 'supporter@example.com',
    });

    expect(
      buildDonationRequestBody(
        {
          ...paypalDonation,
          amount: '25',
          gateway: 'paypal',
        },
        false,
      ),
    ).toEqual({
      gateway_name: 'paypal',
      price: '25',
      payment_method: 'paypal',
      message: 'Thank you',
      full_name: 'Test Supporter',
      email: 'supporter@example.com',
    });
  });

  test('matches the reference form requirements and comment limit', () => {
    const parsed = donationValidationSchema.safeParse({
      paymentType: 'paypal',
      user: { fullName: '', email: '', comment: '' },
    });

    expect(parsed.success).toBe(false);
    expect(DONATION_COMMENT_MAX_LENGTH).toBe(320);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.user).toBeDefined();
    }
  });
});
