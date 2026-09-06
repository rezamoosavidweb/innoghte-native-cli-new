import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { parsePaymentGatewayCallback } from '@/domains/payment/model/gatewayCallback';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { Text } from '@/shared/ui/Text';
import { Button } from '@/ui/components/Button';
import { spacing, useThemeColors } from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'PaymentGateway'>;

export const PaymentGatewayScreen = React.memo(function PaymentGatewayScreen({
  navigation,
  route,
}: Props) {
  const colors = useThemeColors();
  const [failed, setFailed] = React.useState(false);
  const callbackHandled = React.useRef(false);

  const shouldStart = React.useCallback(
    (request: { url: string }) => {
      const callback = parsePaymentGatewayCallback(
        request.url,
        route.params.gatewayName,
      );
      if (callback) {
        if (callbackHandled.current) return false;

        callbackHandled.current = true;
        navigation.navigate('PaymentResult', callback);
        return false;
      }

      if (/^https?:\/\//i.test(request.url)) return true;
      Linking.openURL(request.url).catch(() => setFailed(true));
      return false;
    },
    [navigation, route.params.gatewayName],
  );

  const openInBrowser = React.useCallback(() => {
    Linking.openURL(route.params.url).catch(() => setFailed(true));
  }, [route.params.url]);

  if (failed) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.message, { color: colors.text }]}>
          صفحه پرداخت بارگذاری نشد.
        </Text>
        <Button
          variant="filled"
          title="باز کردن در مرورگر"
          onPress={openInBrowser}
        />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: route.params.url }}
      originWhitelist={['https://*', 'http://*']}
      onShouldStartLoadWithRequest={shouldStart}
      onError={() => setFailed(true)}
      onHttpError={event => {
        if (event.nativeEvent.statusCode >= 400) setFailed(true);
      }}
      startInLoadingState
      setSupportMultipleWindows={false}
      renderLoading={() => (
        <View style={[styles.loading, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.message, { color: colors.text }]}>در حال اتصال به درگاه...</Text>
        </View>
      )}
      style={{ backgroundColor: colors.background }}
    />
  );
});
PaymentGatewayScreen.displayName = 'PaymentGatewayScreen';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  loading: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  message: { textAlign: 'center' },
});
