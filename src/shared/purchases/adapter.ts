import type { IsProductPurchased } from '@/shared/contracts/purchases';

/**
 * In-process indirection. No product rules, no domain imports — the user
 * domain registers a predicate at startup.
 */
let lookup: IsProductPurchased = () => false;

export function registerProductPurchaseLookup(fn: IsProductPurchased): void {
  lookup = fn;
}

export function isProductPurchased(productId: number): boolean {
  return lookup(productId);
}
