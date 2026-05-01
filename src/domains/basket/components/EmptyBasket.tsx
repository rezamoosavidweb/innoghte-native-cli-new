import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { navigateToAppLeaf } from '@/app/bridge/auth/protectedNavigation';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useEmptyBasketStyles } from '@/domains/basket/components/emptyBasket.styles';
import { useThemeColors } from '@/ui/theme';

export const EmptyBasket = React.memo(function EmptyBasket() {
  const colors = useThemeColors();
  const navigation = useAppNavigation();

  const onBrowse = React.useCallback(() => {
    navigateToAppLeaf(navigation, 'PublicCourses');
  }, [navigation]);

  const s = useEmptyBasketStyles(colors);

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
