import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";

export default function SettingsNotificationsScreen() {
  return (
    <SettingsScreenShell title="Notifications">
      <Text variant="muted" className="mt-4 leading-6">
        Notification permission status and link to system settings when denied
        (PRD S12).
      </Text>
    </SettingsScreenShell>
  );
}
