import { ScreenBackButton } from "@/components/layout/screen-back-button";
import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderProps = {
  title: string;
  variant?: "modal" | "sub";
};

export function SettingsScreenHeader({ title, variant = "sub" }: HeaderProps) {
  return (
    <View className="flex-row items-center gap-2 px-4 pt-4">
      <ScreenBackButton
        variant={variant === "modal" ? "modal" : "stack"}
        className="mr-1"
        accessibilityLabel={variant === "modal" ? "Close settings" : "Back"}
      />
      <Text className="text-xl font-bold text-foreground">{title}</Text>
    </View>
  );
}

type Props = {
  title: string;
  variant?: "modal" | "sub";
  children: React.ReactNode;
};

export function SettingsScreenShell({
  title,
  variant = "sub",
  children,
}: Props) {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <SettingsScreenHeader title={title} variant={variant} />
      <ScrollView
        className="flex-1 px-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
