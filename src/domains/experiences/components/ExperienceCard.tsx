import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ExperienceAudioPlayer } from '@/domains/experiences/components/ExperienceAudioPlayer';
import type { CatalogItem } from '@/shared/catalog/model/entities';
import { Text } from '@/shared/ui/Text';

export type ExperienceKind =
  | 'meditation'
  | 'reading'
  | 'listening'
  | 'writing';

const CARD_COLORS: Record<ExperienceKind, string> = {
  meditation: '#34263f',
  listening: '#15343f',
  reading: '#233750',
  writing: '#3e2c44',
};

function cleanText(value: string | null): string {
  return (value ?? '')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
}

function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaValue}>{value}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
    </View>
  );
}

export const ExperienceCard = React.memo(function ExperienceCard({
  item,
  kind,
}: {
  item: CatalogItem;
  kind: ExperienceKind;
}) {
  const image = item.medias.find(media => media.type === 'image');
  const audio = item.medias.find(media => media.type === 'audio');
  const isAudioCard = kind === 'meditation' || kind === 'listening';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: CARD_COLORS[kind],
          borderColor: kind === 'listening' ? '#496b78' : '#695975',
        },
      ]}
    >
      {item.tags ? <Text style={styles.tag}>{item.tags}</Text> : null}
      {image?.src ? (
        <Image
          source={{ uri: image.src }}
          resizeMode="cover"
          style={isAudioCard ? styles.roundImage : styles.storyImage}
          accessibilityLabel={item.title_fa}
        />
      ) : null}

      <Text style={styles.title}>{item.title_fa}</Text>
      {isAudioCard && item.title ? (
        <Text style={styles.englishTitle}>{item.title}</Text>
      ) : null}

      {kind === 'meditation' ? (
        <>
          <MetaRow label="مدت زمان:" value={audio?.duration ?? ''} />
          <MetaRow label="نویسنده و گوینده:" value={item.author || 'حسین'} />
        </>
      ) : null}
      {kind === 'listening' ? (
        <>
          <MetaRow label="کاری از:" value={item.author ?? ''} />
          <MetaRow label="آلبوم:" value={item.fromAlbum ?? ''} />
          <MetaRow label="مدت زمان:" value={audio?.duration ?? ''} />
        </>
      ) : null}

      {audio?.url ? <ExperienceAudioPlayer url={audio.url} /> : null}
      {item.fullInfo ? (
        <Text style={styles.body}>{cleanText(item.fullInfo)}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
    padding: 20,
  },
  tag: {
    color: '#f3eef4',
    textAlign: 'center',
    fontSize: 15,
  },
  roundImage: {
    width: 250,
    height: 250,
    maxWidth: '100%',
    alignSelf: 'center',
    borderRadius: 125,
    borderWidth: 4,
    borderColor: '#202229',
  },
  storyImage: {
    width: '100%',
    minHeight: 260,
    aspectRatio: 1.2,
    borderRadius: 14,
    backgroundColor: '#fff',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
  },
  englishTitle: {
    color: '#eee',
    textAlign: 'center',
    fontSize: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  metaLabel: {
    color: '#fff',
    textAlign: 'right',
  },
  metaValue: {
    color: '#fff',
    flexShrink: 1,
    textAlign: 'left',
  },
  body: {
    color: '#fff',
    textAlign: 'justify',
    writingDirection: 'rtl',
    fontSize: 16,
    lineHeight: 29,
  },
});
