import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {ScrollView, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { TabParamList } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { createServicesHubStyles } from '@/domains/home/ui/servicesHub.styles';
import {
  HubMenuRow,
  type HubMenuRowStyleSet,
} from '@/ui/components/HubMenuRow';

type Props = BottomTabScreenProps<TabParamList>;

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

type ServicesHubMenuRowProps = {
  row: HubRowConfig;
  title: string;
  s: HubMenuRowStyleSet;
};

const ServicesHubMenuRow = React.memo(function ServicesHubMenuRow({
  row,
  title,
  s,
}: ServicesHubMenuRowProps) {
  const navigation = useAppNavigation();

  const onPress = React.useCallback(() => {
    switch (row.action) {
      case 'courses':
        navigation.navigate('Courses');
        return;
      case 'albums':
        navigation.navigate('Albums');
        return;
      default:
        return;
    }
  }, [navigation, row.action]);

  return (
    <HubMenuRow icon={row.icon} title={title} s={s} onPress={onPress} />
  );
});
ServicesHubMenuRow.displayName = 'ServicesHubMenuRow';

const ServicesHubScreenComponent = (_props: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const s = createServicesHubStyles(colors);

  return (
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.subtitle}>{t('screens.servicesHub.subtitle')}</Text>
      <View style={s.list}>
        {HUB_ROWS.map(row => (
          <ServicesHubMenuRow
            key={row.id}
            row={row}
            title={t(`screens.servicesHub.menu.${row.titleKey}`)}
            s={s}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export const ServicesHubScreen = React.memo(ServicesHubScreenComponent);
ServicesHubScreen.displayName = 'ServicesHubScreen';
