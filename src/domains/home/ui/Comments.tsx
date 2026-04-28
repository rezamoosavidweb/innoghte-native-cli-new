import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { HOME_COMMENTS_MOCK } from '@/domains/home/model/comments.mock';
import { useCommentsSectionStyles } from '@/domains/home/ui/comments.styles';
import { CommentCarousel } from '@/shared/ui/CommentCarousel';

const CommentsComponent = () => {
  const { colors } = useTheme();
  const styles = useCommentsSectionStyles(colors);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>نظرات کاربران</Text>
        <Text style={styles.subtitle}>
          تجربه‌ی واقعی هنرجویان از دوره‌ها و محتوای ما
        </Text>
      </View>

      <CommentCarousel
        data={HOME_COMMENTS_MOCK}
        autoPlay
        autoPlayInterval={4500}
        loop
        height={210}
        numberOfLines={4}
        
      />
    </View>
  );
};

export const Comments = React.memo(CommentsComponent);
Comments.displayName = 'HomeComments';
