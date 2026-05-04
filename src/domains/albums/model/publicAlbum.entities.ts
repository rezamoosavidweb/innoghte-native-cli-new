export type PublicAlbumMedia = {
  readonly id: number;
  readonly type: 'image' | 'audio';
  readonly src: string;
};

/** Shape used by the legacy public-albums list card (subset of old PublicCourseDto). */
export type PublicAlbumTrack = {
  readonly id: number;
  readonly title_fa: string;
  readonly chapters_count: number;
  readonly duration: string;
  readonly medias: readonly PublicAlbumMedia[];
};
