import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/ui/theme';
import { createPublicCourseDetailStyles } from '../publicCourseDetail.styles';
import ChapterRow from './ChapterRow';
import LinDecoration from '@/assets/line-decoration-gray.svg';
import { decorations } from './getChapterConfig';

export type PublicChapterItem = Readonly<{
  id: number;
  title_fa: string;
  short_info?: string | null;
}>;

const PublicChapters = ({ data }: { data: readonly PublicChapterItem[] }) => {
  const colors = useThemeColors();
  const s = createPublicCourseDetailStyles(colors);
  return (
    <View style={s.chapterContainer}>
      <Text style={s.chapterTitle}>سرفصل‌های دوره</Text>

      <View style={s.chapterList}>
        {data?.map((item, index) => (
          <ChapterRow
            key={item.id}
            index={index}
            title={item?.title_fa}
            shortInfo={item?.short_info}
          />
        ))}
        {decorations.map(
          (item, index) =>
            data &&
            item.condition(data?.length) && (
              <LinDecoration
                key={index}
                fill={colors.text}
                height="520"
                style={{ position: 'absolute', height: 300, ...item?.styles }}
              />
            ),
        )}
      </View>
    </View>
  );
};

export default PublicChapters;
