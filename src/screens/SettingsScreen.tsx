import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { ScreenScaffold } from '../components/ScreenScaffold';
import type { DrawerParamList } from '../navigation/types';
import type { AppLanguage } from '../bootstrap/readAppLanguage';
import { useLanguageStore } from '../stores/language.store';

type Props = DrawerScreenProps<DrawerParamList, 'Settings'>;

const SettingsScreenComponent = (_props: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { currentLanguage, setLanguage } = useLanguageStore(
    useShallow((s) => ({
      currentLanguage: s.currentLanguage,
      setLanguage: s.setLanguage,
    })),
  );

  const select = React.useCallback(
    (lang: AppLanguage) => {
      setLanguage(lang).catch(() => {});
    },
    [setLanguage],
  );

  return (
    <ScreenScaffold
      title={t('screens.settings.title')}
      subtitle={t('screens.settings.subtitle')}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('screens.settings.languageSection')}
        </Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.chip,
              currentLanguage === 'fa' ? styles.chipActive : null,
            ]}
            onPress={() => select('fa')}
            accessibilityRole="button"
            accessibilityState={{ selected: currentLanguage === 'fa' }}
          >
            <Text style={styles.chipText}>{t('screens.settings.languagePersian')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chip,
              currentLanguage === 'en' ? styles.chipActive : null,
            ]}
            onPress={() => select('en')}
            accessibilityRole="button"
            accessibilityState={{ selected: currentLanguage === 'en' }}
          >
            <Text style={styles.chipText}>{t('screens.settings.languageEnglish')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenScaffold>
  );
};

export const SettingsScreen = React.memo(SettingsScreenComponent);
SettingsScreen.displayName = 'SettingsScreen';

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    backgroundColor: '#f7f7f7',
  },
  chipActive: {
    borderColor: '#246bff',
    backgroundColor: '#e8f0ff',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
