import * as React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { PUBLIC_WEB_ORIGIN } from '@/shared/config/publicWebOrigin';
import { spacing } from '@/ui/theme';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.sm,
    direction: 'ltr',
  },
  touchable: {
    padding: 2,
  },
  image: {
    width: 62,
    height: 62,
  },
});

/** Same trust / verification links as `client-web` footer (javaz icons). */
const TRUST_SEALS: readonly {
  href: string;
  imageUri: string;
  accessibilityLabel: string;
}[] = [
  {
    href: `${PUBLIC_WEB_ORIGIN}/images/parvaneh1.jpg`,
    imageUri: `${PUBLIC_WEB_ORIGIN}/images/javaz5.png`,
    accessibilityLabel: 'javaz icon 5',
  },
  {
    href: 'https://logo.samandehi.ir/Verify.aspx?id=342048&p=xlaoaodsuiwkobpdaodsmcsi',
    imageUri: `${PUBLIC_WEB_ORIGIN}/images/javaz4.png`,
    accessibilityLabel: 'javaz icon 4',
  },
  {
    href: `${PUBLIC_WEB_ORIGIN}/images/parvaneh2.jpg`,
    imageUri: `${PUBLIC_WEB_ORIGIN}/images/javaz1.png`,
    accessibilityLabel: 'javaz icon 1',
  },
  {
    href: `${PUBLIC_WEB_ORIGIN}/images/parvaneh3.jpg`,
    imageUri: `${PUBLIC_WEB_ORIGIN}/images/javaz2.png`,
    accessibilityLabel: 'javaz icon 2',
  },
  {
    href: 'https://trustseal.enamad.ir/?id=317656&Code=fcrwv95fcAV5tvURENa5',
    imageUri: `${PUBLIC_WEB_ORIGIN}/images/javaz3.png`,
    accessibilityLabel: 'javaz icon 3',
  },
];

export const DrawerFooterSocials = React.memo(function DrawerFooterSocials() {
  return (
    <View style={[styles.row]}>
      {TRUST_SEALS.map(seal => (
        <TouchableOpacity
          key={seal.href}
          style={styles.touchable}
          accessibilityRole="link"
          accessibilityLabel={seal.accessibilityLabel}
          onPress={() => Linking.openURL(seal.href)}
        >
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: seal.imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
});

DrawerFooterSocials.displayName = 'DrawerFooterSocials';
