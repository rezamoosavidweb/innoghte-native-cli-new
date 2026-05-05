import { View } from 'react-native';
import React from 'react';

interface Props {
  bgColor: string;
  top?: number;
  bottom?: number;
}
export default function BackgroundLayer({
  bgColor,
  bottom = 0,
  top = 0,
}: Props) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        bottom,
        backgroundColor: bgColor || 'transparent',
        zIndex: 0,
      }}
    />
  );
}
