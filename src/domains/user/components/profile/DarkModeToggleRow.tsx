import * as React from 'react';
import { Switch, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';

import { Text } from '@/shared/ui/Text';
import { useUiThemeStore } from '@/domains/settings';
import type { ProfileScreenMenuStyleSet } from '@/domains/user/ui/profileScreen.styles';

type Props = {
  menuStyles: ProfileScreenMenuStyleSet;
};

export const DarkModeToggleRow = React.memo(function DarkModeToggleRow({ menuStyles: s }: Props) {
  const { t } = useTranslation();
  const { preference, toggleTheme } = useUiThemeStore(
    useShallow(state => ({ preference: state.preference, toggleTheme: state.toggleTheme })),
  );
  const isDark = preference === 'dark';

  return (
    <View style={s.menuRow}>
      <View style={s.menuRowLeft}>
        <Text style={s.menuIcon}>🌙</Text>
        <Text style={s.menuTitle}>{t('screens.profile.actions.darkMode')}</Text>
      </View>
      <Switch value={isDark} onValueChange={toggleTheme} />
    </View>
  );
});
DarkModeToggleRow.displayName = 'DarkModeToggleRow';
