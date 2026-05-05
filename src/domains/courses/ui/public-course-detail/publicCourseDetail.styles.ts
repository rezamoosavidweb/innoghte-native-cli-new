import { fontSize, fontWeight, spacing } from '@/ui/theme';
import type { Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

export function createPublicCourseDetailStyles(colors: Theme['colors']) {
  return StyleSheet.create({
    themText: { color: colors.text },
    primaryText: {
      color: colors.primary,
    },
    wrapper: {
      flex: 1,
    },
    scroll: { flex: 1, paddingVertical: spacing.lg },

    scrollContent: {
      paddingBottom: 28,
    },

    container: {
      zIndex: 1,
      paddingHorizontal: spacing.lg,
      position: 'relative',
    },
    cover: {
      width: '100%',
      height: 430,
      borderRadius: 12,
      marginTop: 8,
    },
    coverPh: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    floatingAction: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: spacing.base,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.xl,
    },
    floatingActionPriceContainer: {
      flex: 1,
    },
    floatingActionPriceText: {},
    floatingActionBtn: {
      flex: 1.8,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      marginTop: 4,
      textAlign: 'center',
    },
    short: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
      opacity: 0.9,
      padding: spacing.lg,
    },
    whiteText: {
      color: '#fff',
    },
    htmlWhiteText: {
      color: '#fff',
    },
    fullInfo: {
      alignSelf: 'center',
      marginVertical: spacing.md,
    },
    optionsContainer: {
      gap: spacing.md,
      marginVertical: spacing.xl,
    },
    actionRow: {
      flexDirection: 'row',
      gap: spacing.md,
      flex: 1,
      marginTop: spacing.md,
    },
    actionAlone: {
      marginTop: spacing.md,
      marginBottom: spacing['3xl'],
    },
    action: {
      flex: 1,
      color: '#fff',
      borderColor: '#fff',
    },
    full: {
      fontSize: 14,
      lineHeight: 22,
      textAlign: 'justify',
      opacity: 0.85,
    },
    optionItemContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    },
    diamond: {
      alignSelf: 'center',
    },
    optionItemIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 1,
    },
    detailsContainer: {
      gap: spacing.md,
      marginVertical: spacing.lg,
    },
    detailsTitle: {
      textAlign: 'center',
      fontWeight: fontWeight.bold,
      marginVertical: spacing.lg,
    },
    detailsTitle2: {
      fontWeight: fontWeight.bold,
      marginVertical: spacing.lg,
    },
    detailsInfo: {
      textAlign: 'justify',
      color: '#fff',
    },
    bigDetailImage: {
      width: '100%',
      height: 330,
      borderRadius: spacing.md,
    },
    price: {
      fontWeight: fontWeight.heavy,
      fontSize: fontSize.base,
    },
    smallDetailImage: {
      width: 70,
      height: 48,
      alignSelf: 'center',
    },
    detailsInfoCenter: {
      textAlign: 'center',
      color: '#fff',
      fontWeight: fontWeight.bold,
    },
    /** Space inline SVG bullets from following text; avoid `gap` (unsupported on some RN Android). */
    inlineSvgImg: {
      marginEnd: spacing.md,
      justifyContent: 'center',
    },
    chapterContainer: {
      padding: spacing.lg,
      gap: spacing.md,
      position: 'relative',
    },
    chapterTitle: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },

    chapterList: {
      gap: 16,
    },

    chapterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // paddingHorizontal: spacing.md,
      width: '100%',
    },

    rowReverse: {
      flexDirection: 'row-reverse',
    },

    chapterCardContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      maxWidth: '75%',
      zIndex: 2,
    },

    chapterCardTitle: {
      color: '#EC7D3E',
      fontWeight: '600',
      marginBottom: 4,
    },

    chapterCardShortInfo: {
      color: '#333',
    },

    decorationLeftTop: {
      position: 'absolute',
      left: -20,
      top: -120,
      width: 60,
      height: 120,
      resizeMode: 'contain',
    },

    decorationRightBottom: {
      position: 'absolute',
      right: -20,
      bottom: -120,
      width: 60,
      height: 120,
      resizeMode: 'contain',
    },
  });
}
