import * as React from 'react';

import type { CartDto } from '@/domains/basket/model/schemas';

export function usePayableCourseIds(
  cartList: readonly CartDto[],
  giftsCourseIds: readonly number[],
): number[] {
  return React.useMemo(
    () =>
      cartList
        .filter(item => {
          const course = item.course as { is_accessible?: boolean } | null;
          const isGift = giftsCourseIds.includes(item.course_id);
          return !course?.is_accessible || isGift;
        })
        .map(item => item.course_id),
    [cartList, giftsCourseIds],
  );
}

/** Course IDs eligible for discount API — matches web `DiscountForm` filter. */
export function useDiscountEligibleCourseIds(cartList: readonly CartDto[]): number[] {
  return React.useMemo(
    () =>
      cartList
        .filter(item => {
          const course = item.course as { is_accessible?: boolean } | null;
          return !course?.is_accessible;
        })
        .map(item => item.course_id),
    [cartList],
  );
}
