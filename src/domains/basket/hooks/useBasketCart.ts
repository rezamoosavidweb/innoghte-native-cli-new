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
import {
  deleteAllAnonymousCartItems,
  postAnonymousCartCreate,
} from '@/domains/user/api/giveGiftApi';
import { PRESENT_STORAGE_JSON_KEY } from '@/domains/user/model/giveGift.storageKeys';
import { readOrCreateCartToken } from '@/domains/user/model/giveGiftCartToken';
import { ApiError } from '@/shared/infra/http';
import { StorageService } from '@/shared/infra/storage/storage.service';
import { useQueryCache } from '@/shared/lib/react-query/useQueryCache';

const STALE_MS = 60 * 1000;

const LOG = '[BasketCart:add]';

const EMPTY_CART_LIST: readonly CartDto[] = [];

type RemoveCartLineResult = {
  rebuiltCart?: readonly CartDto[];
};

/**
 * Staging currently drops `X-Cart-Token` inside the single-line DELETE
 * controller and responds with a PHP type error. The delete-by-token endpoint
 * still accepts the same header, so we can safely rebuild only the remaining
 * lines until the backend controller is fixed.
 */
export function isMissingCartTokenDeleteError(error: unknown): boolean {
  if (!(error instanceof ApiError) || error.status !== 500) {
    return false;
  }

  const payloadMessage =
    error.payload &&
    typeof error.payload === 'object' &&
    'message' in error.payload &&
    typeof error.payload.message === 'string'
      ? error.payload.message
      : '';

  return payloadMessage.includes('$cartToken') && payloadMessage.includes('null given');
}

function useCartToken(): string {
  const [token] = React.useState(readOrCreateCartToken);
  return token;
}

export function useBasketCart() {
  const cartToken = useCartToken();
  const queryClient = useQueryClient();
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

  const removeMutation = useMutation<RemoveCartLineResult, Error, number>({
    mutationFn: async (cartLineId: number) => {
      try {
        await deleteCartLine(cartToken, cartLineId);
        return {};
      } catch (error) {
        if (!isMissingCartTokenDeleteError(error)) {
          throw error;
        }

        const cached =
          queryClient.getQueryData<readonly CartDto[]>(cartQueryKey) ??
          (await fetchPublicCartList(cartToken));
        const remaining = cached.filter(line => line.id !== cartLineId);

        await deleteAllAnonymousCartItems(cartToken);

        const rebuiltCart: CartDto[] = [];
        for (const line of remaining) {
          const created = await postAnonymousCartCreate({
            cartToken,
            courseId: line.course_id,
          });
          if (created) {
            rebuiltCart.push(created);
          }
        }

        return {rebuiltCart};
      }
    },
    onSuccess: (result, cartLineId) => {
      if (result.rebuiltCart) {
        queryClient.setQueryData<readonly CartDto[]>(
          cartQueryKey,
          result.rebuiltCart,
        );
        return;
      }
      removeItem(cartLineId);
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const isGiftCart =
        StorageService.get<Record<string, number[]>>(
          PRESENT_STORAGE_JSON_KEY,
        ) != null;

      if (isGiftCart) {
        await deleteAllAnonymousCartItems(cartToken);
        StorageService.remove(PRESENT_STORAGE_JSON_KEY);
      }

      const created = await postAnonymousCartCreate({cartToken, courseId});
      return {created, replacedGiftCart: isGiftCart};
    },
    onSuccess: ({created, replacedGiftCart}) => {
      if (replacedGiftCart) {
        if (created) {
          queryClient.setQueryData<readonly CartDto[]>(cartQueryKey, [created]);
        } else {
          queryClient.invalidateQueries({queryKey: cartQueryKey}).catch(() => {});
        }
      } else if (created) {
        addItem(created);
      } else {
        queryClient.invalidateQueries({queryKey: cartQueryKey}).catch(() => {});
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
