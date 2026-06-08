import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";

export default function PaywallScreen() {
  return (
    <SettingsScreenShell title="Upgrade to Pro" variant="modal">
      <Text variant="muted" className="mt-4 leading-6">
        Paywall modal placeholder (PRD S13). RevenueCat integration pending.
      </Text>
    </SettingsScreenShell>
  );
}
