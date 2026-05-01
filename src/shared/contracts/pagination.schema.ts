import { z } from 'zod';

/**
 * Laravel / legacy API shapes for list envelopes. Sometimes `pagination` is a
 * {@link PaginationDto}-like object; sometimes `[dto]`; sometimes `[]`; rarely `null`.
 *
 * We normalize to a plain object (first array element, or `{}` for empty array / null)
 * so callers can keep reading `.total`, `.per_page`, `.current_page`, etc.
 *
 * Aligns with client-web {@link PaginationDto} (`fist` spelling preserved).
 */
export const apiPaginationRowLooseSchema = z.looseObject({
  current_page: z.number().optional(),
  fist: z.string().optional(),
  last: z.string().optional(),
  next: z.union([z.string(), z.null()]).optional(),
  per_page: z.number().optional(),
  prev: z.union([z.string(), z.null()]).optional(),
  total_items: z.number().optional(),
  total_pages: z.number().optional(),
  /** Some endpoints expose `total` instead of `total_items`. */
  total: z.number().optional(),
});

export const apiPaginationResponseFieldSchema = z
  .union([
    z.array(apiPaginationRowLooseSchema),
    z.record(z.string(), z.unknown()),
    z.null(),
  ])
  .transform((raw): Record<string, unknown> => {
    if (raw == null) {
      return {};
    }
    if (Array.isArray(raw)) {
      const row = raw[0];
      if (row && typeof row === 'object' && !Array.isArray(row)) {
        return row as Record<string, unknown>;
      }
      return {};
    }
    return raw as Record<string, unknown>;
  })
  .optional();
