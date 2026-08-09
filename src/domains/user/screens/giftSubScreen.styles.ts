import { StyleSheet } from 'react-native';

import { fontSize, fontWeight, radius, spacing } from '@/ui/theme';

export const giftSubScreenStyles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  panel: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
  },
  panelHeader: {
    minHeight: 54,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  panelTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: 24,
    textAlign: 'right',
  },
  table: {
    paddingVertical: spacing.xl,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 72,
    alignItems: 'stretch',
  },
  tableHeaderRow: {
    minHeight: 112,
  },
  bodyRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  pressedRow: {
    opacity: 0.72,
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    lineHeight: 22,
    textAlign: 'right',
  },
  cellText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: 22,
    textAlign: 'right',
  },
  emailText: {
    writingDirection: 'ltr',
    textAlign: 'left',
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    lineHeight: 18,
    textAlign: 'center',
  },
  detailsPill: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  detailsText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  emptyTrack: {
    minHeight: 148,
    position: 'relative',
  },
  empty: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.sm,
    lineHeight: 23,
    textAlign: 'center',
  },
});
