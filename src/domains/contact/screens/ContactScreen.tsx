import { zodResolver } from '@hookform/resolvers/zod';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Text } from '@/shared/ui/Text';

import {
  useContactOtpSheet,
  useContactUsCategoriesQuery,
  useContactUsSendOtpMutation,
  useContactUsVerifyAndCreateMutation,
} from '@/domains/contact/hooks/useContactPublic';
import {
  contactFormSchema,
  type ContactFormValues,
} from '@/domains/contact/model/contactForm.schema';
import { createContactScreenStyles } from '@/domains/contact/ui/contactScreen.styles';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { fireAndForget } from '@/shared/infra/http';
import { showAppToast } from '@/shared/ui/toast';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import {
  createNavScreenShellStyles,
  flashListContentGutters,
  useThemeColors,
} from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'Contact'>;

function normalizeContactMobile(raw: string): string {
  const d = raw.replace(/\D/g, '');
  return d.startsWith('00') ? d : `00${d}`;
}

export const ContactScreen = React.memo(function ContactScreen(_props: Props) {
  const navigation = useAppNavigation();
  const { colors } = useTheme();
  const ui = useThemeColors();
  const shell = React.useMemo(
    () => createNavScreenShellStyles(colors),
    [colors],
  );
  const s = React.useMemo(
    () => createContactScreenStyles(colors, ui),
    [colors, ui],
  );
  const { t } = useTranslation();

  const categoriesQuery = useContactUsCategoriesQuery();
  const sendOtp = useContactUsSendOtpMutation();
  const verifyCreate = useContactUsVerifyAndCreateMutation();
  const otpSheet = useContactOtpSheet();

  const [categoryModal, setCategoryModal] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [otpErr, setOtpErr] = React.useState('');
  const [pendingPayload, setPendingPayload] =
    React.useState<ContactFormValues | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      mobileDigits: '',
      title: '',
      category_id: '',
      info: '',
    },
    mode: 'onBlur',
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = form;

  const categoryId = watch('category_id');

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: t('screens.contact.navTitle') });
  }, [navigation, t]);

  const found = (categoriesQuery.data ?? []).find(c => String(c.id) === categoryId);
  const categoryLabel = found?.name ?? t('screens.contact.pickCategory');

  const startOtp = React.useCallback(
    async (values: ContactFormValues) => {
      const mobile = normalizeContactMobile(values.mobileDigits);
      setPendingPayload(values);
      try {
        const res = await sendOtp.mutateAsync({
          email: values.email.trim(),
          mobile,
        });
        if (!res.isValid) {
          showAppToast(t('screens.contact.errorGeneric'), 'error');
          return;
        }
        otpSheet.show({ email: values.email.trim(), mobileE164: mobile, ttl: res.ttl });
        setOtp('');
        setOtpErr('');
      } catch {
        showAppToast(t('screens.contact.errorGeneric'), 'error');
      }
    },
    [otpSheet, sendOtp, t],
  );

  const onConfirmOtp = React.useCallback(() => {
    if (!pendingPayload || !otp.trim()) {
      return;
    }
    setOtpErr('');
    verifyCreate
      .mutateAsync({
        otp: otp.trim(),
        email: pendingPayload.email.trim(),
        payload: {
          full_name: pendingPayload.full_name.trim(),
          email: pendingPayload.email.trim(),
          title: pendingPayload.title.trim(),
          info: pendingPayload.info.trim(),
          category_id: pendingPayload.category_id,
          mobile: normalizeContactMobile(pendingPayload.mobileDigits),
        },
      })
      .then(() => {
        showAppToast(t('screens.contact.success'), 'success');
        otpSheet.hide();
        setPendingPayload(null);
        setOtp('');
        reset();
      })
      .catch(err => {
        const code = err instanceof Error ? err.message : '';
        setOtpErr(
          code === 'OTP_INVALID' || code === 'CREATE_FAILED'
            ? t('screens.contact.otpInvalid')
            : t('screens.contact.errorGeneric'),
        );
      });
  }, [otp, pendingPayload, reset, otpSheet, t, verifyCreate]);

  const resendOtp = React.useCallback(() => {
    if (!pendingPayload) {
      return;
    }
    void startOtp(pendingPayload);
  }, [pendingPayload, startOtp]);

  const submitBusy = sendOtp.isPending || verifyCreate.isPending;

  return (
    <KeyboardAvoidingView
      style={shell.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          flashListContentGutters.standard,
          s.scrollContent,
        ]}
      >
        <Text style={s.heroTitle}>{t('screens.contact.navTitle')}</Text>
        <Text style={s.heroLead}>{t('screens.contact.lead')}</Text>

        <View style={s.darkBand}>
          <Text style={s.darkBandTitle}>{t('screens.contact.supportIntro')}</Text>
          <Pressable
            accessibilityRole="button"
            style={s.linkBtn}
            onPress={() => navigation.navigate('TicketListScreen')}
          >
            <Text style={s.linkLabel}>{t('screens.contact.openTickets')}</Text>
          </Pressable>

          <Text style={s.hint}>{t('screens.contact.hintPhoneEmail')}</Text>

          <Controller
            control={control}
            name="full_name"
            render={({ field: { value, onChange, onBlur } }) => (
              <View>
                <Text style={s.fieldLabel}>{t('screens.contact.fullName')}</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={[s.input, s.inputRtl]}
                  placeholderTextColor={ui.textMuted}
                />
                {errors.full_name ? (
                  <Text style={s.error}>{errors.full_name.message}</Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <View>
                <Text style={s.fieldLabel}>{t('screens.contact.email')}</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[s.input, s.inputLtr]}
                  placeholderTextColor={ui.textMuted}
                />
                {errors.email ? (
                  <Text style={s.error}>{errors.email.message}</Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="mobileDigits"
            render={({ field: { value, onChange, onBlur } }) => (
              <View>
                <Text style={s.fieldLabel}>{t('screens.contact.mobile')}</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  style={[s.input, s.inputLtr]}
                  placeholderTextColor={ui.textMuted}
                />
                {errors.mobileDigits ? (
                  <Text style={s.error}>{errors.mobileDigits.message}</Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange, onBlur } }) => (
              <View>
                <Text style={s.fieldLabel}>{t('screens.contact.subject')}</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={[s.input, s.inputRtl]}
                  placeholderTextColor={ui.textMuted}
                />
                {errors.title ? (
                  <Text style={s.error}>{errors.title.message}</Text>
                ) : null}
              </View>
            )}
          />

          <View>
            <Text style={s.fieldLabel}>{t('screens.contact.category')}</Text>
            <Pressable
              style={s.categorySelector}
              onPress={() => setCategoryModal(true)}
              accessibilityRole="button"
            >
              <Text style={s.categorySelectorLabel}>{categoryLabel}</Text>
            </Pressable>
            {errors.category_id ? (
              <Text style={s.error}>{errors.category_id.message}</Text>
            ) : null}
          </View>

          <Controller
            control={control}
            name="info"
            render={({ field: { value, onChange, onBlur } }) => (
              <View>
                <Text style={s.fieldLabel}>{t('screens.contact.message')}</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  maxLength={200}
                  placeholder={t('screens.contact.messagePh')}
                  style={[s.input, s.inputRtl, s.area]}
                  placeholderTextColor={ui.textMuted}
                />
                {errors.info ? (
                  <Text style={s.error}>{errors.info.message}</Text>
                ) : null}
              </View>
            )}
          />

          <Pressable
            accessibilityRole="button"
            disabled={submitBusy}
            onPress={() => {
              fireAndForget(handleSubmit(startOtp)());
            }}
            style={[s.submit, submitBusy ? s.submitDisabled : null]}
          >
            {submitBusy ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={s.submitLabel}>{t('screens.contact.submit')}</Text>
            )}
          </Pressable>

          <Text style={s.footnote}>{t('screens.contact.footnoteSupportHours')}</Text>
          <Text style={s.footnote}>{t('screens.contact.footnoteReply')}</Text>
        </View>
      </ScrollView>

      <Modal
        visible={categoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModal(false)}
      >
        <View style={s.modalBackdrop}>
          <Pressable
            accessibilityRole="button"
            style={StyleSheet.absoluteFill}
            onPress={() => setCategoryModal(false)}
          />
          <View style={s.modalCard}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={s.categoryScroll}
            >
              {(categoriesQuery.data ?? []).map(c => (
                <Pressable
                  key={c.id}
                  style={s.categoryRow}
                  onPress={() => {
                    setValue('category_id', String(c.id), {
                      shouldValidate: true,
                    });
                    setCategoryModal(false);
                  }}
                >
                  <Text style={s.categoryRowLabel}>{c.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={otpSheet.open}
        transparent
        animationType="slide"
        onRequestClose={otpSheet.hide}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>{t('screens.contact.otpTitle')}</Text>
            <Text style={[s.heroLead, { color: colors.text }]}>
              {t('screens.contact.otpHint')}
            </Text>
            <TextInput
              value={otp}
              onChangeText={setOtp}
              style={s.otpInput}
              keyboardType="number-pad"
              placeholder="------"
              placeholderTextColor={ui.textMuted}
            />
            {otpErr ? <Text style={s.error}>{otpErr}</Text> : null}
            <View style={s.row}>
              <Pressable accessibilityRole="button" style={s.smallBtn} onPress={otpSheet.hide}>
                <Text style={s.smallBtnLabel}>{t('screens.contact.cancel')}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" style={s.smallBtn} onPress={resendOtp}>
                <Text style={s.smallBtnLabel}>{t('screens.contact.otpResend')}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={[s.smallBtn, s.smallBtnPrimary]}
                onPress={onConfirmOtp}
              >
                <Text style={s.smallBtnLabelOnPrimary}>
                  {t('screens.contact.otpConfirm')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
});

ContactScreen.displayName = 'ContactScreen';
