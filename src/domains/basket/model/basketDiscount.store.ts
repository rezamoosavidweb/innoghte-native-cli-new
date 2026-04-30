import { create } from 'zustand';

import type { CheckDiscountCodeDto } from '@/domains/basket/model/schemas';

type BasketDiscountState = {
  discount: CheckDiscountCodeDto | null;
  setDiscount: (discount: CheckDiscountCodeDto | null) => void;
};

export const useBasketDiscountStore = create<BasketDiscountState>(set => ({
  discount: null,
  setDiscount: discount => set({ discount }),
}));
