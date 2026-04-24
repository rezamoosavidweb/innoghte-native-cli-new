import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import type { AppLanguage } from '@/bootstrap/readAppLanguage';
import { ScreenScaffold } from '@/components/ScreenScaffold';
import type { DrawerParamList } from '@/navigation/types';
import { useLanguageStore } from '@/stores/language.store';
import type { ThemePreference } from '@/stores/uiTheme.store';
import { useUiThemeStore } from '@/stores/uiTheme.store';
import { useScreenScaffoldStyles } from '@/theme';
import { useSettingsScreenStyles } from '@/screens/themed/settingsScreen.styles';

type Props = DrawerScreenProps<DrawerParamList, 'Settings'>;

const SettingsScreenComponent = (_props: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const scaffold = useScreenScaffoldStyles(colors);
  const settingsStyles = useSettingsScreenStyles();
  const { currentLanguage, setLanguage } = useLanguageStore(
    useShallow(s => ({
      currentLanguage: s.currentLanguage,
      setLanguage: s.setLanguage,
    })),
  );
  const { preference, setPreference } = useUiThemeStore(
    useShallow(s => ({
      preference: s.preference,
      setPreference: s.setPreference,
    })),
  );

  const select = React.useCallback(
    (lang: AppLanguage) => {
      setLanguage(lang).catch(() => {});
    },
    [setLanguage],
  );

  const selectTheme = React.useCallback(
    (p: ThemePreference) => {
      setPreference(p);
    },
    [setPreference],
  );

  return (
    <ScreenScaffold
      title={t('screens.settings.title')}
      subtitle={t('screens.settings.subtitle')}
    >
      <View style={settingsStyles.section}>
        <Text style={scaffold.sectionTitle}>
          {t('screens.settings.languageSection')}
        </Text>
        <View style={settingsStyles.row}>
          <TouchableOpacity
            style={[
              settingsStyles.chip,
              currentLanguage === 'fa' ? settingsStyles.chipActive : null,
            ]}
            onPress={() => select('fa')}
            accessibilityRole="button"
            accessibilityState={{ selected: currentLanguage === 'fa' }}
          >
            <Text style={settingsStyles.chipText}>
              {t('screens.settings.languagePersian')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              settingsStyles.chip,
              currentLanguage === 'en' ? settingsStyles.chipActive : null,
            ]}
            onPress={() => select('en')}
            accessibilityRole="button"
            accessibilityState={{ selected: currentLanguage === 'en' }}
          >
            <Text style={settingsStyles.chipText}>
              {t('screens.settings.languageEnglish')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={settingsStyles.section}>
        <Text style={scaffold.sectionTitle}>
          {t('screens.settings.themeSection')}
        </Text>
        <View style={settingsStyles.row}>
          {(
            [
              ['system', 'themeSystem'],
              ['light', 'themeLight'],
              ['dark', 'themeDark'],
            ] as const
          ).map(([value, labelKey]) => (
            <TouchableOpacity
              key={value}
              style={[
                settingsStyles.chip,
                preference === value ? settingsStyles.chipActive : null,
              ]}
              onPress={() => selectTheme(value)}
              accessibilityRole="button"
              accessibilityState={{ selected: preference === value }}
            >
              <Text style={settingsStyles.chipText}>
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
