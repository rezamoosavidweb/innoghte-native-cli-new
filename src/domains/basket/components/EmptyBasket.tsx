import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { navigateToAppLeaf } from '@/app/bridge/auth/protectedNavigation';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useThemeColors, fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export const EmptyBasket = React.memo(function EmptyBasket() {
  const colors = useThemeColors();
  const navigation = useAppNavigation();

  const onBrowse = React.useCallback(() => {
    navigateToAppLeaf(navigation, 'PublicCourses');
  }, [navigation]);

  const s = React.useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          flex: 1,
          minHeight: 280,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.xl,
        },
        glyph: { fontSize: 48, marginBottom: spacing.md },
        title: {
          fontSize: fontSize.lg,
          fontWeight: fontWeight.bold,
          color: colors.text,
          textAlign: 'center',
        },
        btn: {
          marginTop: spacing.xl,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing['2xl'],
          borderRadius: radius.md,
          backgroundColor: colors.primary,
        },
        btnText: { color: colors.onPrimary, fontWeight: fontWeight.semibold },
      }),
    [colors],
  );

  return (
    <View style={s.wrap}>
      <Text style={s.glyph} accessibilityLabel="">
        🛒
      </Text>
      <Text style={s.title}>سبد خرید شما خالی است.</Text>
      <Pressable onPress={onBrowse} style={s.btn} accessibilityRole="button">
        <Text style={s.btnText}>مشاهده لیست دوره‌ها</Text>
      </Pressable>
    </View>
  );
});
