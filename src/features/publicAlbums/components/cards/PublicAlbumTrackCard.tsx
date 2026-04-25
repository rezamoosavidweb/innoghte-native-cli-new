import * as React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { isPurchasedProduct } from '@/shared/utils/lib/purchasedProductIds';
import { usePublicAlbumTrackStyles } from '@/features/publicAlbums/styles/publicAlbumTrack.styles';
import type { PublicAlbumTrack } from '@/features/publicAlbums/types';

type Props = { item: PublicAlbumTrack };

function noop(): void {}

const PublicAlbumTrackCardComponent = ({ item }: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const s = usePublicAlbumTrackStyles(colors);
  const images = item.medias.filter(m => m.type === 'image');
  const uri = images[0]?.src;
  const [failed, setFailed] = React.useState(false);
  const purchased = isPurchasedProduct(item.id);

  return (
    <View style={s.card}>
      {!failed && uri ? (
        <Image
          source={{ uri }}
          style={s.hero}
          onError={() => {
            setFailed(true);
          }}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <View style={[s.hero, s.heroPh]}>
          <Text style={s.heroPhText}>▣</Text>
        </View>
      )}
      <Text style={s.title}>{item.title_fa}</Text>
      <View style={s.rows}>
        <View style={s.row}>
          <Text style={s.label}>{t('publicAlbums.musicCount')}</Text>
          <Text style={s.value}>
            {item.chapters_count} {t('publicAlbums.trackUnit')}
          </Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>{t('publicAlbums.duration')}</Text>
          <Text style={s.value}>{item.duration}</Text>
        </View>
      </View>
      <View style={s.actions}>
        {purchased ? (
          <Pressable
            accessibilityRole="button"
            onPress={noop}
            style={({ pressed }) =>
              pressed ? [s.primaryBtn, s.pressed] : s.primaryBtn
            }
          >
            <Text style={s.primaryBtnText}>{t('courses.show')}</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={noop}
              style={({ pressed }) =>
                pressed ? [s.outline, s.pressed] : s.outline
              }
            >
              <Text style={s.outlineTxt}>{t('courses.moreInformation')}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={noop}
              style={({ pressed }) =>
                pressed ? [s.success, s.pressed] : s.success
              }
            >
              <Text style={s.successBtnText}>{t('courses.buy')}</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export const PublicAlbumTrackCard = React.memo(PublicAlbumTrackCardComponent);
PublicAlbumTrackCard.displayName = 'PublicAlbumTrackCard';
