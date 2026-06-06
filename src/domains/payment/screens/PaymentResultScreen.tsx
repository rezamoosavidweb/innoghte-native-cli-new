import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { RouteProp } from '@react-navigation/native';
import * as React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { resolveErrorMessage } from '@/shared/infra/http';
import { useThemeColors } from '@/ui/theme';

import { OtherStatusOrder } from '@/domains/payment/components/OtherStatusOrder';
import { SuccessOrder } from '@/domains/payment/components/SuccessOrder';
import { usePaymentVerify } from '@/domains/payment/hooks/usePaymentVerify';
import {
  canVerify,
  deriveUnifiedStatus,
  resolvePaymentParams,
} from '@/domains/payment/model/paymentResultParams';
import { usePaymentResultStyles } from '@/domains/payment/ui/paymentResult.styles';

function PaymentResultInner({
  route,
}: {
  route: RouteProp<DrawerParamList, 'PaymentResult'>;
}) {
  const colors = useThemeColors();
  const s = usePaymentResultStyles(colors);

  const params = React.useMemo(
    () => resolvePaymentParams(route.params),
    [route.params],
  );
  const unifiedStatus = deriveUnifiedStatus(params);
  const enabled = canVerify(params);
  const verify = usePaymentVerify(params);

  const order = verify.data?.data?.order;
  const showSuccess = unifiedStatus === 'OK' && !verify.isError && Boolean(order);

  const message = React.useMemo(() => {
    if (verify.isError) {
      return resolveErrorMessage(
        verify.error,
        'متاسفانه مشکلی در دریافت اطلاعات تراکنش داریم!',
      );
    }
    if (unifiedStatus === 'NOK') {
      return 'پرداخت ناموفق بود. در صورت کسر مبلغ، طی ۷۲ ساعت به حساب شما بازمی‌گردد.';
    }
    if (!enabled) {
      return 'اطلاعات تراکنشی برای نمایش یافت نشد.';
    }
    return 'متاسفانه مشکلی در دریافت اطلاعات تراکنش داریم!';
  }, [verify.isError, verify.error, unifiedStatus, enabled]);

  if (enabled && verify.isPending) {
    return (
      <SafeAreaView style={s.flex} edges={['left', 'right']}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.flex} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={s.scrollContent}>
        {showSuccess && order ? (
          <SuccessOrder order={order} gatewayName={params.gatewayName} />
        ) : (
          <OtherStatusOrder message={message} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type Props = DrawerScreenProps<DrawerParamList, 'PaymentResult'>;

const PaymentResultScreenComponent = (props: Props) => (
  <PaymentResultInner route={props.route} />
);

export const PaymentResultScreen = React.memo(PaymentResultScreenComponent);
PaymentResultScreen.displayName = 'PaymentResultScreen';
