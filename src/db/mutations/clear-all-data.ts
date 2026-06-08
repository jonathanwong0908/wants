import { sql } from "drizzle-orm";

import { db } from "@/db/client";
import { items } from "@/db/schema";
import { cancelAllWantNotifications } from "@/lib/notifications";

export async function clearAllItems(): Promise<void> {
  await cancelAllWantNotifications();
  // WHERE is required so expo-sqlite change listeners fire useLiveQuery updates.
  await db.delete(items).where(sql`1 = 1`);
}
