import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LiveMeetingListCard } from '@/domains/live/ui/cards/LiveMeetingListCard';
import type { LiveMeetingType } from '@/domains/live/model/liveMeeting.entities';
import { useLiveMeetings } from '@/domains/live/hooks/useLiveMeetings';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
  useNavScreenShellStyles,
} from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'LiveMeetings'>;

const Sep = React.memo(function Sep() {
  return <View style={flashListRowSeparators.h12} />;
});

const renderItem: ListRenderItem<LiveMeetingType> = ({ item }) => (
  <LiveMeetingListCard item={item} />
);

function keyExtractor(item: LiveMeetingType): string {
  return String(item.id);
}

const LiveMeetingsScreenComponent = (_props: Props) => {
  const { data, isPending, isError, error } = useLiveMeetings();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const shell = useNavScreenShellStyles(colors);

  if (isPending) {
    return (
      <View style={shell.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={shell.loadingText}>{t('screens.liveMeetings.loading')}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={shell.centered}>
        <Text style={shell.errorText}>{t('screens.liveMeetings.error')}</Text>
        <Text style={shell.errorDetail}>
          {error instanceof Error ? error.message : String(error)}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={shell.safe} edges={['left', 'right', 'bottom']}>
      <FlashList<LiveMeetingType>
        data={data ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={flashListEstimatedItemSize.liveMeeting}
        ItemSeparatorComponent={Sep}
        contentContainerStyle={flashListContentGutters.standard}
        showsVerticalScrollIndicator={false}
        extraData={i18n.language}
      />
    </SafeAreaView>
  );
};

export const LiveMeetingsScreen = React.memo(LiveMeetingsScreenComponent);
LiveMeetingsScreen.displayName = 'LiveMeetingsScreen';
