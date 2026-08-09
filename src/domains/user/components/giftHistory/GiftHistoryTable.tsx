import * as React from 'react';
import {
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  type ScrollView as ScrollViewType,
} from 'react-native';

import type {
  GiftHistoryItem,
  GiftHistoryKind,
} from '@/domains/user/api/giftHistoryApi';
import { giftSubScreenStyles as styles } from '@/domains/user/screens/giftSubScreen.styles';
import { Text } from '@/shared/ui/Text';
import { hexAlpha, useThemeColors } from '@/ui/theme';

type ColumnKey =
  | 'name'
  | 'email'
  | 'courses'
  | 'currency'
  | 'tracking'
  | 'message'
  | 'receiveStatus'
  | 'paymentStatus'
  | 'date'
  | 'details';

type Column = {
  key: ColumnKey;
  title: string;
  width: number;
};

const SENT_COLUMNS: readonly Column[] = [
  { key: 'name', title: 'نام و نام خانوادگی هدیه گیرنده', width: 112 },
  { key: 'email', title: 'ایمیل هدیه گیرنده', width: 150 },
  { key: 'courses', title: 'دوره‌های هدیه داده شده', width: 196 },
  { key: 'currency', title: 'نوع دوره', width: 104 },
  { key: 'message', title: 'پیام هدیه دهنده', width: 230 },
  { key: 'receiveStatus', title: 'وضعیت دریافت دوره', width: 156 },
  { key: 'paymentStatus', title: 'وضعیت پرداخت', width: 148 },
  { key: 'date', title: 'تاریخ سفارش', width: 116 },
  { key: 'details', title: '', width: 94 },
];

const RECEIVED_COLUMNS: readonly Column[] = [
  { key: 'name', title: 'نام و نام خانوادگی هدیه دهنده', width: 112 },
  { key: 'email', title: 'ایمیل هدیه دهنده', width: 150 },
  { key: 'courses', title: 'دوره‌های هدیه داده شده', width: 196 },
  { key: 'currency', title: 'نوع دوره', width: 104 },
  { key: 'tracking', title: 'کد پیگیری', width: 130 },
  { key: 'message', title: 'پیام هدیه دهنده', width: 230 },
  { key: 'paymentStatus', title: 'وضعیت پرداخت', width: 148 },
  { key: 'date', title: 'تاریخ سفارش', width: 116 },
];

function personName(item: GiftHistoryItem, kind: GiftHistoryKind): string {
  if (kind === 'received') {
    return (
      item.sender?.full_name?.trim() ||
      [item.sender?.name, item.sender?.family].filter(Boolean).join(' ') ||
      '—'
    );
  }
  return (
    [item.receiver_first_name, item.receiver_last_name]
      .filter(Boolean)
      .join(' ') ||
    item.receiver?.full_name?.trim() ||
    '—'
  );
}

function personEmail(item: GiftHistoryItem, kind: GiftHistoryKind): string {
  return (kind === 'received' ? item.sender?.email : item.receiver_email) || '—';
}

function coursesLabel(item: GiftHistoryItem): string {
  const names = item.order?.courses
    .map(course => course.course_name)
    .filter(Boolean);
  return names?.length ? names.join(' - ') : '—';
}

function currencyLabel(item: GiftHistoryItem): string {
  if (item.order?.CurrencyType === 'IRR') return 'داخلی';
  if (item.order?.CurrencyType === 'USD') return 'خارجی';
  return '—';
}

function paymentPresentation(status?: number | null) {
  if (status === 1) return { label: 'موفق', tone: 'success' as const };
  if (status === 2) return { label: 'در انتظار پرداخت', tone: 'warning' as const };
  if (status === 3) return { label: 'ناموفق', tone: 'error' as const };
  return { label: '—', tone: 'neutral' as const };
}

function receivePresentation(item: GiftHistoryItem) {
  if (item.order?.payment?.status === 3) {
    return { label: 'کنسل شده', tone: 'error' as const };
  }
  if (item.receiver?.email_verified_at || item.receiver?.mobile_verified_at) {
    return { label: 'موفق', tone: 'success' as const };
  }
  return { label: 'در انتظار دریافت', tone: 'warning' as const };
}

function displayDate(value: string): string {
  return Number.isNaN(Date.parse(value))
    ? value
    : new Date(value).toLocaleDateString('fa-IR');
}

type CellProps = {
  column: Column;
  item: GiftHistoryItem;
  kind: GiftHistoryKind;
};

function GiftCell({ column, item, kind }: CellProps) {
  const colors = useThemeColors();
  const commonStyle = [styles.cellText, { color: colors.text }];
  const status =
    column.key === 'receiveStatus'
      ? receivePresentation(item)
      : column.key === 'paymentStatus'
        ? paymentPresentation(item.order?.payment?.status)
        : null;

  if (status) {
    const palette =
      status.tone === 'success'
        ? { background: colors.successMuted, foreground: colors.successText }
        : status.tone === 'warning'
          ? { background: colors.warningBg, foreground: colors.warningText }
          : status.tone === 'error'
            ? { background: colors.errorMuted, foreground: colors.errorText }
            : { background: colors.surfaceSecondary, foreground: colors.textMuted };
    return (
      <View style={[styles.cell, { width: column.width }]}>
        <View style={[styles.statusPill, { backgroundColor: palette.background }]}>
          <Text style={[styles.statusText, { color: palette.foreground }]}>
            {status.label}
          </Text>
        </View>
      </View>
    );
  }

  if (column.key === 'details') {
    return (
      <View style={[styles.cell, { width: column.width }]}>
        <View style={[styles.detailsPill, { backgroundColor: colors.primaryBg }]}>
          <Text style={[styles.detailsText, { color: colors.primary }]}>جزئیات</Text>
        </View>
      </View>
    );
  }

  let value = '—';
  switch (column.key) {
    case 'name':
      value = personName(item, kind);
      break;
    case 'email':
      value = personEmail(item, kind);
      break;
    case 'courses':
      value = coursesLabel(item);
      break;
    case 'currency':
      value = currencyLabel(item);
      break;
    case 'tracking':
      value = item.order?.payment?.payment_number || '—';
      break;
    case 'message':
      value = item.message || '—';
      break;
    case 'date':
      value = displayDate(item.created_at);
      break;
  }

  return (
    <View style={[styles.cell, { width: column.width }]}>
      <Text
        numberOfLines={3}
        style={[commonStyle, column.key === 'email' ? styles.emailText : null]}
      >
        {value}
      </Text>
    </View>
  );
}

type Props = {
  rows: readonly GiftHistoryItem[];
  kind: GiftHistoryKind;
  title: string;
  emptyText: string;
  onGiftPress: (item: GiftHistoryItem) => void;
};

export const GiftHistoryTable = React.memo(function GiftHistoryTable({
  rows,
  kind,
  title,
  emptyText,
  onGiftPress,
}: Props) {
  const colors = useThemeColors();
  const { width: screenWidth } = useWindowDimensions();
  const scrollRef = React.useRef<ScrollViewType>(null);
  const columns = kind === 'sent' ? SENT_COLUMNS : RECEIVED_COLUMNS;
  // React Native resolves horizontal row order against the global RTL direction,
  // so the web table's first column is already placed on the physical right.
  const renderedColumns = columns;
  const tableWidth = React.useMemo(
    () => columns.reduce((total, column) => total + column.width, 0),
    [columns],
  );
  const visibleTableWidth = Math.max(screenWidth - 32, 0);
  const alignToFirstColumn = React.useCallback(() => {
    scrollRef.current?.scrollToEnd({ animated: false });
  }, []);

  return (
    <View
      style={[
        styles.panel,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.panelHeader, { borderColor: colors.divider }]}>
        <Text style={[styles.panelTitle, { color: colors.text }]}>{title}</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        bounces={false}
        nestedScrollEnabled
        showsHorizontalScrollIndicator
        persistentScrollbar
        onContentSizeChange={alignToFirstColumn}
        contentContainerStyle={[styles.table, { width: tableWidth }]}
      >
        <View style={{ width: tableWidth }}>
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            {renderedColumns.map(column => (
              <View
                key={column.key}
                style={[styles.cell, { width: column.width }]}
              >
                <Text style={[styles.headerText, { color: colors.textSecondary }]}>
                  {column.title}
                </Text>
              </View>
            ))}
          </View>

          {rows.map(item => {
            const rowContent = renderedColumns.map(column => (
              <GiftCell
                key={column.key}
                column={column}
                item={item}
                kind={kind}
              />
            ));

            if (kind === 'sent') {
              return (
                <Pressable
                  key={String(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`مشاهده جزئیات هدیه ${personName(item, kind)}`}
                  accessibilityHint="جزئیات سفارش هدیه را نمایش می‌دهد"
                  android_ripple={{ color: hexAlpha(colors.primary, 0.14) }}
                  onPress={() => onGiftPress(item)}
                  style={({ pressed }) => [
                    styles.tableRow,
                    styles.bodyRow,
                    { borderColor: colors.divider },
                    pressed ? styles.pressedRow : null,
                  ]}
                >
                  {rowContent}
                </Pressable>
              );
            }

            return (
              <View
                key={String(item.id)}
                style={[
                  styles.tableRow,
                  styles.bodyRow,
                  { borderColor: colors.divider },
                ]}
              >
                {rowContent}
              </View>
            );
          })}

          {rows.length === 0 ? (
            <View style={styles.emptyTrack}>
              <View style={[styles.empty, { width: visibleTableWidth }]}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {emptyText}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
});
GiftHistoryTable.displayName = 'GiftHistoryTable';
