import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Image, Linking, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/shared/ui/Text';
import { showAppToast } from '@/shared/ui/toast';
import { Button } from '@/ui/components/Button';

const PODCAST_LINKS = [
  {
    label: 'Spotify',
    url: 'https://open.spotify.com/show/2HIXQBtFdNg2QfjoFoIChK?si=VQ-8D0xYQC6vULDyX_31Iw',
  },
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/channel/UCxL5awDwnPpPmcYos4zZSSA',
  },
  {
    label: 'Apple Podcasts',
    url: 'https://podcasts.apple.com/us/podcast/%D8%A7%DB%8C%D9%86-%D9%86%D9%82%D8%B7%D9%87/id1607369690',
  },
  { label: 'Castbox', url: 'https://castbox.fm/va/5175428' },
] as const;

export const PodcastScreen = React.memo(function PodcastScreen() {
  const { colors } = useTheme();

  const openUrl = React.useCallback((url: string) => {
    Linking.openURL(url).catch(() => {
      showAppToast('باز کردن لینک پادکست انجام نشد.', 'error');
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: colors.text }]}>پادکست این نقطه</Text>
      <Text style={[styles.intro, { color: colors.text }]}>
        همراهان گرامی، می‌توانید با مراجعه به اپلیکیشن‌های زیر از پادکست «این نقطه» استفاده نمایید.
      </Text>
      <View style={styles.hero}>
        <Image
          source={{ uri: 'https://stg-web.innoghte.ir/images/podcast.png' }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel="پادکست این نقطه"
        />
        <Text style={styles.quote}>
          تو این نقطه همدیگر رو بیدار می‌کنیم، تا خونه قدم می‌زنیم و تمرین می‌کنیم هنر خوب زیستن رو.
        </Text>
        <Text style={styles.hint}>
          برای شنیدن پادکست، سرویس موردنظر خود را انتخاب کنید.
        </Text>
        <View style={styles.links}>
          {PODCAST_LINKS.map(link => (
            <Button
              key={link.label}
              title={link.label}
              layout="auto"
              variant="outlined"
              onPress={() => openUrl(link.url)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, paddingTop: 26, paddingBottom: 44, gap: 14 },
  title: { textAlign: 'right', fontSize: 25, fontWeight: '800' },
  intro: { textAlign: 'justify', writingDirection: 'rtl', lineHeight: 28 },
  hero: { marginTop: 12, padding: 20, gap: 18, borderRadius: 24, backgroundColor: '#28303d' },
  image: { width: '100%', aspectRatio: 0.72, maxHeight: 520, borderRadius: 18, backgroundColor: '#fff' },
  quote: { color: '#f3f3f3', textAlign: 'center', writingDirection: 'rtl', fontSize: 20, lineHeight: 34 },
  hint: { color: '#e3e3e3', textAlign: 'center', writingDirection: 'rtl' },
  links: { gap: 12 },
});
