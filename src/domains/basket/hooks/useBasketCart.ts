import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteCartLine,
  fetchPublicCartList,
  validateDiscountCode,
} from '@/domains/basket/api/basketApi';
import { useBasketDiscountStore } from '@/domains/basket/model/basketDiscount.store';
import { basketKeys } from '@/domains/basket/model/queryKeys';
import type { CartDto } from '@/domains/basket/model/schemas';
import { postAnonymousCartCreate } from '@/domains/user/api/giveGiftApi';
import { readOrCreateCartToken } from '@/domains/user/model/giveGiftCartToken';

const STALE_MS = 60 * 1000;

const EMPTY_CART_LIST: readonly CartDto[] = [];

/** Stable cart token for query key — created once per screen tree mount. */
function useCartToken(): string {
  return React.useMemo(() => readOrCreateCartToken(), []);
}

export function useBasketCart() {
  const cartToken = useCartToken();
  const queryClient = useQueryClient();
  const setDiscount = useBasketDiscountStore(s => s.setDiscount);

  const listQuery = useQuery({
    queryKey: basketKeys.cart(cartToken),
    queryFn: () => fetchPublicCartList(cartToken),
    staleTime: STALE_MS,
  });

  const removeMutation = useMutation({
    mutationFn: (cartLineId: number) => deleteCartLine(cartToken, cartLineId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: basketKeys.cart(cartToken) });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (courseId: number) =>
      postAnonymousCartCreate({ cartToken, courseId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: basketKeys.cart(cartToken) });
    },
  });

  const discountMutation = useMutation({
    mutationFn: validateDiscountCode,
    onSuccess: data => {
      setDiscount(data);
    },
  });

  const cartList = listQuery.data ?? EMPTY_CART_LIST;

  const cartCourseIds = React.useMemo(
    () => new Set(cartList.map(line => line.course_id)),
    [cartList],
  );

  const addToCart = React.useCallback(
    (courseId: number) => {
      addToCartMutation.mutate(courseId);
    },
    [addToCartMutation],
  );

  return {
    cartToken,
    cartList,
    cartCourseIds,
    isPendingList: listQuery.isPending,
    refetchCart: listQuery.refetch,
    removeCartLine: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
    addToCart,
    isPendingCreate: addToCartMutation.isPending,
    pendingCreateCourseId:
      typeof addToCartMutation.variables === 'number'
        ? addToCartMutation.variables
        : null,
    mutateValidateDiscount: discountMutation.mutateAsync,
    isPendingValidateDiscount: discountMutation.isPending,
  };
}
