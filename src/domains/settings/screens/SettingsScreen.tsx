import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {View} from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { Text } from '@/shared/ui/Text';

import type { ThemeMode } from '@/shared/contracts/theme';
import type { AppLanguage } from '@/shared/contracts/locale';
import { ScreenScaffold } from '@/ui/components/ScreenScaffold';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useLanguageStore } from '@/domains/settings/model/language.store';
import { useUiThemeStore } from '@/domains/settings/model/uiTheme.store';
import { createScreenScaffoldStyles, useThemeColors } from '@/ui/theme';
import { createSettingsScreenStyles } from '@/domains/settings/ui/settingsScreen.styles';
import { Button } from '@/ui/components/Button';

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
            <Button
              key={lang}
              layout="auto"
              variant="text"
              title={t(
                lang === 'fa'
                  ? 'screens.settings.languagePersian'
                  : 'screens.settings.languageEnglish',
              )}
              style={[s.chip, currentLanguage === lang ? s.chipActive : null]}
              onPress={() => selectLanguage(lang)}
              accessibilityState={{ selected: currentLanguage === lang }}
              contentStyle={{ width: '100%' }}
            >
              <Text style={s.chipText}>
                {t(lang === 'fa'
                  ? 'screens.settings.languagePersian'
                  : 'screens.settings.languageEnglish')}
              </Text>
            </Button>
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
              ['light', 'themeLight'],
              ['dark', 'themeDark'],
            ] as const satisfies ReadonlyArray<readonly [ThemeMode, string]>
          ).map(([value, labelKey]) => (
            <Button
              key={value}
              layout="auto"
              variant="text"
              title={t(`screens.settings.${labelKey}`)}
              style={[s.chip, preference === value ? s.chipActive : null]}
              onPress={() => setPreference(value)}
              accessibilityState={{ selected: preference === value }}
              contentStyle={{ width: '100%' }}
            >
              <Text style={s.chipText}>
                {t(`screens.settings.${labelKey}`)}
              </Text>
            </Button>
          ))}
        </View>
      </View>
    </ScreenScaffold>
  );
};

export const SettingsScreen = React.memo(SettingsScreenComponent);
SettingsScreen.displayName = 'SettingsScreen';
