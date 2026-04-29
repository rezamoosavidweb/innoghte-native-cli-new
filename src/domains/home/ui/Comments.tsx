import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { HOME_COMMENTS_MOCK } from '@/domains/home/model/comments.mock';
import { useCommentsSectionStyles } from '@/domains/home/ui/comments.styles';
import { CommentCarousel, DEFAULT_AUTOPLAY_INTERVAL } from '@/shared/ui/CommentCarousel';

const COMMENTS_CAROUSEL_HEIGHT = 210;

const CommentsComponent = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useCommentsSectionStyles(colors);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.home.comments.title')}</Text>
        <Text style={styles.subtitle}>
          {t('screens.home.comments.subtitle')}
        </Text>
      </View>

      <CommentCarousel
        data={HOME_COMMENTS_MOCK}
        autoPlay
        autoPlayInterval={DEFAULT_AUTOPLAY_INTERVAL}
        loop
        height={COMMENTS_CAROUSEL_HEIGHT}
        numberOfLines={4}
      />
    </View>
  );
};

export const Comments = React.memo(CommentsComponent);
Comments.displayName = 'HomeComments';
