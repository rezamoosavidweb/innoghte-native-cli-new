import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { hexAlpha } from '@/ui/theme/utils/colorUtils';

export type CommentsSkeletonProps = {
  count?: number;
};

function createSkeletonCardStyles(height: number, surface: string) {
  return StyleSheet.create({
    fill: { height, backgroundColor: surface },
  });
}

const CommentSkeletonCard = React.memo(function CommentSkeletonCard({
  height,
  surface,
}: {
  height: number;
  surface: string;
}) {
  const dynamic = createSkeletonCardStyles(height, surface);
  return <View style={[styles.card, dynamic.fill]} />;
});
CommentSkeletonCard.displayName = 'CommentSkeletonCard';

function CommentsSkeletonComponent({ count = 4 }: CommentsSkeletonProps) {
  const { colors } = useTheme();
  const surface = hexAlpha(colors.border, 0.2);

  const items = React.useMemo(
    () => Array.from({ length: count }, (_, index) => index),
    [count],
  );

  return (
    <>
      {items.map(id => (
        <CommentSkeletonCard key={id} height={id % 2 === 0 ? 100 : 120} surface={surface} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 12,
  },
});

export const CommentsSkeleton = React.memo(CommentsSkeletonComponent);
CommentsSkeleton.displayName = 'CommentsSkeleton';
