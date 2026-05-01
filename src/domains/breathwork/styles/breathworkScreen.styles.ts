import { StyleSheet } from 'react-native';

export const breathworkScreenStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020108',
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  upperStack: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: '12%',
  },
  phaseLabel: {
    marginTop: 8,
    fontSize: 40,
    fontWeight: '500',
    color: 'rgba(250, 250, 255, 0.94)',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  hint: {
    marginTop: 18,
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(199, 210, 254, 0.52)',
    textAlign: 'center',
    maxWidth: 300,
  },
  orbSpacer: {
    height: 32,
  },
  footer: {
    paddingBottom: 28,
    paddingTop: 12,
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
});
