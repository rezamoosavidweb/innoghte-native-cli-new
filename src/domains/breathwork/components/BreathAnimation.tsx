import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  Oval,
  RadialGradient,
  vec,
  rect,
} from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

type Props = {
  width: number;
  height: number;
  center: { x: number; y: number };
  organCore: SharedValue<number>;
  organMantle: SharedValue<number>;
  organAura: SharedValue<number>;
  lagGlow: SharedValue<number>;
  deformX: SharedValue<number>;
  deformY: SharedValue<number>;
  rippleAge: SharedValue<number>;
  physioDrive: SharedValue<number>;
  ambientDrift: SharedValue<number>;
};

const { width: SW } = Dimensions.get('window');

export const BreathAnimation = React.memo(function BreathAnimation({
  width,
  height,
  center,
  organCore,
  organMantle,
  organAura,
  lagGlow,
  deformX,
  deformY,
  rippleAge,
  physioDrive,
  ambientDrift,
}: Props) {
  const cx = center.x;
  const cy = center.y;

  const haloLarge = useDerivedValue(() => {
    const g = lagGlow.value;
    const p = physioDrive.value;
    return 210 * organAura.value * (0.82 + g * 0.28 + p * 0.22);
  });

  const haloLargeOp = useDerivedValue(() => {
    return 0.12 + lagGlow.value * 0.2 + physioDrive.value * 0.14;
  });

  const haloMid = useDerivedValue(() => {
    const g = lagGlow.value;
    return 168 * organMantle.value * (0.9 + g * 0.18);
  });

  const haloMidOp = useDerivedValue(() => {
    return 0.28 + lagGlow.value * 0.28;
  });

  const coreRect = useDerivedValue(() => {
    const s = organCore.value;
    const rx = 112 * s * deformX.value;
    const ry = 96 * s * deformY.value * 0.94;
    return rect(cx - rx, cy - ry, rx * 2, ry * 2);
  });

  const vignetteTop = useDerivedValue(() => {
    const drift = ambientDrift.value * 0.003;
    return rect(-40 + drift * 20, -80, width + 80, height * 0.55);
  });

  const vignetteBot = useDerivedValue(() => {
    const drift = ambientDrift.value * 0.0025;
    return rect(-60 - drift * 14, height * 0.48, width + 120, height * 0.62);
  });

  const rippleRadius = useDerivedValue(() => {
    return (
      72 +
      rippleAge.value * (SW * 0.52) * (0.55 + physioDrive.value * 0.55)
    );
  });

  const rippleOpacity = useDerivedValue(() => {
    return (
      (1 - rippleAge.value) *
      (0.2 + lagGlow.value * 0.42) *
      (0.62 + physioDrive.value * 0.48)
    );
  });

  const rippleStroke = useDerivedValue(() => {
    return 1.6 + physioDrive.value * 2.8;
  });

  const coreOp = useDerivedValue(() => {
    return 0.9 + lagGlow.value * 0.08;
  });

  const gradCenter = useDerivedValue(() => {
    const w = Math.sin(ambientDrift.value * 0.0022) * 6;
    return vec(cx + w, cy - 10 + Math.cos(ambientDrift.value * 0.0018) * 4);
  });

  const gradR = useDerivedValue(() => {
    return 140 * organCore.value;
  });

  const coreBlur = useDerivedValue(() => {
    return 4 + lagGlow.value * 10;
  });

  const hotSpotR = useDerivedValue(() => {
    return 46 * organCore.value * deformX.value;
  });

  const hotSpotOp = useDerivedValue(() => {
    return 0.12 + lagGlow.value * 0.38;
  });

  return (
    <View style={[styles.wrap, { width, height }]} pointerEvents="none">
      <Canvas style={styles.canvas} accessibilityLabel="Living breath field">
        <Group>
          <Oval
            rect={vignetteTop}
            color="rgba(88, 28, 135, 0.38)"
            opacity={0.55}
          />
          <Oval
            rect={vignetteBot}
            color="rgba(30, 58, 138, 0.42)"
            opacity={0.5}
          />
        </Group>

        <Circle
          c={vec(cx, cy)}
          r={haloLarge}
          opacity={haloLargeOp}
          color="#a78bfa"
        />

        <Circle
          c={vec(cx, cy)}
          r={haloMid}
          color="rgba(192, 132, 252, 0.7)"
          opacity={haloMidOp}
        >
          <BlurMask blur={32} style="normal" />
        </Circle>

        <Circle
          c={vec(cx, cy)}
          r={rippleRadius}
          style="stroke"
          strokeWidth={rippleStroke}
          color="rgba(232, 180, 255, 0.75)"
          opacity={rippleOpacity}
        />

        <Group opacity={coreOp}>
          <Oval rect={coreRect}>
            <RadialGradient
              c={gradCenter}
              r={gradR}
              colors={[
                'rgba(255, 245, 255, 0.99)',
                'rgba(216, 180, 254, 0.94)',
                'rgba(109, 40, 217, 0.9)',
                'rgba(15, 23, 42, 0.99)',
              ]}
              positions={[0, 0.35, 0.68, 1]}
            />
            <BlurMask blur={coreBlur} style="solid" />
          </Oval>
        </Group>

        <Circle
          c={vec(cx, cy)}
          r={hotSpotR}
          color="rgba(255, 250, 255, 0.2)"
          opacity={hotSpotOp}
        />
      </Canvas>
    </View>
  );
});
BreathAnimation.displayName = 'BreathAnimation';

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
