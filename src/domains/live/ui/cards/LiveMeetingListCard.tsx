import * as React from 'react';
import {Image, View} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui/Text';

import { formatPriceForApp } from '@/shared/infra/i18n/formatLocaleNumbers';
import { isProductPurchased } from '@/shared/purchases';
import type { ProductListCardStyles } from '@/shared/ui/cards/productListCard.styles';
import { createProductListCardStyles } from '@/shared/ui/cards/productListCard.styles';
import type { LiveMeetingType } from '@/domains/live/model/liveMeeting.entities';
import { Button } from '@/ui/components/Button';

const PRICE_DISPLAY_DIVISOR = 10;

type Props = { item: LiveMeetingType };

const TypeBadge = React.memo(function TypeBadge({
  isPackage,
  s,
}: {
  isPackage: boolean;
  s: ProductListCardStyles;
}) {
  const { t } = useTranslation();
  const label = isPackage ? t('courses.package') : t('courses.normal');
  return (
    <View style={[s.badge, isPackage ? s.badgePackage : null]}>
      <Text style={s.badgeText}>{label}</Text>
    </View>
  );
});
TypeBadge.displayName = 'TypeBadge';

function noop(): void {}

const LiveMeetingListCardComponent = ({ item }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const s = createProductListCardStyles(colors, theme);
  const purchased = isProductPurchased(item.id);
  const uri = item.image_media[0]?.src;
  const [failed, setFailed] = React.useState(false);
  const price = formatPriceForApp(
    (item.price ?? 0) / PRICE_DISPLAY_DIVISOR,
    t('courses.currency'),
  );

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View style={s.headerTitleOnly}>
          <Text style={s.title} numberOfLines={3}>
            {item.title_fa}
          </Text>
        </View>
        {!failed && uri ? (
          <Image
            source={{ uri }}
            style={s.thumb}
            onError={() => {
              setFailed(true);
            }}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={[s.thumb, s.imagePlaceholder]}>
            <Text style={s.placeholderGlyph}>▣</Text>
          </View>
        )}
      </View>
      <View style={s.metaBlock}>
        <View style={s.infoRow}>
          <Text style={s.infoLabel}>{t('courses.productType')}</Text>
          <TypeBadge isPackage={!!item.package} s={s} />
        </View>
        <View style={s.infoRow}>
          <Text style={s.infoLabel}>{t('courses.price')}</Text>
          <Text style={s.infoValue}>{price}</Text>
        </View>
      </View>
      <View style={s.actionsRow}>
        {purchased ? (
          <Button
            layout="auto"
            variant="filled"
            title={t('courses.show')}
            onPress={noop}
            style={s.buttonPrimary}
            contentStyle={{ width: '100%' }}
          >
            <Text style={s.buttonPrimaryText}>{t('courses.show')}</Text>
          </Button>
        ) : (
          <>
            <Button
              layout="auto"
              variant="outlined"
              title={t('courses.moreInformation')}
              onPress={noop}
              style={s.buttonOutlined}
              contentStyle={{ width: '100%' }}
            >
              <Text style={s.buttonOutlinedText}>
                {t('courses.moreInformation')}
              </Text>
            </Button>
            <Button
              layout="auto"
              variant="filled"
              title={t('courses.buy')}
              onPress={noop}
              style={s.buttonSuccess}
              contentStyle={{ width: '100%' }}
            >
              <Text style={s.buttonSuccessText}>{t('courses.buy')}</Text>
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export const LiveMeetingListCard = React.memo(LiveMeetingListCardComponent);
LiveMeetingListCard.displayName = 'LiveMeetingListCard';
