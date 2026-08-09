import { z } from 'zod';

import { getApiClient, parseJsonResponse } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';

const categorySchema = z.looseObject({
  id: z.number(),
  title: z.string(),
  list_title: z.string().nullable().optional(),
});

const categoriesEnvelopeSchema = z.looseObject({
  data: z.array(categorySchema),
});

const createBlogEnvelopeSchema = z.looseObject({
  message: z.string().optional(),
  data: z.unknown().optional(),
});

export type ExperienceCategory = z.infer<typeof categorySchema>;

export async function fetchExperienceCategories(): Promise<
  ExperienceCategory[]
> {
  const response = await parseJsonResponse(
    getApiClient().get(endpoints.public.categories),
    categoriesEnvelopeSchema,
  );
  return response.data;
}

export type CreateWritingInput = {
  full_name: string;
  email: string;
  title: string;
  info: string;
  status: number;
  is_active: boolean;
};

export async function createWriting(input: CreateWritingInput): Promise<void> {
  await parseJsonResponse(
    getApiClient().post(endpoints.public.createBlog, { json: input }),
    createBlogEnvelopeSchema,
  );
}
