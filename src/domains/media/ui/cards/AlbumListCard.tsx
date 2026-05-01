import * as React from 'react';
import {Image, Pressable, View} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui/Text';

import { formatPriceForApp } from '@/shared/infra/i18n/formatLocaleNumbers';
import { CartMainButtons } from '@/shared/ui/cart/CartMainButtons';
import type { ProductListCardStyles } from '@/shared/ui/cards/productListCard.styles';
import { createProductListCardStyles } from '@/shared/ui/cards/productListCard.styles';
import type { Album } from '@/domains/media/model';

const PRICE_DISPLAY_DIVISOR = 10;

type AlbumListCardProps = {
  album: Album;
};

const AlbumTypeBadge = React.memo(function AlbumTypeBadge({
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
AlbumTypeBadge.displayName = 'AlbumTypeBadge';

const AlbumInfoRow = React.memo(function AlbumInfoRow({
  label,
  value,
  s,
}: {
  label: string;
  value: string | React.ReactNode;
  s: ProductListCardStyles;
}) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      {typeof value === 'string' ? (
        <Text style={s.infoValue} numberOfLines={3} ellipsizeMode="tail">
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
});
AlbumInfoRow.displayName = 'AlbumInfoRow';

const AlbumCardHeader = React.memo(function AlbumCardHeader({
  title,
  imageUri,
  s,
}: {
  title: string;
  imageUri: string | undefined;
  s: ProductListCardStyles;
}) {
  const [failed, setFailed] = React.useState(false);

  return (
    <View style={s.headerRow}>
      <View style={s.headerTextCol}>
        <Text style={s.title} numberOfLines={3}>
          {title}
        </Text>
      </View>
      {!failed && imageUri ? (
        <Image
          accessibilityIgnoresInvertColors
          source={{ uri: imageUri }}
          style={s.thumb}
          onError={() => {
            setFailed(true);
          }}
        />
      ) : (
        <View style={[s.thumb, s.imagePlaceholder]}>
          <Text style={s.placeholderGlyph}>▣</Text>
        </View>
      )}
    </View>
  );
});
AlbumCardHeader.displayName = 'AlbumCardHeader';

function noop(): void {}

const AlbumListCardComponent = ({ album }: AlbumListCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const s = createProductListCardStyles(colors, theme);
  const imageUri = album.image_media[0]?.src;
  const displayPrice = formatPriceForApp(
    (album.price ?? 0) / PRICE_DISPLAY_DIVISOR,
    t('courses.currency'),
  );

  return (
    <View style={s.card}>
      <AlbumCardHeader title={album.title_fa} imageUri={imageUri} s={s} />

      <View style={s.metaBlock}>
        <AlbumInfoRow
          label={t('courses.productType')}
          value={<AlbumTypeBadge isPackage={!!album.package} s={s} />}
          s={s}
        />
        <AlbumInfoRow label={t('courses.price')} value={displayPrice} s={s} />
      </View>

      <View style={s.actionsRow}>
        <CartMainButtons
          courseId={album.id}
          isFull={album.remainCapacity === 0}
          isAccessible={album.isAccessible}
          iconLeftAddToBasket={null}
          iconRightAddToBasket={null}
          iconLeftInBasket={null}
          iconRightInBasket={null}
        />
        <Pressable
          accessibilityRole="button"
          onPress={noop}
          style={({ pressed }) =>
            pressed ? [s.buttonOutlined, s.pressed] : s.buttonOutlined
          }
        >
          <Text style={s.buttonOutlinedText}>{t('courses.moreInformation')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const AlbumListCard = React.memo(AlbumListCardComponent);
AlbumListCard.displayName = 'AlbumListCard';
