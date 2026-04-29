import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import type { BreathingPhase } from '@/domains/breathing/constants/breathingConstants';
import { useBreathing } from '@/domains/breathing/hooks/useBreathing';
import { useBreathingScreenStyles } from '@/domains/breathing/ui/breathingScreen.styles';
import { BreathingCircle } from '@/domains/breathing/ui/BreathingCircle';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { useNavScreenShellStyles } from '@/ui/theme';
import { useThemeColors } from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'Meditation'>;

const PHASE_I18N_KEYS: Record<BreathingPhase, string> = {
  inhale: 'screens.breathing.phase.inhale',
  hold: 'screens.breathing.phase.hold',
  exhale: 'screens.breathing.phase.exhale',
};

const BreathingScreenComponent = (_props: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const themeColors = useThemeColors();
  const shell = useNavScreenShellStyles(colors);
  const s = useBreathingScreenStyles();

  const {
    phase,
    isRunning,
    animationEpoch,
    phaseDurationMs,
    sessionRemainingSec,
    phaseRemainingSec,
    toggleRunning,
    isPaused,
  } = useBreathing();

  const ctaLabel = isRunning
    ? t('screens.breathing.pause')
    : isPaused
      ? t('screens.breathing.resume')
      : t('screens.breathing.start');

  return (
    <View style={[shell.safe, s.column]}>
      <View style={s.fillCenter}>
        <BreathingCircle
          phase={phase}
          isRunning={isRunning}
          phaseDurationMs={phaseDurationMs}
          animationEpoch={animationEpoch}
          countdownValue={phaseRemainingSec}
          primaryColor={themeColors.primary}
          onPrimaryColor={themeColors.onPrimary}
          surfaceColor={themeColors.card}
        />
        <Text style={s.phaseTitle}>{t(PHASE_I18N_KEYS[phase])}</Text>
        <Text style={s.sessionRow}>
          {t('screens.breathing.sessionRemaining', {
            seconds: sessionRemainingSec,
          })}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [
          s.primaryCta,
          pressed ? s.primaryCtaPressed : null,
        ]}
        onPress={toggleRunning}
      >
        <Text style={s.primaryCtaLabel}>{ctaLabel}</Text>
      </Pressable>
    </View>
  );
};

export const BreathingScreen = React.memo(BreathingScreenComponent);
BreathingScreen.displayName = 'BreathingScreen';
