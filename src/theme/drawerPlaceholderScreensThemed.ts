import type { Theme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

export function useExampleScreenStyles(colors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          padding: 24,
          gap: 12,
          backgroundColor: colors.background,
        },
        title: { fontSize: 22, fontWeight: '700', color: colors.text },
        sub: {
          fontSize: 15,
          lineHeight: 22,
          opacity: 0.8,
          color: colors.text,
        },
        actions: { marginTop: 16, gap: 10, alignItems: 'stretch' },
      }),
    [colors.background, colors.text],
  );
}

export function useLegacyMenuPlaceholderStyles(colors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          padding: 24,
          gap: 12,
          backgroundColor: colors.background,
        },
        title: { fontSize: 20, fontWeight: '700', color: colors.text },
        body: {
          fontSize: 15,
          lineHeight: 22,
          opacity: 0.85,
          color: colors.text,
        },
      }),
    [colors.background, colors.text],
  );
}

export function useStartupScreenStyles(colors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        safe: { flex: 1, backgroundColor: colors.background },
        scroll: { padding: 24, gap: 14 },
        title: { fontSize: 22, fontWeight: '700', color: colors.text },
        body: {
          fontSize: 15,
          lineHeight: 22,
          opacity: 0.85,
          color: colors.text,
        },
        actions: { marginTop: 20, gap: 10 },
      }),
    [colors.background, colors.text],
  );
}

export function useLoginScreenStyles(colors: Theme['colors']) {
  return React.useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1, backgroundColor: colors.background },
        inner: {
          flex: 1,
          padding: 20,
          justifyContent: 'center',
          gap: 12,
          maxWidth: 400,
          alignSelf: 'center',
          width: '100%',
        },
        title: {
          fontSize: 26,
          fontWeight: '700',
          textAlign: 'center',
          color: colors.text,
        },
        sub: {
          fontSize: 14,
          lineHeight: 20,
          textAlign: 'center',
          opacity: 0.8,
          marginBottom: 8,
          color: colors.text,
        },
        input: {
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 16,
          borderColor: colors.border,
          color: colors.text,
          backgroundColor: colors.card,
        },
      }),
    [colors.background, colors.border, colors.card, colors.text],
  );
}
