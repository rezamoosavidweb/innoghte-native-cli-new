import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  View,
  type ViewStyle,
} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useCheckoutButtonStyles } from '@/domains/basket/components/checkoutButton.styles';
import { useThemeColors } from '@/ui/theme';

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
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[s.btn, (disabled || loading) && s.disabled]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <View style={s.btnSlot}>
          <View style={loading ? s.btnLabelHidden : undefined}>
            <Text style={s.txt}>{label}</Text>
          </View>
          {loading ? (
            <View
              style={s.btnLoaderOverlay}
              pointerEvents="none"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <ActivityIndicator color={colors.onPrimary} />
            </View>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
});
