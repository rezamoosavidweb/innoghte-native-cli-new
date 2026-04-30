import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteCartLine,
  fetchPublicCartList,
  validateDiscountCode,
} from '@/domains/basket/api/basketApi';
import { useBasketDiscountStore } from '@/domains/basket/model/basketDiscount.store';
import { basketKeys } from '@/domains/basket/model/queryKeys';
import { readOrCreateCartToken } from '@/domains/user/model/giveGiftCartToken';

const STALE_MS = 60 * 1000;

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

  const discountMutation = useMutation({
    mutationFn: validateDiscountCode,
    onSuccess: data => {
      setDiscount(data);
    },
  });

  return {
    cartToken,
    cartList: listQuery.data ?? [],
    isPendingList: listQuery.isPending,
    refetchCart: listQuery.refetch,
    removeCartLine: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
    mutateValidateDiscount: discountMutation.mutateAsync,
    isPendingValidateDiscount: discountMutation.isPending,
  };
}
