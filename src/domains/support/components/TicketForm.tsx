import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import type { Control } from 'react-hook-form';
import { useController } from 'react-hook-form';
import {TextInput, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { CreateTicketFields } from '@/domains/support/model/createTicket.types';
import { createTicketScreenStyles } from '@/domains/support/ui/ticketScreen.styles';
import { pickSemantic } from '@/ui/theme';

export type TicketFormProps = {
  control: Control<CreateTicketFields>;
  titleLabel: string;
  descriptionLabel: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
};

export const TicketForm = React.memo(function TicketForm({
  control,
  titleLabel,
  descriptionLabel,
  titlePlaceholder,
  descriptionPlaceholder,
}: TicketFormProps) {
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);
  const styles = React.useMemo(
    () => createTicketScreenStyles(colors),
    [colors],
  );
  const placeholderColor = semantic.textMuted;

  const titleCtrl = useController({ control, name: 'title' });
  const descCtrl = useController({ control, name: 'description' });

  return (
    <View style={styles.modalSurface}>
      <View>
        <Text style={styles.label}>{titleLabel}</Text>
        <TextInput
          accessibilityLabel={titleLabel}
          style={styles.input}
          placeholder={titlePlaceholder}
          placeholderTextColor={placeholderColor}
          value={titleCtrl.field.value}
          onBlur={titleCtrl.field.onBlur}
          onChangeText={titleCtrl.field.onChange}
        />
      </View>
      <View>
        <Text style={styles.label}>{descriptionLabel}</Text>
        <TextInput
          accessibilityLabel={descriptionLabel}
          style={[styles.input, styles.multiline]}
          placeholder={descriptionPlaceholder}
          placeholderTextColor={placeholderColor}
          multiline
          value={descCtrl.field.value}
          onBlur={descCtrl.field.onBlur}
          onChangeText={descCtrl.field.onChange}
        />
      </View>
    </View>
  );
});
TicketForm.displayName = 'TicketForm';
