import * as React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';

import { Text } from '@/shared/ui/Text';

import {
  createChapterMediaPlaceholderStyles,
  createChapterMediaThemedStyles,
} from '@/domains/courses/ui/course-detail/courseChapterMediaArea.styles';
import { Button } from '@/ui/components/Button';

type JsonMediaItem = { uuid?: string; title?: string };

type Parsed =
  | { kind: 'json-array'; items: JsonMediaItem[] }
  | { kind: 'url'; url: string }
  | { kind: 'html' };

function parseMedia(raw: string | null | undefined): Parsed | null {
  if (!raw?.trim()) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return { kind: 'json-array', items: parsed as JsonMediaItem[] };
    }
  } catch {
    /* fall through */
  }
  const m = raw.trim();
  if (m.startsWith('https://') || m.startsWith('http://')) {
    return { kind: 'url', url: m };
  }
  if (m.includes('<')) {
    return { kind: 'html' };
  }
  return null;
}

export type AlbumChapterMediaAreaProps = {
  activeChapterMedia: string | null | undefined;
};

const AlbumChapterMediaAreaComponent = ({
  activeChapterMedia,
}: AlbumChapterMediaAreaProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const parsedBlocks = React.useMemo(
    () => parseMedia(activeChapterMedia),
    [activeChapterMedia],
  );

  const openUrl = React.useCallback((url: string) => {
    Linking.openURL(url).catch(() => {});
  }, []);

  const placeholderChrome = createChapterMediaPlaceholderStyles(colors);
  const themedChrome = createChapterMediaThemedStyles(colors);

  if (!activeChapterMedia?.trim()) {
    return (
      <View style={[styles.placeholder, placeholderChrome.placeholderBg]}>
        <Text style={[styles.placeholderGlyph, placeholderChrome.glyph]}>▶</Text>
      </View>
    );
  }

  if (!parsedBlocks) {
    return null;
  }

  if (parsedBlocks.kind === 'json-array') {
    return (
      <View style={[styles.box, themedChrome.boxBorder]}>
        {parsedBlocks.items.map((item, idx) => (
          <View key={item.uuid ?? `i-${idx}`} style={styles.jsonRow}>
            {item.title ? (
              <Text style={[styles.jsonTitle, themedChrome.jsonTitle]}>
                {item.title}
              </Text>
            ) : null}
            <Text style={[styles.hint, themedChrome.hint]}>
              {t('screens.coursePlayer.externalPlaybackHint')}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  if (parsedBlocks.kind === 'url') {
    return (
      <Button
        layout="auto"
        variant="text"
        title={t('screens.coursePlayer.openMedia')}
        style={[styles.linkBtn, themedChrome.linkBtn]}
        onPress={() => {
          openUrl(parsedBlocks.url);
        }}
        contentStyle={{ width: '100%' }}
      >
        <Text style={styles.linkText}>{t('screens.coursePlayer.openMedia')}</Text>
      </Button>
    );
  }

  return (
    <View style={[styles.box, themedChrome.boxBorder]}>
      <Text style={[styles.hint, themedChrome.hint]}>
        {t('screens.coursePlayer.htmlMediaHint')}
      </Text>
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
  box: {
    width: '100%',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 8,
  },
  jsonRow: {
    gap: 4,
    marginBottom: 6,
  },
  jsonTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.85,
  },
  linkBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export const AlbumChapterMediaArea = React.memo(AlbumChapterMediaAreaComponent);
AlbumChapterMediaArea.displayName = 'AlbumChapterMediaArea';
