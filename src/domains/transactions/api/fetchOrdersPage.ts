import {
  orderDtoSchema,
  ordersListResponseSchema,
  type OrderDto,
} from '@/domains/transactions/model/order.schemas';
import { parseJsonResponse } from '@/shared/infra/http';
import { getApiClient } from '@/shared/infra/http/appHttpClient';
import { endpoints } from '@/shared/infra/http/endpoints';
import type { PageWithPagination } from '@/shared/lib/infiniteList/defaultGetNextPageParam';

export const ORDERS_PER_PAGE = 20;

export type FetchOrdersPageResult = PageWithPagination<OrderDto>;

export async function fetchOrdersPage(
  page: number,
): Promise<FetchOrdersPageResult> {
  const ky = getApiClient();
  const raw = await parseJsonResponse(
    ky.get(endpoints.user.orders, {
      searchParams: {
        per_page: String(ORDERS_PER_PAGE),
        page: String(page),
      },
    }),
    ordersListResponseSchema,
  );
  const items: OrderDto[] = [];
  for (const row of raw.data) {
    const parsed = orderDtoSchema.safeParse(row);
    if (parsed.success) {
      items.push(parsed.data);
    }
  }

  const p = raw.pagination;
  const current = typeof p?.current_page === 'number' ? p.current_page : page;
  let totalPages =
    typeof p?.total_pages === 'number' ? p.total_pages : undefined;
  if (totalPages == null || !Number.isFinite(totalPages)) {
    const perPage =
      typeof p?.per_page === 'number' ? p.per_page : ORDERS_PER_PAGE;
    const totalItems = p?.total_items;
    if (typeof totalItems === 'number' && totalItems >= 0 && perPage > 0) {
      totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    } else {
      totalPages = items.length < ORDERS_PER_PAGE ? current : current + 1;
    }
  }

  return {
    items,
    pagination: {
      current_page: current,
      total_pages: Math.max(1, totalPages),
    },
  };
}
