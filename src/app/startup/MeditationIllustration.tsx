import * as React from 'react';
import Svg, { Circle, Ellipse, G, Line, Path } from 'react-native-svg';

export type MeditationIllustrationPalette = {
  /** Cool accent — teal rings, chakra line, alternating petals */
  coolAccent: string;
  /** Warm accent — figure, petals, auric ring */
  warmAccent: string;
  /** Filled circle behind figure */
  centerDisc: string;
};

const DEFAULT_PALETTE: MeditationIllustrationPalette = {
  coolAccent: '#0ABBB5',
  warmAccent: '#FF984C',
  centerDisc: '#0D1626',
};

type Props = {
  size?: number;
  colors?: Partial<MeditationIllustrationPalette>;
};

const CX = 130;
const CY = 130;
const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function toRad(deg: number) {
  return (deg - 90) * (Math.PI / 180);
}

export function MeditationIllustration({ size = 260, colors: colorOverrides }: Props) {
  const { coolAccent, warmAccent, centerDisc } = { ...DEFAULT_PALETTE, ...colorOverrides };

  return (
    <Svg width={size} height={size} viewBox="0 0 260 260">
      {/* Outermost ring with dot markers */}
      <Circle cx={CX} cy={CY} r={124} stroke={coolAccent} strokeWidth={0.8} strokeOpacity={0.07} fill="none" />
      <Circle cx={CX} cy={CY} r={107} stroke={coolAccent} strokeWidth={0.8} strokeOpacity={0.13} fill="none" />
      <Circle cx={CX} cy={CY} r={90} stroke={warmAccent} strokeWidth={0.8} strokeOpacity={0.17} fill="none" />

      {/* Dot markers on outermost ring */}
      {PETAL_ANGLES.map((angle, i) => {
        const r = toRad(angle);
        return (
          <Circle
            key={`dot-${i}`}
            cx={CX + 124 * Math.cos(r)}
            cy={CY + 124 * Math.sin(r)}
            r={2.5}
            fill={coolAccent}
            fillOpacity={0.45}
          />
        );
      })}

      {/* Lotus petals — alternating warm / cool */}
      {PETAL_ANGLES.map((angle, i) => (
        <G key={`petal-${i}`} rotation={angle} origin={`${CX}, ${CY}`}>
          <Ellipse
            cx={CX}
            cy={CY - 73}
            rx={13}
            ry={27}
            fill={i % 2 === 0 ? warmAccent : coolAccent}
            fillOpacity={i % 2 === 0 ? 0.78 : 0.68}
          />
        </G>
      ))}

      {/* Inner disc */}
      <Circle cx={CX} cy={CY} r={52} fill={centerDisc} />
      <Circle cx={CX} cy={CY} r={50} stroke={coolAccent} strokeWidth={0.8} strokeOpacity={0.22} fill="none" />

      {/* Aura around head */}
      <Circle cx={CX} cy={CY - 21} r={19} stroke={warmAccent} strokeWidth={1} strokeOpacity={0.22} fill="none" />

      {/* Head */}
      <Circle cx={CX} cy={CY - 21} r={11} fill={warmAccent} fillOpacity={0.92} />

      {/* Body in lotus pose */}
      <Path
        d={`M ${CX - 30} ${CY + 9} Q ${CX - 14} ${CY - 5} ${CX} ${CY + 1} Q ${CX + 14} ${CY - 5} ${CX + 30} ${CY + 9} Q ${CX + 20} ${CY + 28} ${CX} ${CY + 28} Q ${CX - 20} ${CY + 28} ${CX - 30} ${CY + 9} Z`}
        fill={warmAccent}
        fillOpacity={0.88}
      />

      {/* Hands / mudra circles */}
      <Circle cx={CX - 32} cy={CY + 12} r={4.5} fill={warmAccent} fillOpacity={0.8} />
      <Circle cx={CX + 32} cy={CY + 12} r={4.5} fill={warmAccent} fillOpacity={0.8} />

      {/* Spine / energy channel */}
      <Line x1={CX} y1={CY - 10} x2={CX} y2={CY + 5} stroke={coolAccent} strokeWidth={1.4} strokeOpacity={0.65} />

      {/* Chakra dots */}
      <Circle cx={CX} cy={CY - 10} r={2.2} fill={coolAccent} fillOpacity={0.85} />
      <Circle cx={CX} cy={CY - 3} r={2.2} fill={coolAccent} fillOpacity={0.70} />
      <Circle cx={CX} cy={CY + 5} r={2.2} fill={coolAccent} fillOpacity={0.55} />
    </Svg>
  );
}
