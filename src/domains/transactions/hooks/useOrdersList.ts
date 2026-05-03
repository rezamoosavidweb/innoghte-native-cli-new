import { useQueryClient } from '@tanstack/react-query';

import {
  fetchOrdersPage,
  type FetchOrdersPageResult,
} from '@/domains/transactions/api';
import type { OrderDto } from '@/domains/transactions/model/order.schemas';
import { ordersKeys } from '@/domains/transactions/model/queryKeys';
import { useAppInfiniteList } from '@/shared/lib/infiniteList';

const STALE_TIME_MS = 5 * 60 * 1000;

/**
 * Authenticated purchase / orders list — `/api/v1/orders` (client-web `getListOrders`).
 */
export function useOrdersList() {
  return useAppInfiniteList<
    OrderDto,
    FetchOrdersPageResult,
    number,
    ReturnType<typeof ordersKeys.infiniteList>
  >({
    queryKey: ordersKeys.infiniteList(),
    queryFn: ({ pageParam }) => fetchOrdersPage(pageParam as number),
    initialPageParam: 1,
    staleTime: STALE_TIME_MS,
  });
}

export function useInvalidateOrdersList() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ordersKeys.all }).catch(() => {});
  };
}
