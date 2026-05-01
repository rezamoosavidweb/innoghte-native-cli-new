import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui/Text';
import { toPersianNumber } from '@/shared/utils/toPersianNumber';

import type { UserDeviceDto } from '@/domains/user/model/userDevices.schema';
import { createDeviceSessionRowStyles } from '@/domains/user/ui/deviceSessionRow.styles';
import { spacing } from '@/ui/theme/core/spacing';
import { radius } from '@/ui/theme/core/radius';
import { fontSize } from '@/ui/theme/core/typography';

export type DeviceSessionRowProps = {
  device: UserDeviceDto;
  deactivateBusy: boolean;
  labels: {
    active: string;
    inactive: string;
    deactivate: string;
    ipLabel: string;
    timeLabel: string;
    statusLabel: string;
  };
  mutedColor: string;
  textColor: string;
  borderColor: string;
  dangerBg: string;
  dangerText: string;
  successBg: string;
  successText: string;
  onDeactivate: (id: number) => void;
};

export const DeviceSessionRow = React.memo(function DeviceSessionRow({
  device,
  deactivateBusy,
  labels,
  mutedColor,
  textColor,
  borderColor,
  dangerBg,
  dangerText,
  successBg,
  successText,
  onDeactivate,
}: DeviceSessionRowProps) {
  const title = `${device.browser}-${device.platform}`;
  const ip = toPersianNumber(device.ip ?? '');
  const lastLogin = toPersianNumber(device.last_login ?? '');
  const isActive = device.active === 1;

  const themed = createDeviceSessionRowStyles({
    borderColor,
    textColor,
    mutedColor,
    dangerBg,
    dangerText,
    successBg,
    successText,
    isActive,
  });

  const onPressDeactivate = React.useCallback(() => {
    onDeactivate(device.id);
  }, [device.id, onDeactivate]);

  return (
    <View style={[styles.card, themed.card]}>
      <Text style={[styles.title, themed.title]} numberOfLines={2}>
        {title}
      </Text>
      <Text style={[styles.meta, themed.meta]}>
        {labels.ipLabel}:{' '}
        <Text style={[styles.metaStrong, themed.metaStrong]}>{ip}</Text>
      </Text>
      <Text style={[styles.meta, themed.meta]}>
        {labels.timeLabel}:{' '}
        <Text style={[styles.metaStrong, themed.metaStrong]}>
          {lastLogin}
        </Text>
      </Text>
      <View style={styles.footer}>
        <View style={[styles.badge, themed.badgeBg]}>
          <Text style={themed.badgeLabel}>
            {labels.statusLabel}: {isActive ? labels.active : labels.inactive}
          </Text>
        </View>
        {isActive ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={labels.deactivate}
            disabled={deactivateBusy}
            onPress={onPressDeactivate}
            style={({ pressed }) => [
              styles.deactivateBtn,
              themed.deactivateBtn,
              deactivateBusy
                ? themed.deactivateBtnBusy
                : pressed
                  ? themed.deactivateBtnPressed
                  : null,
            ]}
          >
            <Text style={[styles.deactivateLabel, themed.deactivateLabel]}>
              {deactivateBusy ? '…' : labels.deactivate}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});

DeviceSessionRow.displayName = 'DeviceSessionRow';

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  meta: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  metaStrong: {
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  deactivateBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  deactivateLabel: {
    fontWeight: '700',
    fontSize: fontSize.sm,
  },
});
