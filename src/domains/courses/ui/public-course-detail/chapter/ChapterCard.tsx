import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@/shared/ui/Text';
import { createPublicCourseDetailStyles } from '../publicCourseDetail.styles';
import getChapterConfig from './getChapterConfig';

import DiamondIcon from '@/assets/icons/diamond.svg';
import MeditationIcon from '@/assets/icons/meditation.svg';

const renderIcon = (name?: string) => {
  if (name === 'diamond') return <DiamondIcon width={40} height={30} />;
  if (name === 'meditation') return <MeditationIcon width={30} height={30} />;
  return <View />;
};

interface Props {
  title: string;
  shortInfo?: string | null;
  index: number;
}

const ChapterCard = ({ title, shortInfo, index }: Props) => {
  const { colors } = useTheme();
  const s = createPublicCourseDetailStyles(colors);

  const config = getChapterConfig(index);

  return (
    <View style={[s.chapterRow, config.reverse && s.rowReverse]}>
      {renderIcon(config.icon)}
      <View style={s.chapterCardContainer}>
        <Text style={s.chapterCardTitle}>{title}</Text>
        <Text style={s.chapterCardShortInfo}>{shortInfo}</Text>
      </View>
    </View>
  );
};

export default ChapterCard;
