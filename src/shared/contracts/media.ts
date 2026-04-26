/** Cross-domain media shapes (public API payloads, shared by courses + media). */

export type ImageMedia = {
  course_id: number;
  id: number;
  src: string;
};

export type MediaUrl = {
  id: number;
  media_id: number;
  url: string;
};

export type MediaDto = {
  id: number;
  src: string;
  url: string;
  title: string;
  tags: string;
  type: 'audio' | 'image' | 'video';
  is_active: boolean;
  is_cover: boolean;
  duration: string;
  created_at: string;
  updated_at: string;
  priority: number;
};

export type AlbumDetailsDto = {
  id: number;
  course_id: number;
  image: string;
  url: string;
  title: string;
  duration: string;
  tags: string;
  created_at: string;
  updated_at: string;
};
