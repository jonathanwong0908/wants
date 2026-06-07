export function formatDecidedDate(decidedAt: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(decidedAt);
}
