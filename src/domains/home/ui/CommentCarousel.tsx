import { Text } from '@/shared/ui/Text';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Dimensions,
  I18nManager,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Carousel, {
  type ICarouselInstance,
} from 'react-native-reanimated-carousel';

import {
  createCommentCarouselEmptyLayout,
  createCommentCarouselStyles,
} from '@/domains/home/ui/commentCarousel.styles';
import { CommentCard, CommentItem } from '@/ui/components/CommentCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
export const DEFAULT_HEIGHT = 200;
export const DEFAULT_AUTOPLAY_INTERVAL = 3500;
const DEFAULT_RESUME_DELAY = 4000;
const DEFAULT_CONTENT_LINES = 17;
const DEFAULT_SCROLL_ANIMATION_MS = 500;

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
  onIndexChange,
  emptyText = 'No comments yet',
  anonymousLabel = 'Anonymous',
  numberOfLines = DEFAULT_CONTENT_LINES,
  resumeDelay = DEFAULT_RESUME_DELAY,
  style,
  testID,
}: CommentCarouselProps) {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createCommentCarouselStyles(colors, theme);

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

  const renderItem = React.useCallback(
    ({ item, index }: { item: CommentItem; index: number }) => (
      <CommentCard
        content={item.content}
        courseTitle={item.courseTitle}
        createdAt={item.createdAt}
        writer={item.user}
        index={index}
        starColor={colors.primary}
        anonymousLabel={anonymousLabel}
        numberOfLines={numberOfLines}
      />
    ),
    [anonymousLabel, colors.primary, numberOfLines],
  );

  if (itemCount === 0) {
    const emptyLayout = createCommentCarouselEmptyLayout(
      height,
      containerWidth,
    );
    return (
      <View style={[styles.empty, emptyLayout.frame, style]} testID={testID}>
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
