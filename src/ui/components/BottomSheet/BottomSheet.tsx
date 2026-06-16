import * as React from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/ui/theme/core/spacing';
import { useThemeColors } from '@/ui/theme';

import { createBottomSheetStyles } from './BottomSheet.styles';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Extra style for the sheet card (e.g. flow-specific padding). */
  cardStyle?: StyleProp<ViewStyle>;
  /** Delay (ms) before the dimmed backdrop fades in after the sheet starts rising. */
  backdropDelay?: number;
  /** Accessibility label for the dismiss backdrop. */
  closeAccessibilityLabel?: string;
};

const OPEN_MS = 280;
const CLOSE_MS = 200;

/**
 * Animated bottom sheet: the card slides up from the bottom while the dimmed
 * backdrop fades in (after `backdropDelay`). Tapping the backdrop dismisses it;
 * taps on the card are absorbed. Reuse for every bottom-anchored modal so the
 * presentation (slide + delayed scrim fade + tap-to-close) stays consistent.
 */
export const BottomSheet = React.memo(function BottomSheet({
  visible,
  onClose,
  children,
  cardStyle,
  backdropDelay = 140,
  closeAccessibilityLabel,
}: BottomSheetProps) {
  const colors = useThemeColors();
  const s = React.useMemo(() => createBottomSheetStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const [mounted, setMounted] = React.useState(visible);
  const sheetAnim = React.useRef(new Animated.Value(0)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(sheetAnim, {
          toValue: 1,
          duration: OPEN_MS,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: OPEN_MS,
          delay: backdropDelay,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }
    Animated.parallel([
      Animated.timing(sheetAnim, {
        toValue: 0,
        duration: CLOSE_MS,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: CLOSE_MS,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [visible, backdropAnim, sheetAnim, backdropDelay]);

  if (!mounted) {
    return null;
  }

  const translateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={mounted}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.overlay, opacity: backdropAnim },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel={closeAccessibilityLabel}
          onPress={onClose}
        />
      </Animated.View>

      <View style={s.anchor} pointerEvents="box-none">
        <Animated.View
          style={[
            s.sheet,
            { paddingBottom: insets.bottom + spacing['2xl'] },
            cardStyle,
            { transform: [{ translateY }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
});

BottomSheet.displayName = 'BottomSheet';
