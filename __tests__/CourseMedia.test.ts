import { parseCourseMedia } from '@/domains/courses/ui/course-detail/CourseChapterMediaArea';
import { parseKavimoSource } from '@/ui/components/KavimoPlayer';

describe('course media parsing', () => {
  it('extracts the Vis3 host and media id from a Kavimo URL', () => {
    expect(
      parseKavimoSource('https://stream.innoghte.ir/kx78qv2gsft4f/embed'),
    ).toEqual({
      domainName: 'stream.innoghte.ir',
      mediaID: 'kx78qv2gsft4f',
    });
  });

  it('preserves iframe markup for in-app WebView rendering', () => {
    const html = '<iframe src="https://example.com/embed/42"></iframe>';

    expect(parseCourseMedia(html)).toEqual({ kind: 'html', html });
  });

  it('accepts the legacy uuid/type media array used by the web app', () => {
    const items = [{ uuid: 'media-42', type: 'video', title: 'جلسه اول' }];

    expect(parseCourseMedia(JSON.stringify(items))).toEqual({
      kind: 'json-array',
      items,
    });
  });
});
