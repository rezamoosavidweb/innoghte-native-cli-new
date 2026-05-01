import { z } from 'zod';

import { apiPaginationResponseFieldSchema } from '@/shared/contracts/pagination.schema';

/**
 * Single comment row from `GET .../public/courses/comments` — loose match for
 * legacy backend fields (see client-web `CommentDto`).
 */
export const publicCommentRowSchema = z.looseObject({
  comment: z.string(),
  points: z.number().optional(),
  user: z
    .looseObject({
      full_name: z.string().optional(),
    })
    .optional(),
  course: z
    .looseObject({
      title_fa: z.string().optional(),
    })
    .optional(),
  created_at: z.union([z.string(), z.number()]).optional(),
});

export const commentSchema = z.object({
  comment: z.string(),
  course: z.null().optional(),
  course_id: z.number().optional(),
  created_at: z.string(),
  id: z.number(),
  is_active: z.boolean(),
  points: z.number(),
  status: z.string(),
  updated_at: z.string(),
  user: z.object({
    id: z.number(),
    name: z.null().optional(),
    family: z.null().optional(),
    full_name: z.string(),
    email: z.string(),
    avatar: z.string().optional(),
  }),
  user_id: z.number(),
});

export const publicCommentsResponseSchema = z.looseObject({
  message: z.string(),
  data: z.array(commentSchema),
  pagination: apiPaginationResponseFieldSchema,
});
