import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
import { useStartupScreenStyles } from './styles';
import { markStartupSeen } from './useStartupOnFirstLaunch';

type Props = DrawerScreenProps<DrawerParamList, 'Startup'>;

const TIMING_OPTS = { duration: 800, easing: Easing.out(Easing.cubic) };
const BREATH_DURATION = 3200;

const StartupScreenComponent = (_props: Props) => {
  const navigation = useAppNavigation();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const s = useStartupScreenStyles(colors);

  /* ── Breathing ring animation ── */
  const breathScale = useSharedValue(1);
  const breathOpacity = useSharedValue(0.18);
  const outerBreathScale = useSharedValue(1);

  /* ── Entrance animations ── */
  const badgeOpacity = useSharedValue(0);
  const badgeTranslateY = useSharedValue(-12);
  const illustrationOpacity = useSharedValue(0);
  const illustrationScale = useSharedValue(0.88);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
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

    /* Entrance sequence */
    badgeOpacity.value = withDelay(100, withTiming(1, TIMING_OPTS));
    badgeTranslateY.value = withDelay(100, withTiming(0, TIMING_OPTS));

    illustrationOpacity.value = withDelay(250, withTiming(1, TIMING_OPTS));
    illustrationScale.value = withDelay(250, withTiming(1, TIMING_OPTS));

    textOpacity.value = withDelay(500, withTiming(1, TIMING_OPTS));
    textTranslateY.value = withDelay(500, withTiming(0, TIMING_OPTS));

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
  const actionsAnimStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
    transform: [{ translateY: actionsTranslateY.value }],
  }));

  return (
    <SafeAreaView style={s.root} edges={['top', 'left', 'right', 'bottom']}>
      {/* Background atmosphere */}
      <View style={s.orbTopLeft} />
      <View style={s.orbBottomRight} />
      <View style={s.orbCenter} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Brand badge */}
        <Animated.View style={[s.badge, badgeAnimStyle]}>
          <View style={s.badgeDot} />
          <Text style={s.badgeText}>{t('screens.startup.badge')}</Text>
        </Animated.View>

        {/* Illustration with breathing rings */}
        <Animated.View style={[s.illustrationZone, illustrationAnimStyle]}>
          <Animated.View style={[s.breathingRingOuter, outerBreathRingStyle]} />
          <Animated.View style={[s.breathingRing, breathRingStyle]} />
          <MeditationIllustration size={260} />
        </Animated.View>

        {/* Text block */}
        <Animated.View style={[s.textBlock, textAnimStyle]}>
          <Text style={s.appName}>Innoghte</Text>
          <View style={s.divider} />
          <Text style={s.tagline}>{t('screens.startup.tagline')}</Text>
        </Animated.View>

        {/* CTAs */}
        <Animated.View style={[s.actions, actionsAnimStyle]}>
          <TouchableOpacity
            style={s.btnPrimary}
            activeOpacity={0.82}
            onPress={() => { markStartupSeen(); navigation.navigate('MainTabs'); }}
          >
            <Text style={s.btnPrimaryText}>{t('screens.startup.begin')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.btnSecondary}
            activeOpacity={0.75}
            onPress={() => { markStartupSeen(); navigation.navigate('Login'); }}
          >
            <Text style={s.btnSecondaryText}>{t('screens.startup.signIn')}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>{t('screens.startup.footer')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const StartupScreen = React.memo(StartupScreenComponent);
StartupScreen.displayName = 'StartupScreen';
