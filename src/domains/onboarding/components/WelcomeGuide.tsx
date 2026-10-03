import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel, {
  type ICarouselInstance,
} from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ArrowLeft from '@/assets/icons/arrow-left.svg';
import { GuideArtwork } from '@/domains/onboarding/components/GuideArtwork';
import { useWelcomeGuide } from '@/domains/onboarding/hooks/useWelcomeGuide';
import {
  guidePageIndex,
  WELCOME_SLIDES,
} from '@/domains/onboarding/model/welcomeGuide';
import { createWelcomeGuideStyles } from '@/domains/onboarding/ui/welcomeGuide.styles';
import { Text } from '@/shared/ui/Text';
import { useThemeColors } from '@/ui/theme';

export function WelcomeGuide({
  ready,
  userId,
}: {
  ready: boolean;
  userId: number | null;
}) {
  return userId === null ? null : (
    <AccountWelcomeGuide key={userId} ready={ready} userId={userId} />
  );
}

function AccountWelcomeGuide({
  ready,
  userId,
}: {
  ready: boolean;
  userId: number;
}) {
  const { visible, dismiss } = useWelcomeGuide(ready, userId);
  // Mount a fresh pager only when shown; no gestures/animations during bootstrap.
  return visible ? <WelcomeGuideModal onDismiss={dismiss} /> : null;
}

function WelcomeGuideModal({ onDismiss }: { onDismiss: () => void }) {
  const { t, i18n } = useTranslation();
  const c = useThemeColors();
  const s = React.useMemo(() => createWelcomeGuideStyles(c), [c]);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isRTL = i18n.dir() === 'rtl';
  const carousel = React.useRef<ICarouselInstance>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [viewport, setViewport] = React.useState({ width: 0, height: 0 });
  const slides = React.useMemo(
    () => (isRTL ? [...WELCOME_SLIDES].reverse() : [...WELCOME_SLIDES]),
    [isRTL],
  );
  const isLast = activeIndex === WELCOME_SLIDES.length - 1;
  const number = (value: number) => value.toLocaleString(i18n.language);

  const goTo = (index: number) => {
    carousel.current?.scrollTo({
      index: guidePageIndex(index, isRTL),
      animated: true,
    });
  };
  const measure = React.useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setViewport({ width: layout.width, height: layout.height });
    },
    [],
  );

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onDismiss}
      testID="welcome-guide-modal"
    >
      <GestureHandlerRootView
        style={[
          s.overlay,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View
          accessibilityViewIsModal
          style={[
            s.card,
            {
              width: Math.min(width - 32, 440),
              height: Math.min(710, height - insets.top - insets.bottom - 32),
            },
          ]}
        >
          <View style={s.topLine} />
          <View style={s.header}>
            <View style={s.brand}>
              <View style={s.brandDot} />
              <Text style={s.brandText}>{t('welcomeGuide.label')}</Text>
            </View>
            <Pressable
              testID="welcome-guide-skip"
              accessibilityRole="button"
              accessibilityLabel={t('welcomeGuide.skip')}
              onPress={onDismiss}
              style={({ pressed }) => [s.skip, pressed && s.pressed]}
            >
              <Text style={s.skipText}>{t('welcomeGuide.skip')}</Text>
            </Pressable>
          </View>
          <View style={s.viewport} onLayout={measure}>
            {viewport.width > 0 && viewport.height > 0 && (
              <Carousel
                key={i18n.language}
                ref={carousel}
                testID="welcome-guide-swiper"
                style={s.carousel}
                width={viewport.width}
                height={viewport.height}
                data={slides}
                defaultIndex={guidePageIndex(activeIndex, isRTL)}
                loop={false}
                overscrollEnabled={false}
                pagingEnabled
                scrollAnimationDuration={280}
                maxScrollDistancePerSwipe={viewport.width}
                onConfigurePanGesture={gesture =>
                  gesture.activeOffsetX([-15, 15]).failOffsetY([-15, 15])
                }
                onSnapToItem={index =>
                  setActiveIndex(guidePageIndex(index, isRTL))
                }
                renderItem={({ item, index }) => (
                  <ScrollView
                    testID={`welcome-guide-slide-${item}`}
                    style={s.slide}
                    contentContainerStyle={s.slideContent}
                    showsVerticalScrollIndicator={false}
                    accessibilityElementsHidden={
                      guidePageIndex(index, isRTL) !== activeIndex
                    }
                    importantForAccessibility={
                      guidePageIndex(index, isRTL) === activeIndex
                        ? 'auto'
                        : 'no-hide-descendants'
                    }
                  >
                    <View
                      style={s.artwork}
                      importantForAccessibility="no-hide-descendants"
                    >
                      <GuideArtwork slide={item} />
                    </View>
                    <View style={s.tag}>
                      <Text style={s.tagText}>
                        {t(`welcomeGuide.slides.${item}.tag`)}
                      </Text>
                    </View>
                    <Text accessibilityRole="header" style={s.title}>
                      {t(`welcomeGuide.slides.${item}.title`)}
                    </Text>
                    <Text style={s.description}>
                      {t(`welcomeGuide.slides.${item}.description`)}
                    </Text>
                    <View style={s.hint}>
                      <Text style={s.hintText}>
                        {t(`welcomeGuide.slides.${item}.hint`)}
                      </Text>
                    </View>
                  </ScrollView>
                )}
              />
            )}
          </View>
          <View style={s.footer}>
            <View style={s.pagination}>
              <View style={s.dots}>
                {WELCOME_SLIDES.map((slide, index) => (
                  <Pressable
                    key={slide}
                    testID={`welcome-guide-dot-${index}`}
                    accessibilityRole="button"
                    accessibilityLabel={t('welcomeGuide.goToSlide', {
                      number: number(index + 1),
                    })}
                    accessibilityState={{ selected: index === activeIndex }}
                    onPress={() => goTo(index)}
                    style={s.dotTarget}
                  >
                    <View
                      style={[s.dot, index === activeIndex && s.activeDot]}
                    />
                  </Pressable>
                ))}
              </View>
              <Text
                testID="welcome-guide-counter"
                accessibilityLiveRegion="polite"
                style={s.counter}
              >
                {t('welcomeGuide.progress', {
                  current: number(activeIndex + 1),
                  total: number(WELCOME_SLIDES.length),
                })}
              </Text>
            </View>
            <View style={s.actions}>
              <Pressable
                testID="welcome-guide-next"
                accessibilityRole="button"
                onPress={() => (isLast ? onDismiss() : goTo(activeIndex + 1))}
                style={({ pressed }) => [s.next, pressed && s.pressed]}
              >
                <Text style={s.nextText}>
                  {t(isLast ? 'welcomeGuide.start' : 'welcomeGuide.next')}
                </Text>
                <ArrowLeft
                  width={19}
                  height={19}
                  color={c.onPrimary}
                  style={{ transform: [{ rotate: isRTL ? '0deg' : '180deg' }] }}
                />
              </Pressable>
              {activeIndex > 0 && (
                <Pressable
                  testID="welcome-guide-previous"
                  accessibilityRole="button"
                  onPress={() => goTo(activeIndex - 1)}
                  style={({ pressed }) => [s.previous, pressed && s.pressed]}
                >
                  <Text style={s.previousText}>
                    {t('welcomeGuide.previous')}
                  </Text>
                </Pressable>
              )}
            </View>
            <Text style={s.swipeHint}>{t('welcomeGuide.swipeHint')}</Text>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
