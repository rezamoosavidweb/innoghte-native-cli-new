import { useQuery } from '@tanstack/react-query';

import { fetchQuickAccess } from '@/domains/home/api/fetchQuickAccess';
import { homeKeys } from '@/domains/home/model/queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useQuickAccess() {
  return useQuery({
    queryKey: homeKeys.quickAccess(),
    queryFn: fetchQuickAccess,
    staleTime: STALE_TIME_MS,
  });
}
