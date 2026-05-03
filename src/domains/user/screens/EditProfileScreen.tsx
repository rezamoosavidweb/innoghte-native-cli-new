import { Button } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import { useCurrentUser } from '@/domains/auth/hooks/useCurrentUser';
import { ProfileAvatarPicker } from '@/domains/user/components/profile/ProfileAvatarPicker';
import { useUpdateProfileMutation } from '@/domains/user/hooks/useUpdateProfileMutation';
import {
  editProfileFormResolver,
  type EditProfileFormType,
} from '@/domains/user/model/editProfileForm.schema';
import { createEditProfileScreenStyles } from '@/domains/user/ui/editProfileScreen.styles';
import { isDotIr } from '@/shared/config/resolveIsDotIr';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { Text } from '@/shared/ui/Text';
import { resolveAvatarUri } from '@/shared/utils/resolveAvatarUri';
import {
  flashListContentGutters,
  createNavScreenShellStyles,
  useThemeColors,
} from '@/ui/theme';
import { createFormFieldStyles } from '@/ui/theme/formField.styles';

export const EditProfileScreen = () => {
  const navigation = useAppNavigation();
  const { colors } = useTheme();
  const uiColors = useThemeColors();
  const shell = createNavScreenShellStyles(colors);
  const formField = createFormFieldStyles(uiColors);
  const { t } = useTranslation();

  const screenStyles = createEditProfileScreenStyles(colors, uiColors);

  const { data: userRes } = useCurrentUser();
  const user = userRes?.data;

  const updateMutation = useUpdateProfileMutation();

  const defaultRemoteAvatar = React.useMemo(
    () => resolveAvatarUri(user?.avatar),
    [user?.avatar],
  );

  const form = useForm<EditProfileFormType>({
    resolver: editProfileFormResolver,
    defaultValues: {
      avatar: '',
      full_name: '',
      email: '',
      mobile: {
        dial: '',
        countryCode: isDotIr ? 'ir' : 'us',
        dialCode: isDotIr ? '+98' : '+1',
      },
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (!user) {
      return;
    }
    reset({
      avatar: user.avatar ?? '',
      full_name: user.full_name ?? '',
      email: user.email ?? '',
      mobile: {
        dial: (user.mobile ?? '').replace(/^00/, ''),
        countryCode: isDotIr ? 'ir' : 'us',
        dialCode: isDotIr ? '+98' : '+1',
      },
    });
  }, [reset, user]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: t('screens.editProfile.navTitle'),
    });
  }, [navigation, t]);

  const [banner, setBanner] = React.useState<'success' | 'error' | null>(
    null,
  );

  const submitValid = React.useMemo(
    () =>
      handleSubmit(
        values => {
          setBanner(null);
          updateMutation.mutate(
            { full_name: values.full_name, avatar: values.avatar },
            {
              onSuccess: () => {
                setBanner('success');
              },
              onError: () => {
                setBanner('error');
              },
            },
          );
        },
        () => {
          setBanner(null);
        },
      ),
    [handleSubmit, updateMutation],
  );

  return (
    <KeyboardAvoidingView
      style={shell.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={flashListContentGutters.standard}
      >
        <View style={screenStyles.card}>
          <Text style={screenStyles.sectionTitle}>
            {t('screens.editProfile.sectionTitle')}
          </Text>

          <View style={screenStyles.stackLg}>
          <View style={screenStyles.stackSm}>
            <Text style={screenStyles.fieldLabel}>
              {t('screens.editProfile.avatar')}
            </Text>
            <Controller
              control={control}
              name="avatar"
              render={({ field: { value, onChange } }) => (
                <ProfileAvatarPicker
                  accessibilityPickLabel={t(
                    'screens.editProfile.pickImageA11y',
                  )}
                  pickHintLabel={t('screens.editProfile.pickImageHint')}
                  defaultRemoteUri={defaultRemoteAvatar}
                  value={value}
                  onChange={onChange}
                  busy={updateMutation.isPending}
                  error={
                    typeof errors.avatar?.message === 'string'
                      ? errors.avatar.message
                      : undefined
                  }
                />
              )}
            />
          </View>

          <View style={screenStyles.stackSm}>
            <Text style={screenStyles.fieldLabel}>
              {t('screens.editProfile.fullName')}
              <Text style={screenStyles.requiredMark}> *</Text>
            </Text>
            <Controller
              control={control}
              name="full_name"
              render={({ field: { value, onChange, onBlur } }) => (
                <>
                  <TextInput
                    accessibilityLabel={t('screens.editProfile.fullName')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={[screenStyles.textInput]}
                  />
                  {errors.full_name?.message ? (
                    <Text style={formField.errorText}>
                      {errors.full_name.message}
                    </Text>
                  ) : null}
                </>
              )}
            />
          </View>

          <View style={screenStyles.stackSm}>
            <Text style={screenStyles.fieldLabel}>
              {t('screens.editProfile.email')}
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { value } }) => (
                <TextInput
                  editable={false}
                  accessibilityLabel={t('screens.editProfile.email')}
                  value={value}
                  style={[
                    screenStyles.textInput,
                    screenStyles.textInputLtr,
                    screenStyles.inputDisabled,
                  ]}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              )}
            />
          </View>

          <View style={screenStyles.stackSm}>
            <Text style={screenStyles.fieldLabel}>
              {t('screens.editProfile.mobile')}
              <Text style={screenStyles.requiredMark}> *</Text>
            </Text>
            <Controller
              control={control}
              name="mobile"
              render={({ field: { value } }) => (
                <>
                  <TextInput
                    editable={false}
                    accessibilityLabel={t('screens.editProfile.mobile')}
                    value={value.dial}
                    style={[
                      screenStyles.textInput,
                      screenStyles.textInputLtr,
                      screenStyles.inputDisabled,
                    ]}
                    keyboardType="phone-pad"
                  />
                  {errors.mobile?.dial?.message ? (
                    <Text style={formField.errorText}>
                      {errors.mobile.dial.message}
                    </Text>
                  ) : null}
                </>
              )}
            />
          </View>

          {banner === 'success' ? (
            <Text style={screenStyles.bannerSuccess}>
              {t('screens.editProfile.success')}
            </Text>
          ) : null}
          {banner === 'error' ? (
            <Text style={screenStyles.bannerError}>
              {t('screens.editProfile.errorGeneric')}
            </Text>
          ) : null}

          <Button
            disabled={updateMutation.isPending}
            onPress={() => {
              submitValid().catch(() => undefined);
            }}
          >
            {updateMutation.isPending
              ? t('screens.editProfile.saving')
              : t('screens.editProfile.save')}
          </Button>
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProfileScreen.displayName = 'EditProfileScreen';
