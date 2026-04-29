import { zodResolver } from '@hookform/resolvers/zod';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
} from 'react-native';
import { z } from 'zod';

import { TicketForm } from '@/domains/support/components/TicketForm';
import { useCreateTicketMutation } from '@/domains/support/hooks/useTicketDetail';
import type { CreateTicketFields } from '@/domains/support/model/createTicket.types';
import { useTicketScreenStyles } from '@/domains/support/ui/ticketScreen.styles';
import type { DrawerParamList } from '@/shared/contracts/navigationApp';
import { ApiError } from '@/shared/infra/http/apiError';
import { useAppNavigation } from '@/shared/lib/navigation/useAppNavigation';
import { showAppToast } from '@/shared/ui/toast';
import {
  flashListContentGutters,
  useNavScreenShellStyles,
} from '@/ui/theme';

type Props = DrawerScreenProps<DrawerParamList, 'CreateTicketScreen'>;

const ticketDraftSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

function resolveCreateTicketErrorMessage(
  err: unknown,
  fallback: string,
): string {
  if (err instanceof ApiError) {
    const fromPayload = err.payload?.message?.trim();
    if (fromPayload) {
      return fromPayload;
    }
    const msg = err.message.trim();
    return msg.length > 0 ? msg : fallback;
  }
  if (err instanceof Error) {
    const msg = err.message.trim();
    return msg.length > 0 ? msg : fallback;
  }
  return fallback;
}

export const CreateTicketScreen = React.memo(function CreateTicketScreen(
  _props: Props,
) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useAppNavigation();
  const shell = useNavScreenShellStyles(colors);
  const ticketStyles = useTicketScreenStyles(colors);
  const createMutation = useCreateTicketMutation();

  const form = useForm<CreateTicketFields>({
    resolver: zodResolver(ticketDraftSchema),
    defaultValues: { title: '', description: '' },
    mode: 'onBlur',
  });

  const interactionBusy = form.formState.isSubmitting;

  const onValid = React.useCallback(
    async (values: CreateTicketFields) => {
      try {
        await createMutation.mutateAsync(values);
        navigation.navigate('TicketListScreen');
        showAppToast(t('screens.support.tickets.create.successToast'), 'success');
      } catch (err) {
        showAppToast(
          resolveCreateTicketErrorMessage(
            err,
            t('screens.support.tickets.create.errorGeneric'),
          ),
          'error',
        );
      }
    },
    [createMutation, navigation, t],
  );

  const onSubmitPress = React.useCallback(() => {
    form.handleSubmit(onValid)().catch(() => undefined);
  }, [form, onValid]);

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
        <Text style={ticketStyles.ticketTitle}>
          {t('screens.support.tickets.create.title')}
        </Text>
        <Text style={ticketStyles.notice}>
          {t('screens.support.tickets.create.subtitle')}
        </Text>
        <TicketForm
          control={form.control}
          titleLabel={t('screens.support.tickets.create.fieldTitle')}
          descriptionLabel={t(
            'screens.support.tickets.create.fieldDescription',
          )}
          titlePlaceholder={t(
            'screens.support.tickets.create.titlePlaceholder',
          )}
          descriptionPlaceholder={t(
            'screens.support.tickets.create.descriptionPlaceholder',
          )}
        />
        <Pressable
          accessibilityRole="button"
          disabled={interactionBusy}
          onPress={onSubmitPress}
          style={({ pressed }) => [
            ticketStyles.submitBtn,
            interactionBusy || pressed ? ticketStyles.submitDisabled : null,
          ]}
        >
          {interactionBusy ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={ticketStyles.submitLabel}>
              {t('screens.support.tickets.create.submit')}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});
CreateTicketScreen.displayName = 'CreateTicketScreen';
