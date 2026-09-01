import {
  Vis3,
  type Vis3Media,
} from '@kavimo-tehran/vis3-react-native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export interface KavimoPlayerProps {
  autoPlay?: boolean;
  onEnded?: (action: any) => void;
  activeChapterMedia?: string | null;
}

export type KavimoSource = Readonly<{
  domainName: string;
  mediaID: string;
}>;

export function parseKavimoSource(
  activeChapterMedia: string | null | undefined,
): KavimoSource | null {
  if (!activeChapterMedia?.trim()) {
    return null;
  }
  try {
    const url = new URL(activeChapterMedia.trim());
    const mediaID = url.pathname.split('/').filter(Boolean)[0];
    if (!url.hostname || !mediaID) {
      return null;
    }
    return { domainName: url.hostname, mediaID };
  } catch {
    return null;
  }
}

export function KavimoPlayer({
  activeChapterMedia,
  autoPlay = false,
  onEnded,
}: KavimoPlayerProps) {
  const source = React.useMemo(
    () => parseKavimoSource(activeChapterMedia),
    [activeChapterMedia],
  );

  const handleLoad = React.useCallback(
    (media: Vis3Media) => {
      if (autoPlay) {
        media.api.actions.Play();
      }
      media.api.events.OnEnded(() => {
        onEnded?.(media.api.actions.Play);
      });
    },
    [autoPlay, onEnded],
  );

  if (!source) {
    return null;
  }

  return (
    <View style={styles.player}>
      <Vis3
        domainName={source.domainName}
        ID={source.mediaID}
        onLoad={handleLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  player: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#000',
  },
});
