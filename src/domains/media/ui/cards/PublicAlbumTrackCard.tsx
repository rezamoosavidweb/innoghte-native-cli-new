import * as React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, type Theme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { isProductPurchased } from '@/shared/purchases';
import {
  colors,
  fontSize,
  fontWeight,
  pickSemantic,
  radius,
  spacing,
} from '@/ui/theme';
import type { PublicAlbumMedia, PublicAlbumTrack } from '@/domains/media/model';

/** Legacy drawer card surface (**`PublicCourseDto`** list) — aligns with `#122320` album tiles. */
const album = {
  cardBg: '#122320',
  cardBorder: '#122320',
  heroBg: colors.dark[4],
  heroPlaceholder: colors.dark[5],
  title: colors.white,
  label: colors.charcoal[300],
  value: colors.grayscale[200],
  heroGlyph: colors.charcoal[400],
} as const;

const HERO_HEIGHT = 180;

function createPublicAlbumTrackStyles(
  themeColors: Theme['colors'],
  s: ReturnType<typeof pickSemantic>,
) {
  return StyleSheet.create({
    card: {
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      padding: spacing.md,
      width: '100%',
      borderColor: album.cardBorder,
      backgroundColor: album.cardBg,
    },
    hero: {
      width: '100%',
      height: HERO_HEIGHT,
      borderRadius: radius.full,
      marginBottom: spacing.md,
      backgroundColor: album.heroBg,
    },
    heroPh: { alignItems: 'center', justifyContent: 'center' },
    heroPhText: {
      fontSize: fontSize['3xl'] + 8,
      color: album.heroGlyph,
      opacity: 0.6,
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: album.title,
      marginBottom: spacing.md - 2,
    },
    rows: { gap: spacing.md - 2 },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      color: album.label,
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
    },
    value: {
      color: album.value,
      fontSize: fontSize.md,
      flex: 1,
      textAlign: 'right',
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.md - 2,
      marginTop: 14,
    },
    primaryBtn: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      backgroundColor: themeColors.primary,
    },
    outline: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: themeColors.primary,
    },
    outlineTxt: {
      fontWeight: fontWeight.bold,
      fontSize: fontSize.md,
      color: themeColors.primary,
    },
    success: {
      flex: 1,
      borderRadius: radius.lg - 2,
      paddingVertical: spacing.md,
      alignItems: 'center',
      backgroundColor: s.success,
    },
    primaryBtnText: {
      color: s.onPrimary,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    successBtnText: {
      color: colors.white,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
    },
    pressed: { opacity: 0.88 },
  });
}

function usePublicAlbumTrackStyles(themeColors: Theme['colors']) {
  const { dark } = useTheme();
  const sem = pickSemantic(dark);
  return React.useMemo(
    () => createPublicAlbumTrackStyles(themeColors, sem),
    [themeColors, sem],
  );
}

type Props = { item: PublicAlbumTrack };

function noop(): void {}

const PublicAlbumTrackCardComponent = ({ item }: Props) => {
  const { t } = useTranslation();
  const { colors: themeColors } = useTheme();
  const s = usePublicAlbumTrackStyles(themeColors);
  const images = item.medias.filter((m: PublicAlbumMedia) => m.type === 'image');
  const uri = images[0]?.src;
  const [failed, setFailed] = React.useState(false);
  const purchased = isProductPurchased(item.id);

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
