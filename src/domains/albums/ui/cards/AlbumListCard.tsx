import * as React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/shared/ui/Text';

import {
  formatNumberForApp,
  formatPriceForApp,
} from '@/shared/infra/i18n/formatLocaleNumbers';
import { CartMainButtons } from '@/shared/ui/cart/CartMainButtons';
import type { ProductListCardStyles } from '@/shared/ui/cards/productListCard.styles';
import { createProductListCardStyles } from '@/shared/ui/cards/productListCard.styles';
import { CatalogListItemCard } from '@/shared/ui/cards/CatalogListItemCard';
import type { Album } from '@/domains/albums/model';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';

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

const AlbumListCardComponent = ({ album }: AlbumListCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const s = React.useMemo(() => createProductListCardStyles(colors, theme), [colors, theme]);
  const navigation = useAppNavigation();

  const onPressPrimary = React.useCallback(() => {
    navigation.navigate('AlbumDetail', { albumId: album.id });
  }, [navigation, album.id]);

  const onPressSecondary = React.useCallback(() => {
    navigation.navigate('PublicAlbumDetail', { albumId: album.id });
  }, [navigation, album.id]);

  const imageUri = album.image_media[0]?.src;
  const displayPrice = formatPriceForApp(
    (album.price ?? 0) / PRICE_DISPLAY_DIVISOR,
    t('courses.currency'),
  );

  const metaBlock = React.useMemo(
    () => (
      <>
        <AlbumInfoRow
          label={t('courses.productType')}
          value={<AlbumTypeBadge isPackage={!!album.package} s={s} />}
          s={s}
        />
        {album.itemsCount !== undefined ? (
          <AlbumInfoRow
            label={t('screens.albums.itemsCountLabel')}
            value={formatNumberForApp(album.itemsCount)}
            s={s}
          />
        ) : null}
        <AlbumInfoRow label={t('courses.price')} value={displayPrice} s={s} />
      </>
    ),
    [album.itemsCount, album.package, displayPrice, s, t],
  );

  const cartSlot = React.useMemo(
    () => (
      <CartMainButtons
        courseId={album.id}
        isFull={album.remainCapacity === 0}
        isAccessible={album.isAccessible}
        showBtnText={t('screens.albums.viewAlbum')}
        onPressPrimary={onPressPrimary}
        iconLeftAddToBasket={null}
        iconRightAddToBasket={null}
        iconLeftInBasket={null}
        iconRightInBasket={null}
      />
    ),
    [album.id, album.isAccessible, album.remainCapacity, onPressPrimary, t],
  );

  return (
    <CatalogListItemCard
      title={album.title_fa}
      imageUri={imageUri}
      styles={s}
      metaBlock={metaBlock}
      cartSlot={cartSlot}
      showSecondaryButton={!album.isAccessible}
      secondaryButtonText={t('screens.albums.moreInformation')}
      onPressSecondary={onPressSecondary}
    />
  );
};

export const AlbumListCard = React.memo(AlbumListCardComponent);
AlbumListCard.displayName = 'AlbumListCard';
