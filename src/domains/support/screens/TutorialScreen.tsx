import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import { isDotIr } from '@/shared/config/resolveIsDotIr';
import { Text } from '@/shared/ui/Text';
import { Button } from '@/ui/components/Button';

const scope = isDotIr ? 'ir' : 'com';
const TUTORIALS = [
  ['ثبت نام', '1.%D8%AB%D8%A8%D8%AA%20%D9%86%D8%A7%D9%85%20%D8%AF%D8%B1%20%D8%B3%D8%A7%DB%8C%D8%AA.mp4'],
  ['خدمات حمایتی', '2.%D8%B4%D8%B1%D9%88%D8%B9%20%D8%A8%DB%8C%D8%AF%D8%A7%D8%B1%DB%8C-%D8%B1%D8%A7%DB%8C%DA%AF%D8%A7%D9%86.mp4'],
  ['خرید اشتراک', '6.%D8%B3%D9%84%D9%81%20%D9%84%D8%A7%D9%88.mp4'],
  ['روی خط', '7.%D8%B1%D9%88%DB%8C%20%D8%AE%D8%B7.mp4'],
  ['پشتیبانی', '8.%D8%AA%DB%8C%DA%A9%D8%AA.mp4'],
  ['هدیه به دیگری', '9.%D9%87%D8%AF%DB%8C%D9%87.mp4'],
] as const;

export function TutorialScreen() {
  const { colors } = useTheme();
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>نحوه استفاده از خدمات</Text>
      <Text style={[styles.body, { color: colors.text }]}>
        با مشاهده ویدئوهای زیر می‌توانید نحوه ثبت‌نام، خرید و استفاده از خدمات را بیاموزید.
      </Text>
      {TUTORIALS.map(([title, file]) => (
        <View key={file} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
          <Button
            layout="auto"
            variant="outlined"
            title="پخش ویدئوی آموزشی"
            onPress={() =>
              Linking.openURL(`https://dl.innoghte.${scope}/amoozesh-site/${file}`).catch(() => {})
            }
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 36, gap: 14 },
  title: { fontSize: 23, fontWeight: '800', textAlign: 'center' },
  body: { fontSize: 15, lineHeight: 24, textAlign: 'center' },
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, padding: 14, gap: 10 },
  cardTitle: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
});
