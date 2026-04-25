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
import { useExperincesHubStyles } from '@/features/experiences/styles';

type Props = BottomTabScreenProps<TabParamList, 'Experiences'>;

export type experincesNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Experiences'>,
  DrawerNavigationProp<DrawerParamList>
>;

type HubRowConfig = {
  readonly id: string;
  readonly icon: string;
  readonly titleKey: 'meditation' | 'writing' | 'listening' | 'reading';
  readonly action: 'meditation' | 'writing' | 'listening' | 'reading';
};

const HUB_ROWS: readonly HubRowConfig[] = [
  {
    id: 'meditation',
    icon: '🎓',
    titleKey: 'meditation',
    action: 'meditation',
  },
  { id: 'writing', icon: '💿', titleKey: 'writing', action: 'writing' },
  { id: 'listening', icon: '🌐', titleKey: 'listening', action: 'listening' },
  { id: 'reading', icon: '💚', titleKey: 'reading', action: 'reading' },
] as const;

type HubStyles = ReturnType<typeof useExperincesHubStyles>;

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

const ExperiencesHubScreenComponent = (_props: Props) => {
  const navigation = useNavigation<experincesNavigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const s = useExperincesHubStyles(colors);

  const onRowPress = React.useCallback(
    (row: HubRowConfig) => {
      switch (row.action) {
        case 'meditation':
          navigation.navigate('Meditation');
          return;
        case 'writing':
          navigation.navigate('Writing');
          return;
        case 'listening':
          navigation.navigate('Listening');
          return;
        case 'reading':
          navigation.navigate('Reading');
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
      <Text style={s.subtitle}>{t('screens.experinces.subtitle')}</Text>
      <View style={s.list}>
        {HUB_ROWS.map(row => (
          <HubMenuRow
            key={row.id}
            icon={row.icon}
            title={t(`screens.experinces.menu.${row.titleKey}`)}
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

export const ExperiencesHubScreen = React.memo(ExperiencesHubScreenComponent);
ExperiencesHubScreen.displayName = 'ExperiencesHubScreen';
