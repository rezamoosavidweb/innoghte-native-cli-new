import { Vis3 } from '@kavimo-tehran/vis3-react-native';
import { View } from 'react-native';

export interface KavimoPlayerProps {
  autoPlay?: boolean;
  onEnded?: (action: any) => void;
  activeChapterMedia?: string | null;
}
export function KavimoPlayer({
  autoPlay,
  onEnded,
  activeChapterMedia,
}: KavimoPlayerProps) {
  const url = new URL(activeChapterMedia || '');
  const parts = url.pathname.split('/').filter(Boolean);
  const domainName = url.hostname;
  const mediaID = parts[0];

  return (
    <View style={{ height: 300, width: '100%', padding: 20 }}>
      <Vis3 domainName={domainName} ID={mediaID} />
    </View>
  );
}
