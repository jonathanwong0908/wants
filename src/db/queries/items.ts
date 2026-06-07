import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { items } from "@/db/schema";

export function selectWaitingItems() {
  return db
    .select()
    .from(items)
    .where(eq(items.status, "waiting"))
    .orderBy(asc(items.notifyAt));
}
