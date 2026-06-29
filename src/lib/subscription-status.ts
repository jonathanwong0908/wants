export function getSubscriptionHubLabel(isPro: boolean): string {
  if (!isPro) return "Free";
  return "Pro";
}

export function getSubscriptionStatusTitle(isPro: boolean): string {
  if (!isPro) return "Free plan";
  return "Lifetime Pro";
}
