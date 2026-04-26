import { create } from 'zustand';

type State = {
  /** Product IDs the signed-in user has purchased (courses, albums, live, etc.). */
  ids: ReadonlySet<number>;
  setIds: (ids: readonly number[]) => void;
  clear: () => void;
};

export const usePurchasedProductIdsStore = create<State>(set => ({
  ids: new Set(),
  setIds: ids => set({ ids: new Set(ids) }),
  clear: () => set({ ids: new Set() }),
}));

export function isPurchasedProduct(productId: number): boolean {
  return usePurchasedProductIdsStore.getState().ids.has(productId);
}
