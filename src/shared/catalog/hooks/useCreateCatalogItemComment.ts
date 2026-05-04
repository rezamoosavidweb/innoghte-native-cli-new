import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  postCatalogItemComment,
  type CreateCatalogItemCommentBody,
} from '@/shared/catalog/api/postCatalogItemComment';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';

export function useCreateCatalogItemComment(itemId?: number, categoryId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCatalogItemCommentBody) => postCatalogItemComment(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: catalogKeys.commentsScopePrefix(itemId, categoryId),
      });
    },
  });
}
