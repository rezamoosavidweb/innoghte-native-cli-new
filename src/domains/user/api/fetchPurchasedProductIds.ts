import { getApiClient } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';
import { purchasedProductIdsResponseSchema } from '@/domains/user/model/purchases/purchasedProductIdsResponse.schema';
import { usePurchasedProductIdsStore } from '@/domains/user/model/purchases/purchasedProductIds.store';

/**
 * Loads purchased product IDs for the current session user and updates the
 * in-memory store. Fails open to an empty set if the endpoint is missing or returns an error.
 */
export async function fetchAndApplyPurchasedProductIds(): Promise<void> {
  try {
    const ids = await parseJsonResponse(
      getApiClient().get(endpoints.user.purchasedProductIds),
      purchasedProductIdsResponseSchema,
    );
    usePurchasedProductIdsStore.getState().setIds(ids);
  } catch {
    usePurchasedProductIdsStore.getState().setIds([]);
  }
}
