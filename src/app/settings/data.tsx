import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";

export default function SettingsDataScreen() {
  return (
    <SettingsScreenShell title="Data">
      <Text variant="muted" className="mt-4 leading-6">
        Clear all data with destructive confirmation dialog (PRD S12).
      </Text>
    </SettingsScreenShell>
  );
}
