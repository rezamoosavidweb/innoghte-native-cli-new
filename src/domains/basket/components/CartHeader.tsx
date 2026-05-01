import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useCartHeaderStyles } from '@/domains/basket/components/cartHeader.styles';
import { useThemeColors } from '@/ui/theme';

type Props = {
  title: string;
  subtitle?: string;
};

export const CartHeader = React.memo(function CartHeader({ title, subtitle }: Props) {
  const colors = useThemeColors();
  const s = useCartHeaderStyles(colors);

  return (
    <View style={s.wrap}>
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.sub}>{subtitle}</Text> : null}
    </View>
  );
});
