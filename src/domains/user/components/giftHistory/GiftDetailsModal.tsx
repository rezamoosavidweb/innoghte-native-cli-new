import * as React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import CloseIcon from '@/assets/icons/inn/close.svg';
import type { GiftHistoryItem } from '@/domains/user/api/giftHistoryApi';
import { Text } from '@/shared/ui/Text';
import {
  fontSize,
  fontWeight,
  radius,
  spacing,
  useThemeColors,
} from '@/ui/theme';

type Props = {
  item: GiftHistoryItem | null;
  onClose: () => void;
};

function paymentDetailsLabel(status?: number | null): string {
  if (status === 1) return 'تکمیل شده';
  if (status === 2) return 'تکمیل نشده';
  if (status === 3) return 'لغو شده';
  return 'نامشخص';
}

function formatMoney(
  value: number | string | null | undefined,
  currency?: string | null,
): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 'نامشخص';
  if (currency === 'IRR') {
    return `${(amount / 10).toLocaleString('fa-IR')} تومان`;
  }
  if (currency === 'USD') {
    return `${amount.toLocaleString('en-US')} $`;
  }
  return 'نامشخص';
}

type DetailRowProps = {
  label: string;
  value: string;
  strong?: boolean;
};

const DetailRow = React.memo(function DetailRow({
  label,
  value,
  strong = false,
}: DetailRowProps) {
  const colors = useThemeColors();
  return (
    <View style={[styles.row, { borderColor: colors.divider }]}>
      <Text
        style={[
          styles.rowLabel,
          strong ? styles.strong : null,
          { color: colors.text },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.rowValue,
          strong ? styles.strong : null,
          { color: colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
});
DetailRow.displayName = 'DetailRow';

export const GiftDetailsModal = React.memo(function GiftDetailsModal({
  item,
  onClose,
}: Props) {
  const colors = useThemeColors();
  const order = item?.order;
  const courses = order?.courses ?? [];

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={item != null}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="بستن جزئیات هدیه"
          onPress={onClose}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.overlay },
          ]}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.dialog,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={[styles.header, { borderColor: colors.divider }]}>
            <Text style={[styles.title, { color: colors.text }]}>جزئیات هدیه</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="بستن"
              hitSlop={12}
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed ? styles.pressed : null,
              ]}
            >
              <CloseIcon width={16} height={16} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView bounces={false} contentContainerStyle={styles.body}>
            <View style={[styles.tableHeader, { borderColor: colors.divider }]}>
              <Text style={[styles.tableHeaderLabel, { color: colors.text }]}>محصول</Text>
              <Text style={[styles.tableHeaderValue, { color: colors.text }]}>مبلغ</Text>
            </View>

            {courses.length > 0 ? (
              courses.map(course => (
                <DetailRow
                  key={String(course.course_id)}
                  label={course.course_name || '—'}
                  value={formatMoney(course.final_price, order?.CurrencyType)}
                />
              ))
            ) : (
              <DetailRow label="—" value="—" />
            )}

            <DetailRow
              label="وضعیت پرداخت"
              value={paymentDetailsLabel(order?.payment?.status)}
            />
            <DetailRow
              label="مبلغ کل"
              value={formatMoney(order?.totalPayable, order?.CurrencyType)}
              strong
            />
            <DetailRow
              label="شناسه سفارش"
              value={order?.order_number || 'نامشخص'}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});
GiftDetailsModal.displayName = 'GiftDetailsModal';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '78%',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.xl,
  },
  header: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign: 'right',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.65 },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  tableHeader: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tableHeaderLabel: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    textAlign: 'right',
  },
  tableHeaderValue: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    textAlign: 'left',
  },
  row: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: fontSize.sm,
    lineHeight: 22,
    textAlign: 'right',
  },
  rowValue: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: fontSize.sm,
    lineHeight: 22,
    textAlign: 'left',
  },
  strong: { fontWeight: fontWeight.bold },
});
