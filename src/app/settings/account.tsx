import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";
import { usePro } from "@/contexts/pro-context";
import { useIsPro } from "@/hooks/use-is-pro";
import { pushPaywallRoute } from "@/lib/push-paywall-route";
import { pushSettingsRoute } from "@/lib/push-settings-routes";
import { Separator } from "@rn-primitives/dropdown-menu";
import { View } from "react-native";

export default function SettingsAccountScreen() {
  const isPro = useIsPro();
  const { restorePlaceholder } = usePro();

  return (
    <SettingsScreenShell title="Account">
      <View className="mt-4 gap-4">
        {isPro ? (
          <Text className="text-base text-foreground">Wants Pro — active</Text>
        ) : null}

        <FieldContainer>
          {!isPro ? (
            <>
              <FieldContainerItem onPress={() => pushPaywallRoute()}>
                <Text className="text-base text-foreground">Upgrade to Pro</Text>
              </FieldContainerItem>
              <Separator />
            </>
          ) : null}
          <FieldContainerItem
            onPress={() => pushSettingsRoute("/settings/subscription")}
          >
            <Text className="text-base text-foreground">Subscription</Text>
          </FieldContainerItem>
        </FieldContainer>

        <FieldContainer>
          <FieldContainerItem
            onPress={() => void restorePlaceholder()}
            showChevron={false}
          >
            <Text className="text-base text-foreground">Restore purchases</Text>
          </FieldContainerItem>
        </FieldContainer>
      </View>
    </SettingsScreenShell>
  );
}
