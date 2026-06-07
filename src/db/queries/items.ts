import { asc, desc, eq, or, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { items } from "@/db/schema";

export function selectWaitingItems() {
  return db
    .select()
    .from(items)
    .where(eq(items.status, "waiting"))
    .orderBy(asc(items.notifyAt));
}

export function selectPastItems() {
  return db
    .select()
    .from(items)
    .where(or(eq(items.status, "skipped"), eq(items.status, "bought")))
    .orderBy(desc(items.decidedAt));
}

export function selectItemById(id: number) {
  return db.select().from(items).where(eq(items.id, id)).limit(1);
}

export function selectSavingsStats(currencyCode: string) {
  return db
    .select({
      totalSaved: sql<number>`coalesce(sum(case when ${items.status} = 'skipped' and ${items.currency} = ${currencyCode} then ${items.price} else 0 end), 0)`,
      skippedCount: sql<number>`coalesce(sum(case when ${items.status} = 'skipped' then 1 else 0 end), 0)`,
      boughtCount: sql<number>`coalesce(sum(case when ${items.status} = 'bought' then 1 else 0 end), 0)`,
      otherCurrencySkippedCount: sql<number>`coalesce(sum(case when ${items.status} = 'skipped' and ${items.currency} != ${currencyCode} then 1 else 0 end), 0)`,
    })
    .from(items);
}
