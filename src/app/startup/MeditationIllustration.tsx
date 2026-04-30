import * as React from 'react';
import Svg, { Circle, Ellipse, G, Line, Path } from 'react-native-svg';

type Props = {
  size?: number;
};

const CX = 130;
const CY = 130;
const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function toRad(deg: number) {
  return (deg - 90) * (Math.PI / 180);
}

export function MeditationIllustration({ size = 260 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 260 260">
      {/* Outermost ring with dot markers */}
      <Circle cx={CX} cy={CY} r={124} stroke="#0ABBB5" strokeWidth={0.8} strokeOpacity={0.07} fill="none" />
      <Circle cx={CX} cy={CY} r={107} stroke="#0ABBB5" strokeWidth={0.8} strokeOpacity={0.13} fill="none" />
      <Circle cx={CX} cy={CY} r={90}  stroke="#FF984C" strokeWidth={0.8} strokeOpacity={0.17} fill="none" />

      {/* Dot markers on outermost ring */}
      {PETAL_ANGLES.map((angle, i) => {
        const r = toRad(angle);
        return (
          <Circle
            key={`dot-${i}`}
            cx={CX + 124 * Math.cos(r)}
            cy={CY + 124 * Math.sin(r)}
            r={2.5}
            fill="#0ABBB5"
            fillOpacity={0.45}
          />
        );
      })}

      {/* Lotus petals — alternating orange / teal */}
      {PETAL_ANGLES.map((angle, i) => (
        <G key={`petal-${i}`} rotation={angle} origin={`${CX}, ${CY}`}>
          <Ellipse
            cx={CX}
            cy={CY - 73}
            rx={13}
            ry={27}
            fill={i % 2 === 0 ? '#FF984C' : '#0ABBB5'}
            fillOpacity={i % 2 === 0 ? 0.78 : 0.68}
          />
        </G>
      ))}

      {/* Inner disc */}
      <Circle cx={CX} cy={CY} r={52} fill="#0D1626" />
      <Circle cx={CX} cy={CY} r={50} stroke="#0ABBB5" strokeWidth={0.8} strokeOpacity={0.22} fill="none" />

      {/* Aura around head */}
      <Circle cx={CX} cy={CY - 21} r={19} stroke="#FF984C" strokeWidth={1} strokeOpacity={0.22} fill="none" />

      {/* Head */}
      <Circle cx={CX} cy={CY - 21} r={11} fill="#FF984C" fillOpacity={0.92} />

      {/* Body in lotus pose */}
      <Path
        d={`M ${CX - 30} ${CY + 9} Q ${CX - 14} ${CY - 5} ${CX} ${CY + 1} Q ${CX + 14} ${CY - 5} ${CX + 30} ${CY + 9} Q ${CX + 20} ${CY + 28} ${CX} ${CY + 28} Q ${CX - 20} ${CY + 28} ${CX - 30} ${CY + 9} Z`}
        fill="#FF984C"
        fillOpacity={0.88}
      />

      {/* Hands / mudra circles */}
      <Circle cx={CX - 32} cy={CY + 12} r={4.5} fill="#FF984C" fillOpacity={0.8} />
      <Circle cx={CX + 32} cy={CY + 12} r={4.5} fill="#FF984C" fillOpacity={0.8} />

      {/* Spine / energy channel */}
      <Line x1={CX} y1={CY - 10} x2={CX} y2={CY + 5} stroke="#0ABBB5" strokeWidth={1.4} strokeOpacity={0.65} />

      {/* Chakra dots */}
      <Circle cx={CX} cy={CY - 10} r={2.2} fill="#0ABBB5" fillOpacity={0.85} />
      <Circle cx={CX} cy={CY - 3}  r={2.2} fill="#0ABBB5" fillOpacity={0.70} />
      <Circle cx={CX} cy={CY + 5}  r={2.2} fill="#0ABBB5" fillOpacity={0.55} />
    </Svg>
  );
}
