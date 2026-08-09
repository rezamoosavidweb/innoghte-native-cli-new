import {useTheme} from '@react-navigation/native';
import * as React from 'react';
import {Linking, View} from 'react-native';

import type {TicketAttachment} from '@/domains/support/model/ticket.types';
import {createTicketScreenStyles} from '@/domains/support/ui/ticketScreen.styles';
import {resolveApiBaseUrl} from '@/shared/infra/http';
import {Button} from '@/ui/components/Button';

type Props = {attachments: readonly TicketAttachment[]};

function attachmentUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${resolveApiBaseUrl().replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export const TicketAttachmentList = React.memo(function TicketAttachmentList({
  attachments,
}: Props) {
  const {colors} = useTheme();
  const s = React.useMemo(() => createTicketScreenStyles(colors), [colors]);
  if (attachments.length === 0) return null;

  return (
    <View style={s.remoteAttachmentList}>
      {attachments.map((attachment, index) => (
        <Button
          key={`${attachment.path}-${index}`}
          layout="auto"
          variant="text"
          title={attachment.originalName}
          accessibilityLabel={`باز کردن پیوست ${attachment.originalName}`}
          onPress={() => {
            Linking.openURL(attachmentUrl(attachment.path)).catch(() => {});
          }}
          style={s.remoteAttachmentButton}
          contentStyle={{width: '100%', alignItems: 'flex-end'}}
        />
      ))}
    </View>
  );
});
TicketAttachmentList.displayName = 'TicketAttachmentList';
