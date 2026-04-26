import { z } from 'zod';

/**
 * Tolerant parser for the purchased-product-ids API — backend shape may use
 * a bare array, `product_ids`, or `purchased_product_ids` inside `data`.
 */
export const purchasedProductIdsResponseSchema = z
  .object({ data: z.unknown() })
  .transform((row): number[] => {
    const d = row.data;
    if (Array.isArray(d) && d.every((x): x is number => typeof x === 'number')) {
      return d;
    }
    if (d && typeof d === 'object') {
      const o = d as Record<string, unknown>;
      const candidate = o.product_ids ?? o.purchased_product_ids ?? o.ids;
      if (
        Array.isArray(candidate) &&
        candidate.every((x): x is number => typeof x === 'number')
      ) {
        return candidate;
      }
    }
    return [];
  });
