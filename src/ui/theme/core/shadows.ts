import { Platform, type ViewStyle } from 'react-native';

/** Elevation-style shadows (card / FAB). Prefer static objects from callers. */
export function cardShadow(elevation: 0 | 1 | 2 | 3): Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
> {
  if (elevation === 0) {
    return {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    };
  }

  const opacity = elevation === 1 ? 0.08 : elevation === 2 ? 0.12 : 0.16;
  const shadowRadius = elevation === 1 ? 4 : elevation === 2 ? 8 : 12;
  const y = elevation === 1 ? 2 : elevation === 2 ? 4 : 6;

  return Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: y },
      shadowOpacity: opacity,
      shadowRadius,
      elevation: 0,
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: elevation + 1,
    },
  })!;
}
