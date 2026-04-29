import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
} from 'react-native';

import {
  sendVerificationCode,
  verifyCodeWithServer,
} from '@/domains/auth/api/verify.mock';
import { AUTH_USER_QUERY_KEY } from '@/domains/auth/model/queryKeys';
import { translateVerifyError } from '@/domains/auth/model/verifyErrors';
import {
  verifyInitialState,
  verifyScreenReducer,
} from '@/domains/auth/model/verifyScreenReducer';
import { VerifyCodeStep } from '@/domains/auth/ui/verify/VerifyCodeStep';
import {
  getVerifyContactLabelKey,
  getVerifyContactPlaceholderKey,
  getVerifySubtitleKey,
  getVerifyTitleKey,
} from '@/domains/auth/ui/verify/verifyCopy';
import { VerifyHeader } from '@/domains/auth/ui/verify/VerifyHeader';
import { VerifyInputStep } from '@/domains/auth/ui/verify/VerifyInputStep';
import { useVerifyScreenStyles } from '@/domains/auth/ui/verify/verifyScreen.styles';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import type { VerifyChannel } from '@/shared/contracts/verification';
import { isEmailChannel } from '@/shared/contracts/verification';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useThemeColors } from '@/ui/theme';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

type Props = DrawerScreenProps<DrawerParamList, 'Verify'>;

const VerifyScreenComponent = ({ route }: Props) => {
  const { t } = useTranslation();
  const navigation = useAppNavigation();
  const queryClient = useQueryClient();
  const colors = useThemeColors();
  const s = useVerifyScreenStyles(colors);
  const [state, dispatch] = React.useReducer(
    verifyScreenReducer,
    verifyInitialState,
  );

  const channel: VerifyChannel = route.params.type;
  const isEmail = isEmailChannel(channel);

  const titleKey = getVerifyTitleKey(state.step, channel);
  const subtitleKey = getVerifySubtitleKey(state.step, channel);
  const title = t(titleKey);
  const subtitle = t(subtitleKey);

  const placeholderMuted = React.useMemo(
    () => hexAlpha(colors.text, 0.45),
    [colors.text],
  );

  const onChangeContact = React.useCallback((value: string) => {
    dispatch({ type: 'contact_changed', value });
  }, []);

  const onChangeCode = React.useCallback((value: string) => {
    dispatch({ type: 'code_changed', value });
  }, []);

  const onSendCode = React.useCallback(async () => {
    dispatch({ type: 'send_started' });
    try {
      await sendVerificationCode(channel, state.contactValue);
      dispatch({ type: 'send_succeeded' });
    } catch (err) {
      dispatch({
        type: 'send_failed',
        message: translateVerifyError(err, t),
      });
    }
  }, [channel, state.contactValue, t]);

  const onVerifyCode = React.useCallback(async () => {
    dispatch({ type: 'verify_started' });
    try {
      await verifyCodeWithServer(channel, state.contactValue, state.codeValue);
      dispatch({ type: 'verify_succeeded' });
      queryClient
        .invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY })
        .catch(() => {});
      navigation.goBack();
    } catch (err) {
      dispatch({
        type: 'verify_failed',
        message: translateVerifyError(err, t),
      });
    }
  }, [channel, navigation, queryClient, state.codeValue, state.contactValue, t]);

  const contactLabel = t(getVerifyContactLabelKey(channel));
  const contactPlaceholder = t(getVerifyContactPlaceholderKey(channel));
  const submitCodeLabel = t('screens.verify.sendCode');
  const verifyLabel = t('screens.verify.verifyCode');
  const codeFieldLabel = t('screens.verify.codeLabel');
  const codePlaceholder = t('screens.verify.codePlaceholder');

  let keyboardType: 'email-address' | 'phone-pad';
  if (isEmail) {
    keyboardType = 'email-address';
  } else {
    keyboardType = 'phone-pad';
  }

  let stepBody: React.ReactNode;
  if (state.step === 'INPUT') {
    stepBody = (
      <VerifyInputStep
        label={contactLabel}
        placeholder={contactPlaceholder}
        placeholderTextColor={placeholderMuted}
        value={state.contactValue}
        onChangeText={onChangeContact}
        onSubmit={onSendCode}
        submitLabel={submitCodeLabel}
        isSubmitting={state.isSending}
        errorText={state.errorMessage}
        keyboardType={keyboardType}
        fieldLabelStyle={s.fieldLabel}
        inputStyle={s.input}
        primaryButton={s.primaryButton}
        primaryButtonPressed={s.primaryButtonPressed}
        primaryButtonDisabled={s.primaryButtonDisabled}
        primaryButtonLabel={s.primaryButtonLabel}
        errorTextStyle={s.errorText}
      />
    );
  } else {
    stepBody = (
      <>
        {__DEV__ ? (
          <Text style={s.hint}>{t('screens.verify.demoCodeHint')}</Text>
        ) : null}
        <VerifyCodeStep
          label={codeFieldLabel}
          placeholder={codePlaceholder}
          placeholderTextColor={placeholderMuted}
          value={state.codeValue}
          onChangeText={onChangeCode}
          onSubmit={onVerifyCode}
          submitLabel={verifyLabel}
          isSubmitting={state.isVerifying}
          errorText={state.errorMessage}
          fieldLabelStyle={s.fieldLabel}
          inputStyle={s.input}
          primaryButton={s.primaryButton}
          primaryButtonPressed={s.primaryButtonPressed}
          primaryButtonDisabled={s.primaryButtonDisabled}
          primaryButtonLabel={s.primaryButtonLabel}
          errorTextStyle={s.errorText}
        />
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <VerifyHeader
          title={title}
          subtitle={subtitle}
          titleStyle={s.title}
          subtitleStyle={s.subtitle}
        />
        {stepBody}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const VerifyScreen = React.memo(VerifyScreenComponent);
VerifyScreen.displayName = 'VerifyScreen';
