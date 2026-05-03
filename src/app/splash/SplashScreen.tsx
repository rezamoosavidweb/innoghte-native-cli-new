import { CommonActions } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import LogoSvg from '@/assets/logo.svg';
import { useThemeColors } from '@/ui/theme';

import { useAuthBootstrap } from '@/app/bridge/auth/useAuthBootstrap';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';

const LOGO_SIZE = 120;
const MIN_DISPLAY_MS = 1200;
const DOT_PULSE_MS = 480;
const ENTER_MS = 640;

const SplashScreenComponent = () => {
  const navigation = useAppNavigation();
  const colors = useThemeColors();
  const authStatus = useAuthBootstrap();
  const [minTimeElapsed, setMinTimeElapsed] = React.useState(false);

  /* ── Logo entrance: fade + gentle scale ── */
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.78);

  /* ── Loading dots (staggered pulse) ── */
  const dot1 = useSharedValue(0.25);
  const dot2 = useSharedValue(0.25);
  const dot3 = useSharedValue(0.25);

  React.useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    logoOpacity.value = withTiming(1, { duration: ENTER_MS, easing: ease });
    logoScale.value = withTiming(1, { duration: ENTER_MS + 80, easing: ease });

    const pulse = (delay: number) =>
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: DOT_PULSE_MS }),
            withTiming(0.25, { duration: DOT_PULSE_MS }),
          ),
          -1,
          false,
        ),
      );

    dot1.value = pulse(180);
    dot2.value = pulse(360);
    dot3.value = pulse(540);

    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
    // shared values are stable refs — safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Navigate once auth is resolved AND minimum time has passed ── */
  React.useEffect(() => {
    if (!minTimeElapsed || authStatus === 'checking') return;

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: authStatus === 'authenticated' ? 'MainTabs' : 'AuthEntry' },
        ],
      }),
    );
  }, [minTimeElapsed, authStatus, navigation]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <LogoSvg width={LOGO_SIZE} height={LOGO_SIZE} />
      </Animated.View>

      <View style={styles.dots}>
        <Animated.View
          style={[styles.dot, { backgroundColor: colors.primary }, dot1Style]}
        />
        <Animated.View
          style={[styles.dot, { backgroundColor: colors.primary }, dot2Style]}
        />
        <Animated.View
          style={[styles.dot, { backgroundColor: colors.primary }, dot3Style]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 52,
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export const SplashScreen = React.memo(SplashScreenComponent);
SplashScreen.displayName = 'SplashScreen';
