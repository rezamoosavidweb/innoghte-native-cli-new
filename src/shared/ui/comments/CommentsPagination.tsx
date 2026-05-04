import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { Text } from '@/shared/ui/Text';
import { Button } from '@/ui/components/Button';

const MORE_STR = '. . .';

function usePaginationPages(
  currentPage: number,
  totalPages: number,
): Array<number | typeof MORE_STR> {
  return React.useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const firstPages = [1, 2];
    const lastPages = [totalPages - 1, totalPages];
    const pages: Array<number | typeof MORE_STR> = [...firstPages];

    if (currentPage > 3) {
      pages.push(MORE_STR);
    }

    if (currentPage > 2 && currentPage < totalPages - 1) {
      pages.push(currentPage);
    }

    if (currentPage < totalPages - 2) {
      pages.push(MORE_STR);
    }

    pages.push(...lastPages);
    return pages;
  }, [currentPage, totalPages]);
}

export type CommentsPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const paginationLayout = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  arrowBtn: {
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  pageBtn: {
    minWidth: 28,
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
});

function createCommentsPaginationStyles(
  colors: Theme['colors'],
  disabledArrow: string,
  currentPage: number,
  totalPages: number,
) {
  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  return StyleSheet.create({
    prevBtnBorder: {
      borderColor: prevDisabled ? disabledArrow : colors.primary,
    },
    nextBtnBorder: {
      borderColor: nextDisabled ? disabledArrow : colors.primary,
    },
    prevLabel: {
      color: prevDisabled ? disabledArrow : colors.primary,
    },
    nextLabel: {
      color: nextDisabled ? disabledArrow : colors.primary,
    },
    arrowPressed: { opacity: 0.75 },
    pageBtnFace: { borderColor: colors.primary },
    pageBgSelected: { backgroundColor: colors.primary },
    pageBgIdle: { backgroundColor: 'transparent' },
    pagePressed: { opacity: 0.85 },
    pageNumSelected: { color: '#fff', fontWeight: '700' },
    pageNumIdle: { color: colors.primary, fontWeight: '500' },
    dots: {
      paddingHorizontal: 4,
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
  });
}

const CommentsPaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
}: CommentsPaginationProps) => {
  const { colors } = useTheme();
  const pages = usePaginationPages(currentPage, totalPages);

  const disabledArrow = colors.border ?? '#d9d9d9';
  const themed = createCommentsPaginationStyles(
    colors,
    disabledArrow,
    currentPage,
    totalPages,
  );

  const onPrev = React.useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const onNext = React.useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, onPageChange, totalPages]);

  return (
    <View style={paginationLayout.row}>
      <Button
        layout="auto"
        variant="text"
        title="Previous page"
        accessibilityLabel="Previous page"
        accessibilityState={{ disabled: currentPage === 1 }}
        disabled={currentPage === 1}
        onPress={onPrev}
        style={[paginationLayout.arrowBtn, themed.prevBtnBorder]}
        contentStyle={{ width: '100%' }}
      >
        <Text style={themed.prevLabel}>{'‹'}</Text>
      </Button>

      {pages.map((page, i) =>
        page === MORE_STR ? (
          <View
            key={`${String(page)}-${i}`}
            style={[
              paginationLayout.pageBtn,
              themed.pageBtnFace,
              themed.pageBgIdle,
            ]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Text style={themed.dots}>{MORE_STR}</Text>
          </View>
        ) : (
          <Button
            key={`${String(page)}-${i}`}
            layout="auto"
            variant="text"
            title={String(page)}
            accessibilityState={{ selected: currentPage === page }}
            onPress={() => {
              onPageChange(page as number);
            }}
            style={[
              paginationLayout.pageBtn,
              themed.pageBtnFace,
              currentPage === page ? themed.pageBgSelected : themed.pageBgIdle,
            ]}
            contentStyle={{ width: '100%' }}
          >
            <Text
              style={
                currentPage === page
                  ? themed.pageNumSelected
                  : themed.pageNumIdle
              }
            >
              {(page as number).toLocaleString()}
            </Text>
          </Button>
        ),
      )}

      <Button
        layout="auto"
        variant="text"
        title="Next page"
        accessibilityLabel="Next page"
        accessibilityState={{ disabled: currentPage === totalPages }}
        disabled={currentPage === totalPages}
        onPress={onNext}
        style={[paginationLayout.arrowBtn, themed.nextBtnBorder]}
        contentStyle={{ width: '100%' }}
      >
        <Text style={themed.nextLabel}>{'›'}</Text>
      </Button>
    </View>
  );
};

export const CommentsPagination = React.memo(CommentsPaginationComponent);
CommentsPagination.displayName = 'CommentsPagination';
