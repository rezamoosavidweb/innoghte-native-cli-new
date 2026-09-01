import * as React from 'react';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { Text } from '@/shared/ui/Text';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

const portrait = require('@/assets/images/about/Hosein-Aura.png');
const signature = require('@/assets/images/about/Signiture.png');

type Props = DrawerScreenProps<DrawerParamList, 'About'>;

const FIRST_STORY =
  'من حسین هستم، متولد ۱۳۶۴ تهران، دارای لیسانس معماری از دانشگاه بابلسر و فوق‌لیسانس معماری از دانشگاه A&M تگزاس. در بیست‌ونه‌سالگی همه چیزهایی را که روزی آرزوی داشتنشان را داشتم و فکر می‌کردم با داشتن آن‌ها خوشحال خواهم شد، داشتم؛ خانه، اقامت آمریکا، اتومبیل خوب و شغلی عالی در یک شرکت عالی. بااین‌حال هنوز خوشحال نبودم. زندگی آسانی داشتم، اما بدون شور و شوق و حتی بدون درد. می‌دانستم زندگی باید بیشتر از کار کردن و پرداخت قبض باشد و زندگی بدون درد لزوماً زندگی خوبی نیست. پس زندگی خوب، خوشحالی و سعادت چیست؟ کنجکاو شدم تا جواب سؤال‌ها را پیدا کنم: خوشحالی واقعی چیست و ریشه ناخوشی‌هایم کجاست؟';

const SECOND_STORY =
  'همان روزها کتابی از مایکل سینگر به نام «روح تسخیرناپذیر» به دستم رسید. بارها و بارها آن را خواندم و دریافتم این کتاب همان چیزی است که نیاز دارم. سینگر نوشته بود ما افکارمان نیستیم، نقاد درونی می‌تواند از درون ما را فرسوده کند، خوشحالی را باید تمرین کرد و ریشه بسیاری از مشکلات، ذهن انسان است. جمله دیگری از او پس از سال‌ها هنوز چراغ راه من است: «ما کار درونی برای انجام دادن داریم.» تا آن روز اصلاً نمی‌دانستم درون چیست؛ فکر می‌کردم شرایط بیرونی مسئول آرامش و خوشحالی من هستند و باید محیط را آن‌قدر دست‌کاری کنم تا شبیه چیزی شود که می‌خواهم. پس برای نخستین بار چشمم به دنیای درونی خودم افتاد؛ دنیایی زیباتر، پیچیده‌تر و ناشناخته‌تر از دنیای بیرون، شبیه آنچه مولانا سال‌ها پیش نشان داده بود:';

const FINAL_STORY =
  'همیشه از معنا و مفهوم ساده این شعر گذشته بودم و حتی لحظه‌ای به آن فکر نکرده بودم. کم‌کم کنجکاو شدم و برای کشف دنیای درون خودم، از این کلاس به آن کلاس، از این ورکشاپ به آن ورکشاپ و از کتابی به کتاب دیگر رفتم؛ هر راهی را که می‌توانست نوری به دنیای درونم بتاباند طی کردم تا مسیر خودشناسی، آگاهی و دانایی را پیدا کنم. اکنون حس می‌کنم موفق شده‌ام و البته هنوز در مسیرم و در مسیر خواهم ماند. سال ۲۰۲۰ تصمیم گرفتم تجربه‌هایم را با دوستانم به اشتراک بگذارم و اوایل سال ۲۰۲۱ فعالیتم را در اینستاگرام آغاز کردم. همواره سپاسگزار خدای بزرگ و شما دوستانم هستم که از حمایت دست نکشیدید. امروز مصمم‌تر، نیرومندتر و آگاه‌تر از قبل مسیر خودشناسی را ادامه می‌دهم و امیدوارم همچنان در این مسیر با من همراه باشید.';

const AboutScreenComponent = (_props: Props) => {
  const { colors } = useTheme();
  const dividerColor = hexAlpha(colors.text, 0.22);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>آشنایی با حسین</Text>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <Text style={[styles.subtitle, { color: colors.text }]}>
          با مدیر و مؤسس «این نقطه»، حسین اُرا، بیشتر آشنا شوید.
        </Text>
      </View>

      <Text style={[styles.story, { color: colors.text }]}>{FIRST_STORY}</Text>
      <Text style={[styles.story, { color: colors.text }]}>{SECOND_STORY}</Text>

      <View
        style={[
          styles.poem,
          {
            borderColor: dividerColor,
            backgroundColor: hexAlpha(colors.primary, 0.08),
          },
        ]}
      >
        <Text style={[styles.verse, { color: colors.text }]}>ای برادر تو همان اندیشه‌ای</Text>
        <Text style={[styles.verse, { color: colors.text }]}>مابقی تو استخوان و ریشه‌ای</Text>
        <Text style={[styles.verse, { color: colors.text }]}>گر گُل است اندیشهٔ تو، گلشنی</Text>
        <Text style={[styles.verse, { color: colors.text }]}>ور بُوَد خاری، تو هیمهٔ گلخنی</Text>
      </View>

      <Text style={[styles.story, { color: colors.text }]}>{FINAL_STORY}</Text>

      <View style={styles.portraitStage}>
        <Image
          source={portrait}
          style={styles.portrait}
          resizeMode="contain"
          accessibilityLabel="حسین اُرا، مدیر و مؤسس این نقطه"
        />
        <Image
          source={signature}
          style={[styles.signature, { opacity: 0.58 }]}
          resizeMode="contain"
          accessibilityLabel="امضای حسین اُرا"
        />
      </View>
    </ScrollView>
  );
};

export const AboutScreen = React.memo(AboutScreenComponent);
AboutScreen.displayName = 'AboutScreen';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 0,
    gap: 20,
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 27,
    textAlign: 'center',
  },
  story: {
    fontSize: 15,
    lineHeight: 29,
    textAlign: 'justify',
    writingDirection: 'rtl',
  },
  poem: {
    alignSelf: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 8,
  },
  verse: {
    fontSize: 17,
    lineHeight: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  portraitStage: {
    width: '100%',
    aspectRatio: 1.12,
    marginTop: 4,
    overflow: 'hidden',
  },
  portrait: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  signature: {
    position: 'absolute',
    left: -18,
    bottom: 14,
    width: '62%',
    height: 82,
  },
});
