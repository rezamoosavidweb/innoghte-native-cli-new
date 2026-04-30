import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createStorageServiceStateStorage } from '@/shared/infra/storage/createStorageServiceAdapter';

export type BasketPaymentMethod = 'paypal' | 'credit_card';
export type BasketIrGateway = 'zarinpal' | 'vandar';

export type BasketCheckoutPersist = {
  termsAccepted: boolean;
  paymentMethod: BasketPaymentMethod;
  gatewayName: BasketIrGateway;
  /** If user typed a code before login redirect, re-validated after auth. */
  pendingDiscountCode: string | null;
  /** When true, returning from Login should attempt payment once conditions pass. */
  autoResumeCheckout: boolean;
};

type BasketCheckoutState = BasketCheckoutPersist & {
  setTermsAccepted: (v: boolean) => void;
  setPaymentMethod: (v: BasketPaymentMethod) => void;
  setGatewayName: (v: BasketIrGateway) => void;
  setPendingDiscountCode: (code: string | null) => void;
  setAutoResumeCheckout: (v: boolean) => void;
  prepareLoginRedirect: () => void;
  resetCheckoutIntent: () => void;
};

const BASKET_CHECKOUT_PERSIST_KEY = 'zustand_basket_checkout_v1';

export const useBasketCheckoutStore = create<BasketCheckoutState>()(
  persist(
    set => ({
      termsAccepted: false,
      paymentMethod: 'paypal',
      gatewayName: 'zarinpal',
      pendingDiscountCode: null,
      autoResumeCheckout: false,

      setTermsAccepted: v => set({ termsAccepted: v }),
      setPaymentMethod: v => set({ paymentMethod: v }),
      setGatewayName: v => set({ gatewayName: v }),
      setPendingDiscountCode: code => set({ pendingDiscountCode: code }),
      setAutoResumeCheckout: v => set({ autoResumeCheckout: v }),

      prepareLoginRedirect: () => set({ autoResumeCheckout: true }),

      resetCheckoutIntent: () =>
        set({
          autoResumeCheckout: false,
          pendingDiscountCode: null,
        }),
    }),
    {
      name: BASKET_CHECKOUT_PERSIST_KEY,
      storage: createJSONStorage(() => createStorageServiceStateStorage()),
      partialize: s => ({
        termsAccepted: s.termsAccepted,
        paymentMethod: s.paymentMethod,
        gatewayName: s.gatewayName,
        pendingDiscountCode: s.pendingDiscountCode,
        autoResumeCheckout: s.autoResumeCheckout,
      }),
    },
  ),
);
