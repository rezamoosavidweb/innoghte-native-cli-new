import { z } from 'zod';

const eventItemSchema = z.record(z.string(), z.unknown());

/** Permissive envelope — full item shape is normalized by `mapEventItem`. */
export const eventsListResponseSchema = z.union([
  z.array(eventItemSchema),
  z
    .object({
      data: z.array(eventItemSchema).optional(),
    })
    .passthrough(),
]);

export type EventsListResponse = z.infer<typeof eventsListResponseSchema>;
