import { z } from 'zod';

export const faqEntrySchema = z
  .object({
    id: z.number(),
    question: z.string(),
    answer: z.string(),
  })
  .passthrough();

export const faqItemSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    faqs: z.array(faqEntrySchema),
  })
  .passthrough();

export const faqsListResponseSchema = z.union([
  z.array(faqItemSchema),
  z
    .object({
      data: z.array(faqItemSchema).optional(),
    })
    .passthrough(),
]);

export type FaqsListResponse = z.infer<typeof faqsListResponseSchema>;
