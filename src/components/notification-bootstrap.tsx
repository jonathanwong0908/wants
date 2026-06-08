import { useNotificationObserver } from "@/hooks/use-notification-observer";
import { useNotificationReconciliation } from "@/hooks/use-notification-reconciliation";

export function NotificationBootstrap() {
  useNotificationObserver();
  useNotificationReconciliation();
  return null;
}
