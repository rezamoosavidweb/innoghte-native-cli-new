import type {
  AlbumDetailsDto,
  ImageMedia,
  MediaDto,
  MediaUrl,
} from '@/shared/contracts/media';
import type { PaginationDto } from '@/shared/contracts/pagination';

export type AudioMedia = {
  course_id: number;
  duration: string;
  id: number;
  urls: MediaUrl[];
};

export type CategoryDto = {
  active: boolean;
  created_at: Date;
  deleted_at: null;
  demo: null;
  id: number;
  image: string;
  list_info: string;
  list_questions_and_answers: Record<string, { question: string; answer: string }>;
  list_title: string;
  meta_description: null;
  meta_keywords: null;
  order: number;
  parent_id: number;
  slug: null;
  title: string;
  title_en: string;
  updated_at: Date;
};

export type RedirectLink = {
  active: boolean;
  label: string;
  url: null | string;
};

export type LiveDetailType = {
  id: number;
  course_id: number;
  start_date: string;
  is_live_time_passed: boolean;
  start_time: string;
  duration: string;
  questions_and_answers: Record<string, { question: string; answer: string }>;
  recorded_url: string;
};

export type IncludedItemType = {
  id: number;
  title_fa: string;
  live_detail: LiveDetailType;
};

export type ChaptersDto = {
  id: number;
  sort: number | null;
  course_id: number;
  author: string | null;
  url: string | null;
  audio_media_url: string | null;
  author_fa: string | null;
  admin_author_id: number | null;
  title: string;
  title_fa: string;
  language: string;
  short_info: string | null;
  full_info: string | null;
  duration: string | null;
  publish_date_time: string | null;
  publish_status: number;
  is_free: number;
  points: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DetailsDto = {
  id: number;
  course_id: number;
  image: string;
  title: string;
  info: string;
  created_at: string;
  updated_at: string;
};

export type AudioBookDetailDto = {
  id: number;
  course_id: number;
  section1_description: string;
  section2_title: string;
  section2_description: string;
  section3_title: string;
  section3_description: string;
  section4_title: string;
  section4_description: string;
  created_at: string;
  updated_at: string;
};

/** Raw API shape for a single public catalog item. */
export type CatalogItemDto = {
  id: number;
  is_package: boolean;
  included_course_ids: number[];
  included_courses: CatalogItemDto[];
  category_id: number;
  access_type: string;
  author: string;
  title: string | null;
  title_fa: string;
  short_info: string;
  full_info: string;
  tags: string | null;
  duration: string | null;
  from_album: string | null;
  color: string;
  price: number;
  discount_price: number;
  capacity: number;
  points: number;
  is_show: boolean;
  external_url: string | null;
  requirements: string | null;
  demo: string | null;
  is_downloadable: number;
  remain_capacity: number;
  priority: number;
  created_at: string;
  updated_at: string;
  medias: MediaDto[];
  chapters: ChaptersDto[];
  details: DetailsDto[];
  live_detail: LiveDetailType | null;
  album_details: AlbumDetailsDto[];
  event_detail: unknown | null;
  audio_book_detail: AudioBookDetailDto | null;
  is_accessible: boolean | null;
  purchase_scope: unknown | null;
  is_active: boolean;
  is_show_fa: boolean;
  is_gift: boolean;
  discount_type: number;
  discount_type_label: string;
};

export type AuthCatalogItemDto = {
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

export type CatalogItemsResponse = {
  message: string;
  data: CatalogItemDto[];
  pagination: PaginationDto;
};

export type CatalogItemDetailResponse = {
  message: string;
  data: CatalogItemDto;
  pagination: PaginationDto;
};
