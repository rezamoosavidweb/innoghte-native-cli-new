import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { DrawerParamList, TabParamList } from '../navigation/types';
import { useMyCoursesHubStyles } from '../theme/myCoursesHubThemed';

type Props = BottomTabScreenProps<TabParamList, 'MyCourses'>;

export type MyCoursesHubNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'MyCourses'>,
  DrawerNavigationProp<DrawerParamList>
>;

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

type HubStyles = ReturnType<typeof useMyCoursesHubStyles>;

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

const MyCoursesHubScreenComponent = (_props: Props) => {
  const navigation = useNavigation<MyCoursesHubNavigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const s = useMyCoursesHubStyles(colors);

  const onRowPress = React.useCallback(
    (row: HubRowConfig) => {
      switch (row.action) {
        case 'courses':
          navigation.navigate('Courses');
          return;
        case 'albums':
          navigation.navigate('Albums');
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
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.subtitle}>{t('screens.myCoursesHub.subtitle')}</Text>
      <View style={styles.list}>
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

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
  },
  list: {
    gap: 12,
  },
});
