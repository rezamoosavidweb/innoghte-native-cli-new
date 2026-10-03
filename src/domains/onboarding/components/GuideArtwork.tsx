import * as React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import Logo from '@/assets/logo.svg';
import type { WelcomeSlide } from '@/domains/onboarding/model/welcomeGuide';
import { useThemeColors } from '@/ui/theme';

/** Local vector artwork stays sharp, theme-aware and available offline. */
export function GuideArtwork({ slide }: { slide: WelcomeSlide }) {
  const c = useThemeColors();
  const artwork = (() => {
    switch (slide) {
      case 'welcome':
        return (
          <>
            <Circle
              cx="160"
              cy="118"
              r="77"
              stroke={c.primary}
              strokeOpacity="0.2"
              fill="none"
            />
            <Circle
              cx="160"
              cy="118"
              r="59"
              fill={c.surface}
              stroke={c.border}
            />
            <G transform="translate(117 99)">
              <Logo width={86} height={38} color={c.text} />
            </G>
            <Rect
              x="42"
              y="47"
              width="49"
              height="49"
              rx="16"
              fill={c.surface}
              stroke={c.border}
            />
            <Path
              d="M54 64L67 57L80 64L67 71Z M59 67V75Q67 81 75 75V67"
              stroke={c.primary}
              strokeWidth="2"
              strokeLinejoin="round"
              fill="none"
            />
            <Rect
              x="230"
              y="120"
              width="49"
              height="49"
              rx="16"
              fill={c.surface}
              stroke={c.border}
            />
            <Path
              d="M242 146V140A12 12 0 0 1 266 140V146 M243 142V152 M265 142V152"
              stroke={c.primary}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <Rect
              x="77"
              y="181"
              width="166"
              height="7"
              rx="3.5"
              fill={c.border}
            />
            <Rect
              x="109"
              y="195"
              width="102"
              height="5"
              rx="2.5"
              fill={c.border}
              opacity="0.5"
            />
          </>
        );
      case 'courses':
        return (
          <>
            <Rect
              x="72"
              y="39"
              width="193"
              height="137"
              rx="17"
              fill={c.primarySoft}
              stroke={c.primary}
              strokeOpacity="0.3"
              transform="rotate(7 168 108)"
            />
            <Rect
              x="49"
              y="51"
              width="212"
              height="145"
              rx="18"
              fill={c.surface}
              stroke={c.border}
            />
            <Rect
              x="61"
              y="63"
              width="188"
              height="89"
              rx="11"
              fill="url(#guideGlow)"
            />
            <Path
              d="M63 145L111 100L143 126L180 91L247 147"
              stroke={c.primary}
              strokeOpacity="0.25"
              strokeWidth="2"
              fill="none"
            />
            <Circle cx="155" cy="107" r="23" fill={c.primary} />
            <Path d="M150 96L166 107L150 118Z" fill={c.onPrimary} />
            <Rect
              x="127"
              y="167"
              width="118"
              height="6"
              rx="3"
              fill={c.text}
              opacity="0.65"
            />
            <Rect
              x="155"
              y="179"
              width="90"
              height="4"
              rx="2"
              fill={c.textMuted}
              opacity="0.4"
            />
            <Circle cx="83" cy="175" r="13" fill={c.successMuted} />
            <Path
              d="M77 175L81 179L89 171"
              stroke={c.success}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );
      case 'albums':
        return (
          <>
            <Circle
              cx="160"
              cy="105"
              r="66"
              fill={c.surface}
              stroke={c.border}
            />
            <Circle
              cx="160"
              cy="105"
              r="49"
              stroke={c.primary}
              strokeOpacity="0.12"
              fill="none"
            />
            <Path
              d="M118 114V99A42 42 0 0 1 202 99V114"
              stroke={c.primary}
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            <Rect
              x="112"
              y="106"
              width="20"
              height="36"
              rx="9"
              fill={c.primary}
            />
            <Rect
              x="188"
              y="106"
              width="20"
              height="36"
              rx="9"
              fill={c.primary}
            />
            <Path
              d="M159 90V118 M159 94L178 90V113"
              stroke={c.text}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <Circle cx="154" cy="119" r="6" fill={c.text} />
            <Circle cx="173" cy="114" r="6" fill={c.text} />
            <Rect
              x="65"
              y="177"
              width="190"
              height="33"
              rx="16.5"
              fill={c.surface}
              stroke={c.border}
            />
            {[
              9, 16, 23, 13, 20, 10, 24, 17, 10, 21, 14, 8, 19, 12, 22, 9, 15,
            ].map((h, i) => (
              <Rect
                key={i}
                x={79 + i * 10}
                y={193 - h / 2}
                width="3"
                height={h}
                rx="1.5"
                fill={c.primary}
                opacity={i < 10 ? 1 : 0.3}
              />
            ))}
          </>
        );
      case 'live':
        return (
          <>
            <Rect
              x="60"
              y="51"
              width="192"
              height="151"
              rx="19"
              fill={c.surface}
              stroke={c.border}
            />
            <Path d="M61 91H251" stroke={c.border} />
            <Path
              d="M107 42V63 M205 42V63"
              stroke={c.primary}
              strokeWidth="7"
              strokeLinecap="round"
            />
            {[0, 1, 2].map(row =>
              [0, 1, 2, 3].map(col => (
                <Rect
                  key={`${row}-${col}`}
                  x={81 + col * 41}
                  y={106 + row * 26}
                  width="22"
                  height="13"
                  rx="4"
                  fill={row === 1 && col === 2 ? c.primary : c.surfaceSecondary}
                />
              )),
            )}
            <Circle
              cx="243"
              cy="161"
              r="33"
              fill={c.primary}
              stroke={c.surface}
              strokeWidth="5"
            />
            <Path d="M237 150L254 161L237 172Z" fill={c.onPrimary} />
            <Path
              d="M267 131Q279 143 279 157 M274 122Q291 138 291 158"
              stroke={c.primary}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
            />
          </>
        );
      case 'profile':
        return (
          <>
            <Rect
              x="75"
              y="35"
              width="172"
              height="175"
              rx="20"
              fill={c.surface}
              stroke={c.border}
            />
            <Circle cx="161" cy="83" r="28" fill={c.primarySoft} />
            <Circle cx="161" cy="77" r="10" fill={c.primary} />
            <Path d="M142 99Q143 87 161 87Q179 87 180 99" fill={c.primary} />
            <Rect
              x="122"
              y="123"
              width="78"
              height="6"
              rx="3"
              fill={c.text}
              opacity="0.7"
            />
            {[145, 167, 189].map(y => (
              <G key={y}>
                <Rect
                  x="103"
                  y={y}
                  width="83"
                  height="5"
                  rx="2.5"
                  fill={c.border}
                />
                <Circle cx="208" cy={y + 2} r="6" fill={c.primarySoft} />
              </G>
            ))}
            <Circle
              cx="74"
              cy="158"
              r="27"
              fill={c.primary}
              stroke={c.surface}
              strokeWidth="4"
            />
            <Path
              d="M66 158L72 164L83 152"
              stroke={c.onPrimary}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );
    }
  })();

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 320 240"
      color={c.text}
      accessible={false}
    >
      <Defs>
        <LinearGradient id="guideGlow" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={c.primary} stopOpacity="0.21" />
          <Stop offset="1" stopColor={c.primary} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Circle cx="160" cy="120" r="110" fill="url(#guideGlow)" />
      <Circle
        cx="160"
        cy="120"
        r="96"
        stroke={c.primary}
        strokeOpacity="0.14"
        strokeDasharray="3 7"
        fill="none"
      />
      <Circle cx="47" cy="135" r="4" fill={c.primary} opacity="0.5" />
      <Circle cx="271" cy="76" r="5" fill={c.primary} opacity="0.3" />
      <G stroke={c.primary} strokeWidth="2" strokeLinecap="round" opacity="0.8">
        <Line x1="263" x2="273" y1="37" y2="37" />
        <Line x1="268" x2="268" y1="32" y2="42" />
        <Line x1="42" x2="50" y1="193" y2="193" />
        <Line x1="46" x2="46" y1="189" y2="197" />
      </G>
      {artwork}
    </Svg>
  );
}
