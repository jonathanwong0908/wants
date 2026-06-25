import { useEffect } from "react";
import { AppState } from "react-native";

import { reconcileWaitingWantNotifications } from "@/lib/notifications";

export function useNotificationReconciliation(): void {
  useEffect(() => {
    void reconcileWaitingWantNotifications();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void reconcileWaitingWantNotifications();
      }
    });

    return () => subscription.remove();
  }, []);
}
