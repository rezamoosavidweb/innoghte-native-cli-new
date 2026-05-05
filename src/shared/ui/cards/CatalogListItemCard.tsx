import * as React from 'react';
import { Image, View } from 'react-native';

import type { ProductListCardStyles } from '@/shared/ui/cards/productListCard.styles';
import { Text } from '@/shared/ui/Text';
import { Button } from '@/ui/components/Button';

export type CatalogListItemCardProps = {
  title: string;
  imageUri: string | undefined;
  /** When set, a star row is shown under the title (e.g. course rating). */
  showSecondaryButton: boolean;
  starLabel?: string;
  styles: ProductListCardStyles;
  metaBlock: React.ReactNode;
  cartSlot: React.ReactNode;
  secondaryButtonText: string;
  onPressSecondary: () => void;
};

const CatalogCardHeader = React.memo(function CatalogCardHeader({
  title,
  imageUri,
  starLabel,
  s,
}: {
  title: string;
  imageUri: string | undefined;
  starLabel?: string;
  s: ProductListCardStyles;
}) {
  const [failed, setFailed] = React.useState(false);

  return (
    <View style={s.headerRow}>
      <View style={s.headerTextCol}>
        <Text style={s.title} numberOfLines={3}>
          {title}
        </Text>
        {starLabel ? <Text style={s.stars}>{starLabel}</Text> : null}
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
CatalogCardHeader.displayName = 'CatalogCardHeader';

const CatalogListItemCardComponent = ({
  title,
  imageUri,
  showSecondaryButton,
  starLabel,
  styles: s,
  metaBlock,
  cartSlot,
  secondaryButtonText,
  onPressSecondary,
}: CatalogListItemCardProps) => {
  return (
    <View style={s.card}>
      <CatalogCardHeader
        title={title}
        imageUri={imageUri}
        starLabel={starLabel}
        s={s}
      />

      <View style={s.metaBlock}>{metaBlock}</View>

      <View style={s.actionsRow}>
        {cartSlot}
        {true && (
          <Button
            layout="auto"
            variant="outlined"
            title={secondaryButtonText}
            onPress={onPressSecondary}
            style={s.secondaryBtn}
          />
        )}
      </View>
    </View>
  );
};

export const CatalogListItemCard = React.memo(CatalogListItemCardComponent);
CatalogListItemCard.displayName = 'CatalogListItemCard';
