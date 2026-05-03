import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import {
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '@/ui/theme';
import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export function createTicketScreenStyles(colors: Theme['colors']) {
  return StyleSheet.create({
        scrollContent: {
          paddingHorizontal: spacing.xl,
          paddingBottom: spacing['4xl'],
          gap: spacing.md,
        },
        notice: {
          fontSize: fontSize.sm,
          color: colors.text,
          opacity: 0.85,
          lineHeight: fontSize.sm * 1.5,
          marginBottom: spacing.sm,
          textAlign: 'right',
          writingDirection: 'rtl',
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
          marginBottom: spacing.sm,
        },
        listWrap: {
          minHeight: 120,
        },
        listFill: {
          flex: 1,
        },
        ticketCardOuter: {
          marginBottom: spacing.sm,
        },
        ticketCard: {
          padding: spacing.md,
          borderRadius: radius.md,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          backgroundColor: colors.card,
          gap: spacing.sm,
          width: '100%',
        },
        ticketCardHeaderRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: spacing.md,
          width: '100%',
        },
        ticketCardTitleText: {
          flex: 1,
          minWidth: 0,
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
          color: colors.text,
          textAlign: 'right',
          writingDirection: 'rtl',
        },
        ticketStatusBadge: {
          flexShrink: 0,
          maxWidth: '46%',
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          borderRadius: radius.sm,
          backgroundColor: hexAlpha(colors.primary, 0.14),
        },
        ticketStatusBadgeText: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.semibold,
          color: colors.primary,
          textAlign: 'center',
        },
        ticketCardFields: {
          gap: spacing.sm,
          width: '100%',
        },
        ticketLabelValueRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: spacing.md,
        },
        ticketLabelValueLabel: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.medium,
          color: colors.text,
          opacity: 0.62,
          flexShrink: 0,
          maxWidth: '46%',
        },
        ticketLabelValueValue: {
          flex: 1,
          fontSize: fontSize.sm,
          color: colors.text,
          textAlign: 'right',
          writingDirection: 'ltr',
        },
        ticketCardViewButton: {
          marginTop: spacing.sm,
          width: '100%',
          alignSelf: 'stretch',
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
        },
        ticketCardViewButtonPressed: {
          opacity: 0.88,
        },
        ticketCardViewButtonLabel: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.bold,
          color: colors.background,
        },
        ticketTitle: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
          color: colors.text,
          textAlign: 'right',
          writingDirection: 'rtl',
        },
        ticketMeta: {
          fontSize: fontSize.sm,
          color: colors.text,
          opacity: 0.65,
          textAlign: 'right',
          writingDirection: 'rtl',
        },
        modalSurface: {
          marginHorizontal: spacing.md,
          marginTop: spacing['2xl'],
          padding: spacing.xl,
          borderRadius: radius.lg,
          backgroundColor: colors.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          gap: spacing.md,
        },
        label: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.semibold,
          color: colors.text,
          marginBottom: spacing.xs,
          textAlign: 'right',
          writingDirection: 'rtl',
        },
        input: {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          borderRadius: radius.sm,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          fontSize: fontSize.base,
          color: colors.text,
          backgroundColor: colors.background,
          minHeight: 44,
          textAlign: 'right',
          writingDirection: 'rtl',
        },
        multiline: {
          minHeight: 120,
          textAlignVertical: 'top',
        },
        submitBtn: {
          marginTop: spacing.sm,
          paddingVertical: spacing.md,
          borderRadius: radius.md,
          alignItems: 'center',
          backgroundColor: colors.primary,
        },
        submitLabel: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.bold,
          color: colors.background,
          textAlign: 'center',
        },
        submitDisabled: {
          opacity: 0.45,
        },
        bubbleRow: {
          gap: spacing.sm,
          paddingVertical: spacing.sm,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        bubbleAuthor: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.semibold,
          color: colors.text,
          textAlign: 'right',
          writingDirection: 'rtl',
        },
        bubbleBody: {
          fontSize: fontSize.base,
          color: colors.text,
          lineHeight: fontSize.base * 1.45,
          textAlign: 'right',
          writingDirection: 'rtl',
        },
        bubbleTime: {
          fontSize: fontSize.sm - 1,
          color: colors.text,
          opacity: 0.55,
          textAlign: 'right',
        },
        replyRow: {
          gap: spacing.sm,
          marginTop: spacing.md,
        },
        createTicketLink: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        },
        createTicketLinkText: {
          fontSize: fontSize.sm,
          fontWeight: fontWeight.bold,
          color: colors.primary,
        },
        listFooterSpinner: {
          paddingVertical: spacing.md,
          alignItems: 'center',
        },
        retryLink: {
          marginTop: spacing.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        },
        retryLinkLabel: {
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
          color: colors.primary,
        },
      });
}

export type TicketScreenStyles = ReturnType<typeof createTicketScreenStyles>;
