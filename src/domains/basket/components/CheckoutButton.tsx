import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useCheckoutButtonStyles } from '@/domains/basket/components/checkoutButton.styles';
import { useThemeColors } from '@/ui/theme';
import { Button } from '@/ui/components/Button';

type Props = {
  onPress: () => void;
  loading: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
  style?: ViewStyle;
};

export const CheckoutButton = React.memo(function CheckoutButton({
  onPress,
  loading,
  disabled,
  label = 'ثبت سفارش',
  loadingLabel: _loadingLabel = 'لطفا کمی صبر کنید...',
  style,
}: Props) {
  const colors = useThemeColors();
  const s = useCheckoutButtonStyles(colors);

  return (
    <View style={style}>
      <Button
        variant="filled"
        title={label}
        onPress={onPress}
        loading={loading}
        disabled={disabled}
        style={[s.btn, (disabled || loading) && s.disabled]}
      />
    </View>
  );
});
