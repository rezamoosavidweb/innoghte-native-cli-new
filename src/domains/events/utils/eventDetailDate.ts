export function isEventPast(startAt: string | null | undefined, now = Date.now()): boolean {
  if (!startAt) {
    return false;
  }
  const timestamp = Date.parse(startAt);
  return Number.isFinite(timestamp) && timestamp < now;
}

function formatPart(
  startAt: string | null | undefined,
  options: Intl.DateTimeFormatOptions,
): string {
  if (!startAt) {
    return '';
  }
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('fa-IR', options).format(date);
}

export function formatEventDate(startAt: string | null | undefined): string {
  return formatPart(startAt, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatEventTime(startAt: string | null | undefined): string {
  return formatPart(startAt, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
