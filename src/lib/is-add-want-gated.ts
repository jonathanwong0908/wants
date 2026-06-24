export function isAddWantGated(isPro: boolean, waitingCount: number): boolean {
  return !isPro && waitingCount >= 1;
}

export function isAddWantGatedWhenReady(
  isPro: boolean,
  waitingItems: unknown[] | undefined
): boolean | null {
  if (waitingItems === undefined) return null;
  return isAddWantGated(isPro, waitingItems.length);
}
