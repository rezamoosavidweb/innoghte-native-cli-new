import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { Text } from '@/shared/ui/Text';

type Props = {
  displayBpm: number | null;
  beatPhase: SharedValue<number>;
  isActive: boolean;
  label: string;
  unit: string;
};

export const HeartRateIndicator = React.memo(function HeartRateIndicator({
  displayBpm,
  beatPhase,
  isActive,
  label,
  unit,
}: Props) {
  const breathStyle = useAnimatedStyle(() => {
    const bump = isActive ? Math.sin(beatPhase.value * Math.PI * 2) : 0;
    return {
      transform: [{ scale: 1 + 0.045 * bump }],
      opacity: 0.92 + 0.08 * Math.max(0, bump),
    };
  }, [isActive]);

  const bloomStyle = useAnimatedStyle(() => {
    if (!isActive) {
      return { opacity: 0, transform: [{ scale: 1 }] };
    }
    const x = beatPhase.value;
    const throb = Math.max(0, Math.sin(x * Math.PI * 2));
    return {
      opacity: 0.08 + throb * 0.22,
      transform: [{ scale: 1.08 + throb * 0.14 }],
    };
  }, [isActive]);

  if (displayBpm == null) {
    return (
      <View style={styles.hold}>
        <Text style={styles.whisper}>{label}</Text>
        <Text style={styles.absent}>—</Text>
      </View>
    );
  }

  return (
    <View style={styles.shell}>
      <Animated.View style={[styles.bloom, bloomStyle]} />
      <Animated.View style={[styles.row, breathStyle]}>
        <Text style={styles.whisper}>{label}</Text>
        <View style={styles.bpmRow}>
          <Text style={styles.bpm}>{displayBpm}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </Animated.View>
    </View>
  );
});
HeartRateIndicator.displayName = 'HeartRateIndicator';

const styles = StyleSheet.create({
  shell: {
    minWidth: 168,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 26,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.22)',
    backgroundColor: 'rgba(15, 23, 42, 0.38)',
  },
  hold: {
    minWidth: 168,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 26,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
  },
  bloom: {
    ...StyleSheet.absoluteFill,
    borderRadius: 999,
    backgroundColor: 'rgba(192, 132, 252, 0.35)',
  },
  row: {
    alignItems: 'center',
  },
  whisper: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(226, 232, 240, 0.55)',
    marginBottom: 4,
  },
  bpmRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bpm: {
    fontSize: 44,
    fontWeight: '600',
    color: 'rgba(248, 250, 252, 0.96)',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    marginLeft: 8,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.4,
    color: 'rgba(203, 213, 225, 0.65)',
  },
  absent: {
    marginTop: 4,
    fontSize: 32,
    color: 'rgba(148, 163, 184, 0.35)',
    fontWeight: '500',
  },
});
