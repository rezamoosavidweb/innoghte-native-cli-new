import { z } from 'zod';

import { getApiClient } from '@/shared/infra/http/appHttpClient';
import { endpoints } from '@/shared/infra/http/endpoints';
import { parseJsonResponse } from '@/shared/infra/http/parseJson';

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const categoriesEnvelope = z.object({
  data: z.array(categorySchema),
  message: z.string().optional(),
});

const genericEnvelope = z.object({
  data: z.unknown(),
  message: z.string().optional(),
});

export type CollaborationCategoryDto = z.infer<typeof categorySchema>;

export async function fetchWorkWithUsCategories(): Promise<
  CollaborationCategoryDto[]
> {
  const raw = await parseJsonResponse(
    getApiClient().get(endpoints.public.workWithUsCategories),
    categoriesEnvelope,
  );
  return raw.data;
}

export type CollaborationResumeUpload = {
  uri: string;
  name: string;
  type: string;
};

export async function postWorkWithUsApplication(input: {
  fields: Record<string, string>;
  resume: CollaborationResumeUpload;
}): Promise<void> {
  const fd = new FormData();
  Object.entries(input.fields).forEach(([k, v]) => {
    fd.append(k, v);
  });
  fd.append('resume_file', {
    uri: input.resume.uri,
    name: input.resume.name,
    type: input.resume.type,
  } as unknown as Blob);

  await parseJsonResponse(
    getApiClient().post(endpoints.public.workWithUsCreate, { body: fd }),
    genericEnvelope,
  );
}
