import { isPurchasedProduct } from '@/domains/user/model/purchases/purchasedProductIds';
import { registerProductPurchaseLookup } from '@/shared/purchases';

export function registerUserPurchaseLookup(): void {
  registerProductPurchaseLookup(isPurchasedProduct);
}
