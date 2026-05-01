import { StyleSheet } from 'react-native';

import { fontSize } from '@/ui/theme/core/typography';

export type DeviceSessionRowStyleArgs = {
  borderColor: string;
  textColor: string;
  mutedColor: string;
  dangerBg: string;
  dangerText: string;
  successBg: string;
  successText: string;
  isActive: boolean;
};

export type DeviceSessionRowStyles = ReturnType<
  typeof createDeviceSessionRowStyles
>;

export function createDeviceSessionRowStyles(p: DeviceSessionRowStyleArgs) {
  const badgeBg = p.isActive ? p.successBg : p.dangerBg;
  const badgeColor = p.isActive ? p.successText : p.dangerText;

  return StyleSheet.create({
    card: { borderColor: p.borderColor },
    title: { color: p.textColor },
    meta: { color: p.mutedColor },
    metaStrong: { color: p.textColor },
    badgeBg: { backgroundColor: badgeBg },
    badgeLabel: {
      color: badgeColor,
      fontSize: fontSize.sm,
      fontWeight: '600',
    },
    deactivateBtn: { backgroundColor: p.dangerBg },
    deactivateBtnPressed: { opacity: 0.85 },
    deactivateBtnBusy: { opacity: 0.55 },
    deactivateLabel: { color: p.dangerText },
  });
}
