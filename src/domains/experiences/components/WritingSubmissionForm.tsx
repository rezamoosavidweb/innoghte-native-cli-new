import { useTheme } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { createWriting } from '@/domains/experiences/api/experiencesApi';
import { useCurrentUser } from '@/domains/auth/hooks/useCurrentUser';
import { Text } from '@/shared/ui/Text';
import { showAppToast } from '@/shared/ui/toast';
import { Button } from '@/ui/components/Button';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const WritingSubmissionForm = React.memo(
  function WritingSubmissionForm() {
    const { colors } = useTheme();
    const userQuery = useCurrentUser();
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [info, setInfo] = React.useState('');

    React.useEffect(() => {
      const user = userQuery.data?.data;
      if (!user) return;
      setFullName(current => current || user.full_name);
      setEmail(current => current || user.email);
    }, [userQuery.data?.data]);

    const mutation = useMutation({ mutationFn: createWriting });

    const submit = React.useCallback(async () => {
      const normalizedName = fullName.trim();
      const normalizedEmail = email.trim();
      const normalizedTitle = title.trim();
      const normalizedInfo = info.trim();
      if (
        !normalizedName ||
        !EMAIL_PATTERN.test(normalizedEmail) ||
        !normalizedTitle ||
        !normalizedInfo
      ) {
        showAppToast('لطفاً همه فیلدها را با اطلاعات معتبر تکمیل کنید.', 'error');
        return;
      }
      try {
        await mutation.mutateAsync({
          full_name: normalizedName,
          email: normalizedEmail,
          title: normalizedTitle,
          info: normalizedInfo,
          status: 1,
          is_active: true,
        });
        setTitle('');
        setInfo('');
        showAppToast(
          'یادداشت روزنگار شما با موفقیت ارسال شد و پس از بررسی منتشر می‌شود.',
          'success',
        );
      } catch {
        showAppToast('ارسال یادداشت انجام نشد. دوباره تلاش کنید.', 'error');
      }
    }, [email, fullName, info, mutation, title]);

    const inputStyle = [
      styles.input,
      { color: colors.text, borderColor: colors.border, backgroundColor: colors.card },
    ];

    return (
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={[styles.heading, { color: colors.text }]}>فرم ارسال روزنگار</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          اگر تجربه‌ای در زمینه ژورنال‌نویسی دارید، آن را برای بررسی و اشتراک با دیگران ارسال کنید.
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>نام *</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={inputStyle}
          textAlign="right"
          placeholder="نام و نام خانوادگی"
          placeholderTextColor={colors.border}
        />

        <Text style={[styles.label, { color: colors.text }]}>آدرس ایمیل *</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={[inputStyle, styles.ltr]}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="name@example.com"
          placeholderTextColor={colors.border}
        />

        <Text style={[styles.label, { color: colors.text }]}>عنوان *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={inputStyle}
          textAlign="right"
          placeholder="عنوان یادداشت"
          placeholderTextColor={colors.border}
        />

        <Text style={[styles.label, { color: colors.text }]}>شرح مطلب *</Text>
        <TextInput
          value={info}
          onChangeText={setInfo}
          style={[inputStyle, styles.multiline]}
          textAlign="right"
          textAlignVertical="top"
          multiline
          maxLength={2000}
          placeholder="اینجا بنویسید..."
          placeholderTextColor={colors.border}
        />
        <Text style={[styles.counter, { color: colors.text }]}>{info.length}/۲۰۰۰</Text>

        <Button
          title="ثبت نظر"
          layout="auto"
          loading={mutation.isPending}
          onPress={() => {
            submit().catch(() => {});
          }}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    gap: 10,
    marginTop: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 18,
  },
  heading: {
    textAlign: 'center',
    fontSize: 23,
    fontWeight: '800',
  },
  description: {
    textAlign: 'justify',
    writingDirection: 'rtl',
    lineHeight: 25,
    marginBottom: 8,
  },
  label: {
    textAlign: 'right',
    fontWeight: '700',
    marginTop: 5,
  },
  input: {
    minHeight: 52,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  ltr: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  multiline: {
    minHeight: 150,
    paddingTop: 12,
  },
  counter: {
    textAlign: 'left',
    opacity: 0.65,
  },
});
