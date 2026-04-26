import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import type { DrawerParamList, TabParamList } from '@/shared/contracts/navigationApp';
import { useServicesHubStyles } from '@/domains/home/ui/servicesHub.styles';
import { HubMenuRow } from '@/ui/components/HubMenuRow';

type Props = BottomTabScreenProps<TabParamList, 'Services'>;

export type ServicesHubNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Services'>,
  DrawerNavigationProp<DrawerParamList>
>;

type HubRowConfig = {
  readonly id: string;
  readonly icon: string;
  readonly titleKey: 'courses' | 'albums' | 'liveMeeting' | 'support' | 'events';
  readonly action: 'courses' | 'albums' | 'liveMeetings' | 'help' | 'eventsDrawer';
};

const HUB_ROWS: readonly HubRowConfig[] = [
  {
    id: 'courses',
    icon: '🎓',
    titleKey: 'courses',
    action: 'courses',
  },
  { id: 'albums', icon: '💿', titleKey: 'albums', action: 'albums' },
] as const;

const ServicesHubScreenComponent = (_props: Props) => {
  const navigation = useNavigation<ServicesHubNavigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const s = useServicesHubStyles(colors);

  const onRowPress = React.useCallback(
    (row: HubRowConfig) => {
      switch (row.action) {
        case 'courses':
          navigation.navigate('PublicCourses');
          return;
        case 'albums':
          navigation.navigate('PublicAlbums');
          return;
        default:
          return;
      }
    },
    [navigation],
  );

  return (
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.subtitle}>{t('screens.servicesHub.subtitle')}</Text>
      <View style={s.list}>
        {HUB_ROWS.map(row => (
          <HubMenuRow
            key={row.id}
            icon={row.icon}
            title={t(`screens.servicesHub.menu.${row.titleKey}`)}
            s={s}
            onPress={() => {
              onRowPress(row);
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export const ServicesHubScreen = React.memo(ServicesHubScreenComponent);
ServicesHubScreen.displayName = 'ServicesHubScreen';
