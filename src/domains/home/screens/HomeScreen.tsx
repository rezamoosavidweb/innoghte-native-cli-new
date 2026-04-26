import * as React from 'react';
import { View } from 'react-native';

import { useHomeScreenStyles } from '@/domains/home/ui/homeScreen.styles';
import { DrawerActions, useNavigation, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';

import { ScreenScaffold } from '@/ui/components/ScreenScaffold';

type HomeNav = NavigationProp<ParamListBase> & { dispatch: (a: { type: string }) => void };

const HomeScreenComponent = () => {
  const navigation = useNavigation<HomeNav>();
  const { t } = useTranslation();
  const styles = useHomeScreenStyles();

  return (
    <ScreenScaffold
      title={t('screens.home.title')}
      subtitle={t('screens.home.subtitle')}
    >
      <View style={styles.actions}>
        <Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          {t('screens.home.openDrawer')}
        </Button>
        <Button
          onPress={() =>
            navigation.navigate('Search', { query: 'react native' })
          }
        >
          {t('screens.home.goSearch')}
        </Button>
        <Button onPress={() => navigation.navigate('MyCourses')}>
          {t('screens.home.goMyCourses')}
        </Button>
        <Button onPress={() => navigation.navigate('Courses')}>
          {t('screens.home.goCourses')}
        </Button>
        <Button onPress={() => navigation.navigate('Settings')}>
          {t('screens.home.goSettings')}
        </Button>
      </View>
    </ScreenScaffold>
  );
};

export const HomeScreen = React.memo(HomeScreenComponent);
HomeScreen.displayName = 'HomeScreen';
