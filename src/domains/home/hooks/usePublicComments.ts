import { useQuery } from '@tanstack/react-query';

import { fetchPublicComments } from '@/domains/home/api/fetchPublicComments';
import { homeKeys } from '@/domains/home/model/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;

export function usePublicComments(
  page: number = DEFAULT_PAGE,
  perPage: number = DEFAULT_PER_PAGE,
) {
  return useQuery({
    queryKey: homeKeys.comments(page, perPage),
    queryFn: () => fetchPublicComments(page, perPage),
    staleTime: STALE_TIME_MS,
  });
}
