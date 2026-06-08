import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";

import { getNotificationPermissionGranted } from "@/lib/notifications";

type NotificationPermissionState = {
  granted: boolean;
  status: Notifications.PermissionStatus | null;
  refresh: () => Promise<void>;
};

export function useNotificationPermission(): NotificationPermissionState {
  const [granted, setGranted] = useState(false);
  const [status, setStatus] = useState<Notifications.PermissionStatus | null>(
    null
  );

  const refresh = useCallback(async () => {
    const settings = await Notifications.getPermissionsAsync();
    setStatus(settings.status);
    setGranted(await getNotificationPermissionGranted());
  }, []);

  useEffect(() => {
    void refresh();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void refresh();
      }
    });

    return () => subscription.remove();
  }, [refresh]);

  return { granted, status, refresh };
}
