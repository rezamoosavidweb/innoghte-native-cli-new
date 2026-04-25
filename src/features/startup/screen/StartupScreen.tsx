import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useNavigation, useTheme } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { DrawerParamList } from '@/shared/navigation/types';
import { useStartupScreenStyles } from '@/features/auth/styles/login.styles';

type Props = DrawerScreenProps<DrawerParamList, 'Startup'>;

const StartupScreenComponent = (_props: Props) => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const s = useStartupScreenStyles(colors);

  return (
    <SafeAreaView style={s.safe} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>{t('screens.startup.title')}</Text>
        <Text style={s.body}>{t('screens.startup.body')}</Text>
        <View style={s.actions}>
          <Button onPress={() => navigation.navigate('Example')}>
            {t('screens.startup.goExample')}
          </Button>
          <Button onPress={() => navigation.navigate('MainTabs')}>
            {t('screens.startup.goMain')}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const StartupScreen = React.memo(StartupScreenComponent);
StartupScreen.displayName = 'StartupScreen';
