export { getPublicCourses } from './fetchPublicCourses';

import {
  mapPublicCourseToCourseItem,
  type Course,
} from '../model/entities';
import { getPublicCourses } from './fetchPublicCourses';

export async function fetchCourses(): Promise<readonly Course[]> {
  const response = await getPublicCourses();
  return (response.data ?? []).map(mapPublicCourseToCourseItem);
}
