import { useQuery } from '@tanstack/react-query';

import { fetchFaqs } from '@/domains/support/faqs/api';
import { FAQS_QUERY_KEY } from '@/domains/support/faqs/model/queryKeys';

const STALE_TIME_MS = 30 * 60 * 1000;

export function useFaqs() {
  return useQuery({
    queryKey: FAQS_QUERY_KEY,
    queryFn: fetchFaqs,
    staleTime: STALE_TIME_MS,
  });
}
