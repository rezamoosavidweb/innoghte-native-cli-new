/**
 * Port types for "is this catalog product id owned?" — implementation is wired
 * from `domains/user` at startup; consumers call into `shared/infra` registry.
 */
export type IsProductPurchased = (productId: number) => boolean;

export type RegisterProductPurchaseLookup = (fn: IsProductPurchased) => void;
