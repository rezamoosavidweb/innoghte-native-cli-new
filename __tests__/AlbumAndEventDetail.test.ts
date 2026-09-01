import { resolveAlbumChapterAudio } from '@/domains/albums/utils/resolveAlbumChapterAudio';
import {
  formatEventDate,
  formatEventTime,
  isEventPast,
} from '@/domains/events/utils/eventDetailDate';
import { catalogItemDetailSchema } from '@/shared/catalog/model/catalogItemDetail.schema';

describe('album playback sources', () => {
  it('prefers a chapter audio URL over catalog media', () => {
    expect(
      resolveAlbumChapterAudio(
        {
          id: 1,
          title_fa: 'قطعه مستقیم',
          audio_media_url: 'https://audio.example/direct.mp3',
          url: null,
        },
        0,
        [
          {
            type: 'audio',
            src: '',
            url: 'https://audio.example/fallback.mp3',
          },
        ],
      ),
    ).toBe('https://audio.example/direct.mp3');
  });

  it('maps an audio media item by chapter index when chapter URLs are empty', () => {
    expect(
      resolveAlbumChapterAudio(
        { id: 2, title_fa: 'قطعه دوم', audio_media_url: null, url: null },
        1,
        [
          { type: 'image', src: 'cover.jpg' },
          { type: 'audio', src: '', url: 'https://audio.example/one.mp3' },
          { type: 'audio', src: '', url: 'https://audio.example/two.mp3' },
        ],
      ),
    ).toBe('https://audio.example/two.mp3');
  });
});

describe('event detail data', () => {
  it('accepts the event, prioritized media, and album audio fields returned by the API', () => {
    const result = catalogItemDetailSchema.safeParse({
      id: 256,
      title_fa: 'رویداد نمونه',
      short_info: '',
      full_info: '<p>برنامه</p>',
      from_album: null,
      color: null,
      price: 0,
      requirements: null,
      demo: null,
      access_type: null,
      event_detail: {
        start_at: '2026-12-29T07:00:00+03:30',
        location: 'سالن همایش',
        type: 'workshop',
      },
      chapters: [
        {
          id: 1,
          title_fa: 'قطعه',
          audio_media_url: 'https://audio.example/track.mp3',
        },
      ],
      medias: [
        {
          id: 10,
          type: 'image',
          priority: 1,
          src: 'https://image.example/event.jpg',
          url: null,
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('formats valid dates and detects past events', () => {
    const startAt = '2025-12-29T07:00:00+03:30';

    expect(formatEventDate(startAt)).not.toBe('');
    expect(formatEventTime(startAt)).not.toBe('');
    expect(isEventPast(startAt, Date.parse('2026-01-01T00:00:00Z'))).toBe(true);
  });
});
