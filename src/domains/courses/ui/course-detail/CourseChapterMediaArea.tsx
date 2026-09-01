import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

import {
  KavimoPlayer,
  parseKavimoSource,
} from '@/ui/components/KavimoPlayer';
import { Text } from '@/shared/ui/Text';

import { createChapterMediaPlaceholderStyles } from '@/domains/courses/ui/course-detail/courseChapterMediaArea.styles';

type JsonMediaItem = {
  uuid?: string;
  title?: string;
  type?: string;
  url?: string;
};

export type ParsedCourseMedia =
  | { kind: 'json-array'; items: JsonMediaItem[] }
  | { kind: 'url'; url: string }
  | { kind: 'html'; html: string };

export function parseCourseMedia(
  raw: string | null | undefined,
): ParsedCourseMedia | null {
  if (!raw?.trim()) {
    return null;
  }
  const media = raw.trim();
  try {
    const parsed = JSON.parse(media) as unknown;
    if (Array.isArray(parsed)) {
      return { kind: 'json-array', items: parsed as JsonMediaItem[] };
    }
  } catch {
    /* The API also returns plain URLs and iframe HTML. */
  }
  if (media.startsWith('https://') || media.startsWith('http://')) {
    return { kind: 'url', url: media };
  }
  if (media.includes('<')) {
    return { kind: 'html', html: media };
  }
  return null;
}

function isDirectVideoUrl(url: string): boolean {
  return /\.(?:mp4|webm|m3u8)(?:$|[?#])/i.test(url);
}

function responsiveMediaHtml(content: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
      iframe, video { position: absolute; inset: 0; width: 100% !important; height: 100% !important; border: 0; background: #000; }
    </style>
  </head>
  <body>${content}</body>
</html>`;
}

function directVideoMarkup(url: string): string {
  return `<video controls autoplay playsinline controlslist="nodownload"><source src="${url}" /></video>`;
}

function EmbeddedMedia({ html }: { html: string }) {
  return (
    <View style={styles.webPlayer}>
      <WebView
        source={{
          html: responsiveMediaHtml(html),
          baseUrl: 'https://innoghte.ir',
        }}
        style={styles.webView}
        originWhitelist={['*']}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        setSupportMultipleWindows={false}
      />
    </View>
  );
}

function UrlMedia({ url }: { url: string }) {
  if (isDirectVideoUrl(url)) {
    return <EmbeddedMedia html={directVideoMarkup(url)} />;
  }
  if (parseKavimoSource(url)) {
    return <KavimoPlayer activeChapterMedia={url} />;
  }
  return (
    <View style={styles.webPlayer}>
      <WebView
        source={{ uri: url }}
        style={styles.webView}
        originWhitelist={['*']}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
      />
    </View>
  );
}

export type CourseChapterMediaAreaProps = {
  activeChapterMedia: string | null | undefined;
};

const CourseChapterMediaAreaComponent = ({
  activeChapterMedia,
}: CourseChapterMediaAreaProps) => {
  const { colors } = useTheme();
  const parsedMedia = React.useMemo(
    () => parseCourseMedia(activeChapterMedia),
    [activeChapterMedia],
  );
  const placeholderChrome = createChapterMediaPlaceholderStyles(colors);

  if (!activeChapterMedia?.trim()) {
    return (
      <View style={[styles.placeholder, placeholderChrome.placeholderBg]}>
        <Text style={[styles.placeholderGlyph, placeholderChrome.glyph]}>▶</Text>
      </View>
    );
  }

  if (!parsedMedia) {
    return null;
  }

  if (parsedMedia.kind === 'url') {
    return <UrlMedia url={parsedMedia.url} />;
  }

  if (parsedMedia.kind === 'html') {
    return <EmbeddedMedia html={parsedMedia.html} />;
  }

  return (
    <View style={styles.mediaList}>
      {parsedMedia.items.map((item, index) => (
        <View key={item.uuid ?? item.url ?? `media-${index}`} style={styles.mediaItem}>
          {item.title ? (
            <Text style={[styles.mediaTitle, { color: colors.text }]}>
              {item.title}
            </Text>
          ) : null}
          {item.url ? <UrlMedia url={item.url} /> : null}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderGlyph: {
    fontSize: 44,
    opacity: 0.45,
  },
  webPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000',
  },
  mediaList: {
    width: '100%',
    gap: 14,
  },
  mediaItem: {
    gap: 8,
  },
  mediaTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
});

export const CourseChapterMediaArea = React.memo(
  CourseChapterMediaAreaComponent,
);
CourseChapterMediaArea.displayName = 'CourseChapterMediaArea';
