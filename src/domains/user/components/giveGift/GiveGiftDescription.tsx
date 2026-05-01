import {View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { GiveGiftStyles } from '@/domains/user/ui/giveGiftScreen.styles';

const DESCRIPTION_LINES = [
  'همراه عزیز سلام',
  'در این بخش از پنل کاربری، می‌توانید اشتراک دوره‌ها را برای دوستان خود به عنوان هدیه خریداری نمایید.',
  'لطفاً اطلاعات شامل (نام، شماره تماس، آدرس ایمیل و ...) هدیه‌گیرنده را آماده داشته باشید.',
  'تهیه هدیه از ایران و در وب‌سایت innoghte.ir تنها برای کاربران داخل ایران امکان‌پذیر است.',
  'تهیه هدیه از خارج از ایران و در وب‌سایت innoghte.com برای کاربران از سراسر دنیا بلامانع است.',
  'لطفاً اطلاعات هدیه‌گیرنده را با دقت وارد کنید و چنانچه ایمیل هدیه‌گیرنده را اشتباه وارد کنید،',
  'مسئولیت آن به عهده شماست و جابجایی هدیه خریداری‌شده امکان‌پذیر نمی‌باشد.',
  'پس از اهدا دوره، رسید تأیید سفارش به آدرس ایمیل هدیه‌دهنده و هدیه‌گیرنده ارسال می‌شود.',
  'هدیه خریداری‌شده بلافاصله در اکانت هدیه‌گیرنده به شرط آنکه قبلاً در وب‌سایت ثبت‌نام کرده باشد، فعال می‌شود.',
  'هدیه خریداری‌شده برای هدیه‌گیرنده‌ای که در وب‌سایت اکانت ندارد، پس از ایجاد اکانت کاربری فعال می‌شود.',
  'لطفاً با توجه به توضیحات فوق و با استفاده از فرم زیر برای خرید اشتراک هدیه اقدام نمایید.',
] as const;

function descriptionLineUsesBullet(index: number): boolean {
  return index > 1 && index !== 6;
}

type Props = { styles: GiveGiftStyles };

export function GiveGiftDescription({ styles }: Props) {
  return (
    <View style={styles.descriptionWrap}>
      {DESCRIPTION_LINES.map((textLine, index) => (
        <View key={index} style={styles.descriptionRow}>
          <Text style={styles.descriptionText}>
            {descriptionLineUsesBullet(index)
              ? `\u2022  ${textLine}`
              : textLine}
          </Text>
        </View>
      ))}
    </View>
  );
}
