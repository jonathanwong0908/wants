export function formatCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

/** Placeholder countdown copy for upcoming wants (full timer comes later). */
export function formatCountdownUntil(notifyAtMs: number, nowMs: number = Date.now()): string {
  const diff = notifyAtMs - nowMs;
  if (diff <= 0) {
    return "Ready";
  }
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `${days}d left`;
  }
  if (hours > 0) {
    return `${hours}h left`;
  }
  const mins = Math.max(1, Math.floor(diff / (60 * 1000)));
  return `${mins}m left`;
}
