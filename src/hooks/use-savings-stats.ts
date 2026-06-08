import { selectSavingsStats } from "@/db/queries/items";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useSavingsStats(currencyCode: string) {
  const { data } = useLiveQuery(selectSavingsStats(currencyCode), [
    currencyCode,
  ]);
  const row = data?.[0];

  return {
    totalSaved: row?.totalSaved ?? 0,
    skippedCount: row?.skippedCount ?? 0,
    boughtCount: row?.boughtCount ?? 0,
    hasOtherCurrencySkipped: (row?.otherCurrencySkippedCount ?? 0) > 0,
  };
}
