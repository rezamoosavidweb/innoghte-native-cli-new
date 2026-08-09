import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import { isDotIr } from '@/shared/config/resolveIsDotIr';
import { Text } from '@/shared/ui/Text';
import { Button } from '@/ui/components/Button';

const CALENDLY_URL = 'https://calendly.com/hosein-aura/life_coaching';

export function PrivateConsultationScreen() {
  const { colors } = useTheme();
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>دوست و همراه عزیز سلام،</Text>
      <Text style={[styles.body, { color: colors.text }]}>
        خوشحالم که برای ارتقای کیفیت زندگی‌ات تصمیم گرفته‌ای مشاوره خصوصی داشته باشی. برای رزرو وقت از فرم رزرو آنلاین استفاده کن.
      </Text>
      {isDotIr ? (
        <View style={[styles.warning, { backgroundColor: colors.card, borderColor: colors.notification }]}>
          <Text style={[styles.warningText, { color: colors.text }]}>
            سرویس مشاوره خصوصی با توجه به شرایط، برای ساکنین کشور ایران قابل استفاده نیست.
          </Text>
        </View>
      ) : (
        <Button
          layout="auto"
          title="رزرو وقت مشاوره خصوصی"
          onPress={() => Linking.openURL(CALENDLY_URL).catch(() => {})}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 36, gap: 16 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  body: { fontSize: 16, lineHeight: 26, textAlign: 'justify' },
  warning: { borderWidth: 1, borderRadius: 12, padding: 16 },
  warningText: { fontSize: 15, lineHeight: 24, textAlign: 'center' },
});
