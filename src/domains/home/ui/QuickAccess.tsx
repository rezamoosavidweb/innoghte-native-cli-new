import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  View
} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useQuickAccess } from '@/domains/home/hooks/useQuickAccess';
import type { QuickAccessItem } from '@/domains/home/model/quickAccess.dto';
import {
  QUICK_ACCESS_CARD_WIDTH,
  createQuickAccessStyles,
  type QuickAccessStyles,
} from '@/domains/home/ui/quickAccess.styles';
import { Swiper } from '@/shared/ui/Swiper';
import { spacing } from '@/ui/theme';

const HIT_SLOP = 4;

type Props = {
  /** Optional handler — defaults to opening `item.url` in the system browser. */
  onItemPress?: (item: QuickAccessItem) => void;
};

const QuickAccessComponent = ({ onItemPress }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const s = createQuickAccessStyles(colors, theme);
  const { data, isPending, isError } = useQuickAccess();

  const handleItemPress = React.useCallback(
    (item: QuickAccessItem) => {
      if (onItemPress) {
        onItemPress(item);
        return;
      }
      if (item.url) {
        Linking.openURL(item.url).catch(() => {
          /* swallow — system handles unsupported URLs */
        });
      }
    },
    [onItemPress],
  );

  const renderCard = React.useCallback(
    (item: QuickAccessItem) => (
      <QuickAccessCard item={item} s={s} onPress={handleItemPress} />
    ),
    [handleItemPress, s],
  );

  return (
    <View style={s.section}>
      <View style={s.header}>
        <Text style={s.title}>{t('screens.home.quickAccess.title')}</Text>
        <Text style={s.subtitle}>
          {t('screens.home.quickAccess.subtitle')}
        </Text>
      </View>

      {isPending ? (
        <View style={s.stateContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={s.stateContainer}>
          <Text style={s.stateText}>
            {t('screens.home.quickAccess.error')}
          </Text>
        </View>
      ) : !data || data.length === 0 ? (
        <View style={s.stateContainer}>
          <Text style={s.stateText}>
            {t('screens.home.quickAccess.empty')}
          </Text>
        </View>
      ) : (
        <Swiper<QuickAccessItem>
          data={data}
          renderItem={renderCard}
          itemWidth={QUICK_ACCESS_CARD_WIDTH}
          gap={spacing.md}
          pagination
        />
      )}
    </View>
  );
};

export const QuickAccess = React.memo(QuickAccessComponent);
QuickAccess.displayName = 'QuickAccess';

type QuickAccessCardProps = {
  item: QuickAccessItem;
  s: QuickAccessStyles;
  onPress: (item: QuickAccessItem) => void;
};

const QuickAccessCard = React.memo(function QuickAccessCard({
  item,
  s,
  onPress,
}: QuickAccessCardProps) {
  const handlePress = React.useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      hitSlop={HIT_SLOP}
      onPress={handlePress}
      style={({ pressed }) => [s.card, pressed ? s.cardPressed : null]}
    >
      <CardImage uri={item.imageUrl} s={s} />
      <View style={s.cardBody}>
        <Text style={s.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={s.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
});
QuickAccessCard.displayName = 'QuickAccessCard';

const CardImage = React.memo(function CardImage({
  uri,
  s,
}: {
  uri: string;
  s: QuickAccessStyles;
}) {
  const [loading, setLoading] = React.useState(true);
  const [errored, setErrored] = React.useState(false);

  if (!uri || errored) {
    return (
      <View style={[s.image, s.imageFallback]}>
        <Text style={s.imageGlyph}>▣</Text>
      </View>
    );
  }

  return (
    <View style={s.image}>
      <Image
        accessibilityIgnoresInvertColors
        source={{ uri }}
        style={s.imageInner}
        resizeMode="cover"
        onLoadStart={() => {
          setLoading(true);
        }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        onError={() => {
          setErrored(true);
          setLoading(false);
        }}
      />
      {loading ? (
        <View style={s.imageLoadingOverlay}>
          <ActivityIndicator />
        </View>
      ) : null}
    </View>
  );
});
CardImage.displayName = 'QuickAccessCardImage';
