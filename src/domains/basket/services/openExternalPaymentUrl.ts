import { Linking } from 'react-native';

export async function openExternalPaymentUrl(url: string): Promise<void> {
  const can = await Linking.canOpenURL(url);
  if (!can) {
    throw new Error('Cannot open payment URL');
  }
  await Linking.openURL(url);
}
