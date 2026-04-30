import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useReplyToTicketMutation,
  useTicketDetail,
} from '@/domains/support/hooks/useTicketDetail';
import type { TicketThreadAuthorRole } from '@/domains/support/model/ticket.types';
import { useTicketScreenStyles } from '@/domains/support/ui/ticketScreen.styles';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { formatTsIso } from '@/shared/utils/formatTsIso';
import {
  flashListContentGutters,
  pickSemantic,
  useNavScreenShellStyles,
} from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'TicketDetailScreen'>;

export const TicketDetailScreen = React.memo(function TicketDetailScreen({
  route,
}: Props) {
  const { id } = route.params;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const semantic = pickSemantic(theme);
  const shell = useNavScreenShellStyles(colors);
  const ticketStyles = useTicketScreenStyles(colors);

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
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={ticketStyles.retryLink}
        >
          <Text style={ticketStyles.retryLinkLabel}>{t('listStates.retry')}</Text>
        </Pressable>
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
        <Text style={ticketStyles.ticketTitle}>{detail.title}</Text>
        <Text style={ticketStyles.ticketMeta}>
          #{detail.ticketNumber} · {detail.status}
        </Text>
        <Text style={ticketStyles.ticketMeta}>
          {t('screens.support.tickets.detail.createdAt', {
            date: formatTsIso(detail.createdAt, i18n.language),
          })}
        </Text>
        {detail.description.length > 0 ? (
          <Text style={ticketStyles.notice}>{detail.description}</Text>
        ) : null}
        {/* TODO: Replace with FlashList when ticket volume increases */}
        {detail.messages.map(msg => (
          <View key={msg.id} style={ticketStyles.bubbleRow}>
            <Text style={ticketStyles.bubbleAuthor}>
              {authorLabel(msg.authorRole)}
            </Text>
            <Text style={ticketStyles.bubbleBody}>{msg.body}</Text>
            <Text style={ticketStyles.bubbleTime}>
              {formatTsIso(msg.createdAt, i18n.language)}
            </Text>
          </View>
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
          <Pressable
            accessibilityRole="button"
            disabled={replyDisabled}
            onPress={onSubmitReply}
            style={({ pressed }) => [
              ticketStyles.submitBtn,
              replyDisabled || pressed ? ticketStyles.submitDisabled : null,
            ]}
          >
            <Text style={ticketStyles.submitLabel}>
              {t('screens.support.tickets.detail.sendReply')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});
TicketDetailScreen.displayName = 'TicketDetailScreen';
