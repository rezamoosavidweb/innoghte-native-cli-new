import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { navigateToAppLeaf } from '@/app/bridge/auth';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useThemeColors } from '@/ui/theme';
import { Button } from '@/ui/components/Button';

import { usePaymentResultStyles } from '@/domains/payment/ui/paymentResult.styles';

type Props = {
  message: string;
};

export const OtherStatusOrder = React.memo(function OtherStatusOrder({
  message,
}: Props) {
  const colors = useThemeColors();
  const navigation = useAppNavigation();
  const s = usePaymentResultStyles(colors);

  const onHome = React.useCallback(() => {
    navigateToAppLeaf(navigation, 'Home');
  }, [navigation]);

  return (
    <View style={s.center}>
      <Text style={s.statusTitle}>{message}</Text>
      <Button
        variant="filled"
        title="بازگشت به خانه"
        onPress={onHome}
        style={s.statusBtn}
      />
    </View>
  );
});
