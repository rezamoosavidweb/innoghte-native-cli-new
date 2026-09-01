import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';

import { Text } from '@/shared/ui/Text';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

function escapeHtmlAttribute(value: string): string {
  return value.replace(
    /[&<>"']/g,
    character =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character] ?? character,
  );
}

export type AlbumChapterMediaAreaProps = {
  activeChapterMedia: string | null | undefined;
};

const AlbumChapterMediaAreaComponent = ({
  activeChapterMedia,
}: AlbumChapterMediaAreaProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const normalizedUrl = activeChapterMedia?.trim() ?? '';

  const html = React.useMemo(
    () =>
      `<!doctype html><html dir="rtl"><head><meta name="viewport" content="width=device-width,initial-scale=1" /></head><body style="margin:0;background:transparent;display:flex;align-items:center;height:72px"><audio controls preload="metadata" controlslist="nodownload" style="width:100%;height:54px" src="${escapeHtmlAttribute(normalizedUrl)}"></audio></body></html>`,
    [normalizedUrl],
  );

  if (!normalizedUrl) {
    return (
      <View
        style={[
          styles.empty,
          {
            borderColor: colors.border,
            backgroundColor: hexAlpha(colors.text, 0.04),
          },
        ]}
      >
        <Text style={[styles.emptyIcon, { color: colors.text }]}>♫</Text>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          {t('screens.albumDetail.noAudio')}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.playerFrame,
        { borderColor: colors.border, backgroundColor: colors.card },
      ]}
    >
      <WebView
        key={normalizedUrl}
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://innoghte.ir' }}
        style={styles.player}
        scrollEnabled={false}
        mediaPlaybackRequiresUserAction
        allowsInlineMediaPlayback
      />
    </View>
  );
};

const styles = StyleSheet.create({
  playerFrame: {
    width: '100%',
    height: 74,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  player: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  empty: {
    minHeight: 74,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  emptyIcon: {
    fontSize: 22,
    opacity: 0.65,
  },
  emptyText: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export const AlbumChapterMediaArea = React.memo(AlbumChapterMediaAreaComponent);
AlbumChapterMediaArea.displayName = 'AlbumChapterMediaArea';
