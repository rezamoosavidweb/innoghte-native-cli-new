import * as React from 'react';
import { Switch, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';

import { Text } from '@/shared/ui/Text';
import { useUiThemeStore } from '@/domains/settings';
import type { ProfileScreenMenuStyleSet } from '@/domains/user/ui/profileScreen.styles';
import DarkIcon from '@/assets/icons/dark.svg';
import { useThemeColors } from '@/ui/theme';

type Props = {
  menuStyles: ProfileScreenMenuStyleSet;
};

export const DarkModeToggleRow = React.memo(function DarkModeToggleRow({
  menuStyles: s,
}: Props) {
  const { t } = useTranslation();
  const themeColors = useThemeColors();
  const { preference, toggleTheme } = useUiThemeStore(
    useShallow(state => ({
      preference: state.preference,
      toggleTheme: state.toggleTheme,
    })),
  );
  const isDark = preference === 'dark';

  return (
    <View style={s.menuRow}>
      <View style={s.menuRowLeft}>
        <DarkIcon width={24} height={24} style={s.menuIcon} />
        <Text style={s.menuTitle}>{t('screens.profile.actions.darkMode')}</Text>
      </View>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ true: themeColors.success }}
        thumbColor={isDark ? themeColors.text : themeColors.background}
      />
    </View>
  );
});
DarkModeToggleRow.displayName = 'DarkModeToggleRow';
