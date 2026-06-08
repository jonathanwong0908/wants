import { useEffect } from "react";
import { AppState } from "react-native";

import { setItemNotifId } from "@/db/mutations/items";
import { selectWaitingItemsNeedingSchedule } from "@/db/queries/items";
import {
  ensureNotificationSetup,
  scheduleWantNotification,
} from "@/lib/notifications";

async function reconcileWaitingItemNotifications(): Promise<void> {
  await ensureNotificationSetup();

  const now = new Date();
  const itemsNeedingSchedule = await selectWaitingItemsNeedingSchedule(now);

  for (const item of itemsNeedingSchedule) {
    const notifId = await scheduleWantNotification(item);
    if (notifId) {
      await setItemNotifId(item.id, notifId);
    }
  }
}

export function useNotificationReconciliation(): void {
  useEffect(() => {
    void reconcileWaitingItemNotifications();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void reconcileWaitingItemNotifications();
      }
    });

    return () => subscription.remove();
  }, []);
}
