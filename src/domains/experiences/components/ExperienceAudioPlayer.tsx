import * as React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

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

export const ExperienceAudioPlayer = React.memo(function ExperienceAudioPlayer({
  url,
}: {
  url: string;
}) {
  const html = React.useMemo(
    () =>
      `<!doctype html><html dir="rtl"><head><meta name="viewport" content="width=device-width,initial-scale=1" /></head><body style="margin:0;background:transparent;display:flex;align-items:center;height:72px"><audio controls preload="metadata" style="width:100%" src="${escapeHtmlAttribute(url)}"></audio></body></html>`,
    [url],
  );

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      style={styles.root}
      scrollEnabled={false}
      mediaPlaybackRequiresUserAction
      allowsInlineMediaPlayback
    />
  );
});

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    height: 72,
    backgroundColor: 'transparent',
  },
});
