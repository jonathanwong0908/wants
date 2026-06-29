export function formatNotifyAtDateTime(notifyAt: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(notifyAt);
}

export function formatDecidedDate(decidedAt: Date): string {
  return formatAddedDate(decidedAt);
}

export function formatAddedDate(createdAt: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(createdAt);
}
