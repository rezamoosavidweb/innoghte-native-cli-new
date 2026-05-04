import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Share, View } from 'react-native';

import type { OrderDto } from '@/domains/transactions/model/order.schemas';
import {
  formatDiscountLine,
  formatOrderMoneyField,
  formatOrderPayableLine,
  formatTrackingCode,
} from '@/domains/transactions/model/formatOrder';
import {
  getPaymentStatusPresentation,
  toneColors,
} from '@/domains/transactions/model/orderStatus';
import type { TransactionDetailsStyleSet } from '@/domains/transactions/ui/TransactionDetails.styles';
import { Text } from '@/shared/ui/Text';
import { toPersianNumber } from '@/shared/utils/toPersianNumber';
import { useThemeColors } from '@/ui/theme';
import { Button } from '@/ui/components/Button';

function buildShareMessage(
  order: OrderDto,
  t: (key: string, opts?: Record<string, string>) => string,
  language: string,
): string {
  const pay = getPaymentStatusPresentation(order.payment?.status);
  const lines = [
    t('screens.transactions.details.title', {
      orderNumber:
        language === 'fa'
          ? toPersianNumber(order.order_number)
          : order.order_number,
    }),
    `${t('screens.transactions.details.tracking')}: ${formatTrackingCode(order, language)}`,
    `${t('screens.transactions.details.id')}: ${language === 'fa' ? toPersianNumber(String(order.id)) : String(order.id)}`,
    `${t('screens.transactions.details.price')}: ${formatOrderMoneyField(order, order.total, language)}`,
    `${t('screens.transactions.details.paymentStatus')}: ${pay.label}`,
    `${t('screens.transactions.details.discount')}: ${formatDiscountLine(order, language)}`,
    `${t('screens.transactions.details.total')}: ${formatOrderPayableLine(order, language)}`,
  ];
  return lines.join('\n');
}

export type TransactionDetailsBodyProps = {
  order: OrderDto;
  styles: TransactionDetailsStyleSet;
  onClosePress: () => void;
};

function TransactionDetailsBodyComponent({
  order,
  styles,
  onClosePress,
}: TransactionDetailsBodyProps) {
  const { t, i18n } = useTranslation();
  const uiColors = useThemeColors();
  const pay = getPaymentStatusPresentation(order.payment?.status);
  const payTone = toneColors(pay.tone, uiColors);
  const orderNumDisplay =
    i18n.language === 'fa'
      ? toPersianNumber(order.order_number)
      : order.order_number;

  const onShare = React.useCallback(() => {
    const message = buildShareMessage(order, t, i18n.language);
    Share.share({
      message,
      title: t('screens.transactions.details.downloadInvoice'),
    }).catch(() => {});
  }, [i18n.language, order, t]);

  return (
    <View style={styles.sheet}>
      <View style={styles.header}>
        <Button
          layout="auto"
          variant="text"
          title={t('screens.transactions.details.closeA11y')}
          accessibilityLabel={t('screens.transactions.details.closeA11y')}
          hitSlop={12}
          onPress={onClosePress}
          style={styles.closePress}
        >
          <Text style={styles.closeGlyph}>×</Text>
        </Button>
        <Text style={styles.title} numberOfLines={1}>
          {t('screens.transactions.details.title', {
            orderNumber: orderNumDisplay,
          })}
        </Text>
        <View style={styles.headerBalance} />
      </View>
      <BottomSheetScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.detailsCard}>
          <View style={styles.row}>
            <Text style={styles.label}>
              {t('screens.transactions.details.tracking')}
            </Text>
            <Text style={styles.value}>
              {formatTrackingCode(order, i18n.language)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>
              {t('screens.transactions.details.id')}
            </Text>
            <Text style={styles.value}>
              {i18n.language === 'fa'
                ? toPersianNumber(String(order.id))
                : String(order.id)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>
              {t('screens.transactions.details.price')}
            </Text>
            <Text style={styles.value}>
              {formatOrderMoneyField(order, order.total, i18n.language)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>
              {t('screens.transactions.details.paymentStatus')}
            </Text>
            <View
              style={[
                styles.paymentPill,
                { backgroundColor: payTone.backgroundColor },
              ]}
            >
              <Text style={[styles.paymentPillText, { color: payTone.color }]}>
                {pay.label}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>
              {t('screens.transactions.details.discount')}
            </Text>
            <Text style={styles.value}>
              {formatDiscountLine(order, i18n.language)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              {t('screens.transactions.details.total')}
            </Text>
            <Text style={styles.totalValue}>
              {formatOrderPayableLine(order, i18n.language)}
            </Text>
          </View>
        </View>
      </BottomSheetScrollView>
      <Button
        variant="filled"
        title={t('screens.transactions.details.downloadInvoice')}
        onPress={onShare}
        style={styles.primaryButton}
        contentStyle={{ width: '100%' }}
      >
        <Text style={styles.primaryButtonText}>
          {t('screens.transactions.details.downloadInvoice')}
        </Text>
      </Button>
    </View>
  );
}

export const TransactionDetailsBody = React.memo(TransactionDetailsBodyComponent);

TransactionDetailsBody.displayName = 'TransactionDetailsBody';
