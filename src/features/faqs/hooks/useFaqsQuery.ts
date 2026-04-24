import { useQuery } from '@tanstack/react-query';

import { fetchFaqs } from '../api/fetchFaqs';
import { FAQS_QUERY_KEY } from '../constants/queryKeys';

const STALE_TIME_MS = 30 * 60 * 1000;

export function useFaqsQuery() {
  return useQuery({
    queryKey: FAQS_QUERY_KEY,
    queryFn: fetchFaqs,
    staleTime: STALE_TIME_MS,
  });
}
