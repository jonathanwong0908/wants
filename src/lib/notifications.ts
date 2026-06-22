import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { items } from "@/db/schema";
import { formatCurrency } from "@/lib/money-format";

export const WANTS_NOTIFICATION_CHANNEL_ID = "wants-decisions";

type ItemForNotification = Pick<
  typeof items.$inferSelect,
  "id" | "name" | "price" | "currency" | "delayHours" | "notifyAt"
>;

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

export async function rescheduleWantNotification(
  previousNotifId: string | null,
  item: ItemForNotification
): Promise<string | null> {
  await cancelWantNotification(previousNotifId);
  return scheduleWantNotification(item);
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
