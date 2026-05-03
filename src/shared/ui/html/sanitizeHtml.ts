/** Strips tags from server HTML snippets and decodes basic entities. No script execution. */
const BLOCKED_TAG =
  /<\/?(?:script|iframe|object|embed|style|link|meta|base|form|input|button|textarea|select|option)[^>]*>/gi;
const EVENT_HANDLER =
  /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;

export function sanitizeHtmlToPlainText(html: string): string {
  if (!html.trim()) {
    return '';
  }
  let s = html.replace(BLOCKED_TAG, '');
  s = s.replace(EVENT_HANDLER, '');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n');
  s = s.replace(/<[^>]+>/g, '');
  s = decodeBasicEntities(s);
  return s.replace(/\n{3,}/g, '\n\n').trim();
}

function decodeBasicEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
