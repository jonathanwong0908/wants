import { and, asc, desc, eq, gt, isNull, or, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { items } from "@/db/schema";

export function selectAllItems() {
  return db.select().from(items).orderBy(asc(items.createdAt));
}

export function countAllItems() {
  return db
    .select({ count: sql<number>`count(*)` })
    .from(items);
}

export function selectWaitingItems() {
  return db
    .select()
    .from(items)
    .where(eq(items.status, "waiting"))
    .orderBy(asc(items.notifyAt));
}

export function selectWaitingItemsNeedingSchedule(now: Date) {
  return db
    .select()
    .from(items)
    .where(
      and(
        eq(items.status, "waiting"),
        isNull(items.notifId),
        gt(items.notifyAt, now)
      )
    )
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

export function selectSavingsByCurrency() {
  return db
    .select({
      currency: items.currency,
      totalSaved: sql<number>`coalesce(sum(${items.price}), 0)`,
      skippedCount: sql<number>`count(*)`,
    })
    .from(items)
    .where(eq(items.status, "skipped"))
    .groupBy(items.currency);
}
