import { SEED_ALBUMS, type Album } from '@/features/albums/data/seedAlbums';

const FAKE_LATENCY_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function fetchAlbums(): Promise<readonly Album[]> {
  await delay(FAKE_LATENCY_MS);
  return SEED_ALBUMS;
}
