import { useMutation, useQuery } from '@tanstack/react-query';

import {
  fetchWorkWithUsCategories,
  postWorkWithUsApplication,
  type CollaborationResumeUpload,
} from '@/domains/collaboration/api/collaborationPublicApi';

export const collaborationCategoriesKey = ['workWithUs', 'categories'] as const;

export function useWorkWithUsCategoriesQuery() {
  return useQuery({
    queryKey: collaborationCategoriesKey,
    queryFn: fetchWorkWithUsCategories,
    staleTime: 60_000,
  });
}

export function useWorkWithUsMutation() {
  return useMutation({
    mutationFn: (input: {
      fields: Record<string, string>;
      resume: CollaborationResumeUpload;
    }) => postWorkWithUsApplication(input),
  });
}
