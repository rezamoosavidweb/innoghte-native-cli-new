import { z } from 'zod';

const liveMeetingItemSchema = z.record(z.string(), z.unknown());

/** Permissive envelope — full item shape is normalized by `mapLiveMeetingItem`. */
export const liveMeetingsListResponseSchema = z.union([
  z.array(liveMeetingItemSchema),
  z
    .object({
      data: z.array(liveMeetingItemSchema).optional(),
    })
    .passthrough(),
]);

export type LiveMeetingsListResponse = z.infer<typeof liveMeetingsListResponseSchema>;
