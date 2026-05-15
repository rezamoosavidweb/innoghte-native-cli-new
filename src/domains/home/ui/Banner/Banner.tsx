import lampImage from '@/assets/images/new-banner/Lamp.png';
import parImage from '@/assets/images/new-banner/Par.png';
import image from '@/assets/images/new-banner/web-back.jpg';
import React from 'react';
import { Image, ImageBackground, View } from 'react-native';
import { useBannerStyles } from './banner.styles';

export default function BannerNew() {
  const styles = useBannerStyles();
  return (
    <ImageBackground
      source={image}
      style={styles.background}
      resizeMode="cover"
      accessibilityIgnoresInvertColors
    >
      <View pointerEvents="none">
        <Image
          accessibilityIgnoresInvertColors
          source={lampImage}
          style={styles.lamp}
          resizeMode="contain"
        />
        <Image
          accessibilityIgnoresInvertColors
          source={parImage}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </View>
    </ImageBackground>
  );
}
