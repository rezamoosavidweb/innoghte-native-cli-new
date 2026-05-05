import { CatalogItemDetail } from '@/shared/catalog/model/catalogItemDetail.schema';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { createPublicCourseDetailStyles } from '../publicCourseDetail.styles';
import ChapterCard from './ChapterCard';
import LinDecoration from '@/assets/line-decoration-gray.svg';
import { decorations } from './getChapterConfig';

const PublicChapters = ({ data }: { data: CatalogItemDetail['chapters'] }) => {
  const { colors } = useTheme();
  const s = createPublicCourseDetailStyles(colors);
  return (
    <View style={s.chapterContainer}>
      <Text style={s.chapterTitle}>سرفصل‌های دوره</Text>

      <View style={s.chapterList}>
        {data?.map((item, index) => (
          <ChapterCard
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
                height='640'
                style={{ position: 'absolute', height: 300, ...item?.styles }}
              />
            ),
        )}
      </View>
    </View>
  );
};

export default PublicChapters;
