import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

type ParticleDef = {
  left: `${number}%`;
  top: `${number}%`;
  size: number;
  seed: number;
};

const PARTICLES: readonly ParticleDef[] = [
  { left: '8%', top: '14%', size: 5, seed: 0.11 },
  { left: '84%', top: '20%', size: 4, seed: 0.56 },
  { left: '16%', top: '58%', size: 6, seed: 0.33 },
  { left: '76%', top: '54%', size: 5, seed: 0.79 },
  { left: '42%', top: '10%', size: 3, seed: 0.04 },
  { left: '54%', top: '74%', size: 4, seed: 0.67 },
  { left: '4%', top: '40%', size: 3, seed: 0.44 },
  { left: '90%', top: '68%', size: 5, seed: 0.91 },
  { left: '48%', top: '88%', size: 3, seed: 0.22 },
  { left: '28%', top: '28%', size: 4, seed: 0.63 },
  { left: '66%', top: '32%', size: 3, seed: 0.18 },
];

type ParticleOrbProps = {
  seed: number;
  size: number;
  cycleT: SharedValue<number>;
  organAura: SharedValue<number>;
  lagGlow: SharedValue<number>;
  physioDrive: SharedValue<number>;
};

const ParticleOrb = React.memo(function ParticleOrb({
  seed,
  size,
  cycleT,
  organAura,
  lagGlow,
  physioDrive,
}: ParticleOrbProps) {
  const style = useAnimatedStyle(() => {
    'worklet';
    const t = cycleT.value;
    const aura = organAura.value;
    const phys = physioDrive.value;
    const tw = lagGlow.value;
    const breathe = 0.62 + aura * 0.48;
    const float =
      Math.sin((t + seed) * Math.PI * 2 * 1.12) * (18 * breathe + phys * 10);
    const sway =
      Math.cos((t * 0.58 + seed * 1.75) * Math.PI * 2) *
      (12 * breathe + phys * 8);
    const pulse = 0.85 + tw * 0.35 + phys * 0.25;
    const o =
      0.09 +
      Math.sin((t * 0.75 + seed) * Math.PI * 2) * 0.08 * pulse +
      phys * 0.06;
    return {
      opacity: Math.min(0.52, Math.max(0.06, o)),
      transform: [
        { translateX: sway * pulse },
        { translateY: float * pulse },
        { scale: 0.88 + aura * 0.18 + phys * 0.1 },
      ],
      width: size * pulse,
      height: size * pulse,
      borderRadius: size * pulse,
    };
  });
  return <Animated.View pointerEvents="none" style={[styles.dot, style]} />;
});
ParticleOrb.displayName = 'ParticleOrb';

type Props = {
  cycleT: SharedValue<number>;
  organAura: SharedValue<number>;
  lagGlow: SharedValue<number>;
  physioDrive: SharedValue<number>;
};

export const BreathAmbientParticles = React.memo(
  function BreathAmbientParticles({
    cycleT,
    organAura,
    lagGlow,
    physioDrive,
  }: Props) {
    return (
      <View style={styles.layer} pointerEvents="none">
        {PARTICLES.map(p => (
          <View
            key={`${p.left}-${p.top}`}
            style={[styles.anchor, { left: p.left, top: p.top }]}
          >
            <ParticleOrb
              seed={p.seed}
              size={p.size}
              cycleT={cycleT}
              organAura={organAura}
              lagGlow={lagGlow}
              physioDrive={physioDrive}
            />
          </View>
        ))}
      </View>
    );
  },
);
BreathAmbientParticles.displayName = 'BreathAmbientParticles';

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
  },
  anchor: {
    position: 'absolute',
    width: 1,
    height: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    backgroundColor: 'rgba(221, 214, 254, 0.55)',
    shadowColor: '#e9d5ff',
    shadowOpacity: 0.45,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 0 },
  },
});
