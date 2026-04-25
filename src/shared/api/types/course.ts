import { ImageMedia, PaginationDto, PublicCourseDto } from '@/shared/api/types/common';

export type CourseDto = {
  id: number;
  priority: number;
  package: number;
  included_course_ids: string[] | null;
  downloadable: number;
  title_fa: string;
  short_info: string;
  full_info: string;
  color: string;
  show: number;
  show_fa: number;
  price: number;
  discount_type: number;
  discount_price: number;
  discount_percent: null;
  capacity: number;
  remain_capacity: number;
  image_media: ImageMedia[];
};
export type CoursesResponse = {
  non_package_courses: CourseDto[];
  package_courses: [];
  status: number;
};
export type PublicCoursesResponse = {
  message: string;
  data: PublicCourseDto[];
  pagination: PaginationDto;
};

export type PublicCourseDetailResponse = {
  message: string;
  data: PublicCourseDto;
  pagination: PaginationDto;
};
