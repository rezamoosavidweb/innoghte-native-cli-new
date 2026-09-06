import {
  commerceMarket,
  type CommerceMarket,
} from '@/shared/config/commerceMarket';

import type { CreateBasketPaymentBody } from '@/domains/basket/api/basketApi';
import type {
  BasketIrGateway,
  BasketPaymentMethod,
} from '@/domains/basket/model/basketCheckout.store';
import type { BasketPaymentFormType } from '@/domains/basket/model/paymentFormSchema';
import { basketCartTypeOptions } from '@/domains/basket/model/paymentFormSchema';
import type { CheckDiscountCodeDto } from '@/domains/basket/model/schemas';

export type BuildPaymentInput = {
  payableCourseIds: number[];
  giftsCourseIds: number[];
  presentId: string | null;
  gateway: BasketIrGateway;
  paymentMethod: BasketPaymentMethod;
  discount: CheckDiscountCodeDto | null;
  form: BasketPaymentFormType;
  market?: CommerceMarket;
};

export function buildBasketPaymentPayload(
  input: BuildPaymentInput,
): CreateBasketPaymentBody {
  const market = input.market ?? commerceMarket;
  const body: Record<string, unknown> = {
    course_ids: input.payableCourseIds,
    order_type: 'normal',
    gateway_name: market.isDotIr ? input.gateway : 'paypal',
    payment_method: input.paymentMethod,
  };

  if (input.discount?.discount_code) {
    body.discount_code = input.discount.discount_code;
  }

  const allArePresent =
    input.payableCourseIds.length > 0 &&
    input.payableCourseIds.every(id => input.giftsCourseIds.includes(id));

  if (allArePresent && input.presentId) {
    body.order_type = 'present';
    body.present_id = input.presentId;
  }

  if (input.form.paymentType === 'credit_card') {
    const cartForm = input.form.cart;
    const cardTypeOption = basketCartTypeOptions.find(
      el => el.value === String(cartForm.cardType),
    );
    Object.assign(body, {
      first_name: cartForm.fistName,
      last_name: cartForm.lastName,
      card_number: cartForm.cardNumber.replace(/\s+/g, ''),
      cvv: cartForm.cvv,
      expiry_month: cartForm.expireMonth,
      expiry_year: cartForm.expireYear,
      type: cardTypeOption?.label.toLowerCase(),
    });
  }

  return body as CreateBasketPaymentBody;
}
