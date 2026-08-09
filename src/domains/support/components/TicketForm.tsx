import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import type { Control } from 'react-hook-form';
import { useController } from 'react-hook-form';
import {TextInput, View} from 'react-native';
import { Text } from '@/shared/ui/Text';

import type { CreateTicketFields } from '@/domains/support/model/createTicket.types';
import { createTicketScreenStyles } from '@/domains/support/ui/ticketScreen.styles';
import { pickSemantic } from '@/ui/theme';
import { Select, type SelectOption } from '@/ui/components/Select';
import { TicketAttachmentPicker } from '@/domains/support/components/TicketAttachmentPicker';
import { useTranslation } from 'react-i18next';

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
  const {t} = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);
  const styles = React.useMemo(
    () => createTicketScreenStyles(colors),
    [colors],
  );
  const placeholderColor = semantic.textMuted;

  const titleCtrl = useController({ control, name: 'title' });
  const categoryCtrl = useController({ control, name: 'category' });
  const priorityCtrl = useController({ control, name: 'priority' });
  const descCtrl = useController({ control, name: 'description' });
  const attachmentCtrl = useController({ control, name: 'attachments' });

  const categoryOptions = React.useMemo<SelectOption[]>(
    () => [
      {value: 'technical_issue', label: t('screens.support.tickets.categories.technical_issue')},
      {value: 'course_content', label: t('screens.support.tickets.categories.course_content')},
      {value: 'billing', label: t('screens.support.tickets.categories.billing')},
      {value: 'feature_request', label: t('screens.support.tickets.categories.feature_request')},
      {value: 'bug_report', label: t('screens.support.tickets.categories.bug_report')},
      {value: 'general_support', label: t('screens.support.tickets.categories.general_support')},
    ],
    [t],
  );
  const priorityOptions = React.useMemo<SelectOption[]>(
    () => [
      {value: 'low', label: t('screens.support.tickets.priorities.low')},
      {value: 'medium', label: t('screens.support.tickets.priorities.medium')},
      {value: 'high', label: t('screens.support.tickets.priorities.high')},
      {value: 'urgent', label: t('screens.support.tickets.priorities.urgent')},
    ],
    [t],
  );

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
        <Text style={styles.label}>
          {t('screens.support.tickets.create.fieldCategory')}
        </Text>
        <Select
          value={categoryCtrl.field.value}
          onChange={categoryCtrl.field.onChange}
          options={categoryOptions}
          placeholder={t('screens.support.tickets.create.categoryPlaceholder')}
          error={categoryCtrl.fieldState.error?.message}
          accessibilityLabel={t('screens.support.tickets.create.fieldCategory')}
        />
      </View>
      <View>
        <Text style={styles.label}>
          {t('screens.support.tickets.create.fieldPriority')}
        </Text>
        <Select
          value={priorityCtrl.field.value}
          onChange={priorityCtrl.field.onChange}
          options={priorityOptions}
          placeholder={t('screens.support.tickets.create.priorityPlaceholder')}
          accessibilityLabel={t('screens.support.tickets.create.fieldPriority')}
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
      <TicketAttachmentPicker
        value={attachmentCtrl.field.value}
        onChange={attachmentCtrl.field.onChange}
      />
    </View>
  );
});
TicketForm.displayName = 'TicketForm';
