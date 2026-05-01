import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { useEffect } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '@/shared/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { useThemeColors } from '@/ui/theme';

import { MeditationIllustration } from './MeditationIllustration';
import { createStartupScreenStyles } from './styles';
import { markStartupSeen } from './useStartupOnFirstLaunch';

type Props = DrawerScreenProps<DrawerParamList, 'Startup'>;

const TIMING_OPTS = { duration: 800, easing: Easing.out(Easing.cubic) };
const BREATH_DURATION = 3200;
const FLOAT_MS = 2200;

const StartupScreenComponent = (_props: Props) => {
  const navigation = useAppNavigation();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const s = createStartupScreenStyles(colors);

  /* ── Breathing ring animation ── */
  const breathScale = useSharedValue(1);
  const breathOpacity = useSharedValue(0.18);
  const outerBreathScale = useSharedValue(1);

  /* ── Ambient layer motion ── */
  const orbCenterOpacity = useSharedValue(0.38);
  const innerGlowOpacity = useSharedValue(0.045);
  const innerGlowScale = useSharedValue(1);
  const particleTranslateA = useSharedValue(0);
  const particleOpacityA = useSharedValue(0.35);
  const particleTranslateB = useSharedValue(0);
  const particleOpacityB = useSharedValue(0.42);
  const particleTranslateC = useSharedValue(0);
  const particleOpacityC = useSharedValue(0.38);

  /* ── Entrance animations ── */
  const badgeOpacity = useSharedValue(0);
  const badgeTranslateY = useSharedValue(-12);
  const illustrationOpacity = useSharedValue(0);
  const illustrationScale = useSharedValue(0.88);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const titleBarOpacity = useSharedValue(0);
  const titleBarScaleX = useSharedValue(0.2);
  const actionsOpacity = useSharedValue(0);
  const actionsTranslateY = useSharedValue(24);

  useEffect(() => {
    /* Breathing ring — continuous */
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: BREATH_DURATION, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: BREATH_DURATION, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    breathOpacity.value = withRepeat(
      withSequence(
        withTiming(0.32, { duration: BREATH_DURATION }),
        withTiming(0.12, { duration: BREATH_DURATION }),
      ),
      -1,
      false,
    );
    outerBreathScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: BREATH_DURATION + 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: BREATH_DURATION + 400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    /* Center orb pulse */
    orbCenterOpacity.value = withRepeat(
      withSequence(
        withTiming(0.54, { duration: 5600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.32, { duration: 5600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );

    /* Inner illustration glow */
    innerGlowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.09, { duration: BREATH_DURATION, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.035, { duration: BREATH_DURATION, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    innerGlowScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: BREATH_DURATION + 200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: BREATH_DURATION + 200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    const floatEase = Easing.inOut(Easing.sin);
    const floatUpDown = [
      withTiming(-10, { duration: FLOAT_MS, easing: floatEase }),
      withTiming(0, { duration: FLOAT_MS, easing: floatEase }),
    ];
    particleTranslateA.value = withRepeat(withSequence(...floatUpDown), -1, false);
    particleOpacityA.value = withRepeat(
      withSequence(withTiming(0.65, { duration: FLOAT_MS }), withTiming(0.28, { duration: FLOAT_MS })),
      -1,
      false,
    );
    particleTranslateB.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(-14, { duration: FLOAT_MS + 300, easing: floatEase }),
          withTiming(0, { duration: FLOAT_MS + 300, easing: floatEase }),
        ),
        -1,
        false,
      ),
    );
    particleOpacityB.value = withDelay(
      400,
      withRepeat(
        withSequence(withTiming(0.72, { duration: FLOAT_MS + 300 }), withTiming(0.3, { duration: FLOAT_MS + 300 })),
        -1,
        false,
      ),
    );
    particleTranslateC.value = withDelay(
      850,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: FLOAT_MS + 500, easing: floatEase }),
          withTiming(0, { duration: FLOAT_MS + 500, easing: floatEase }),
        ),
        -1,
        false,
      ),
    );
    particleOpacityC.value = withDelay(
      850,
      withRepeat(
        withSequence(withTiming(0.55, { duration: FLOAT_MS + 500 }), withTiming(0.22, { duration: FLOAT_MS + 500 })),
        -1,
        false,
      ),
    );

    /* Entrance sequence */
    badgeOpacity.value = withDelay(100, withTiming(1, TIMING_OPTS));
    badgeTranslateY.value = withDelay(100, withTiming(0, TIMING_OPTS));

    illustrationOpacity.value = withDelay(250, withTiming(1, TIMING_OPTS));
    illustrationScale.value = withDelay(250, withTiming(1, TIMING_OPTS));

    textOpacity.value = withDelay(500, withTiming(1, TIMING_OPTS));
    textTranslateY.value = withDelay(500, withTiming(0, TIMING_OPTS));
    titleBarOpacity.value = withDelay(720, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    titleBarScaleX.value = withDelay(720, withTiming(1, { duration: 700, easing: Easing.out(Easing.exp) }));

    actionsOpacity.value = withDelay(750, withTiming(1, TIMING_OPTS));
    actionsTranslateY.value = withDelay(750, withTiming(0, TIMING_OPTS));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const breathRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
    opacity: breathOpacity.value,
  }));
  const outerBreathRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: outerBreathScale.value }],
    opacity: breathOpacity.value * 0.55,
  }));
  const badgeAnimStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ translateY: badgeTranslateY.value }],
  }));
  const illustrationAnimStyle = useAnimatedStyle(() => ({
    opacity: illustrationOpacity.value,
    transform: [{ scale: illustrationScale.value }],
  }));
  const textAnimStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));
  const titleBarAnimStyle = useAnimatedStyle(() => ({
    opacity: titleBarOpacity.value,
    transform: [{ scaleX: titleBarScaleX.value }],
  }));
  const actionsAnimStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
    transform: [{ translateY: actionsTranslateY.value }],
  }));
  const orbCenterAnimStyle = useAnimatedStyle(() => ({
    opacity: orbCenterOpacity.value,
  }));
  const innerGlowAnimStyle = useAnimatedStyle(() => ({
    opacity: innerGlowOpacity.value,
    transform: [{ scale: innerGlowScale.value }],
  }));
  const particleAStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: particleTranslateA.value }],
    opacity: particleOpacityA.value,
  }));
  const particleBStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: particleTranslateB.value }],
    opacity: particleOpacityB.value,
  }));
  const particleCStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: particleTranslateC.value }],
    opacity: particleOpacityC.value,
  }));

  const illustrationPalette = React.useMemo(
    () => ({
      coolAccent: colors.ambientOrb1,
      warmAccent: colors.ambientOrb2,
      centerDisc: colors.card,
    }),
    [colors.ambientOrb1, colors.ambientOrb2, colors.card],
  );

  return (
    <SafeAreaView style={s.root} edges={['top', 'left', 'right', 'bottom']}>
      <Animated.View style={[s.orbCenterFill, orbCenterAnimStyle]} pointerEvents="none" />
      <View style={s.orbTopLeft} />
      <View style={s.orbBottomRight} />

      <Animated.View style={[s.particleA, particleAStyle]} pointerEvents="none" />
      <Animated.View style={[s.particleB, particleBStyle]} pointerEvents="none" />
      <Animated.View style={[s.particleC, particleCStyle]} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View style={[s.badge, badgeAnimStyle]}>
          <View style={s.badgeDot} />
          <Text style={s.badgeText}>{t('screens.startup.badge')}</Text>
        </Animated.View>

        <Animated.View style={[s.illustrationZone, illustrationAnimStyle]}>
          <Animated.View style={[s.innerGlow, innerGlowAnimStyle]} />
          <Animated.View style={[s.breathingRingOuter, outerBreathRingStyle]} />
          <Animated.View style={[s.breathingRing, breathRingStyle]} />
          <MeditationIllustration size={260} colors={illustrationPalette} />
        </Animated.View>

        <Animated.View style={[s.textBlock, textAnimStyle]}>
          <Text style={s.appName}>Innoghte</Text>
          <Animated.View style={[s.titleAccentBar, titleBarAnimStyle]} />
          <View style={s.divider} />
          <Text style={s.tagline}>{t('screens.startup.tagline')}</Text>
        </Animated.View>

        <Animated.View style={[s.actions, actionsAnimStyle]}>
          <TouchableOpacity
            style={s.btnPrimary}
            activeOpacity={0.82}
            onPress={() => {
              markStartupSeen();
              navigation.navigate('MainTabs');
            }}
          >
            <Text style={s.btnPrimaryText}>{t('screens.startup.begin')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.btnSecondary}
            activeOpacity={0.75}
            onPress={() => {
              markStartupSeen();
              navigation.navigate('Login');
            }}
          >
            <Text style={s.btnSecondaryText}>{t('screens.startup.signIn')}</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={s.footer}>
          <Text style={s.footerText}>{t('screens.startup.footer')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const StartupScreen = React.memo(StartupScreenComponent);
StartupScreen.displayName = 'StartupScreen';
