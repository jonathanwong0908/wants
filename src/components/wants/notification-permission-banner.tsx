import { Text } from "@/components/ui/text";
import { NOTIFICATION_BANNER_DISMISSED_AT_KEY } from "@/constants/storage-keys";
import type { items } from "@/db/schema";
import Storage from "expo-sqlite/kv-store";
import { X } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Pressable, useColorScheme, View } from "react-native";

import { pushHomeAreaRoute } from "@/lib/push-home-routes";
import { THEME } from "@/lib/theme";

type Item = typeof items.$inferSelect;

type NotificationPermissionBannerProps = {
  granted: boolean;
  waitingItems: Item[];
};

function readDismissedAtMs(): number | null {
  const raw = Storage.getItemSync(NOTIFICATION_BANNER_DISMISSED_AT_KEY);
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function shouldShowBanner(
  granted: boolean,
  waitingItems: Item[],
  dismissedAtMs: number | null
): boolean {
  if (granted || waitingItems.length === 0) {
    return false;
  }

  if (dismissedAtMs == null) {
    return true;
  }

  const latestCreatedAt = Math.max(
    ...waitingItems.map((item) => item.createdAt.getTime())
  );

  return dismissedAtMs < latestCreatedAt;
}

export function NotificationPermissionBanner({
  granted,
  waitingItems,
}: NotificationPermissionBannerProps) {
  const iconTint =
    THEME[useColorScheme() === "dark" ? "dark" : "light"].mutedForeground;
  const [dismissedAtMs, setDismissedAtMs] = useState<number | null>(() =>
    readDismissedAtMs()
  );

  const visible = useMemo(
    () => shouldShowBanner(granted, waitingItems, dismissedAtMs),
    [granted, waitingItems, dismissedAtMs]
  );

  const handlePress = useCallback(() => {
    pushHomeAreaRoute("/settings");
  }, []);

  const handleDismiss = useCallback(() => {
    const now = Date.now();
    Storage.setItemSync(NOTIFICATION_BANNER_DISMISSED_AT_KEY, String(now));
    setDismissedAtMs(now);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <View className="mb-4 flex-row items-start gap-2 rounded-lg border border-border bg-muted/50 px-3 py-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications are off. Open notification settings."
        onPress={handlePress}
        className="flex-1 active:opacity-70"
      >
        <Text variant="muted" className="text-sm leading-5">
          Notifications are off — check back here manually.
        </Text>
      </Pressable>
      <Pressable
        accessibilityLabel="Dismiss notification banner"
        onPress={handleDismiss}
        hitSlop={8}
        className="pt-0.5"
      >
        <X size={18} color={iconTint} strokeWidth={1.5} />
      </Pressable>
    </View>
  );
}
