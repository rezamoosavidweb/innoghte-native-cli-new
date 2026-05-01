import * as React from 'react';
import { Image, Pressable, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui/Text';

import {
  formatNumberForApp,
  formatPriceForApp,
} from '@/shared/infra/i18n/formatLocaleNumbers';
import type { EventType } from '@/domains/events/model/event.entities';
import { useEventListCardStyles } from '@/domains/events/ui/cards/eventListCard.styles';

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
