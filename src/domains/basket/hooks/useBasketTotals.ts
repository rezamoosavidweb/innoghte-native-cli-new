import * as React from 'react';

import { asCourseLike } from '@/domains/basket/model/courseGuards';
import type {
  CartDto,
  CheckDiscountCodeDto,
} from '@/domains/basket/model/schemas';

export type BasketTotals = {
  fullPrice: number;
  fullPriceWithDiscount: number;
  displayPrice: number;
  displayDiscountPrice: number;
};

export function useBasketTotals(
  cartList: readonly CartDto[],
  giftsCourseIds: readonly number[],
  discount: CheckDiscountCodeDto | null,
): BasketTotals {
  return React.useMemo(() => {
    let fullPrice = 0;
    let fullPriceWithDiscount = 0;
    const payable = cartList.filter(item => {
      const course = item.course;
      const isGift = giftsCourseIds.includes(item.course_id);
      const disabledPurchased = Boolean(course?.is_accessible);
      return !disabledPurchased || isGift;
    });
    for (const { course } of payable) {
      const c = asCourseLike(course);
      if (!c) continue;
      fullPrice += c.price ?? 0;
      fullPriceWithDiscount += c.discount_price ?? 0;
    }

    const discountPrice = discount?.final_price
      ? discount.final_price - discount.discount_amount
      : fullPriceWithDiscount;
    const price = discount?.final_price ?? fullPrice;

    return {
      fullPrice,
      fullPriceWithDiscount,
      displayPrice: price,
      displayDiscountPrice: discountPrice,
    };
  }, [cartList, giftsCourseIds, discount]);
}
