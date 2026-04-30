import * as React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

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
import { ApiError } from '@/shared/infra/http';
import { useQueryCache } from '@/shared/lib/react-query/useQueryCache';

const STALE_MS = 60 * 1000;

const LOG = '[BasketCart:add]';

const EMPTY_CART_LIST: readonly CartDto[] = [];

/** Stable cart token for query key — created once per screen tree mount. */
function useCartToken(): string {
  return React.useMemo(() => readOrCreateCartToken(), []);
}

export function useBasketCart() {
  const cartToken = useCartToken();
  const setDiscount = useBasketDiscountStore(s => s.setDiscount);
  const cartQueryKey = React.useMemo(
    () => basketKeys.cart(cartToken),
    [cartToken],
  );
  const { addItem, removeItem } = useQueryCache<CartDto>(cartQueryKey);

  const listQuery = useQuery({
    queryKey: cartQueryKey,
    queryFn: () => fetchPublicCartList(cartToken),
    staleTime: STALE_MS,
  });

  const removeMutation = useMutation({
    mutationFn: (cartLineId: number) => deleteCartLine(cartToken, cartLineId),
    onSuccess: (_data, cartLineId) => {
      removeItem(cartLineId);
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (courseId: number) =>
      postAnonymousCartCreate({ cartToken, courseId }),
    onMutate: courseId => {
      console.log(LOG, 'onMutate', { courseId });
    },
    onSuccess: created => {
      if (created) {
        addItem(created);
      }
    },
    onError: (error, courseId) => {
      const api = error instanceof ApiError ? error : null;
      console.error(LOG, 'onError', {
        courseId,
        message: error instanceof Error ? error.message : String(error),
        ...(api && {
          apiStatus: api.status,
          apiPayloadSnippet:
            typeof api.payload === 'object' && api.payload != null
              ? JSON.stringify(api.payload).slice(0, 500)
              : api.payload,
        }),
      });
    },
    onSettled: (_data, error, courseId) => {
      console.log(LOG, 'onSettled', {
        courseId,
        status: error ? 'error' : 'success',
      });
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
      console.log(LOG, 'addToCart invoked', {
        courseId,
        cartTokenPreview: `${cartToken.slice(0, 8)}…`,
        mutationPending: addToCartMutation.isPending,
        mutationStatus: addToCartMutation.status,
      });
      addToCartMutation.mutate(courseId);
    },
    [addToCartMutation, cartToken],
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
