import { useTheme } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { activateSupportCourse } from '@/domains/support/api/supportServicesApi';
import { useCatalogItemDetail } from '@/shared/catalog/hooks/useCatalogItemDetail';
import { catalogKeys } from '@/shared/catalog/model/queryKeys';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { Text } from '@/shared/ui/Text';
import { showAppToast } from '@/shared/ui/toast/toastBus';
import { Button } from '@/ui/components/Button';

const SUPPORT_COURSE_ID = 2;

export function SupportServicesScreen() {
  const { colors } = useTheme();
  const navigation = useAppNavigation();
  const queryClient = useQueryClient();
  const [accepted, setAccepted] = React.useState(false);
  const { data, isPending, isError, refetch } =
    useCatalogItemDetail(SUPPORT_COURSE_ID);
  const activation = useMutation({
    mutationFn: () => activateSupportCourse(SUPPORT_COURSE_ID),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: catalogKeys.detail(SUPPORT_COURSE_ID),
      });
      showAppToast(
        'درخواست شما ثبت شد و اشتراک دوره شروع بیداری به حسابتان اضافه شد.',
        'success',
      );
    },
    onError: error => {
      showAppToast(
        error instanceof Error ? error.message : 'ثبت درخواست ناموفق بود.',
        'error',
      );
    },
  });

  const activate = React.useCallback(() => {
    if (!accepted) {
      showAppToast('لطفاً ابتدا قوانین ارائه خدمات را بپذیرید.', 'error');
      return;
    }
    activation.mutate();
  }, [accepted, activation]);

  if (isPending) {
    return <Text style={styles.center}>در حال بررسی وضعیت اشتراک…</Text>;
  }
  if (isError) {
    return (
      <View style={styles.state}>
        <Text style={[styles.center, { color: colors.text }]}>دریافت اطلاعات خدمات حمایتی ناموفق بود.</Text>
        <Button title="تلاش دوباره" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>خدمات حمایتی «این نقطه»</Text>
      <Text style={[styles.intro, { color: colors.text }]}>
        ضمن تشکر بابت انتخاب مجموعه «این نقطه»، در حال حاضر خدمات حمایتی به شرح زیر است:
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.heading, { color: colors.text }]}>اشتراک آنلاین شروع بیداری</Text>
        <Text style={[styles.body, { color: colors.text }]}>
          هدف این مجموعه پیش از هر چیز گسترش آگاهی است. به همین دلیل امکان استفاده از دوره شروع بیداری برای افرادی که حقیقتاً و صادقانه توان پرداخت هزینه آن را ندارند فراهم شده است. اگر توان پرداخت دارید، خرید این دوره حمایت شما از هدف اصلی مجموعه است؛ در غیر این صورت قوانین را بپذیرید و درخواست فعال‌سازی را ثبت کنید.
        </Text>

        {data?.is_accessible ? (
          <Text style={[styles.success, { borderColor: colors.primary, color: colors.text }]}>
            شما قبلاً اشتراک آنلاین دوره شروع بیداری را دریافت کرده‌اید.
          </Text>
        ) : (
          <>
            <Button
              layout="auto"
              variant={accepted ? 'filled' : 'outlined'}
              title={accepted ? '✓ قوانین را می‌پذیرم' : 'قوانین ارائه خدمت را می‌پذیرم'}
              onPress={() => setAccepted(value => !value)}
            />
            <Button
              layout="auto"
              variant="text"
              title="مشاهده قوانین ارائه خدمت"
              onPress={() => navigation.navigate('Terms')}
            />
            <Button
              layout="auto"
              title="فعالسازی اشتراک آنلاین شروع بیداری"
              loading={activation.isPending}
              onPress={activate}
            />
          </>
        )}
        <Button
          layout="auto"
          variant="outlined"
          title="خرید دوره شروع بیداری"
          onPress={() => navigation.navigate('PublicCourseDetail', { courseId: SUPPORT_COURSE_ID })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32, gap: 14 },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  center: { textAlign: 'center', padding: 24 },
  title: { fontSize: 23, fontWeight: '800', textAlign: 'center' },
  intro: { fontSize: 15, lineHeight: 24, textAlign: 'center' },
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, padding: 16, gap: 14 },
  heading: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  body: { fontSize: 15, lineHeight: 25, textAlign: 'justify' },
  success: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, padding: 14, textAlign: 'center' },
});
