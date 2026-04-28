import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { useMyCoursesHubStyles } from '@/domains/user/ui/myCoursesHub.styles';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { HubMenuRow } from '@/ui/components/HubMenuRow';

type HubRowConfig = {
  readonly id: string;
  readonly icon: string;
  readonly titleKey: 'courses' | 'albums' | 'liveMeeting' | 'support' | 'events';
  readonly action: 'courses' | 'albums' | 'help' | 'liveMeetings' | 'eventsDrawer';
};

const HUB_ROWS: readonly HubRowConfig[] = [
  { id: 'courses', icon: '🎓', titleKey: 'courses', action: 'courses' },
  { id: 'albums', icon: '💿', titleKey: 'albums', action: 'albums' },
  { id: 'live', icon: '🌐', titleKey: 'liveMeeting', action: 'liveMeetings' },
  { id: 'support', icon: '💚', titleKey: 'support', action: 'help' },
  { id: 'events', icon: '📅', titleKey: 'events', action: 'eventsDrawer' },
] as const;

const MyCoursesHubScreenComponent = () => {
  const navigation = useAppNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const s = useMyCoursesHubStyles(colors);

  const onRowPress = React.useCallback(
    (row: HubRowConfig) => {
      switch (row.action) {
        case 'courses':
          navigation.navigate('PublicCourses');
          return;
        case 'albums':
          navigation.navigate('PublicAlbums');
          return;
        case 'help':
          navigation.navigate('Help');
          return;
        case 'liveMeetings':
          navigation.navigate('LiveMeetings');
          return;
        case 'eventsDrawer':
          navigation.navigate('Events');
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
      <Text style={s.subtitle}>{t('screens.myCoursesHub.subtitle')}</Text>
      <View style={s.list}>
        {HUB_ROWS.map(row => (
          <HubMenuRow
            key={row.id}
            icon={row.icon}
            title={t(`screens.myCoursesHub.menu.${row.titleKey}`)}
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

export const MyCoursesHubScreen = React.memo(MyCoursesHubScreenComponent);
MyCoursesHubScreen.displayName = 'MyCoursesHubScreen';
