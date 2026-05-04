import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {Modal, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import { useDonationResultModalStyles } from '@/domains/donation/ui/donationResultModal.styles';
import { pickSemantic } from '@/ui/theme';
import { Button } from '@/ui/components/Button';

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

  const s = useDonationResultModalStyles(
    colors.card,
    colors.text,
    semantic,
    titleColor,
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
            <Button
              layout="auto"
              variant="text"
              title="Close"
              accessibilityLabel="Close"
              onPress={onClose}
              contentStyle={{ width: '100%' }}
            >
              <Text style={s.closeText}>✕</Text>
            </Button>
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
