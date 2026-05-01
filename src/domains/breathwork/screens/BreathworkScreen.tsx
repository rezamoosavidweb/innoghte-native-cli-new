import type { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BreathAmbientParticles } from '@/domains/breathwork/components/BreathAmbientParticles';
import { BreathAnimation } from '@/domains/breathwork/components/BreathAnimation';
import { DeviceConnectionStatus } from '@/domains/breathwork/components/DeviceConnectionStatus';
import { HeartRateIndicator } from '@/domains/breathwork/components/HeartRateIndicator';
import { useBreathingAnimation } from '@/domains/breathwork/hooks/useBreathingAnimation';
import { useHeartRate } from '@/domains/breathwork/hooks/useHeartRate';
import { useLivingOrganMotion } from '@/domains/breathwork/hooks/useLivingOrganMotion';
import { DEFAULT_BREATH_CYCLE } from '@/domains/breathwork/model/types';
import { breathworkScreenStyles } from '@/domains/breathwork/styles/breathworkScreen.styles';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { Text } from '@/shared/ui/Text';

type Props = DrawerScreenProps<DrawerParamList, 'Meditation'>;

const BreathworkScreenComponent = (_props: Props) => {
  const { t } = useTranslation();
  const { width: W, height: H } = Dimensions.get('window');
  const center = React.useMemo(
    () => ({ x: W / 2, y: H * 0.36 }),
    [H, W],
  );

  const { cycleT, breathTarget, glowTarget, phase } = useBreathingAnimation(
    DEFAULT_BREATH_CYCLE,
  );
  const {
    displayBpm,
    beatPhase,
    connectionStatus,
    isLiveDevice,
    beatImpulse,
    physioDrive,
  } = useHeartRate();

  const {
    organCore,
    organMantle,
    organAura,
    lagGlow,
    deformX,
    deformY,
    rippleAge,
    ambientDrift,
  } = useLivingOrganMotion({
    breathTarget,
    glowTarget,
    cycleT,
    beatPhase,
    beatImpulse,
    physioDrive,
  });

  const phaseLabel = t(`screens.breathwork.phase.${phase}`);
  const deviceMessages = React.useMemo(
    () => ({
      live: t('screens.breathwork.device.live'),
      simulated: t('screens.breathwork.device.simulated'),
      connecting: t('screens.breathwork.device.connecting'),
      error: t('screens.breathwork.device.error'),
      disconnected: t('screens.breathwork.device.disconnected'),
    }),
    [t],
  );

  return (
    <View style={breathworkScreenStyles.root}>
      <BreathAnimation
        width={W}
        height={H}
        center={center}
        organCore={organCore}
        organMantle={organMantle}
        organAura={organAura}
        lagGlow={lagGlow}
        deformX={deformX}
        deformY={deformY}
        rippleAge={rippleAge}
        physioDrive={physioDrive}
        ambientDrift={ambientDrift}
      />
      <BreathAmbientParticles
        cycleT={cycleT}
        organAura={organAura}
        lagGlow={lagGlow}
        physioDrive={physioDrive}
      />
      <SafeAreaView style={breathworkScreenStyles.safe} edges={['left', 'right']}>
        <View style={breathworkScreenStyles.content}>
          <View style={breathworkScreenStyles.upperStack}>
            <View style={breathworkScreenStyles.orbSpacer} />
            <Text style={breathworkScreenStyles.phaseLabel}>{phaseLabel}</Text>
            <Text style={breathworkScreenStyles.hint}>
              {t('screens.breathwork.hint')}
            </Text>
          </View>
          <View style={breathworkScreenStyles.footer}>
            <HeartRateIndicator
              displayBpm={displayBpm}
              beatPhase={beatPhase}
              isActive={displayBpm != null && displayBpm >= 40}
              label={t('screens.breathwork.heartLabel')}
              unit={t('screens.breathwork.bpm')}
            />
            <DeviceConnectionStatus
              status={connectionStatus}
              isLiveDevice={isLiveDevice}
              messages={deviceMessages}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export const BreathworkScreen = React.memo(BreathworkScreenComponent);
BreathworkScreen.displayName = 'BreathworkScreen';
