import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {Modal, Pressable, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { createDonationResultModalStyles } from '@/domains/donation/styles/donationResultModal.styles';
import { pickSemantic } from '@/ui/theme';

export type DonationResultModalProps = {
  visible: boolean;
  variant: 'success' | 'error';
  title: string;
  bodyLines: string[];
  onClose: () => void;
};

export const DonationResultModal = React.memo(function DonationResultModal({
  visible,
  variant,
  title,
  bodyLines,
  onClose,
}: DonationResultModalProps) {
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);
  const titleColor =
    variant === 'error' ? '#F75555' : semantic.successText;

  const s = React.useMemo(
    () =>
      createDonationResultModalStyles({
        colors: { ...semantic, card: colors.card, text: colors.text },
        semantic,
        titleColor,
      }),
    [colors.card, colors.text, semantic, titleColor],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.card}>
          <View style={s.closeRow}>
            <Pressable onPress={onClose} accessibilityRole="button">
              <Text style={s.closeText}>✕</Text>
            </Pressable>
          </View>
          <Text style={s.title}>{title}</Text>
          {bodyLines.map((line, idx) => (
            <Text key={`${idx}-${line.slice(0, 24)}`} style={s.body}>
              {line}
            </Text>
          ))}
        </View>
      </View>
    </Modal>
  );
});
DonationResultModal.displayName = 'DonationResultModal';
