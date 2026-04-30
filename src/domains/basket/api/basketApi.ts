import { resolveIsDotIr } from '@/shared/config/resolveIsDotIr';
import { endpoints, parseJsonResponse } from '@/shared/infra/http';
import { getApiClient } from '@/shared/infra/http/appHttpClient';

import {
  createPaymentResponseSchema,
  publicCartListResponseSchema,
  publicCheckDiscountResponseSchema,
  type CartDto,
  type CheckDiscountCodeDto,
  type CreatePaymentResult,
} from '@/domains/basket/model/schemas';

function scopeHeader(): { Scope: 'ir' | 'com' } {
  return { Scope: resolveIsDotIr() ? 'ir' : 'com' };
}

export async function fetchPublicCartList(cartToken: string): Promise<readonly CartDto[]> {
  const res = await parseJsonResponse(
    getApiClient().get(endpoints.public.cartList, {
      headers: {
        ...scopeHeader(),
        'X-Cart-Token': cartToken,
      },
    }),
    publicCartListResponseSchema,
  );
  return res.data;
}

export async function deleteCartLine(
  cartToken: string,
  cartLineId: number,
): Promise<void> {
  const path = `${endpoints.public.cartDestroy}/${cartLineId}`;
  const response = await getApiClient().delete(path, {
    headers: {
      ...scopeHeader(),
      'X-Cart-Token': cartToken,
    },
  });
  await response.text().catch(() => '');
}

export async function deleteCartByToken(cartToken: string): Promise<void> {
  const response = await getApiClient().delete(endpoints.public.cartDeleteByToken, {
    headers: {
      ...scopeHeader(),
      'X-Cart-Token': cartToken,
    },
  });
  await response.text().catch(() => '');
}

export async function validateDiscountCode(params: {
  courseIds: number[];
  discountCode: string;
}): Promise<CheckDiscountCodeDto> {
  const res = await parseJsonResponse(
    getApiClient().post(endpoints.public.checkDiscountCode, {
      json: {
        course_ids: params.courseIds,
        discount_code: params.discountCode,
      },
      headers: scopeHeader(),
    }),
    publicCheckDiscountResponseSchema,
  );
  return res.data;
}

export type CreateBasketPaymentBody = {
  course_ids: number[];
  order_type: 'normal' | 'present';
  gateway_name: 'zarinpal' | 'vandar' | 'paypal';
  payment_method: 'paypal' | 'credit_card';
  discount_code?: string;
  present_id?: string;
  cardNumber?: string;
  type?: string;
  cvv?: string;
  expireMonth?: string;
  expireYear?: string;
  fistName?: string;
  lastName?: string;
};

export async function createBasketPayment(
  body: CreateBasketPaymentBody,
): Promise<CreatePaymentResult> {
  return parseJsonResponse(
    getApiClient().post(endpoints.payment.create, {
      json: body,
      headers: scopeHeader(),
    }),
    createPaymentResponseSchema,
  );
}
