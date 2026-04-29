import type { Auth401PolicyInput } from '@/shared/infra/auth401/types';

/**
 * LIFO stack of focused-screen policies. Top = innermost focused screen.
 * No React context: avoids subtree re-renders. Mutations only from navigation focus hooks.
 */
const screenPolicyStack: Auth401PolicyInput[] = [];

export function pushAuth401ScreenPolicy(policy: Auth401PolicyInput): () => void {
  screenPolicyStack.push(policy);
  return () => {
    const i = screenPolicyStack.lastIndexOf(policy);
    if (i !== -1) {
      screenPolicyStack.splice(i, 1);
    }
  };
}

export function getFocusedAuth401ScreenPolicy(): Auth401PolicyInput | undefined {
  if (screenPolicyStack.length === 0) {
    return undefined;
  }
  return screenPolicyStack[screenPolicyStack.length - 1];
}
