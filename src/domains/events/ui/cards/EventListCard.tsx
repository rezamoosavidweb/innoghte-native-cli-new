import * as React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, type Theme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import {
  formatNumberForApp,
  formatPriceForApp,
} from '@/shared/infra/i18n/formatLocaleNumbers';
import {
  colors,
  fontSize,
  fontWeight,
  pickSemantic,
  radius,
  spacing,
} from '@/ui/theme';
import type { EventType } from '@/domains/events/model/event.entities';

const IMAGE_SIZE = 64;
const CARD_RADIUS = radius.lg - 2;

function createEventListCardStyles(
  themeColors: Theme['colors'],
  s: ReturnType<typeof pickSemantic>,
) {
  return StyleSheet.create({
    card: {
      borderRadius: CARD_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      padding: spacing.md,
      width: '100%',
      backgroundColor: themeColors.card,
      borderColor: themeColors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'dashed',
      borderBottomColor: themeColors.border,
    },
    title: {
      flex: 1,
      paddingEnd: spacing.md,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: themeColors.text,
    },
    thumb: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      borderRadius: CARD_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: themeColors.border,
      backgroundColor: themeColors.card,
    },
    placeholder: { alignItems: 'center', justifyContent: 'center' },
    phGlyph: {
      fontSize: fontSize['2xl'],
      opacity: 0.35,
      color: themeColors.text,
    },
    meta: { paddingTop: spacing.md, gap: spacing.md - 2 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    label: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      flexShrink: 0,
      color: themeColors.text,
    },
    value: {
      fontSize: fontSize.md,
      flex: 1,
      textAlign: 'right',
      color: themeColors.text,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.md - 2,
      marginTop: spacing.md,
    },
    primaryBtn: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      backgroundColor: themeColors.primary,
    },
    outlineBtn: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: themeColors.primary,
    },
    successBtn: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      backgroundColor: s.success,
    },
    btnPrimaryText: {
      color: s.onPrimary,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    btnSuccessText: {
      color: colors.white,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    outlineTxt: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: themeColors.primary,
    },
    pressed: { opacity: 0.88 },
  });
}

function useEventListCardStyles(themeColors: Theme['colors']) {
  const { dark } = useTheme();
  const sem = pickSemantic(dark);
  return React.useMemo(
    () => createEventListCardStyles(themeColors, sem),
    [themeColors, sem],
  );
}

const PRICE_DIVISOR = 10;

type Props = { item: EventType };

function noop(): void {}

function statusTranslationKey(
  state: string,
):
  | 'events.status.past'
  | 'events.status.upcoming'
  | 'events.status.ongoing'
  | 'events.status.unknown' {
  if (state === 'past') return 'events.status.past';
  if (state === 'upcoming') return 'events.status.upcoming';
  if (state === 'ongoing') return 'events.status.ongoing';
  return 'events.status.unknown';
}

const EventListCardComponent = ({ item }: Props) => {
  const { t } = useTranslation();
  const { colors: themeColors } = useTheme();
  const s = useEventListCardStyles(themeColors);
  const uri = item.image_media[0]?.src;
  const [failed, setFailed] = React.useState(false);
  const price = formatPriceForApp(
    (item.price ?? 0) / PRICE_DIVISOR,
    t('courses.currency'),
  );
  const capacity = formatNumberForApp(item.remain_capacity ?? 0);
  const isUpcoming = item.state === 'upcoming';
  const eventType = item.event_detail?.type ?? 'workshop';

  return (
    <View style={s.card}>
      <View style={s.header}>
        <Text style={s.title} numberOfLines={3}>
          {item.title_fa}
        </Text>
        {!failed && uri ? (
          <Image
            source={{ uri }}
            style={s.thumb}
            onError={() => {
              setFailed(true);
            }}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={[s.thumb, s.placeholder]}>
            <Text style={s.phGlyph}>▣</Text>
          </View>
        )}
      </View>
      <View style={s.meta}>
        <View style={s.row}>
          <Text style={s.label}>{t('events.remainingCapacity')}</Text>
          <Text style={s.value}>{capacity}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>{t('events.statusLabel')}</Text>
          <Text style={s.value}>{t(statusTranslationKey(item.state))}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>{t('courses.price')}</Text>
          <Text style={s.value}>{price}</Text>
        </View>
      </View>
      <View style={s.actions}>
        {isUpcoming && eventType === 'retreat' ? (
          <Pressable
            accessibilityRole="button"
            onPress={noop}
            style={({ pressed }) =>
              pressed ? [s.successBtn, s.pressed] : s.successBtn
            }
          >
            <Text style={s.btnSuccessText}>{t('events.registerInfo')}</Text>
          </Pressable>
        ) : isUpcoming && eventType === 'workshop' ? (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={noop}
              style={({ pressed }) =>
                pressed ? [s.outlineBtn, s.pressed] : s.outlineBtn
              }
            >
              <Text style={s.outlineTxt}>{t('courses.moreInformation')}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={noop}
              style={({ pressed }) =>
                pressed ? [s.successBtn, s.pressed] : s.successBtn
              }
            >
              <Text style={s.btnSuccessText}>{t('courses.buy')}</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={noop}
            style={({ pressed }) =>
              pressed ? [s.primaryBtn, s.pressed] : s.primaryBtn
            }
          >
            <Text style={s.btnPrimaryText}>{t('courses.moreInformation')}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export const EventListCard = React.memo(EventListCardComponent);
EventListCard.displayName = 'EventListCard';
