import type { PublicAlbumTrack } from '@/domains/media/model';

/** Static sample — legacy drawer `Albums` used `getPublicCourses(1)`; replace with API when wired. */
export const SEED_PUBLIC_ALBUM_TRACKS: readonly PublicAlbumTrack[] = [
  {
    id: 101,
    title_fa: 'قطعه نمونه ۱',
    chapters_count: 12,
    duration: '۴۵ دقیقه',
    medias: [
      {
        id: 1,
        type: 'image',
        src: 'https://admin.innoghte.ir/storage/front/images/course_images/1723632939-xG9BcbgG.jpg',
      },
    ],
  },
  {
    id: 102,
    title_fa: 'قطعه نمونه ۲',
    chapters_count: 8,
    duration: '۳۰ دقیقه',
    medias: [
      {
        id: 2,
        type: 'image',
        src: 'https://admin.innoghte.ir/storage/front/images/course_images/1723633252-MSnm6m0s.jpg',
      },
    ],
  },
];
