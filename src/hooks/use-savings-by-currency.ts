import { selectSavingsByCurrency } from "@/db/queries/items";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

export type SavingsByCurrencyRow = {
  currency: string;
  totalSaved: number;
  skippedCount: number;
};

function sortSavingsByCurrency(
  rows: SavingsByCurrencyRow[],
  settingsCurrencyCode: string
): SavingsByCurrencyRow[] {
  return [...rows].sort((a, b) => {
    if (a.currency === settingsCurrencyCode) return -1;
    if (b.currency === settingsCurrencyCode) return 1;
    return a.currency.localeCompare(b.currency);
  });
}

export function useSavingsByCurrency(settingsCurrencyCode: string) {
  const { data } = useLiveQuery(selectSavingsByCurrency(), []);

  const rows = useMemo(() => {
    const raw: SavingsByCurrencyRow[] = (data ?? []).map((row) => ({
      currency: row.currency,
      totalSaved: row.totalSaved,
      skippedCount: row.skippedCount,
    }));
    return sortSavingsByCurrency(raw, settingsCurrencyCode);
  }, [data, settingsCurrencyCode]);

  return { rows };
}
