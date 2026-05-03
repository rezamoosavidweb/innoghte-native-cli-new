import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  FlatList,
  RefreshControl,
  View,
  type ListRenderItem,
} from 'react-native';

import { useOrdersList } from '@/domains/transactions/hooks/useOrdersList';
import type { OrderDto } from '@/domains/transactions/model/order.schemas';
import { ordersKeys } from '@/domains/transactions/model/queryKeys';
import { TransactionDetailsBody } from '@/domains/transactions/ui/TransactionDetailsBody';
import { TransactionItem } from '@/domains/transactions/ui/TransactionItem';
import { createTransactionItemStyles } from '@/domains/transactions/ui/TransactionItem.styles';
import { createTransactionsStyles } from '@/domains/transactions/ui/Transactions.styles';
import { createTransactionDetailsStyles } from '@/domains/transactions/ui/TransactionDetails.styles';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useListPerformanceProfile } from '@/shared/infra/device/listPerformanceProfile';
import { Text } from '@/shared/ui/Text';
import { BottomSheet } from '@/shared/ui/bottomSheet/BottomSheet';
import { useBottomSheet } from '@/shared/ui/bottomSheet/useBottomSheet';
import { ListFooterLoader } from '@/shared/ui/list-states/ListFooterLoader';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import {
  flashListContentGutters,
  pickSemantic,
  useThemeColors,
} from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'PurchaseHistory'>;

function keyExtractor(item: OrderDto): string {
  return String(item.id);
}

const TransactionsScreenComponent = (_props: Props) => {
  const perf = useListPerformanceProfile();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);

  const tableStyles = React.useMemo(
    () => createTransactionsStyles(colors, semantic),
    [colors, semantic],
  );
  const itemStyles = React.useMemo(
    () => createTransactionItemStyles(colors, semantic),
    [colors, semantic],
  );

  const uiColors = useThemeColors();
  const detailsStyles = React.useMemo(
    () => createTransactionDetailsStyles(uiColors),
    [uiColors],
  );

  const sheet = useBottomSheet<OrderDto>();
  const { open: openTransactionSheet, close: closeTransactionSheet } = sheet;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (sheet.data) {
          sheet.close(); // same as swipe/overlay/dismiss
          return true;
        }
        return false;
      };

      const sub = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => sub.remove();
    }, [sheet]),
  );

  const {
    flatData,
    isPending,
    isError,
    isSuccess,
    error,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useOrdersList();

  const onSelectOrder = React.useCallback(
    (order: OrderDto) => {
      openTransactionSheet(order);
    },
    [openTransactionSheet],
  );

  const renderItem = React.useCallback<ListRenderItem<OrderDto>>(
    ({ item }) => (
      <TransactionItem
        order={item}
        onPress={onSelectOrder}
        styles={itemStyles}
      />
    ),
    [itemStyles, onSelectOrder],
  );

  const listHeader = React.useMemo(
    () => (
      <View style={tableStyles.tableHeader}>
        <View style={tableStyles.headerCellProducts}>
          <Text
            style={[tableStyles.headerText, tableStyles.headerTextProducts]}
          >
            {t('screens.transactions.columns.products')}
          </Text>
        </View>
        <View style={tableStyles.headerCellPaid}>
          <Text style={tableStyles.headerText}>
            {t('screens.transactions.columns.paid')}
          </Text>
        </View>
        <View style={tableStyles.headerCellStatus}>
          <Text style={tableStyles.headerText}>
            {t('screens.transactions.columns.status')}
          </Text>
        </View>
        <View style={tableStyles.headerCellDetails}>
          <Text style={tableStyles.headerText}>
            {t('screens.transactions.columns.details')}
          </Text>
        </View>
      </View>
    ),
    [t, tableStyles],
  );

  const ItemSep = React.useCallback(
    () => <View style={tableStyles.rowSeparator} />,
    [tableStyles],
  );

  const onEndReached = React.useCallback(() => {
    fetchNextPage().catch(() => {});
  }, [fetchNextPage]);

  const refresh = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ordersKeys.all }).catch(() => {});
  }, [queryClient]);

  const refreshing = Boolean(isSuccess && flatData.length > 0 && isRefetching);

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={refreshing} onRefresh={refresh} />,
    [refreshing, refresh],
  );

  const listFooter = React.useMemo(
    () => <ListFooterLoader visible={isFetchingNextPage} />,
    [isFetchingNextPage],
  );

  const renderList = React.useCallback(() => {
    return (
      <View style={[tableStyles.listFill, flashListContentGutters.standard]}>
        <View style={tableStyles.tableCard}>
          <FlatList<OrderDto>
            data={flatData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={listHeader}
            ItemSeparatorComponent={ItemSep}
            ListFooterComponent={listFooter}
            contentContainerStyle={tableStyles.scrollContent}
            style={tableStyles.listFill}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onEndReached={onEndReached}
            onEndReachedThreshold={perf.onEndReachedThreshold}
            refreshControl={refreshControl}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={false}
          />
        </View>
      </View>
    );
  }, [
    ItemSep,
    flatData,
    listFooter,
    listHeader,
    onEndReached,
    perf.onEndReachedThreshold,
    refreshControl,
    renderItem,
    tableStyles.listFill,
    tableStyles.scrollContent,
    tableStyles.tableCard,
  ]);

  const retryOrRefetch = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);

  const showFullBleedLoading = isPending;

  const isEmpty = isSuccess && flatData.length === 0;

  const renderTransactionDetails = React.useCallback(
    (order: OrderDto) => (
      <TransactionDetailsBody
        order={order}
        styles={detailsStyles}
        onClosePress={closeTransactionSheet}
      />
    ),
    [closeTransactionSheet, detailsStyles],
  );

  return (
    <>
      <ListStateView
        isLoading={showFullBleedLoading}
        isError={Boolean(isError)}
        error={error}
        isEmpty={isEmpty}
        onRetry={retryOrRefetch}
        renderList={renderList}
        loadingMessage={t('screens.transactions.loading')}
        errorTitle={t('screens.transactions.error')}
        emptyTitle={t('screens.transactions.empty')}
        retryLabel={t('listStates.retry')}
        safeAreaEdges={['left', 'right', 'bottom']}
      />
      <BottomSheet<OrderDto>
        controller={sheet}
        snapPoints={['92%']}
        renderContent={renderTransactionDetails}
      />
    </>
  );
};

export const TransactionsScreen = React.memo(TransactionsScreenComponent);
TransactionsScreen.displayName = 'TransactionsScreen';
