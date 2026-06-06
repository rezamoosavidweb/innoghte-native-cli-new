import * as React from 'react';
import { Image, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { navigateToAppLeaf } from '@/app/bridge/auth';
import type { PaymentGatewayName } from '@/shared/contracts/navigationPayment';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useThemeColors } from '@/ui/theme';
import { Button } from '@/ui/components/Button';

import type { OrderCourseDto, OrderDto } from '@/domains/payment/model/schemas';
import {
  formatOrderPrice,
  formatPaidAt,
  paymentMethodLabel,
} from '@/domains/payment/utils/formatOrder';
import { usePaymentResultStyles } from '@/domains/payment/ui/paymentResult.styles';

function courseImageSrc(item: OrderCourseDto): string {
  return item.medias?.find(m => m?.type === 'image')?.src ?? '';
}

type Props = {
  order: OrderDto;
  gatewayName: PaymentGatewayName;
};

export const SuccessOrder = React.memo(function SuccessOrder({
  order,
  gatewayName,
}: Props) {
  const colors = useThemeColors();
  const navigation = useAppNavigation();
  const s = usePaymentResultStyles(colors);

  const totalNum = Number(order.totalPayable || order.total || 0);
  const isFree = !totalNum;
  const items = order.courses ?? [];

  const onOpenCourse = React.useCallback(
    (courseId?: number) => {
      if (courseId != null) {
        navigateToAppLeaf(navigation, 'CourseDetail', { courseId });
      } else {
        navigateToAppLeaf(navigation, 'Courses');
      }
    },
    [navigation],
  );

  return (
    <View style={s.card}>
      <Text style={s.successTitle}>سفارش شما تایید شد</Text>
      <Text style={s.helper}>
        {isFree
          ? 'دسترسی به دوره برای شما فعال شده است.'
          : 'پرداخت شما با موفقیت انجام و دسترسی برای شما فعال شده است.'}
      </Text>
      <Text style={s.note}>
        اگر سفارش شما شامل رزرو رویداد می باشد بلیط و شرایط حضور برای شما ایمیل
        شده است. لطفا ایمیل خود را چک کنید.
      </Text>

      <View style={s.detailsRow}>
        <View style={s.detailCol}>
          <Text style={s.detailLabel}>شماره سفارش</Text>
          <Text style={s.detailValue}>{order.order_number ?? '-'}</Text>
        </View>
        <View style={s.detailCol}>
          <Text style={s.detailLabel}>تاریخ</Text>
          <Text style={s.detailValue}>
            {order.paid_at ? formatPaidAt(order.paid_at) : '-'}
          </Text>
        </View>
      </View>
      <View style={s.detailsRow}>
        <View style={s.detailCol}>
          <Text style={s.detailLabel}>ایمیل</Text>
          <Text style={s.detailValue} numberOfLines={1}>
            {order.user?.email ?? '-'}
          </Text>
        </View>
        <View style={s.detailCol}>
          <Text style={s.detailLabel}>مجموع</Text>
          <Text style={s.detailValue}>{formatOrderPrice(totalNum)}</Text>
        </View>
      </View>
      <View style={s.detailColFull}>
        <Text style={s.detailLabel}>روش پرداخت</Text>
        <Text style={s.detailValue}>
          {paymentMethodLabel(gatewayName, order.totalPayable)}
        </Text>
      </View>

      <View style={s.divider} />
      <Text style={s.sectionTitle}>سفارش شما</Text>

      {items.map((item, i) => {
        const img = courseImageSrc(item);
        return (
          <View key={item.id ?? i} style={s.item}>
            <View style={s.itemRow}>
              <View style={s.thumbWrap}>
                {img ? (
                  <Image
                    source={{ uri: img }}
                    style={s.thumb}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[s.thumb, s.thumbPlaceholder]} />
                )}
              </View>
              <View style={s.itemInfo}>
                <Text style={s.itemTitle} numberOfLines={2}>
                  {item.title_fa ?? '—'}
                </Text>
                <View style={s.metaRow}>
                  <Text style={s.metaLabel}>تعداد:</Text>
                  <Text style={s.metaValue}>۱</Text>
                </View>
                <View style={s.metaRow}>
                  <Text style={s.metaLabel}>قیمت:</Text>
                  <Text style={s.price}>
                    {formatOrderPrice(Number(item.pivot?.final_price ?? 0))}
                  </Text>
                </View>
              </View>
            </View>
            <Button
              variant="filled"
              title="بخش دوره‌های من"
              onPress={() => onOpenCourse(item.id)}
              style={s.greenBtn}
            />
          </View>
        );
      })}

      <View style={s.finalRow}>
        <Text style={s.finalLabel}>قیمت نهایی</Text>
        <Text style={s.finalValue}>{formatOrderPrice(totalNum)}</Text>
      </View>

      <Text style={s.thanks}>از این که همراه ما هستید سپاسگزاریم.</Text>
    </View>
  );
});
