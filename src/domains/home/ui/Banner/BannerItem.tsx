import * as React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { BannerStyles } from '@/domains/home/ui/Banner/banner.styles';
import { createBannerDecorationStyles } from '@/domains/home/ui/Banner/bannerItemDecoration.styles';

/** First headline line with accent segment (legacy web “آسمان” color). */
export type BannerTitleAccent = {
  before: string;
  highlight: string;
  after: string;
};

export type BannerItemData = {
  id: string;
  /** Base background (`web-back.jpg`). */
  image?: ImageSourcePropType;
  /** Decorative overlay — hanging lamp (visual left). */
  lampImage?: ImageSourcePropType;
  /** Decorative overlay — feathers / Par artwork (above fold center). */
  parImage?: ImageSourcePropType;
  /** Plain multi-line title when `titleLine1Accent` is not used. */
  title?: string;
  /** Optional split first line with themed accent highlight. */
  titleLine1Accent?: BannerTitleAccent;
  /** Second bold line below line 1 (web typography split). */
  titleRest?: string;
  subtitle1?: string;
  subtitle2?: string;
  cta?: string;
  onPress?: () => void;
  overlay?: boolean;
  accessibilityLabel?: string;
};

type BannerItemProps = {
  item: BannerItemData;
  styles: BannerStyles;
};

const HIT_SLOP = 4;

function BannerItemComponent({ item, styles }: BannerItemProps) {
  const {
    image,
    lampImage,
    parImage,
    title,
    titleLine1Accent,
    titleRest,
    subtitle1,
    subtitle2,
    cta,
    onPress,
    overlay,
    accessibilityLabel,
  } = item;

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const layeredDecor = Boolean(lampImage || parImage);

  const decorationLayout = React.useMemo(() => {
    const lampHeight = Math.min(windowHeight * 0.48, 400);
    const lampWidth = lampHeight * 0.5;
    const parSize = Math.min(windowWidth * 0.68, 280);
    const parTop = windowHeight * 0.42;
    const lampTop = -4;
    const lampLeft = Math.round(windowWidth * 0.575);
    return {
      lampHeight,
      lampWidth,
      lampTop,
      lampLeft,
      parSize,
      parTop,
    };
  }, [windowHeight, windowWidth]);

  const deco = createBannerDecorationStyles(decorationLayout);

  const hasCopy =
    Boolean(titleLine1Accent) ||
    Boolean(title) ||
    Boolean(titleRest) ||
    Boolean(subtitle1) ||
    Boolean(subtitle2) ||
    Boolean(cta);

  const showOverlay = overlay ?? hasCopy;

  const handlePress = React.useCallback(() => {
    onPress?.();
  }, [onPress]);

  const cardStyle = React.useCallback(
    ({ pressed }: { pressed: boolean }) =>
      pressed ? [styles.item, styles.itemPressed] : styles.item,
    [styles],
  );

  const ctaStyle = React.useCallback(
    ({ pressed }: { pressed: boolean }) =>
      pressed ? [styles.ctaButton, styles.ctaButtonPressed] : styles.ctaButton,
    [styles],
  );

  const ctaHeroStyle = React.useCallback(
    ({ pressed }: { pressed: boolean }) =>
      pressed
        ? [styles.ctaButtonHero, styles.ctaButtonHeroPressed]
        : styles.ctaButtonHero,
    [styles],
  );

  const renderCopyColumn = (hero: boolean) => (
    <View style={hero ? styles.heroCopy : styles.body}>
      {titleLine1Accent ? (
        <Text style={styles.title}>
          <Text>{titleLine1Accent.before}</Text>
          <Text style={styles.titleAccent}>{titleLine1Accent.highlight}</Text>
          <Text>{titleLine1Accent.after}</Text>
        </Text>
      ) : title ? (
        <Text style={styles.title} numberOfLines={6}>
          {title}
        </Text>
      ) : null}

      {titleRest ? (
        <Text style={styles.title} numberOfLines={6}>
          {titleRest}
        </Text>
      ) : null}

      {subtitle1 ? (
        <Text style={styles.subtitle} numberOfLines={6}>
          {subtitle1}
        </Text>
      ) : null}
      {subtitle2 ? (
        <Text style={styles.subtitle} numberOfLines={6}>
          {subtitle2}
        </Text>
      ) : null}

      {cta ? (
        <View style={hero ? styles.ctaRowHero : styles.ctaRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={cta}
            hitSlop={HIT_SLOP}
            onPress={handlePress}
            disabled={!onPress}
            style={
              onPress
                ? hero
                  ? ctaHeroStyle
                  : ctaStyle
                : hero
                ? styles.ctaButtonHero
                : styles.ctaButton
            }
          >
            <Text style={styles.ctaText} numberOfLines={hero ? 1 : undefined}>
              {cta}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  const backgroundBlock = image ? (
    layeredDecor ? (
      <ImageBackground
        source={image}
        style={[styles.layerRoot, styles.imageLayered]}
        imageStyle={styles.imageContent}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      >
        {showOverlay ? (
          <View style={styles.overlaySoft} pointerEvents="none" />
        ) : null}

        {lampImage ? (
          <View style={deco.lampWrap} pointerEvents="none">
            <Image
              accessibilityIgnoresInvertColors
              source={lampImage}
              resizeMode="contain"
              style={styles.lampImageFill}
            />
          </View>
        ) : null}

        {renderCopyColumn(true)}

        {parImage ? (
          <View style={deco.parAnchor} pointerEvents="none">
            <Image
              accessibilityIgnoresInvertColors
              source={parImage}
              resizeMode="contain"
              style={deco.parImage}
            />
          </View>
        ) : null}
      </ImageBackground>
    ) : (
      <ImageBackground
        source={image}
        style={styles.image}
        imageStyle={styles.imageContent}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      >
        {showOverlay ? (
          <View style={styles.overlay} pointerEvents="none" />
        ) : null}
        {hasCopy ? renderCopyColumn(false) : null}
      </ImageBackground>
    )
  ) : (
    <View style={styles.fallback}>
      <Text style={styles.fallbackGlyph}>▣</Text>
    </View>
  );

  const content = <>{backgroundBlock}</>;

  if (!onPress) {
    return <View style={styles.item}>{content}</View>;
  }

  return (
    <Pressable
      style={cardStyle}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title ?? titleRest ?? cta}
    >
      {content}
    </Pressable>
  );
}

export const BannerItem = React.memo(BannerItemComponent);
BannerItem.displayName = 'BannerItem';
