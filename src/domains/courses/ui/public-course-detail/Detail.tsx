import { CatalogItemDetail } from '@/shared/catalog/model/catalogItemDetail.schema';
import { Text } from '@/shared/ui/Text';
import { fontWeight } from '@/ui/theme';
import type { TBlock } from '@native-html/transient-render-engine';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Image, useWindowDimensions, View } from 'react-native';
import type { CustomRenderer } from 'react-native-render-html';
import RenderHTML from 'react-native-render-html';
import { SvgXml } from 'react-native-svg';
import { createPublicCourseDetailStyles } from './publicCourseDetail.styles';

/** SVG data URIs must use SvgXml; RN `Image` does not decode `data:image/svg+xml`. */
const decodeSvgDataUri = (dataUri: string): string | null => {
  if (!dataUri.startsWith('data:image/svg+xml')) {
    return null;
  }
  const comma = dataUri.indexOf(',');
  if (comma === -1) {
    return null;
  }
  const payload = dataUri.slice(comma + 1);
  try {
    // Backend sends percent-encoded (`%3Csvg...`); `;base64` is rare for inline SVG.
    if (dataUri.slice(0, comma).includes('base64')) {
      return null;
    }
    return decodeURIComponent(payload);
  } catch {
    return null;
  }
};

const parseImgDimension = (value: string | undefined, fallback: number) => {
  if (value == null || value === '') {
    return fallback;
  }
  const n = Number.parseInt(String(value).replace(/px$/i, ''), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const createHtmlImgRenderer = (
  s: ReturnType<typeof createPublicCourseDetailStyles>,
): CustomRenderer<TBlock> => {
  return props => {
    const { InternalRenderer, tnode } = props;
    const src = tnode.attributes.src ?? '';

    if (src.startsWith('data:image/svg+xml')) {
      const xml = decodeSvgDataUri(src);
      const w = parseImgDimension(tnode.attributes.width, 20);
      const h = parseImgDimension(tnode.attributes.height, w);

      if (!xml) return null;

      return (
        <View style={s.inlineSvgImg}>
          <SvgXml xml={xml} width={w} height={h} />
        </View>
      );
    }

    return <InternalRenderer {...props} />;
  };
};

export const Details = ({ data }: { data: CatalogItemDetail['details'] }) => {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const s = createPublicCourseDetailStyles(colors);
  const htmlImgRenderer = React.useMemo(() => createHtmlImgRenderer(s), [s]);
  return (
    <View style={s.detailsContainer}>
      <View>
        {data?.[0]?.image && (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: data?.[0]?.image }}
            style={s.bigDetailImage}
          />
        )}
        {data?.[0]?.title && (
          <Text style={[s.whiteText, s.detailsTitle]}>{data?.[0]?.title}</Text>
        )}
        {data?.[0]?.info && (
          <RenderHTML
            contentWidth={width}
            source={{
              html: data?.[0]?.info,
            }}
            baseStyle={s.detailsInfo}
            renderers={{ img: htmlImgRenderer }}
          />
        )}
      </View>
      <View>
        {data?.[1]?.image && (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: data?.[1]?.image }}
            style={s.smallDetailImage}
          />
        )}
        {data?.[1]?.title && (
          <Text style={[s.whiteText, s.detailsTitle]}>{data?.[1]?.title}</Text>
        )}
        {data?.[1]?.info && (
          <RenderHTML
            contentWidth={width}
            source={{
              html: data?.[1]?.info,
            }}
            baseStyle={s.detailsInfoCenter}
            renderers={{ img: htmlImgRenderer }}
          />
        )}
      </View>
      <View>
        {data?.[2]?.image && (
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: data?.[2]?.image }}
            style={s.bigDetailImage}
          />
        )}
        {data?.[2]?.title && (
          <Text style={[s.whiteText, s.detailsTitle]}>{data?.[2]?.title}</Text>
        )}
        {data?.[2]?.info && (
          <RenderHTML
            contentWidth={width - 60}
            source={{
              html: data?.[2]?.info,
            }}
            baseStyle={s.detailsInfo}
            renderers={{ img: htmlImgRenderer }}
            tagsStyles={{
              p: {
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                fontWeight: fontWeight.bold,
                flexWrap: 'nowrap',
                width: width - 75,
              },
              strong: {
                fontWeight: 'bold',
              },

              ul: {
                marginVertical: 10,
                width: '100%',
                // paddingVertical:spacing.lg
              },

              li: {
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: 6,
                width: '100%',
              },
            }}
          />
        )}
      </View>
    </View>
  );
};
