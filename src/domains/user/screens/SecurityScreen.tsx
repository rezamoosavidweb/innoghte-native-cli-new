import { Button } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { navigateToAppLeaf } from '@/app/bridge/auth';
import { useCurrentUser } from '@/domains/auth/hooks/useCurrentUser';
import { DeviceSessionRow } from '@/domains/user/components/security/DeviceSessionRow';
import { useChangePasswordMutation } from '@/domains/user/hooks/useChangePasswordMutation';
import { useDeactivateDeviceMutation } from '@/domains/user/hooks/useDeactivateDeviceMutation';
import { useUserDevicesQuery } from '@/domains/user/hooks/useUserDevicesQuery';
import {
  changePasswordFormResolver,
  type ChangePasswordFormType,
} from '@/domains/user/model/changePasswordForm.schema';
import { createSecurityScreenStyles } from '@/domains/user/ui/securityScreen.styles';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { Text } from '@/shared/ui/Text';
import {
  flashListContentGutters,
  createNavScreenShellStyles,
  useThemeColors,
} from '@/ui/theme';
import { InputField } from '@/ui/components/form/InputField';
import { createFormFieldStyles } from '@/ui/theme/formField.styles';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export const SecurityScreen = () => {
  const navigation = useAppNavigation();
  const { colors } = useTheme();
  const uiColors = useThemeColors();
  const shell = createNavScreenShellStyles(colors);
  const formField = createFormFieldStyles(uiColors);
  const { t } = useTranslation();

  const screenStyles = createSecurityScreenStyles(colors, uiColors);

  const { data: userRes } = useCurrentUser();
  const user = userRes?.data;
  const hasSession = Boolean(user);

  const devicesQuery = useUserDevicesQuery(hasSession);
  const deactivateMutation = useDeactivateDeviceMutation();
  const passwordMutation = useChangePasswordMutation();

  const [showPasswordForm, setShowPasswordForm] = React.useState(false);

  const pwdForm = useForm<ChangePasswordFormType>({
    resolver: changePasswordFormResolver,
    defaultValues: { old: '', new: '', confirm: '' },
  });

  const {
    control,
    handleSubmit,
    reset: resetPasswordFields,
    formState: { errors },
  } = pwdForm;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: t('screens.security.navTitle'),
    });
  }, [navigation, t]);

  const rowLabels = React.useMemo(
    () => ({
      active: t('screens.security.active'),
      inactive: t('screens.security.inactive'),
      deactivate: t('screens.security.deactivate'),
      ipLabel: t('screens.security.ipLabel'),
      timeLabel: t('screens.security.timeLabel'),
      statusLabel: t('screens.security.statusLabel'),
    }),
    [t],
  );

  const devices = devicesQuery.data ?? [];

  const onDeactivate = React.useCallback(
    (id: number) => {
      deactivateMutation.mutate(id);
    },
    [deactivateMutation],
  );

  const deactivateBusy = deactivateMutation.isPending;

  const passwordErrorMessage = passwordMutation.error?.message ?? '';

  const onTogglePasswordForm = React.useCallback(() => {
    setShowPasswordForm(prev => !prev);
  }, []);

  const onHidePasswordForm = React.useCallback(() => {
    setShowPasswordForm(false);
    resetPasswordFields({ old: '', new: '', confirm: '' });
    passwordMutation.reset();
  }, [passwordMutation, resetPasswordFields]);

  const onForgetPassword = React.useCallback(() => {
    navigateToAppLeaf(navigation, 'Login');
  }, [navigation]);

  const submitPassword = React.useMemo(
    () =>
      handleSubmit(values => {
        passwordMutation.mutate(
          {
            password: values.old,
            new_password: values.new,
            new_password_confirmation: values.confirm,
          },
          {
            onSuccess: () => {
              resetPasswordFields({ old: '', new: '', confirm: '' });
            },
          },
        );
      }),
    [handleSubmit, passwordMutation, resetPasswordFields],
  );

  const pwdBusy = passwordMutation.isPending;

  return (
    <KeyboardAvoidingView
      style={shell.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={flashListContentGutters.standard}
      >
        <Text style={screenStyles.sectionHeading}>
          {t('screens.security.sessionsTitle')}
        </Text>

        {devicesQuery.isPending ? (
          <Text style={screenStyles.devicesMuted}>
            {t('screens.security.devicesLoading')}
          </Text>
        ) : devicesQuery.isError ? (
          <Text style={screenStyles.devicesError}>
            {t('screens.security.devicesError')}
          </Text>
        ) : devices.length === 0 ? (
          <Text style={screenStyles.devicesMuted}>
            {t('screens.security.devicesEmpty')}
          </Text>
        ) : (
          devices.map(d => (
            <DeviceSessionRow
              key={d.id}
              device={d}
              deactivateBusy={deactivateBusy}
              labels={rowLabels}
              mutedColor={uiColors.textMuted}
              textColor={colors.text}
              borderColor={colors.border}
              dangerBg={hexAlpha(uiColors.errorText, 0.2)}
              dangerText={uiColors.errorText}
              successBg={hexAlpha(uiColors.successText, 0.2)}
              successText={uiColors.successText}
              onDeactivate={onDeactivate}
            />
          ))
        )}

        <Text style={screenStyles.sectionHeadingSpaced}>
          {t('screens.security.passwordCardTitle')}
        </Text>

        {!showPasswordForm ? (
          <View style={screenStyles.passwordSummaryRow}>
            <View style={screenStyles.passwordSummaryTextBlock}>
              <Text style={screenStyles.passwordSummaryLabel}>
                {t('screens.security.passwordCardTitle')}
              </Text>
              <Text style={screenStyles.passwordMasked}>
                {t('screens.security.passwordMasked')}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('screens.security.changePassword')}
              onPress={onTogglePasswordForm}
              style={({ pressed }) => [
                screenStyles.changePasswordBtn,
                pressed ? screenStyles.changePasswordBtnPressed : null,
              ]}
            >
              <Text style={screenStyles.changePasswordLabel}>
                {t('screens.security.changePassword')}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={screenStyles.formStack}>
            <Controller
              control={control}
              name="old"
              render={({ field: { value, onChange, onBlur } }) => (
                <View style={screenStyles.fieldStack}>
                  <Text style={screenStyles.fieldLabel}>
                    {t('screens.security.currentPassword')}
                  </Text>
                  <InputField
                    accessibilityLabel={t('screens.security.currentPassword')}
                    placeholder=""
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.old?.message}
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name="new"
              render={({ field: { value, onChange, onBlur } }) => (
                <View style={screenStyles.fieldStack}>
                  <Text style={screenStyles.fieldLabel}>
                    {t('screens.security.newPassword')}
                  </Text>
                  <InputField
                    accessibilityLabel={t('screens.security.newPassword')}
                    placeholder=""
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.new?.message}
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name="confirm"
              render={({ field: { value, onChange, onBlur } }) => (
                <View style={screenStyles.fieldStack}>
                  <Text style={screenStyles.fieldLabel}>
                    {t('screens.security.confirmPassword')}
                  </Text>
                  <InputField
                    accessibilityLabel={t('screens.security.confirmPassword')}
                    placeholder=""
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirm?.message}
                  />
                </View>
              )}
            />

            <Text style={screenStyles.hintMuted}>
              {t('screens.security.passwordHint')}
            </Text>
            <Pressable accessibilityRole="button" onPress={onForgetPassword}>
              <Text style={screenStyles.forgetPasswordText}>
                {`${t('screens.security.forgetPasswordLead')} ${t('screens.security.forgetPassword')}`}
              </Text>
            </Pressable>

            <View style={screenStyles.buttonRow}>
              <Button disabled={pwdBusy} onPress={onHidePasswordForm}>
                {t('screens.security.cancel')}
              </Button>
              <Button
                disabled={pwdBusy}
                onPress={() => {
                  submitPassword().catch(() => undefined);
                }}
              >
                {pwdBusy
                  ? t('screens.editProfile.saving')
                  : t('screens.security.confirm')}
              </Button>
            </View>

            {passwordMutation.isSuccess ? (
              <Text style={screenStyles.successText}>
                {t('screens.security.passwordChanged')}
              </Text>
            ) : null}
            {passwordErrorMessage ? (
              <Text
                style={[formField.errorText, screenStyles.apiErrorMargin]}
              >
                {passwordErrorMessage}
              </Text>
            ) : null}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

SecurityScreen.displayName = 'SecurityScreen';
