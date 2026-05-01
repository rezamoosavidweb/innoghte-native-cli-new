import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import type { HeartRateConnectionStatus } from '@/domains/breathwork/model/types';
import { Text } from '@/shared/ui/Text';

type Props = {
  status: HeartRateConnectionStatus;
  isLiveDevice: boolean;
  messages: {
    live: string;
    simulated: string;
    connecting: string;
    error: string;
    disconnected: string;
  };
};

export const DeviceConnectionStatus = React.memo(function DeviceConnectionStatus({
  status,
  isLiveDevice,
  messages,
}: Props) {
  const label = React.useMemo(() => {
    if (status === 'connecting') return messages.connecting;
    if (status === 'error') return messages.error;
    if (status === 'disconnected') return messages.disconnected;
    return isLiveDevice ? messages.live : messages.simulated;
  }, [
    isLiveDevice,
    messages.connecting,
    messages.disconnected,
    messages.error,
    messages.live,
    messages.simulated,
    status,
  ]);

  const showSpinner = status === 'connecting';

  return (
    <View style={styles.row} accessibilityRole="text">
      {showSpinner ? (
        <ActivityIndicator color="rgba(196, 181, 253, 0.9)" size="small" />
      ) : (
        <View
          style={[
            styles.dot,
            status === 'connected'
              ? styles.dotOn
              : status === 'error'
                ? styles.dotErr
                : styles.dotMuted,
          ]}
        />
      )}
      <Text style={styles.text}>{label}</Text>
    </View>
  );
});
DeviceConnectionStatus.displayName = 'DeviceConnectionStatus';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOn: {
    backgroundColor: 'rgba(52, 211, 153, 0.95)',
    shadowColor: '#34d399',
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  dotErr: {
    backgroundColor: 'rgba(248, 113, 113, 0.95)',
  },
  dotMuted: {
    backgroundColor: 'rgba(148, 163, 184, 0.55)',
  },
  text: {
    fontSize: 13,
    color: 'rgba(203, 213, 225, 0.78)',
  },
});
