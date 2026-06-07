import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { items, type ItemStatus } from "@/db/schema";
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

type UpdateItemContext = {
  currencyCode: string;
  status: ItemStatus;
  createdAt: Date;
  previousDelayHours: number;
  previousNotifId: string | null;
};

export async function updateItem(
  id: number,
  values: ItemFormValues,
  context: UpdateItemContext
): Promise<void> {
  const updates: Partial<typeof items.$inferInsert> = {
    name: values.name.trim(),
    price: values.price,
    currency: context.currencyCode,
    note: values.note.trim() || null,
  };

  if (context.status === "waiting") {
    updates.delayHours = values.delayHours;

    if (values.delayHours !== context.previousDelayHours) {
      updates.notifyAt = new Date(
        context.createdAt.getTime() + values.delayHours * 60 * 60 * 1000
      );

      // When notifications are implemented:
      // if (updates.notifyAt or delayHours changed) {
      //   await cancelNotification(context.previousNotifId);
      //   const newNotifId = await scheduleNotification(updates.notifyAt, ...);
      //   updates.notifId = newNotifId;
      // }
    }
  }

  await db.update(items).set(updates).where(eq(items.id, id));
}
