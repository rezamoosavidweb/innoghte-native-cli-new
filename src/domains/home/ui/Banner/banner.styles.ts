import { StyleSheet, useWindowDimensions } from 'react-native';

export function useBannerStyles() {
  const { height } = useWindowDimensions();
  return StyleSheet.create({
    background: {
      flex: 1,
      position: 'relative',
      height: height - 50,
    },
    lamp: {
      width: 200,
      position: 'absolute',
      right: -30,
      top: -90,
    },
    mainImage: {
      width: 320,
      alignSelf: 'center',
      marginTop: 260,
    },
  });
}

export type BannerStyles = ReturnType<typeof useBannerStyles>;
