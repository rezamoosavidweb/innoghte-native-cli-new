import { zodResolver } from '@hookform/resolvers/zod';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Text } from '@/shared/ui/Text';

import { collaborationApiMobile } from '@/domains/collaboration/model/collaborationMobile';
import {
  collaborationFormSchema,
  collaborationResumeSchema,
  type CollaborationFormValues,
  type CollaborationResumeValue,
} from '@/domains/collaboration/model/collaborationForm.schema';
import {
  useWorkWithUsCategoriesQuery,
  useWorkWithUsMutation,
} from '@/domains/collaboration/hooks/useCollaborationPublic';
import { createCollaborationScreenStyles } from '@/domains/collaboration/ui/collaborationScreen.styles';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { fireAndForget } from '@/shared/infra/http';
import { showAppToast } from '@/shared/ui/toast';
import {
  createNavScreenShellStyles,
  flashListContentGutters,
  useThemeColors,
} from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'Collaboration'>;

const GENDER = [
  { value: 'male', label: 'آقا' },
  { value: 'female', label: 'خانم' },
  { value: 'other', label: 'دیگر' },
];

const MARITAL = [
  { value: 'married', label: 'متاهل' },
  { value: 'single', label: 'مجرد' },
];

const EXP = [
  { value: 'کمتراز یک سال', label: 'کمتر از یک سال' },
  { value: 'یک تا سه سال', label: 'یک تا سه سال' },
  { value: 'سه تا پنج سال', label: 'سه تا پنج سال' },
  { value: 'بیشتر از پنج سال', label: 'بیشتر از پنج سال' },
];

export const CollaborationScreen = React.memo(function CollaborationScreen({
  navigation,
}: Props) {
  const { colors } = useTheme();
  const ui = useThemeColors();
  const shell = React.useMemo(
    () => createNavScreenShellStyles(colors),
    [colors],
  );
  const s = React.useMemo(
    () => createCollaborationScreenStyles(colors, ui),
    [colors, ui],
  );
  const { t } = useTranslation();

  const catQuery = useWorkWithUsCategoriesQuery();
  const submitMut = useWorkWithUsMutation();
  const [resume, setResume] = React.useState<CollaborationResumeValue | null>(
    null,
  );

  const form = useForm<CollaborationFormValues>({
    resolver: zodResolver(collaborationFormSchema),
    defaultValues: {
      name: '',
      family: '',
      email: '',
      mobile: '',
      birth_date: '',
      gender: '',
      marital_status: '',
      experience: '',
      work_with_us_category_id: '',
      city: '',
      address: '',
      description: '',
    },
    mode: 'onBlur',
  });

  const { control, handleSubmit, watch, setValue, formState: { errors } } =
    form;

  const categoryId = watch('work_with_us_category_id');

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: t('screens.collaboration.navTitle') });
  }, [navigation, t]);

  const pickResume = React.useCallback(() => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 1 },
      response => {
        const a = response.assets?.[0];
        if (!a?.uri) {
          return;
        }
        const next = {
          uri: a.uri,
          name: a.fileName ?? 'resume.jpg',
          type: a.type ?? 'image/jpeg',
          size: a.fileSize ?? 0,
        };
        const parsed = collaborationResumeSchema.safeParse(next);
        if (!parsed.success) {
          showAppToast(parsed.error.issues[0]?.message ?? 'خطا', 'error');
          return;
        }
        setResume(parsed.data);
      },
    );
  }, []);

  const onValid = React.useCallback(
    (values: CollaborationFormValues) => {
      if (!resume) {
        showAppToast(t('screens.collaboration.resumeName'), 'error');
        return;
      }
      const mobile = collaborationApiMobile(values.mobile);
      const fields: Record<string, string> = {
        name: values.name.trim(),
        family: values.family.trim(),
        email: values.email.trim(),
        mobile,
        birth_date: values.birth_date.trim(),
        gender: values.gender,
        marital_status: values.marital_status,
        experience: values.experience,
        work_with_us_category_id: values.work_with_us_category_id,
        city: values.city.trim(),
        address: values.address.trim(),
        description: values.description.trim(),
      };
      submitMut
        .mutateAsync({ fields, resume })
        .then(() => {
          showAppToast(t('screens.collaboration.success'), 'success');
          form.reset();
          setResume(null);
        })
        .catch(() => {
          showAppToast(t('screens.collaboration.error'), 'error');
        });
    },
    [form, resume, submitMut, t],
  );

  const chipSelect = React.useCallback(
    (
      options: { value: string; label: string }[],
      field: keyof CollaborationFormValues,
      current: string,
    ) => (
      <View style={s.chipRow}>
        {options.map(o => (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            style={[s.chip, current === o.value ? s.chipOn : null]}
            onPress={() =>
              setValue(field, o.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          >
            <Text style={s.chipLabel}>{o.label}</Text>
          </Pressable>
        ))}
      </View>
    ),
    [s, setValue],
  );

  return (
    <KeyboardAvoidingView
      style={shell.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          flashListContentGutters.standard,
          s.scroll,
        ]}
      >
        <View style={s.card}>
          <Text style={s.title}>{t('screens.collaboration.navTitle')}</Text>
          <Text style={s.subtitle}>{t('screens.collaboration.jobsTitle')}</Text>
          <Text style={s.muted}>{t('screens.collaboration.jobsEmpty')}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.subtitle}>{t('screens.collaboration.formTitle')}</Text>

          <View style={s.row2}>
            <View style={s.half}>
              <Text style={s.label}>{t('screens.collaboration.name')}</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={[s.input, s.inputRtl]}
                    placeholderTextColor={ui.textMuted}
                  />
                )}
              />
              {errors.name ? (
                <Text style={s.error}>{errors.name.message}</Text>
              ) : null}
            </View>
            <View style={s.half}>
              <Text style={s.label}>{t('screens.collaboration.family')}</Text>
              <Controller
                control={control}
                name="family"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={[s.input, s.inputRtl]}
                    placeholderTextColor={ui.textMuted}
                  />
                )}
              />
              {errors.family ? (
                <Text style={s.error}>{errors.family.message}</Text>
              ) : null}
            </View>
          </View>

          <Text style={s.label}>{t('screens.collaboration.email')}</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[s.input, s.inputLtr]}
                placeholderTextColor={ui.textMuted}
              />
            )}
          />
          {errors.email ? (
            <Text style={s.error}>{errors.email.message}</Text>
          ) : null}

          <Text style={s.label}>{t('screens.collaboration.mobile')}</Text>
          <Controller
            control={control}
            name="mobile"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                style={[s.input, s.inputLtr]}
                placeholderTextColor={ui.textMuted}
              />
            )}
          />
          {errors.mobile ? (
            <Text style={s.error}>{errors.mobile.message}</Text>
          ) : null}

          <Text style={s.label}>{t('screens.collaboration.birthYear')}</Text>
          <Controller
            control={control}
            name="birth_date"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value}
                onChangeText={text => {
                  if (/^\d{0,4}$/.test(text)) {
                    onChange(text);
                  }
                }}
                onBlur={onBlur}
                keyboardType="number-pad"
                style={[s.input, s.inputLtr]}
                placeholderTextColor={ui.textMuted}
                maxLength={4}
              />
            )}
          />
          {errors.birth_date ? (
            <Text style={s.error}>{errors.birth_date.message}</Text>
          ) : null}

          <Text style={s.label}>{t('screens.collaboration.gender')}</Text>
          {chipSelect(GENDER, 'gender', watch('gender'))}
          {errors.gender ? (
            <Text style={s.error}>{errors.gender.message}</Text>
          ) : null}

          <Text style={s.label}>{t('screens.collaboration.marital')}</Text>
          {chipSelect(MARITAL, 'marital_status', watch('marital_status'))}
          {errors.marital_status ? (
            <Text style={s.error}>{errors.marital_status.message}</Text>
          ) : null}

          <Text style={s.label}>{t('screens.collaboration.experience')}</Text>
          {chipSelect(EXP, 'experience', watch('experience'))}
          {errors.experience ? (
            <Text style={s.error}>{errors.experience.message}</Text>
          ) : null}

          <Text style={s.label}>{t('screens.collaboration.unit')}</Text>
          <View style={s.chipRow}>
            {(catQuery.data ?? []).map(c => (
              <Pressable
                key={c.id}
                accessibilityRole="button"
                style={[
                  s.chip,
                  categoryId === String(c.id) ? s.chipOn : null,
                ]}
                onPress={() =>
                  setValue('work_with_us_category_id', String(c.id), {
                    shouldValidate: true,
                  })
                }
              >
                <Text style={s.chipLabel}>{c.name}</Text>
              </Pressable>
            ))}
          </View>
          {errors.work_with_us_category_id ? (
            <Text style={s.error}>
              {errors.work_with_us_category_id.message}
            </Text>
          ) : null}

          <Text style={s.label}>{t('screens.collaboration.city')}</Text>
          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[s.input, s.inputRtl]}
                placeholderTextColor={ui.textMuted}
              />
            )}
          />
          {errors.city ? (
            <Text style={s.error}>{errors.city.message}</Text>
          ) : null}

          <Text style={s.label}>{t('screens.collaboration.address')}</Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                style={[s.input, s.inputRtl, s.area]}
                placeholderTextColor={ui.textMuted}
              />
            )}
          />
          {errors.address ? (
            <Text style={s.error}>{errors.address.message}</Text>
          ) : null}

          <Text style={s.label}>{t('screens.collaboration.description')}</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                maxLength={500}
                style={[s.input, s.inputRtl, s.area]}
                placeholderTextColor={ui.textMuted}
              />
            )}
          />
          {errors.description ? (
            <Text style={s.error}>{errors.description.message}</Text>
          ) : null}

          <Text style={s.label}>{t('screens.collaboration.resumePick')}</Text>
          <Pressable accessibilityRole="button" style={s.resumeBox} onPress={pickResume}>
            <Text style={s.muted}>
              {resume?.name ?? t('screens.collaboration.resumeName')}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            style={[s.submit, submitMut.isPending ? s.submitDisabled : null]}
            disabled={submitMut.isPending}
            onPress={() => {
              fireAndForget(handleSubmit(onValid)());
            }}
          >
            {submitMut.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={s.submitLabel}>{t('screens.collaboration.submit')}</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

CollaborationScreen.displayName = 'CollaborationScreen';
