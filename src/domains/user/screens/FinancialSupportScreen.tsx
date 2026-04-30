import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import {
  flashListContentGutters,
  fontSize,
  fontWeight,
  pickSemantic,
  useNavScreenShellStyles,
} from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'FinancialSupport'>;

export const FinancialSupportScreen = React.memo(function FinancialSupportScreen(
  _props: Props,
) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);
  const shell = useNavScreenShellStyles(colors);

  const s = React.useMemo(
    () =>
      StyleSheet.create({
        title: {
          color: colors.text,
          fontSize: fontSize.lg,
          fontWeight: fontWeight.semibold,
          marginBottom: 8,
        },
        body: {
          color: semantic.textMuted,
          lineHeight: fontSize.base * 1.45,
          fontSize: fontSize.base,
        },
      }),
    [colors.text, semantic.textMuted],
  );

  return (
    <ScrollView
      contentContainerStyle={flashListContentGutters.standard}
      keyboardShouldPersistTaps="handled"
    >
      <View style={shell.safe}>
        <Text style={s.title}>{t('screens.financialSupport.title')}</Text>
        <Text style={s.body}>{t('screens.financialSupport.body')}</Text>
      </View>
    </ScrollView>
  );
});
FinancialSupportScreen.displayName = 'FinancialSupportScreen';
