import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
  type DocumentPickerResponse,
} from '@react-native-documents/picker';
import {useTheme} from '@react-navigation/native';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, View} from 'react-native';

import type {TicketUploadFile} from '@/domains/support/model/createTicket.types';
import {createTicketScreenStyles} from '@/domains/support/ui/ticketScreen.styles';
import {Text} from '@/shared/ui/Text';
import {Button} from '@/ui/components/Button';

export const TICKET_ATTACHMENT_MAX_COUNT = 5;
export const TICKET_ATTACHMENT_MAX_BYTES = 2 * 1024 * 1024;

type Props = {
  value: TicketUploadFile[];
  onChange: (files: TicketUploadFile[]) => void;
  disabled?: boolean;
};

function isAllowedFile(file: DocumentPickerResponse): boolean {
  const name = file.name?.toLowerCase() ?? '';
  const mime = file.type?.toLowerCase() ?? '';
  return (
    file.hasRequestedType &&
    (mime === 'application/pdf' ||
      mime === 'image/jpeg' ||
      mime === 'image/png' ||
      /\.(jpe?g|png|pdf)$/.test(name))
  );
}

function normalizeFile(file: DocumentPickerResponse): TicketUploadFile | null {
  if (
    !file.name ||
    !file.type ||
    file.size == null ||
    file.size > TICKET_ATTACHMENT_MAX_BYTES ||
    !isAllowedFile(file)
  ) {
    return null;
  }
  return {
    uri: file.uri,
    name: file.name,
    mimeType: file.type,
    size: file.size,
  };
}

export const TicketAttachmentPicker = React.memo(function TicketAttachmentPicker({
  value,
  onChange,
  disabled = false,
}: Props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const s = React.useMemo(() => createTicketScreenStyles(colors), [colors]);

  const onPick = React.useCallback(async () => {
    if (disabled || value.length >= TICKET_ATTACHMENT_MAX_COUNT) return;
    try {
      const result = await pick({
        type: [types.images, types.pdf],
        allowMultiSelection: true,
        mode: 'import',
      });
      const available = TICKET_ATTACHMENT_MAX_COUNT - value.length;
      const normalized = result
        .map(normalizeFile)
        .filter((file): file is TicketUploadFile => file != null)
        .slice(0, available);

      if (normalized.length !== result.length) {
        Alert.alert(
          t('screens.support.tickets.attachments.invalidTitle'),
          t('screens.support.tickets.attachments.invalidBody'),
        );
      }
      if (normalized.length > 0) onChange([...value, ...normalized]);
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }
      Alert.alert(
        t('screens.support.tickets.attachments.errorTitle'),
        t('screens.support.tickets.attachments.errorBody'),
      );
    }
  }, [disabled, onChange, t, value]);

  return (
    <View style={s.attachmentSection}>
      <Text style={s.label}>
        {t('screens.support.tickets.attachments.label')}
      </Text>
      <Button
        layout="auto"
        variant="outlined"
        title={t('screens.support.tickets.attachments.pick')}
        onPress={onPick}
        disabled={disabled || value.length >= TICKET_ATTACHMENT_MAX_COUNT}
        style={s.attachmentPicker}
        contentStyle={{width: '100%'}}
      />
      <Text style={s.attachmentHint}>
        {t('screens.support.tickets.attachments.hint')}
      </Text>
      {value.map((file, index) => (
        <View key={`${file.uri}-${index}`} style={s.attachmentRow}>
          <Text numberOfLines={1} style={s.attachmentName}>
            {file.name}
          </Text>
          <Button
            layout="auto"
            variant="text"
            title={t('screens.support.tickets.attachments.remove')}
            accessibilityLabel={`${t('screens.support.tickets.attachments.remove')} ${file.name}`}
            onPress={() => onChange(value.filter((_, i) => i !== index))}
            disabled={disabled}
            style={s.attachmentRemove}
          />
        </View>
      ))}
    </View>
  );
});
TicketAttachmentPicker.displayName = 'TicketAttachmentPicker';
