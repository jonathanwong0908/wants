import * as Notifications from "expo-notifications";
import { eq } from "drizzle-orm";
import { Platform } from "react-native";

import { db } from "@/db/client";
import { selectWaitingItems } from "@/db/queries/items";
import { items } from "@/db/schema";
import { formatCurrency } from "@/lib/money-format";

export const WANTS_NOTIFICATION_CHANNEL_ID = "wants-decisions";
export const IOS_MAX_SCHEDULED_LOCAL_NOTIFICATIONS = 64;

type ItemRow = typeof items.$inferSelect;

type ItemForNotification = Pick<
  ItemRow,
  "id" | "name" | "price" | "currency" | "delayHours" | "notifyAt"
>;

async function persistItemNotifId(
  id: number,
  notifId: string | null
): Promise<void> {
  await db.update(items).set({ notifId }).where(eq(items.id, id));
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let setupComplete = false;

export async function ensureNotificationSetup(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  if (setupComplete) {
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      WANTS_NOTIFICATION_CHANNEL_ID,
      {
        name: "Want reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
      }
    );
  }

  setupComplete = true;
}

export async function getNotificationPermissionGranted(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export function buildWantNotificationContent(
  item: ItemForNotification
): Notifications.NotificationContentInput {
  return {
    title: "Still want this?",
    body: `You added ${item.name} ${formatCurrency(
      item.price,
      item.currency
    )}.`,
    data: { itemId: String(item.id) },
    ...(Platform.OS === "android"
      ? { channelId: WANTS_NOTIFICATION_CHANNEL_ID }
      : {}),
  };
}

export async function scheduleWantNotification(
  item: ItemForNotification
): Promise<string | null> {
  if (Platform.OS === "web") {
    return null;
  }

  if (item.notifyAt.getTime() <= Date.now()) {
    return null;
  }

  await ensureNotificationSetup();

  return Notifications.scheduleNotificationAsync({
    content: buildWantNotificationContent(item),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: item.notifyAt,
      ...(Platform.OS === "android"
        ? { channelId: WANTS_NOTIFICATION_CHANNEL_ID }
        : {}),
    },
  });
}

export async function cancelWantNotification(
  notifId: string | null | undefined
): Promise<void> {
  if (Platform.OS === "web" || !notifId) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(notifId);
}

export async function cancelAllWantNotifications(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
}

let reconcileInFlight: Promise<void> | null = null;

async function doReconcileWaitingWantNotifications(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  if (!(await getNotificationPermissionGranted())) {
    return;
  }

  await ensureNotificationSetup();

  const now = Date.now();
  const waitingItems = await selectWaitingItems();

  const future: ItemRow[] = [];
  const expiredWaiting: ItemRow[] = [];

  for (const item of waitingItems) {
    if (item.notifyAt.getTime() > now) {
      future.push(item);
    } else {
      expiredWaiting.push(item);
    }
  }

  const maxScheduled =
    Platform.OS === "ios"
      ? IOS_MAX_SCHEDULED_LOCAL_NOTIFICATIONS
      : future.length;

  const prioritized = future.slice(0, maxScheduled);
  const deprioritized = future.slice(maxScheduled);

  const osScheduled = await Notifications.getAllScheduledNotificationsAsync();
  const osIds = new Set(osScheduled.map((request) => request.identifier));

  for (const item of expiredWaiting) {
    if (item.notifId) {
      await cancelWantNotification(item.notifId);
      await persistItemNotifId(item.id, null);
    }
  }

  for (const item of deprioritized) {
    if (item.notifId) {
      await cancelWantNotification(item.notifId);
      await persistItemNotifId(item.id, null);
    }
  }

  for (const item of prioritized) {
    const needsSchedule = !item.notifId || !osIds.has(item.notifId);
    if (!needsSchedule) {
      continue;
    }

    await cancelWantNotification(item.notifId);
    const notifId = await scheduleWantNotification(item);
    await persistItemNotifId(item.id, notifId);
  }
}

export function reconcileWaitingWantNotifications(): Promise<void> {
  if (!reconcileInFlight) {
    reconcileInFlight = doReconcileWaitingWantNotifications().finally(() => {
      reconcileInFlight = null;
    });
  }

  return reconcileInFlight;
}

export function parseNotificationItemId(
  data: Record<string, unknown> | undefined
): number | null {
  const raw = data?.itemId;
  if (typeof raw !== "string" && typeof raw !== "number") {
    return null;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}
