import { StyleSheet } from 'react-native';

export function createCollapsibleShellInsetStyles(
  paddingTop: number,
  minHeight: number,
) {
  return StyleSheet.create({
    shell: { paddingTop, minHeight },
  });
}

export function createCollapsibleRowMinHeightStyles(minHeight: number) {
  return StyleSheet.create({
    row: { minHeight },
  });
}

export function createCollapsibleStaticTitleColorStyles(color: string) {
  return StyleSheet.create({
    title: { color },
  });
}
