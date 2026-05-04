import { z } from 'zod';

import { getApiClient, parseJsonResponse } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';

export type CreateCatalogItemCommentBody = {
  course_id: number;
  points: number;
  comment: string;
};

const createCommentResponseSchema = z.looseObject({
  message: z.string(),
});

export async function postCatalogItemComment(
  body: CreateCatalogItemCommentBody,
): Promise<void> {
  await parseJsonResponse(
    getApiClient().post(endpoints.coursesAuth.createComment, { json: body }),
    createCommentResponseSchema,
  );
}
