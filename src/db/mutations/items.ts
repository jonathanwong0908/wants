import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { items, type ItemStatus } from "@/db/schema";
import {
  computeNotifyAt,
  type ItemFormValues,
} from "@/lib/forms/item-form-schema";
import {
  cancelWantNotification,
  rescheduleWantNotification,
  scheduleWantNotification,
} from "@/lib/notifications";

export async function createItem(
  values: ItemFormValues,
  currencyCode: string
): Promise<number> {
  const now = new Date();
  const notifyAt = computeNotifyAt(now, values.delayHours);

  const [inserted] = await db
    .insert(items)
    .values({
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
    })
    .returning();

  const notifId = await scheduleWantNotification(inserted);

  if (notifId) {
    await db
      .update(items)
      .set({ notifId })
      .where(eq(items.id, inserted.id));
  }

  return inserted.id;
}

type UpdateItemContext = {
  currencyCode: string;
  status: ItemStatus;
  createdAt: Date;
  previousName: string;
  previousPrice: number;
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

    const delayChanged = values.delayHours !== context.previousDelayHours;
    const nameChanged = values.name.trim() !== context.previousName;
    const priceChanged = values.price !== context.previousPrice;

    if (delayChanged) {
      updates.notifyAt = computeNotifyAt(context.createdAt, values.delayHours);
    }

    if (delayChanged || nameChanged || priceChanged) {
      const nextNotifyAt =
        updates.notifyAt ?? computeNotifyAt(context.createdAt, values.delayHours);

      const notifId = await rescheduleWantNotification(context.previousNotifId, {
        id,
        name: values.name.trim(),
        price: values.price,
        currency: context.currencyCode,
        delayHours: values.delayHours,
        notifyAt: nextNotifyAt,
      });

      updates.notifId = notifId;
      if (!delayChanged) {
        updates.notifyAt = nextNotifyAt;
      }
    }
  }

  await db.update(items).set(updates).where(eq(items.id, id));
}

export async function setItemNotifId(
  id: number,
  notifId: string | null
): Promise<void> {
  await db.update(items).set({ notifId }).where(eq(items.id, id));
}

type DeleteItemContext = {
  notifId: string | null;
};

export async function deleteItem(
  id: number,
  context: DeleteItemContext
): Promise<void> {
  await cancelWantNotification(context.notifId);
  await db.delete(items).where(eq(items.id, id));
}

type SkipItemContext = {
  notifId: string | null;
};

export async function skipItem(
  id: number,
  context: SkipItemContext
): Promise<void> {
  await cancelWantNotification(context.notifId);

  await db
    .update(items)
    .set({ status: "skipped", decidedAt: new Date() })
    .where(and(eq(items.id, id), eq(items.status, "waiting")));
}

type BuyItemContext = {
  notifId: string | null;
};

export async function buyItem(
  id: number,
  context: BuyItemContext
): Promise<void> {
  await cancelWantNotification(context.notifId);

  await db
    .update(items)
    .set({ status: "bought", decidedAt: new Date() })
    .where(and(eq(items.id, id), eq(items.status, "waiting")));
}
