import * as React from 'react';
import { View } from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';

import { AlbumListCard } from '@/domains/albums/ui/cards/AlbumListCard';
import type { Album } from '@/domains/albums/model';
import { useAlbums } from '@/domains/albums/hooks/useAlbums';
import { ListStateView } from '@/shared/ui/list-states/ListStateView';
import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
} from '@/ui/theme';

const Separator = React.memo(function AlbumsListSeparator() {
  return <View style={flashListRowSeparators.h12} />;
});
Separator.displayName = 'AlbumsListSeparator';

const renderAlbumItem: ListRenderItem<Album> = ({ item }) => (
  <AlbumListCard album={item} />
);

function keyExtractor(item: Album): string {
  return String(item.id);
}

const AlbumsScreenComponent = () => {
  const { data, isPending, isError, error, refetch, isSuccess } = useAlbums();
  const { t } = useTranslation();

  const listData = React.useMemo(() => data ?? [], [data]);

  const showFullBleedLoading = isPending;

  const isEmpty = isSuccess && listData.length === 0;

  const retryOrRefetch = React.useCallback(() => {
    refetch().catch(() => {});
  }, [refetch]);

  const renderList = React.useCallback(() => {
    return (
      <FlashList<Album>
        data={listData}
        renderItem={renderAlbumItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={flashListEstimatedItemSize.album}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={flashListContentGutters.standard}
        showsVerticalScrollIndicator={false}
      />
    );
  }, [listData]);

  return (
    <ListStateView
      isLoading={showFullBleedLoading}
      isError={Boolean(isError)}
      error={error}
      isEmpty={isEmpty}
      onRetry={retryOrRefetch}
      renderList={renderList}
      loadingMessage={t('screens.albums.loading')}
      errorTitle={t('screens.albums.error')}
      emptyTitle={t('screens.albums.empty')}
      retryLabel={t('listStates.retry')}
      safeAreaEdges={['left', 'right', 'bottom']}
    />
  );
};

export const AlbumsScreen = React.memo(AlbumsScreenComponent);
AlbumsScreen.displayName = 'AlbumsScreen';
