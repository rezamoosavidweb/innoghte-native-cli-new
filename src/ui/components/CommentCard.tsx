import StartIcon from '@/assets/icons/star.svg';
import { Text } from '@/shared/ui/Text';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { createCommentCarouselStyles } from './commentCad.styles';

export type CommentItem = {
  user?: string | null;
  createdAt?: string | null;
  courseTitle?: string | null;
  content: string;
};

type CommentCardProps = {
  content: string;
  writer?: string | null;
  createdAt?: string | null;
  courseTitle?: string | null;
  index: number;
  starColor: string;
  anonymousLabel: string;
  numberOfLines: number;
};

export const CommentCard = React.memo(function CommentCard({
  writer,
  content,
  courseTitle,
  starColor,
  anonymousLabel,
  numberOfLines,
}: CommentCardProps) {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createCommentCarouselStyles(colors, theme);
  const userLabel =
    typeof writer === 'string' && writer.trim().length > 0
      ? writer
      : anonymousLabel;

  const courseLabel =
    typeof courseTitle === 'string' && courseTitle.trim().length > 0
      ? courseTitle
      : null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.userText} numberOfLines={1}>
          {userLabel}
        </Text>
        <View style={styles.starContainer}>
          {[...Array(5)].map((_, i) => (
            <StartIcon key={i} width={14} color={starColor} />
          ))}
        </View>
      </View>

      {courseLabel ? (
        <Text style={styles.courseText} numberOfLines={1}>
          {courseLabel}
        </Text>
      ) : null}

      <Text style={styles.contentText} numberOfLines={numberOfLines}>
        {content}
      </Text>
    </View>
  );
});
CommentCard.displayName = 'CommentCard';
