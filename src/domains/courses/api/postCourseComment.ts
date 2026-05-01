import { z } from 'zod';

import { getApiClient, parseJsonResponse } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';

/** Matches client-web `CreateCommentBodyType`. */
export type CreateCourseCommentBody = {
  course_id: number;
  points: number;
  comment: string;
};

const createCommentResponseSchema = z.looseObject({
  message: z.string(),
});

/** Same contract as client-web `createComment`. */
export async function postCourseComment(
  body: CreateCourseCommentBody,
): Promise<void> {
  await parseJsonResponse(
    getApiClient().post(endpoints.coursesAuth.createComment, { json: body }),
    createCommentResponseSchema,
  );
}
