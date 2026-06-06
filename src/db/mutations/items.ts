import { db } from "@/db/client";
import { items } from "@/db/schema";
import type { ItemFormValues } from "@/lib/forms/item-form-schema";

export async function createItem(
  values: ItemFormValues,
  currencyCode: string
): Promise<void> {
  const now = new Date();
  const notifyAt = new Date(now.getTime() + values.delayHours * 60 * 60 * 1000);

  await db.insert(items).values({
    name: values.name.trim(),
    price: values.price,
    currency: currencyCode,
    delayHours: values.delayHours,
    notifyAt,
    notifId: null,
    status: "waiting",
    createdAt: now,
    decidedAt: null,
    note: values.note.trim() || null,
  });
}
