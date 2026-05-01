import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle
} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useThemeColors, fontSize, fontWeight, radius, spacing } from '@/ui/theme';

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
  const s = React.useMemo(
    () =>
      StyleSheet.create({
        btn: {
          marginTop: spacing.md,
          paddingVertical: spacing.md,
          borderRadius: radius.md,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
        },
        disabled: { opacity: 0.5 },
        txt: { color: colors.onPrimary, fontWeight: fontWeight.semibold, fontSize: fontSize.base },
      }),
    [colors],
  );

  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[s.btn, (disabled || loading) && s.disabled]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {loading ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={s.txt}>{label}</Text>}
      </Pressable>
    </View>
  );
});
