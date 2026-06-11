import { zodResolver } from '@hookform/resolvers/zod';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
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
import { isDotIr } from '@/shared/config/resolveIsDotIr';
import { fireAndForget } from '@/shared/infra/http';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { showAppToast } from '@/shared/ui/toast';
import { Button } from '@/ui/components/Button';
import { InputField } from '@/ui/components/form/InputField';
import { PhoneInput, defaultPhoneInputValue } from '@/ui/components/PhoneInput';
import { Textarea } from '@/ui/components/Textarea';
import { useThemeColors } from '@/ui/theme';

import MailIcon from '@/assets/icons/inn/mail.svg';
import UserIcon from '@/assets/icons/inn/user.svg';
import SubjectIcon from '@/assets/icons/user-edit.svg';

type Props = DrawerScreenProps<DrawerParamList, 'Contact'>;

const INFO_MAX_LENGTH = 200;

/** Web sends `00${dial}`; PhoneInput already strips the national number to digits. */
function contactMobileE164(dial: string): string {
  return `00${dial.replace(/\D/g, '')}`;
}

export const ContactScreen = React.memo(function ContactScreen(_props: Props) {
  const navigation = useAppNavigation();
  const ui = useThemeColors();
  const s = React.useMemo(() => createContactScreenStyles(ui), [ui]);
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
      mobile: defaultPhoneInputValue(),
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

  const found = (categoriesQuery.data ?? []).find(
    c => String(c.id) === categoryId,
  );
  const categoryLabel = found?.name ?? t('screens.contact.pickCategory');

  const startOtp = React.useCallback(
    async (values: ContactFormValues) => {
      const mobile = contactMobileE164(values.mobile.dial);
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
        otpSheet.show({
          email: values.email.trim(),
          mobileE164: mobile,
          ttl: res.ttl,
        });
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
          mobile: contactMobileE164(pendingPayload.mobile.dial),
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
    startOtp(pendingPayload).catch(() => {});
  }, [pendingPayload, startOtp]);

  const goTickets = React.useCallback(() => {
    navigation.navigate('TicketListScreen');
  }, [navigation]);

  const submitBusy = sendOtp.isPending || verifyCreate.isPending;

  const renderLabel = (text: string) => (
    <View style={s.fieldLabelRow}>
      <Text style={s.fieldLabel}>{text}</Text>
      <Text style={s.requiredMark}>*</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.scrollContent}
        >
          <Text style={s.lead}>{t('screens.contact.lead')}</Text>

          <Text style={s.methodsTitle}>
            {t('screens.contact.methodsTitle')}
          </Text>
          <Text style={s.methodText}>{t('screens.contact.method1')}</Text>
          <Text style={s.methodText}>
            {t('screens.contact.method2Pre')}
            <Text style={s.methodLink} onPress={goTickets}>
              {t('screens.contact.method2Link')}
            </Text>
            {t('screens.contact.method2Post')}
          </Text>
          <Text style={s.methodText}>{t('screens.contact.method3')}</Text>

          <Controller
            control={control}
            name="full_name"
            render={({ field: { value, onChange, onBlur } }) => (
              <View style={s.field}>
                {renderLabel(t('screens.contact.fullName'))}
                <InputField
                  accessibilityLabel={t('screens.contact.fullName')}
                  placeholder=""
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.full_name?.message}
                  leadingIcon={
                    <UserIcon width={20} height={20} color={ui.textMuted} />
                  }
                />
              </View>
            )}
          />

          <Text style={s.hint}>{t('screens.contact.hintPhoneEmail')}</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <View style={s.field}>
                {renderLabel(t('screens.contact.email'))}
                <InputField
                  accessibilityLabel={t('screens.contact.email')}
                  placeholder=""
                  keyboardType="email-address"
                  forceInputLtr
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  leadingIcon={
                    <MailIcon width={20} height={20} color={ui.textMuted} />
                  }
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="mobile"
            render={({ field: { value, onChange, onBlur } }) => (
              <View style={s.field}>
                {renderLabel(t('screens.contact.mobile'))}
                <PhoneInput
                  accessibilityLabelDial={t('screens.contact.mobile')}
                  placeholder={t('screens.contact.mobile')}
                  value={value ?? defaultPhoneInputValue()}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errors.mobile?.dial?.message}
                  disableDropdown={isDotIr}
                  defaultCountryIso={isDotIr ? 'ir' : undefined}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange, onBlur } }) => (
              <View style={s.field}>
                {renderLabel(t('screens.contact.subject'))}
                <InputField
                  accessibilityLabel={t('screens.contact.subject')}
                  placeholder=""
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.title?.message}
                  leadingIcon={
                    <SubjectIcon width={20} height={20} color={ui.textMuted} />
                  }
                />
              </View>
            )}
          />

          <View style={s.field}>
            {renderLabel(t('screens.contact.category'))}
            <Button
              layout="auto"
              variant="text"
              title={categoryLabel}
              style={s.categorySelector}
              onPress={() => setCategoryModal(true)}
              contentStyle={{ width: '100%' }}
            >
              <Text
                style={found ? s.categorySelectorLabel : s.categorySelectorPlaceholder}
              >
                {categoryLabel}
              </Text>
            </Button>
            {errors.category_id ? (
              <Text style={s.error}>{errors.category_id.message}</Text>
            ) : null}
          </View>

          <Controller
            control={control}
            name="info"
            render={({ field: { value, onChange, onBlur } }) => (
              <View style={s.field}>
                {renderLabel(t('screens.contact.message'))}
                <Textarea
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  maxLength={INFO_MAX_LENGTH}
                  minHeight={110}
                  placeholder={t('screens.contact.messagePh')}
                  accessibilityLabel={t('screens.contact.message')}
                  error={errors.info?.message}
                />
              </View>
            )}
          />

          <Button
            variant="filled"
            title={t('screens.contact.submit')}
            disabled={submitBusy}
            loading={submitBusy}
            onPress={() => {
              fireAndForget(handleSubmit(startOtp)());
            }}
            style={[s.submit, submitBusy ? s.submitDisabled : null]}
            contentStyle={s.submitSlot}
          >
            <Text style={s.submitLabel}>{t('screens.contact.submit')}</Text>
          </Button>

          <Text style={s.footnote}>
            {t('screens.contact.footnoteSupportHours')}
          </Text>
          <Text style={s.footnote}>{t('screens.contact.footnoteReply')}</Text>
        </ScrollView>

      <Modal
        visible={categoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModal(false)}
      >
        <View style={s.modalBackdrop}>
          <Button
            layout="auto"
            variant="text"
            title="Dismiss"
            accessibilityLabel="Dismiss"
            style={StyleSheet.absoluteFill}
            onPress={() => setCategoryModal(false)}
          >
            <View style={StyleSheet.absoluteFill} />
          </Button>
          <View style={s.modalCard}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={s.categoryScroll}
            >
              {(categoriesQuery.data ?? []).map(c => (
                <Button
                  key={c.id}
                  layout="auto"
                  variant="text"
                  title={c.name}
                  style={s.categoryRow}
                  onPress={() => {
                    setValue('category_id', String(c.id), {
                      shouldValidate: true,
                    });
                    setCategoryModal(false);
                  }}
                  contentStyle={{ width: '100%' }}
                >
                  <Text style={s.categoryRowLabel}>{c.name}</Text>
                </Button>
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
            <Text style={s.modalHint}>{t('screens.contact.otpHint')}</Text>
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
              <Button
                layout="auto"
                variant="text"
                title={t('screens.contact.cancel')}
                style={s.smallBtn}
                onPress={otpSheet.hide}
                contentStyle={{ width: '100%' }}
              >
                <Text style={s.smallBtnLabel}>
                  {t('screens.contact.cancel')}
                </Text>
              </Button>
              <Button
                layout="auto"
                variant="text"
                title={t('screens.contact.otpResend')}
                style={s.smallBtn}
                onPress={resendOtp}
                contentStyle={{ width: '100%' }}
              >
                <Text style={s.smallBtnLabel}>
                  {t('screens.contact.otpResend')}
                </Text>
              </Button>
              <Button
                layout="auto"
                variant="filled"
                title={t('screens.contact.otpConfirm')}
                style={[s.smallBtn, s.smallBtnPrimary]}
                onPress={onConfirmOtp}
                contentStyle={{ width: '100%' }}
              >
                <Text style={s.smallBtnLabelOnPrimary}>
                  {t('screens.contact.otpConfirm')}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
});

ContactScreen.displayName = 'ContactScreen';
