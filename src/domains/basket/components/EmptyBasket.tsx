import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { navigateToAppLeaf } from '@/app/bridge/auth/protectedNavigation';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useEmptyBasketStyles } from '@/domains/basket/components/emptyBasket.styles';
import { useThemeColors } from '@/ui/theme';
import { Button } from '@/ui/components/Button';

export const EmptyBasket = React.memo(function EmptyBasket() {
  const colors = useThemeColors();
  const navigation = useAppNavigation();

  const onBrowse = React.useCallback(() => {
    navigateToAppLeaf(navigation, 'Courses');
  }, [navigation]);

  const s = useEmptyBasketStyles(colors);

  return (
    <View style={s.wrap}>
      <Text style={s.glyph} accessibilityLabel="">
        🛒
      </Text>
      <Text style={s.title}>سبد خرید شما خالی است.</Text>
      <Button
        layout="auto"
        variant="filled"
        title="مشاهده لیست دوره‌ها"
        onPress={onBrowse}
        style={s.btn}
        contentStyle={{ width: '100%' }}
      >
        <Text style={s.btnText}>مشاهده لیست دوره‌ها</Text>
      </Button>
    </View>
  );
});
