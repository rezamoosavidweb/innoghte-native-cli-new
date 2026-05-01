import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { Text } from '@/shared/ui/Text';

import type { ThemePreference } from '@/shared/contracts/theme';
import type { AppLanguage } from '@/shared/contracts/locale';
import { ScreenScaffold } from '@/ui/components/ScreenScaffold';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useLanguageStore } from '@/domains/settings/model/language.store';
import { useUiThemeStore } from '@/domains/settings/model/uiTheme.store';
import { createScreenScaffoldStyles, useThemeColors } from '@/ui/theme';
import { createSettingsScreenStyles } from '@/domains/settings/ui/settingsScreen.styles';

type Props = DrawerScreenProps<DrawerParamList, 'Settings'>;

const SettingsScreenComponent = (_props: Props) => {
  const { t } = useTranslation();
  const uiColors = useThemeColors();
  const { colors } = useTheme();
  const scaffold = createScreenScaffoldStyles(colors);
  const s = createSettingsScreenStyles(uiColors);

  const { currentLanguage, setLanguage } = useLanguageStore(
    useShallow(state => ({
      currentLanguage: state.currentLanguage,
      setLanguage: state.setLanguage,
    })),
  );

  const { preference, setPreference } = useUiThemeStore(
    useShallow(state => ({
      preference: state.preference,
      setPreference: state.setPreference,
    })),
  );

  const selectLanguage = React.useCallback(
    (lang: AppLanguage) => { setLanguage(lang).catch(() => {}); },
    [setLanguage],
  );

  return (
    <ScreenScaffold
      title={t('screens.settings.title')}
      subtitle={t('screens.settings.subtitle')}
    >
      {/* Language */}
      <View style={s.section}>
        <Text style={scaffold.sectionTitle}>
          {t('screens.settings.languageSection')}
        </Text>
        <View style={s.row}>
          {(['fa', 'en'] as const).map(lang => (
            <TouchableOpacity
              key={lang}
              style={[s.chip, currentLanguage === lang ? s.chipActive : null]}
              onPress={() => selectLanguage(lang)}
              accessibilityRole="button"
              accessibilityState={{ selected: currentLanguage === lang }}
            >
              <Text style={s.chipText}>
                {t(lang === 'fa'
                  ? 'screens.settings.languagePersian'
                  : 'screens.settings.languageEnglish')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Appearance */}
      <View style={s.section}>
        <Text style={scaffold.sectionTitle}>
          {t('screens.settings.themeSection')}
        </Text>
        <View style={s.row}>
          {(
            [
              ['system', 'themeSystem'],
              ['light', 'themeLight'],
              ['dark', 'themeDark'],
              ['editorialGray', 'themeEditorialGray'],
              ['studioDark', 'themeStudioDark'],
              ['nighttime', 'themeNighttime'],
              ['steady', 'themeSteady'],
              ['stoneCalm', 'themeStoneCalm'],
            ] as const satisfies ReadonlyArray<
              readonly [ThemePreference, string]
            >
          ).map(([value, labelKey]) => (
            <TouchableOpacity
              key={value}
              style={[s.chip, preference === value ? s.chipActive : null]}
              onPress={() => setPreference(value)}
              accessibilityRole="button"
              accessibilityState={{ selected: preference === value }}
            >
              <Text style={s.chipText}>
                {t(`screens.settings.${labelKey}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenScaffold>
  );
};

export const SettingsScreen = React.memo(SettingsScreenComponent);
SettingsScreen.displayName = 'SettingsScreen';
