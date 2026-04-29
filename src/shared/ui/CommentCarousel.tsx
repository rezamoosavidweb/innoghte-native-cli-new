import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Dimensions,
  I18nManager,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Carousel, {
  type ICarouselInstance,
} from 'react-native-reanimated-carousel';

import {
  fontSize,
  fontWeight,
  lineHeight,
  pickSemantic,
  radius,
  spacing,
} from '@/ui/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DEFAULT_HEIGHT = 200;
const DEFAULT_AUTOPLAY_INTERVAL = 3500;
const DEFAULT_RESUME_DELAY = 4000;
const DEFAULT_CONTENT_LINES = 5;
const DEFAULT_SCROLL_ANIMATION_MS = 500;

export type CommentItem = {
  user?: string | null;
  createdAt?: string | null;
  courseTitle?: string | null;
  content: string;
};

export type CommentCarouselProps = {
  data: ReadonlyArray<CommentItem>;
  /** Auto rotate cards. */
  autoPlay?: boolean;
  /** Auto rotate interval (ms). */
  autoPlayInterval?: number;
  /** Infinite loop scrolling. */
  loop?: boolean;
  /** Carousel viewport height. */
  height?: number;
  /** Carousel viewport width — defaults to screen width. */
  width?: number;
  /** Press handler — when provided, cards become Pressable. */
  onPressItem?: (item: CommentItem, index: number) => void;
  /** Fired when the active item changes. */
  onIndexChange?: (index: number) => void;
  /** Fallback text shown when `data` is empty. */
  emptyText?: string;
  /** Fallback for missing user names. */
  anonymousLabel?: string;
  /** Lines to clamp comment body to. */
  numberOfLines?: number;
  /** Delay before autoplay resumes after user interaction (ms). */
  resumeDelay?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function CommentCarouselBase({
  data,
  autoPlay = false,
  autoPlayInterval = DEFAULT_AUTOPLAY_INTERVAL,
  loop = true,
  height = DEFAULT_HEIGHT,
  width,
  onPressItem,
  onIndexChange,
  emptyText = 'No comments yet',
  anonymousLabel = 'Anonymous',
  numberOfLines = DEFAULT_CONTENT_LINES,
  resumeDelay = DEFAULT_RESUME_DELAY,
  style,
  testID,
}: CommentCarouselProps) {
  const { colors, dark } = useTheme();
  const styles = useCommentCarouselStyles(colors, dark);

  const carouselRef = React.useRef<ICarouselInstance>(null);
  const resumeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [isPaused, setIsPaused] = React.useState(false);

  const itemCount = data.length;
  const containerWidth = width ?? SCREEN_WIDTH;
  const canLoop = loop && itemCount > 1;
  const canAutoPlay = autoPlay && !isPaused && itemCount > 1;
  const isRTL = I18nManager.isRTL;

  const clearResumeTimer = React.useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const pauseAutoPlay = React.useCallback(() => {
    if (!autoPlay) return;
    clearResumeTimer();
    setIsPaused(true);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      resumeTimerRef.current = null;
    }, resumeDelay);
  }, [autoPlay, clearResumeTimer, resumeDelay]);

  React.useEffect(() => clearResumeTimer, [clearResumeTimer]);

  const handlePressItem = React.useCallback(
    (item: CommentItem, index: number) => {
      pauseAutoPlay();
      onPressItem?.(item, index);
    },
    [onPressItem, pauseAutoPlay],
  );

  const cardOnPress = onPressItem ? handlePressItem : undefined;

  const renderItem = React.useCallback(
    ({ item, index }: { item: CommentItem; index: number }) => (
      <CommentCard
        item={item}
        index={index}
        styles={styles}
        anonymousLabel={anonymousLabel}
        numberOfLines={numberOfLines}
        onPress={cardOnPress}
      />
    ),
    [anonymousLabel, cardOnPress, numberOfLines, styles],
  );

  if (itemCount === 0) {
    return (
      <View
        style={[styles.empty, { height, width: containerWidth }, style]}
        testID={testID}
      >
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Carousel
        ref={carouselRef}
        data={data as CommentItem[]}
        loop={canLoop}
        autoPlay={canAutoPlay}
        autoPlayInterval={autoPlayInterval}
        autoPlayReverse={isRTL}
        width={containerWidth}
        height={height}
        pagingEnabled
        snapEnabled
        windowSize={3}
        scrollAnimationDuration={DEFAULT_SCROLL_ANIMATION_MS}
        onScrollStart={pauseAutoPlay}
        onSnapToItem={onIndexChange}
        renderItem={renderItem}
      />
    </View>
  );
}

export const CommentCarousel = React.memo(CommentCarouselBase);
CommentCarousel.displayName = 'CommentCarousel';

type CommentCarouselStyles = ReturnType<typeof useCommentCarouselStyles>;

type CommentCardProps = {
  item: CommentItem;
  index: number;
  styles: CommentCarouselStyles;
  anonymousLabel: string;
  numberOfLines: number;
  onPress?: (item: CommentItem, index: number) => void;
};

const CommentCard = React.memo(function CommentCard({
  item,
  index,
  styles,
  anonymousLabel,
  numberOfLines,
  onPress,
}: CommentCardProps) {
  const handlePress = React.useCallback(() => {
    onPress?.(item, index);
  }, [index, item, onPress]);

  const userLabel =
    typeof item.user === 'string' && item.user.trim().length > 0
      ? item.user
      : anonymousLabel;

  const dateLabel =
    typeof item.createdAt === 'string' && item.createdAt.trim().length > 0
      ? item.createdAt
      : null;

  const courseLabel =
    typeof item.courseTitle === 'string' && item.courseTitle.trim().length > 0
      ? item.courseTitle
      : null;

  const cardStyleFn = React.useCallback(
    ({ pressed }: { pressed: boolean }) =>
      pressed ? [styles.card, styles.cardPressed] : styles.card,
    [styles],
  );

  return (
    <Pressable
      style={onPress ? cardStyleFn : styles.card}
      onPress={onPress ? handlePress : undefined}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={userLabel}
    >
      <View style={styles.headerRow}>
        <Text style={styles.userText} numberOfLines={1}>
          {userLabel}
        </Text>
        {dateLabel ? (
          <Text style={styles.dateText} numberOfLines={1}>
            {dateLabel}
          </Text>
        ) : null}
      </View>

      {courseLabel ? (
        <Text style={styles.courseText} numberOfLines={1}>
          {courseLabel}
        </Text>
      ) : null}

      <Text style={styles.contentText} numberOfLines={numberOfLines}>
        {item.content}
      </Text>
    </Pressable>
  );
});
CommentCard.displayName = 'CommentCard';

function useCommentCarouselStyles(
  themeColors: ReturnType<typeof useTheme>['colors'],
  dark: boolean,
) {
  const s = pickSemantic(dark);

  return React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: '100%',
        },
        empty: {
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.xl,
        },
        emptyText: {
          fontSize: fontSize.md,
          color: s.textMuted,
          textAlign: 'center',
        },
        card: {
          flex: 1,
          marginHorizontal: spacing.base,
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.md,
          borderRadius: radius.xl,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: themeColors.border,
          backgroundColor: themeColors.card,
          gap: spacing.xs + 2,
        },
        cardPressed: {
          opacity: 0.92,
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
        },
        userText: {
          flexShrink: 1,
          fontSize: fontSize.base,
          fontWeight: fontWeight.bold,
          color: themeColors.text,
        },
        dateText: {
          fontSize: fontSize.xs,
          color: s.textMuted,
        },
        courseText: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.semibold,
          color: themeColors.primary,
        },
        contentText: {
          flexShrink: 1,
          fontSize: fontSize.md,
          lineHeight: lineHeight.relaxed,
          color: s.textSecondary,
        },
      }),
    [
      themeColors.border,
      themeColors.card,
      themeColors.primary,
      themeColors.text,
      s,
    ],
  );
}
