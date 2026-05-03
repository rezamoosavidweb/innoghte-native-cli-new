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

type Props = DrawerScreenProps<DrawerParamList, 'Copyright'>;

type LegalStyles = ReturnType<typeof createLegalScreenStyles>;

export const CopyrightScreen = React.memo(function CopyrightScreen(
  _props: Props,
) {
  const navigation = useAppNavigation();
  const { colors } = useTheme();
  const shell = createNavScreenShellStyles(colors);
  const s = React.useMemo(() => createLegalScreenStyles(colors), [colors]);
  const { t } = useTranslation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: t('drawer.copyright') });
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
        <Text style={s.heroTitle}>{t('screens.legal.copyrightTitle')}</Text>
        <Text style={s.heroLead}>{t('screens.legal.copyrightLead')}</Text>
      </View>
      <View style={s.band}>
        <LegalBlock
          title="جایگاه معنوی آثار"
          body="آثار فکری و آموزشی فراتر از یک فایل دیجیتال‌اند؛ حاصل اندیشه و تلاش خالق هستند. استفاده بدون اجازه و پرداخت به حقوق خالق آسیب می‌زند و شأن استفاده‌کننده را نیز مخدوش می‌کند."
          sectionTitleStyle={s.sectionTitle}
          pStyle={s.p}
        />
        <LegalBlock
          title="تعهد و پرداخت"
          body="پرداخت هزینه فراتر از تراکنش مالی است؛ نشانهٔ آمادگی برای ارتباط مؤثر با محتواست. آنچه بی‌زحمت به‌دست آید در اعماق وجود ریشه نمی‌دواند."
          sectionTitleStyle={s.sectionTitle}
          pStyle={s.p}
        />
        <LegalBlock
          title="انتخاب: اصالت یا تقلید؟"
          body="ما دعوت می‌کنیم مسیر آگاهانه انتخاب شود: اصالت و تعهد درونی، یا مسیر تقلید که به رکود منجر می‌شود."
          sectionTitleStyle={s.sectionTitle}
          pStyle={s.p}
        />
        <LegalBlock
          title="درخواست ما"
          body="از کپی‌برداری غیرمجاز پرهیز کنید؛ با احترام و آگاهی بهای اثر را بپردازید. یادآوری محترمانهٔ حقوق مؤلف در موارد تخلف، بذر آگاهی اجتماعی می‌کارد."
          sectionTitleStyle={s.sectionTitle}
          pStyle={s.p}
        />
        <LegalBlock
          title="خارج از کشور"
          body="در صورت اقامت خارج از ایران، لطفاً دوره‌ها را با قیمت و مسیر رسمی مربوطه تهیه کنید تا به حقوق خالف و مسیر رشدتان احترام گذاشته شود."
          sectionTitleStyle={s.sectionTitle}
          pStyle={s.p}
        />
      </View>
    </ScrollView>
  );
});

CopyrightScreen.displayName = 'CopyrightScreen';
