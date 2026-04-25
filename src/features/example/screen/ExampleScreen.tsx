import type { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';
import { useNavigation, useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import type { DrawerParamList } from '@/shared/navigation/types';
import { useExampleScreenStyles } from '@/features/auth/styles/login.styles';

type Props = DrawerScreenProps<DrawerParamList, 'Example'>;

const ExampleScreenComponent = (_props: Props) => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const s = useExampleScreenStyles(colors);

  return (
    <View style={s.root}>
      <Text style={s.title}>{t('screens.example.title')}</Text>
      <Text style={s.sub}>{t('screens.example.subtitle')}</Text>
      <View style={s.actions}>
        <Button onPress={() => navigation.navigate('Startup')}>
          {t('screens.example.goStartup')}
        </Button>
        <Button onPress={() => navigation.navigate('MainTabs')}>
          {t('screens.example.goMainTabs')}
        </Button>
      </View>
    </View>
  );
};

export const ExampleScreen = React.memo(ExampleScreenComponent);
ExampleScreen.displayName = 'ExampleScreen';
