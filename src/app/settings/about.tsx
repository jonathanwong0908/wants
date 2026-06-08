import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SettingsScreenShell } from "@/components/settings/settings-screen-shell";
import { Text } from "@/components/ui/text";
import Constants from "expo-constants";
import { View } from "react-native";

// Privacy policy and terms links deferred until URLs are provided (PRD S12).
const appVersion = Constants.expoConfig?.version ?? "—";

export default function SettingsAboutScreen() {
  return (
    <SettingsScreenShell title="About">
      <View className="mt-4">
        <FieldContainer>
          <FieldContainerItem>
            <View className="flex-row items-center justify-between gap-2">
              <Text>Version</Text>
              <Text className="text-base text-foreground">{appVersion}</Text>
            </View>
          </FieldContainerItem>
        </FieldContainer>
      </View>
    </SettingsScreenShell>
  );
}
