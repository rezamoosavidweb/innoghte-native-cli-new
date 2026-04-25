/**
 * Product IDs the user "owns" — migrated from innoghte-native-cli fake
 * `purchasedCourses` (used for both courses and albums in the legacy app).
 */
const PURCHASED_PRODUCT_IDS = new Set<number>([115, 10, 9, 3, 2]);

export function isPurchasedProduct(productId: number): boolean {
  return PURCHASED_PRODUCT_IDS.has(productId);
}
