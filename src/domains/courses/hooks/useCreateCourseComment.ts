import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  postCourseComment,
  type CreateCourseCommentBody,
} from '@/domains/courses/api/postCourseComment';
import { coursesKeys } from '@/domains/courses/model/queryKeys';

export function useCreateCourseComment(courseId?: number, categoryId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCourseCommentBody) => postCourseComment(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: coursesKeys.commentsScopePrefix(courseId, categoryId),
      });
    },
  });
}
