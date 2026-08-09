import { z } from 'zod';

import { getApiClient, parseJsonResponse } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';

const supportServiceResponseSchema = z.looseObject({
  status: z.union([z.number(), z.boolean()]).optional(),
  message: z.string().optional(),
});

export async function activateSupportCourse(courseId: number): Promise<void> {
  await parseJsonResponse(
    getApiClient().post(endpoints.coursesAuth.giftRequest(courseId)),
    supportServiceResponseSchema,
  );
}
