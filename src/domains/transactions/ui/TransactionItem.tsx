import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { OrderDto } from '@/domains/transactions/model/order.schemas';
import {
  formatOrderDate,
  formatOrderPayableLine,
  buildCourseSummary,
} from '@/domains/transactions/model/formatOrder';
import {
  getOrderStatusPresentation,
  toneColors,
} from '@/domains/transactions/model/orderStatus';
import { Text } from '@/shared/ui/Text';
import { useThemeColors } from '@/ui/theme';

import type { TransactionItemStyleSet } from '@/domains/transactions/ui/TransactionItem.styles';

export type TransactionItemProps = {
  order: OrderDto;
  onPress: (order: OrderDto) => void;
  styles: TransactionItemStyleSet;
};

function DetailsArrowIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path
        d="M7 17 L17 7 M17 7 H9 M17 7 V15"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const TransactionItemComponent = ({
  order,
  onPress,
  styles: s,
}: TransactionItemProps) => {
  const { t, i18n } = useTranslation();
  const uiColors = useThemeColors();

  const onRowPress = React.useCallback(() => {
    onPress(order);
  }, [onPress, order]);

  const payLine = formatOrderPayableLine(order, i18n.language);
  const productLine = buildCourseSummary(order);
  const dateLine = formatOrderDate(
    order.created_at ?? order.updated_at,
    i18n.language,
  );
  const { label, tone } = getOrderStatusPresentation(order.status);
  const badge = toneColors(tone, uiColors);

  const typeLabel = order.courses.some(c => (c.package ?? 0) > 0)
    ? t('screens.transactions.orderType.package')
    : order.courses.length
      ? t('screens.transactions.orderType.course')
      : '—';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onRowPress}
      style={({ pressed }) => [
        s.pressable,
        pressed && { opacity: 0.78 },
      ]}
    >
      <View style={s.colProducts}>
        <Text style={s.productText} numberOfLines={2}>
          {productLine}
        </Text>
        <Text style={s.typeText}>
          {t('screens.transactions.typeLabel')}: {typeLabel}
        </Text>
        {dateLine ? (
          <Text style={s.dateText}>
            {t('screens.transactions.dateLabel')}: {dateLine}
          </Text>
        ) : null}
      </View>
      <View style={s.colPaid}>
        <Text style={s.amountText} numberOfLines={2}>
          {payLine}
        </Text>
      </View>
      <View style={s.colStatus}>
        <View style={[s.statusBadge, { backgroundColor: badge.backgroundColor }]}>
          <Text style={[s.statusBadgeText, { color: badge.color }]}>
            {label}
          </Text>
        </View>
      </View>
      <View style={s.colDetails}>
        <View style={[s.detailsIconHit, { backgroundColor: uiColors.card }]}>
          <DetailsArrowIcon color={uiColors.primary} />
        </View>
      </View>
    </Pressable>
  );
};

export const TransactionItem = React.memo(
  TransactionItemComponent,
  (prev, next) =>
    prev.order.id === next.order.id &&
    prev.onPress === next.onPress &&
    prev.styles === next.styles,
);

TransactionItem.displayName = 'TransactionItem';
