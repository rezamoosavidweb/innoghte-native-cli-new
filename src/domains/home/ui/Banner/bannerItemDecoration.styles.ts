import { StyleSheet } from 'react-native';

export type BannerDecorationLayout = {
  lampHeight: number;
  lampWidth: number;
  lampTop: number;
  lampLeft: number;
  parSize: number;
  parTop: number;
};

export function createBannerDecorationStyles(layout: BannerDecorationLayout) {
  return StyleSheet.create({
    lampWrap: {
      position: 'absolute',
      top: layout.lampTop,
      left: layout.lampLeft,
      width: layout.lampWidth,
      height: layout.lampHeight,
      zIndex: 1,
    },
    parAnchor: {
      position: 'absolute',
      top: layout.parTop,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 3,
    },
    parImage: {
      width: layout.parSize,
      height: layout.parSize,
    },
  });
}
