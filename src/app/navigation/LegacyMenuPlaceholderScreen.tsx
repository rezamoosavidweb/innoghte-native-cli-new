import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useLegacyMenuPlaceholderStyles } from '@/app/navigation/legacyMenuPlaceholder.styles';

type Props = DrawerScreenProps<DrawerParamList>;

const LegacyMenuPlaceholderScreenComponent = (_props: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const s = useLegacyMenuPlaceholderStyles(colors);

  return (
    <View style={s.root}>
      <Text style={s.title}>{t('legacyMenu.title')}</Text>
      <Text style={s.body}>{t('legacyMenu.body')}</Text>
    </View>
  );
};

export const LegacyMenuPlaceholderScreen = React.memo(
  LegacyMenuPlaceholderScreenComponent,
);
LegacyMenuPlaceholderScreen.displayName = 'LegacyMenuPlaceholderScreen';
