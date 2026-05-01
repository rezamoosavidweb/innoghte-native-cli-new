import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import {
  flashListContentGutters,
  pickSemantic,
  createNavScreenShellStyles,
} from '@/ui/theme';

import { useFinancialSupportScreenStyles } from '@/domains/user/screens/financialSupportScreen.styles';

type Props = DrawerScreenProps<DrawerParamList, 'FinancialSupport'>;

export const FinancialSupportScreen = React.memo(function FinancialSupportScreen(
  _props: Props,
) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);
  const shell = createNavScreenShellStyles(colors);

  const s = useFinancialSupportScreenStyles(colors, semantic);

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
