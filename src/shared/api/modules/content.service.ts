import { apiClient, parseJsonResponse } from '@/shared/api/client';
import { endpoints } from '@/shared/api/endpoints';
import type { PublicCoursesResponse } from '@/shared/api/types/course';

export type FaqCategory = {
  id: number;
  title: string;
  faqs: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
};

type RawListResponse<T> = {
  data?: T;
};

async function getPublicList<T>(endpoint: string): Promise<T[]> {
  const result = await parseJsonResponse<RawListResponse<T[]> | T[]>(
    apiClient.get(endpoint.replace(/^\//, '')),
  );

  if (Array.isArray(result)) {
    return result;
  }

  return result.data ?? [];
}

export async function getCourses(): Promise<PublicCoursesResponse> {
  return parseJsonResponse<PublicCoursesResponse>(
    apiClient.get(endpoints.public.courses.replace(/^\//, '')),
  );
}

export async function getAlbums(): Promise<Record<string, unknown>[]> {
  return getPublicList<Record<string, unknown>>(endpoints.public.albums);
}

export async function getEvents(): Promise<Record<string, unknown>[]> {
  return getPublicList<Record<string, unknown>>(endpoints.public.events);
}

export async function getLiveMeetings(): Promise<Record<string, unknown>[]> {
  return getPublicList<Record<string, unknown>>(endpoints.public.liveMeeting);
}

export async function getFaqs(): Promise<FaqCategory[]> {
  return getPublicList<FaqCategory>(endpoints.public.faq);
}
