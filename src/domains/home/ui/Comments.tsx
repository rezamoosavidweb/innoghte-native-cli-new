import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {View} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/ui/Text';

import { usePublicComments } from '@/domains/home/hooks/usePublicComments';
import { createCommentsSectionStyles } from '@/domains/home/ui/comments.styles';
import {
  CommentCarousel,
  DEFAULT_AUTOPLAY_INTERVAL,
} from './CommentCarousel';

const COMMENTS_CAROUSEL_HEIGHT = 210;

const CommentsComponent = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createCommentsSectionStyles(colors, theme);
  const { t } = useTranslation();
  const { data } = usePublicComments(1, 20);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('screens.home.comments.title')}</Text>
        <Text style={styles.subtitle}>
          {t('screens.home.comments.subtitle')}
        </Text>
      </View>

      <CommentCarousel
        data={data ?? []}
        autoPlay
        autoPlayInterval={DEFAULT_AUTOPLAY_INTERVAL}
        loop
        height={COMMENTS_CAROUSEL_HEIGHT}
        numberOfLines={5}
      />
    </View>
  );
};

export const Comments = React.memo(CommentsComponent);
Comments.displayName = 'HomeComments';
