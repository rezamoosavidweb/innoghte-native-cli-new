import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { DrawerParamList, TabParamList } from '@/shared/navigation/types';
import { useServicesHubStyles } from '@/features/services/styles';

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
  // { id: 'liveMeeting', icon: '🌐', titleKey: 'liveMeeting', action: 'liveMeetings' },
  // { id: 'support', icon: '💚', titleKey: 'support', action: 'help' },
  // { id: 'events', icon: '📅', titleKey: 'events', action: 'eventsDrawer' },
] as const;

type HubStyles = ReturnType<typeof useServicesHubStyles>;

const HubMenuRow = React.memo(function HubMenuRow({
  icon,
  title,
  onPress,
  s,
}: {
  icon: string;
  title: string;
  onPress: () => void;
  s: HubStyles;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) =>
        pressed ? [s.menuRow, s.menuRowPressed] : s.menuRow
      }
    >
      <View style={s.menuRowLeft}>
        <Text style={s.menuIcon}>{icon}</Text>
        <Text style={s.menuTitle}>{title}</Text>
      </View>
      <Text style={s.chevron}>›</Text>
    </Pressable>
  );
});
HubMenuRow.displayName = 'HubMenuRow';

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
