import type { DrawerScreenProps } from '@react-navigation/drawer';
import { Button } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { DrawerParamList } from '@/navigation/types';
import { pickSemantic } from '@/theme';
import { useLoginScreenStyles } from '@/screens/themed/drawerPlaceholderScreens.styles';

type Props = DrawerScreenProps<DrawerParamList, 'Login'>;

const LoginScreenComponent = (_props: Props) => {
  const { colors, dark } = useTheme();
  const { t } = useTranslation();
  const s = useLoginScreenStyles(colors);
  const semantic = pickSemantic(dark);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSubmit = React.useCallback(() => {
    Alert.alert(t('screens.login.demoTitle'), t('screens.login.demoMessage'));
  }, [t]);

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.inner}>
        <Text style={s.title}>{t('screens.login.title')}</Text>
        <Text style={s.sub}>{t('screens.login.subtitle')}</Text>
        <TextInput
          accessibilityLabel={t('screens.login.email')}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder={t('screens.login.email')}
          placeholderTextColor={semantic.textMuted}
          value={email}
          onChangeText={setEmail}
          style={s.input}
        />
        <TextInput
          accessibilityLabel={t('screens.login.password')}
          secureTextEntry
          placeholder={t('screens.login.password')}
          placeholderTextColor={semantic.textMuted}
          value={password}
          onChangeText={setPassword}
          style={s.input}
        />
        <Button onPress={onSubmit}>{t('screens.login.submit')}</Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export const LoginScreen = React.memo(LoginScreenComponent);
LoginScreen.displayName = 'LoginScreen';
