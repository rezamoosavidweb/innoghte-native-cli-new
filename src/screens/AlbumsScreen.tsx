import * as React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlbumListCard } from '../features/albums/components/AlbumListCard';
import type { Album } from '../features/albums/data/seedAlbums';
import { useAlbumsQuery } from '../features/albums/hooks/useAlbumsQuery';
import type { TabParamList } from '../navigation/types';
import {
  flashListContentGutters,
  flashListRowSeparators,
  useNavScreenShellStyles,
} from '../theme/navScreenLayout';

type Props = BottomTabScreenProps<TabParamList, 'Albums'>;

const ESTIMATED_ALBUM_ITEM_SIZE = 260;

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

const AlbumsScreenComponent = (_props: Props) => {
  const { data, isPending, isError, error } = useAlbumsQuery();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const shell = useNavScreenShellStyles(colors);

  if (isPending) {
    return (
      <View style={shell.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={shell.loadingText}>{t('screens.albums.loading')}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={shell.centered}>
        <Text style={shell.errorText}>{t('screens.albums.error')}</Text>
        <Text style={shell.errorDetail}>
          {error instanceof Error ? error.message : String(error)}
        </Text>
      </View>
    );
  }

  const listData = data ?? [];

  return (
    <SafeAreaView style={shell.safe} edges={['left', 'right', 'bottom']}>
      <FlashList<Album>
        data={listData}
        renderItem={renderAlbumItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={ESTIMATED_ALBUM_ITEM_SIZE}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={flashListContentGutters.standard}
        showsVerticalScrollIndicator={false}
        extraData={i18n.language}
      />
    </SafeAreaView>
  );
};

export const AlbumsScreen = React.memo(AlbumsScreenComponent);
AlbumsScreen.displayName = 'AlbumsScreen';
