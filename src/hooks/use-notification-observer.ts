import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import { selectItemById } from "@/db/queries/items";
import {
  parseNotificationItemId,
  ensureNotificationSetup,
} from "@/lib/notifications";
import { pushWantRoute } from "@/lib/push-want-route";

async function handleNotificationResponse(
  response: Notifications.NotificationResponse
): Promise<void> {
  if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
    return;
  }

  const itemId = parseNotificationItemId(
    response.notification.request.content.data as Record<string, unknown>
  );

  if (itemId == null) {
    return;
  }

  const rows = await selectItemById(itemId);
  if (rows.length === 0) {
    return;
  }

  pushWantRoute(itemId);
  Notifications.clearLastNotificationResponse();
}

export function useNotificationObserver(): void {
  useEffect(() => {
    void ensureNotificationSetup();

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) {
      void handleNotificationResponse(lastResponse);
    }

    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        void handleNotificationResponse(response);
      });

    return () => subscription.remove();
  }, []);
}
