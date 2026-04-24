import { SEED_PUBLIC_ALBUM_TRACKS } from '@/features/publicAlbums/data/seedPublicAlbumTracks';
import type { PublicAlbumTrack } from '@/features/publicAlbums/types';

const LATENCY_MS = 600;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function fetchPublicAlbumTracks(): Promise<
  readonly PublicAlbumTrack[]
> {
  await delay(LATENCY_MS);
  return SEED_PUBLIC_ALBUM_TRACKS;
}
