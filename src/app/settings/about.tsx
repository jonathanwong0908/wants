import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";

export default function SettingsAboutScreen() {
  return (
    <SettingsScreenShell title="About">
      <Text variant="muted" className="mt-4 leading-6">
        App version via expo-constants, privacy policy link, terms link (PRD
        S12). URLs TBD.
      </Text>
    </SettingsScreenShell>
  );
}
