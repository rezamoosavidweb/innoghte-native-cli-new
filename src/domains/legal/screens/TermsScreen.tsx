import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { createLegalScreenStyles } from '@/domains/legal/ui/legalScreens.styles';
import { LegalBlock } from '@/domains/legal/ui/LegalBlock';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import {
  createNavScreenShellStyles,
  flashListContentGutters,
} from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'Terms'>;

type LegalStyles = ReturnType<typeof createLegalScreenStyles>;

export const TermsScreen = React.memo(function TermsScreen(_props: Props) {
  const navigation = useAppNavigation();
  const { colors } = useTheme();
  const shell = createNavScreenShellStyles(colors);
  const s = React.useMemo(() => createLegalScreenStyles(colors), [colors]);
  const { t } = useTranslation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: t('drawer.terms') });
  }, [navigation, t]);

  return (
    <ScrollView
      style={shell.safe}
      contentContainerStyle={[
        flashListContentGutters.standard,
        s.scroll,
      ]}
    >
      <View style={s.hero}>
        <Text style={s.heroTitle}>{t('screens.legal.termsTitle')}</Text>
        <Text style={s.heroLead}>{t('screens.legal.termsLead')}</Text>
      </View>
      <View style={s.band}>
        <TermsSections s={s} />
      </View>
    </ScrollView>
  );
});

const TermsSections = React.memo(function TermsSections({
  s,
}: {
  s: LegalStyles;
}) {
  return (
    <>
      <LegalBlock
        title="تعاریف اولیه"
        body="مشتری یا کاربر به شخصی گفته می‌شود که با اطلاعات کاربری خود به ثبت سفارش یا استفاده از خدمات وب‌سایت «این نقطه» اقدام کند."
        sectionTitleStyle={s.sectionTitle}
        pStyle={s.p}
      />
      <LegalBlock
        title="حریم خصوصی"
        body="وب‌سایت متعهد می‌شود در حد توان از حریم شخصی و اطلاعات خصوصی کاربران محافظت کند. با استفاده از خدمات، شما این سیاست را می‌پذیرید."
        sectionTitleStyle={s.sectionTitle}
        pStyle={s.p}
      />
      <LegalBlock
        title="حق نشر"
        body="مطالب در دسترس از طریق خدمات، از جمله متن، تصویر و محتوای تولیدشده، متعلق به وب‌سایت است. هرگونه استفاده بدون مجوز کتبی مجاز نیست."
        sectionTitleStyle={s.sectionTitle}
        pStyle={s.p}
      />
      <LegalBlock
        title="اکانت کاربری"
        body="استفاده از هر اکانت تنها توسط یک کاربر مجاز است. افزودن به سبد به‌معنای رزرو نیست و سفارش پس از تأیید نهایی و ارسال ایمیل تکمیل می‌شود."
        sectionTitleStyle={s.sectionTitle}
        pStyle={s.p}
      />
      <LegalBlock
        title="نحوه استفاده از دوره‌ها"
        body="محتوای دوره‌ها صرفاً آنلاین و مطابق قوانین مالکیت معنوی قابل استفاده است. کپی‌برداری یا توزیع غیرمجاز تخلف محسوب می‌شود."
        sectionTitleStyle={s.sectionTitle}
        pStyle={s.p}
      />
      <LegalBlock
        title="ورکشاپ‌ها و رویدادها"
        body="زمان‌بندی رویدادها پس از خرید از طریق ایمیل اطلاع‌رسانی می‌شود؛ عودت وجه یا تغییر زمان پس از خرید ممکن نیست."
        sectionTitleStyle={s.sectionTitle}
        pStyle={s.p}
      />
      <LegalBlock
        title="مالی و مجوزها"
        body="خدمات طبق قوانین ناشر آنلاین ارائه می‌شود. مسئولیت اختلال بانکی یا فنی بر عهده ارائه‌دهنده خدمت یا بانک است."
        sectionTitleStyle={s.sectionTitle}
        pStyle={s.p}
      />
      <Text style={s.p}>
        تمامی شرایط در حالت عادی معتبر است. در موارد قوه قهریه، مسئولیتی متوجه سرویس‌دهنده نیست.
      </Text>
    </>
  );
});

TermsScreen.displayName = 'TermsScreen';
TermsSections.displayName = 'TermsSections';
