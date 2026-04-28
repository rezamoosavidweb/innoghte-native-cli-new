import { fetchAndApplyPurchasedProductIds } from '@/domains/user/api/fetchPurchasedProductIds';
import { isPurchasedProduct } from '@/domains/user/model/purchases/purchasedProductIds.store';
import { usePurchasedProductIdsStore } from '@/domains/user/model/purchases/purchasedProductIds.store';
import { registerProductPurchaseLookup } from '@/shared/purchases';

/**
 * Public user surface for cross-domain consumers (app/bridge etc.).
 * Encapsulates the purchases Zustand store — outside the user domain
 * code MUST go through this service.
 */
export const UserService = {
  /** Wires the global purchase-lookup port to the user-domain store snapshot. */
  registerPurchaseLookup: (): void => {
    registerProductPurchaseLookup(isPurchasedProduct);
  },

  /** Fetch + persist purchased product IDs for the signed-in user. */
  refreshPurchasedProductIds: (): Promise<void> =>
    fetchAndApplyPurchasedProductIds(),

  /** Clear the in-memory purchases set (used on sign-out). */
  clearPurchasedProductIds: (): void => {
    usePurchasedProductIdsStore.getState().clear();
  },
} as const;
