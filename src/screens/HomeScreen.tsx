import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';

import { ScreenScaffold } from '../components/ScreenScaffold';
import type { DrawerParamList, TabParamList } from '../navigation/types';

/** Tab + parent drawer — use this with `useNavigation` (static navigators omit `navigation` on screen props). */
export type HomeNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  DrawerNavigationProp<DrawerParamList>
>;

const HomeScreenComponent = () => {
  const navigation = useNavigation<HomeNavigation>();
  const { t } = useTranslation();

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
        <Button onPress={() => navigation.navigate('Settings')}>
          {t('screens.home.goSettings')}
        </Button>
      </View>
    </ScreenScaffold>
  );
};

export const HomeScreen = React.memo(HomeScreenComponent);
HomeScreen.displayName = 'HomeScreen';

const styles = StyleSheet.create({
  actions: {
    marginTop: 8,
    width: '100%',
    maxWidth: 320,
    gap: 10,
  },
});
