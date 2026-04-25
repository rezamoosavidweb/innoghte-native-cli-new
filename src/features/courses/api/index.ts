import {
  mapPublicCourseToCourseItem,
  type Course,
} from '@/features/courses/types';
import { getCourses } from '@/shared/api/modules/content.service';

export async function fetchCourses(): Promise<readonly Course[]> {
  const response = await getCourses();
  return (response.data ?? []).map(mapPublicCourseToCourseItem);
}
