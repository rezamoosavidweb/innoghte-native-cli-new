export function collaborationApiMobile(raw: string): string {
  const d = raw.replace(/\D/g, '');
  return d.startsWith('00') ? d : `00${d}`;
}
