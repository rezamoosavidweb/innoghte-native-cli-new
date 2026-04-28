import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import type { TabParamList } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useExperiencesHubStyles } from '@/domains/experiences/ui/experiencesHub.styles';
import { HubMenuRow } from '@/ui/components/HubMenuRow';

type Props = BottomTabScreenProps<TabParamList, 'Experiences'>;

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

const ExperiencesHubScreenComponent = (_props: Props) => {
  const navigation = useAppNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const s = useExperiencesHubStyles(colors);

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
      <Text style={s.subtitle}>{t('screens.experiences.subtitle')}</Text>
      <View style={s.list}>
        {HUB_ROWS.map(row => (
          <HubMenuRow
            key={row.id}
            icon={row.icon}
            title={t(`screens.experiences.menu.${row.titleKey}`)}
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
