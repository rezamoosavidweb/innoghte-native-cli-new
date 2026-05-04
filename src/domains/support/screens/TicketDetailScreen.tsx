import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View
} from 'react-native';
import { Text } from '@/shared/ui/Text';
import { SafeHtmlContent } from '@/shared/ui/html';

import {
  useReplyToTicketMutation,
  useTicketDetail,
} from '@/domains/support/hooks/useTicketDetail';
import type {
  TicketThreadAuthorRole,
  TicketThreadMessage,
} from '@/domains/support/model/ticket.types';
import { createTicketScreenStyles } from '@/domains/support/ui/ticketScreen.styles';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { formatTsIso } from '@/shared/utils/formatTsIso';
import {
  flashListContentGutters,
  pickSemantic,
  createNavScreenShellStyles,
} from '@/ui/theme';
import { Button } from '@/ui/components/Button';

type Props = DrawerScreenProps<DrawerParamList, 'TicketDetailScreen'>;

const TicketMessageBubble = React.memo(function TicketMessageBubble({
  msg,
  authorLabel,
  ticketStyles,
  language,
}: {
  msg: TicketThreadMessage;
  authorLabel: (role: TicketThreadAuthorRole) => string;
  ticketStyles: ReturnType<typeof createTicketScreenStyles>;
  language: string;
}) {
  return (
    <View style={ticketStyles.bubbleRow}>
      <Text style={ticketStyles.bubbleAuthor}>
        {authorLabel(msg.authorRole)}
      </Text>
      <SafeHtmlContent
        html={msg.body}
        style={ticketStyles.bubbleBody}
        selectable
      />
      <Text style={ticketStyles.bubbleTime}>
        {formatTsIso(msg.createdAt, language)}
      </Text>
    </View>
  );
});

export const TicketDetailScreen = React.memo(function TicketDetailScreen({
  route,
}: Props) {
  const { id } = route.params;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);
  const shell = React.useMemo(
    () => createNavScreenShellStyles(colors),
    [colors],
  );
  const ticketStyles = React.useMemo(
    () => createTicketScreenStyles(colors),
    [colors],
  );

  const {
    data: detail,
    isPending,
    isError,
    refetch,
  } = useTicketDetail(id);

  const replyMutation = useReplyToTicketMutation(id);

  const [replyDraft, setReplyDraft] = React.useState('');

  const placeholderReply = t(
    'screens.support.tickets.detail.replyPlaceholder',
  );

  const authorLabel = React.useCallback(
    (role: TicketThreadAuthorRole) =>
      role === 'staff'
        ? t('screens.support.tickets.detail.authorStaff')
        : t('screens.support.tickets.detail.authorYou'),
    [t],
  );

  const onSubmitReply = React.useCallback(() => {
    const trimmed = replyDraft.trim();
    if (!trimmed || replyMutation.isPending) {
      return;
    }
    replyMutation.mutate(trimmed, {
      onSuccess: () => setReplyDraft(''),
    });
  }, [replyDraft, replyMutation]);

  const replyBusy = replyMutation.isPending;
  const replyDisabled =
    replyDraft.trim().length === 0 || replyBusy;

  const onRetry = React.useCallback(() => {
    refetch().catch(() => undefined);
  }, [refetch]);

  if (isPending && detail === undefined) {
    return (
      <View style={[shell.safe, shell.centered]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError || detail === undefined) {
    return (
      <View style={[shell.safe, shell.centered]}>
        <Text style={shell.errorText}>
          {t('screens.support.states.error')}
        </Text>
        <Button
          layout="auto"
          variant="text"
          title={t('listStates.retry')}
          onPress={onRetry}
          style={ticketStyles.retryLink}
          contentStyle={{ width: '100%' }}
        >
          <Text style={ticketStyles.retryLinkLabel}>{t('listStates.retry')}</Text>
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={shell.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          flashListContentGutters.standard,
          ticketStyles.scrollContent,
        ]}
      >
        <SafeHtmlContent html={detail.title} style={ticketStyles.ticketTitle} />
        <Text style={ticketStyles.ticketMeta}>
          #{detail.ticketNumber} · {detail.status}
        </Text>
        <Text style={ticketStyles.ticketMeta}>
          {t('screens.support.tickets.detail.createdAt', {
            date: formatTsIso(detail.createdAt, i18n.language),
          })}
        </Text>
        {detail.description.length > 0 ? (
          <SafeHtmlContent html={detail.description} style={ticketStyles.notice} />
        ) : null}
        {/* TODO: Replace with FlashList when ticket volume increases */}
        {detail.messages.map(msg => (
          <TicketMessageBubble
            key={msg.id}
            msg={msg}
            authorLabel={authorLabel}
            ticketStyles={ticketStyles}
            language={i18n.language}
          />
        ))}
        <View style={ticketStyles.replyRow}>
          <Text style={ticketStyles.label}>
            {t('screens.support.tickets.detail.replyLabel')}
          </Text>
          <TextInput
            style={[ticketStyles.input, ticketStyles.multiline]}
            placeholder={placeholderReply}
            placeholderTextColor={semantic.textMuted}
            multiline
            editable={!replyBusy}
            value={replyDraft}
            onChangeText={setReplyDraft}
          />
          <Button
            variant="filled"
            title={t('screens.support.tickets.detail.sendReply')}
            disabled={replyDisabled}
            onPress={onSubmitReply}
            style={[
              ticketStyles.submitBtn,
              replyDisabled ? ticketStyles.submitDisabled : null,
            ]}
            contentStyle={{ width: '100%' }}
          >
            <Text style={ticketStyles.submitLabel}>
              {t('screens.support.tickets.detail.sendReply')}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});
TicketDetailScreen.displayName = 'TicketDetailScreen';
