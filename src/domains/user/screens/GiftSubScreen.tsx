import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView } from 'react-native';

import {
  fetchGiftHistory,
  type GiftHistoryItem,
  type GiftHistoryKind,
} from '@/domains/user/api/giftHistoryApi';
import { GiftDetailsModal } from '@/domains/user/components/giftHistory/GiftDetailsModal';
import { GiftHistoryTable } from '@/domains/user/components/giftHistory/GiftHistoryTable';
import { giftSubScreenStyles as styles } from '@/domains/user/screens/giftSubScreen.styles';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';

type GiftLeafName = 'GiftReceived' | 'GiftSent';
type Props = DrawerScreenProps<DrawerParamList, GiftLeafName>;

export const GiftSubScreen = React.memo(function GiftSubScreen({ route }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const kind: GiftHistoryKind = route.name === 'GiftReceived' ? 'received' : 'sent';
  const queryKey = React.useMemo(() => ['giftHistory', kind] as const, [kind]);
  const [selectedGift, setSelectedGift] = React.useState<GiftHistoryItem | null>(null);
  const { data, isPending, isError, error, isSuccess, isRefetching, refetch } =
    useQuery({
      queryKey,
      queryFn: () => fetchGiftHistory(kind),
    });
  const rows = React.useMemo(() => data ?? [], [data]);
  const title = kind === 'received' ? 'هدیه‌های دریافت شده' : 'هدیه‌های داده شده';
  const emptyText = kind === 'received'
    ? 'اطلاعاتی برای نمایش وجود ندارد.'
    : 'هنوز هدیه‌ای ارسال نکرده‌اید.';

  React.useEffect(() => {
    setSelectedGift(null);
  }, [kind]);

  const refresh = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey }).catch(() => {});
  }, [queryClient, queryKey]);
  const retry = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);
  const openDetails = React.useCallback(
    (item: GiftHistoryItem) => {
      if (kind === 'sent') {
        setSelectedGift(item);
      }
    },
    [kind],
  );
  const closeDetails = React.useCallback(() => setSelectedGift(null), []);

  const renderList = React.useCallback(
    () => (
      <>
        <ScrollView
          bounces
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={Boolean(isSuccess && isRefetching)}
              onRefresh={refresh}
            />
          }
        >
          <GiftHistoryTable
            rows={rows}
            kind={kind}
            title={title}
            emptyText={emptyText}
            onGiftPress={openDetails}
          />
        </ScrollView>
        <GiftDetailsModal item={selectedGift} onClose={closeDetails} />
      </>
    ),
    [
      closeDetails,
      emptyText,
      isRefetching,
      isSuccess,
      kind,
      openDetails,
      refresh,
      rows,
      selectedGift,
      title,
    ],
  );

  return (
    <ListStateView
      isLoading={isPending}
      isError={isError}
      error={error}
      isEmpty={false}
      onRetry={retry}
      renderList={renderList}
      loadingMessage="در حال دریافت هدیه‌ها…"
      errorTitle="دریافت اطلاعات هدیه‌ها ناموفق بود."
      emptyTitle={t(
        `screens.gift.leaf.${kind === 'received' ? 'received' : 'sent'}.body`,
      )}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
});
GiftSubScreen.displayName = 'GiftSubScreen';
