import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";

export default function SettingsAccountScreen() {
  return (
    <SettingsScreenShell title="Account">
      <Text variant="muted" className="mt-4 leading-6">
        Upgrade to Pro, subscription status, restore purchases (RevenueCat).
        Links to paywall modal when built (PRD S12/S13).
      </Text>
    </SettingsScreenShell>
  );
}
