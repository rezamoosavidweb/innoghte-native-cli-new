export function buildScrollMemoryKey(queryKeyParts: readonly unknown[]): string {
  return `scroll:list:${JSON.stringify(queryKeyParts)}`;
}
