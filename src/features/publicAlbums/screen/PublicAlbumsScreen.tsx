import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PublicAlbumTrackCard } from '@/features/publicAlbums/components/cards/PublicAlbumTrackCard';
import type { PublicAlbumTrack } from '@/features/publicAlbums/types';
import { usePublicAlbumTracksQuery } from '@/features/publicAlbums/hooks/usePublicAlbumTracksQuery';
import type { DrawerParamList } from '@/shared/navigation/types';
import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
  useNavScreenShellStyles,
} from '@/shared/styles/theme';

type Props = DrawerScreenProps<DrawerParamList, 'PublicAlbums'>;

const Sep = React.memo(function Sep() {
  return <View style={flashListRowSeparators.h14} />;
});

const renderItem: ListRenderItem<PublicAlbumTrack> = ({ item }) => (
  <PublicAlbumTrackCard item={item} />
);

function keyExtractor(item: PublicAlbumTrack): string {
  return String(item.id);
}

const PublicAlbumsScreenComponent = (_props: Props) => {
  const { data, isPending, isError, error } = usePublicAlbumTracksQuery();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const shell = useNavScreenShellStyles(colors);

  if (isPending) {
    return (
      <View style={shell.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={shell.loadingText}>{t('screens.publicAlbums.loading')}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={shell.centered}>
        <Text style={shell.errorText}>{t('screens.publicAlbums.error')}</Text>
        <Text style={shell.errorDetail}>
          {error instanceof Error ? error.message : String(error)}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={shell.safe} edges={['left', 'right', 'bottom']}>
      <FlashList<PublicAlbumTrack>
        data={data ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={flashListEstimatedItemSize.publicAlbumTrack}
        ItemSeparatorComponent={Sep}
        contentContainerStyle={flashListContentGutters.drawerWide}
        showsVerticalScrollIndicator={false}
        extraData={i18n.language}
      />
    </SafeAreaView>
  );
};

export const PublicAlbumsScreen = React.memo(PublicAlbumsScreenComponent);
PublicAlbumsScreen.displayName = 'PublicAlbumsScreen';
