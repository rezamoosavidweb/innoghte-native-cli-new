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

import { EventListCard } from '@/features/events/components/cards/EventListCard';
import type { EventType } from '@/features/events/types';
import { useEventsQuery } from '@/features/events/hooks/useEventsQuery';
import type { DrawerParamList } from '@/shared/navigation/types';
import {
  flashListContentGutters,
  flashListEstimatedItemSize,
  flashListRowSeparators,
  useNavScreenShellStyles,
} from '@/shared/styles/theme';

type Props = DrawerScreenProps<DrawerParamList, 'Events'>;

const Sep = React.memo(function Sep() {
  return <View style={flashListRowSeparators.h12} />;
});

const renderItem: ListRenderItem<EventType> = ({ item }) => (
  <EventListCard item={item} />
);

function keyExtractor(item: EventType): string {
  return String(item.id);
}

const EventsScreenComponent = (_props: Props) => {
  const { data, isPending, isError, error } = useEventsQuery();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const shell = useNavScreenShellStyles(colors);

  if (isPending) {
    return (
      <View style={shell.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={shell.loadingText}>{t('screens.events.loading')}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={shell.centered}>
        <Text style={shell.errorText}>{t('screens.events.error')}</Text>
        <Text style={shell.errorDetail}>
          {error instanceof Error ? error.message : String(error)}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={shell.safe} edges={['left', 'right', 'bottom']}>
      <FlashList<EventType>
        data={data ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={flashListEstimatedItemSize.event}
        ItemSeparatorComponent={Sep}
        contentContainerStyle={flashListContentGutters.standard}
        showsVerticalScrollIndicator={false}
        extraData={i18n.language}
      />
    </SafeAreaView>
  );
};

export const EventsScreen = React.memo(EventsScreenComponent);
EventsScreen.displayName = 'EventsScreen';
