import type { CatalogItemDetail } from '@/shared/catalog/model/catalogItemDetail.schema';

type Chapter = NonNullable<CatalogItemDetail['chapters']>[number];

function nonEmpty(value: string | null | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function resolveAlbumChapterAudio(
  chapter: Chapter,
  chapterIndex: number,
  medias: CatalogItemDetail['medias'],
): string {
  const direct = nonEmpty(chapter.audio_media_url) ?? nonEmpty(chapter.url);
  if (direct) {
    return direct;
  }

  const audio = (medias ?? []).filter(media => media.type === 'audio')[
    chapterIndex
  ];
  return nonEmpty(audio?.url) ?? '';
}
